import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { autoTable, applyPlugin } from 'jspdf-autotable';

applyPlugin(jsPDF);

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  /** 'p' | 'l' – if omitted, auto-detected from table column count */
  orientation?: 'p' | 'l';
  to?: string;
  message?: string;
}

export interface ExportPdfResult {
  emailSuccess: boolean;
  emailId?: string;
  emailError?: string;
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────

interface FormSummary {
  fecha?: string;
  pozo?: string;
  equipo?: string;
  operador?: string;
  [key: string]: string | undefined;
}

function extractSummaryFromDOM(elementId: string): FormSummary {
  const element = document.getElementById(elementId);
  if (!element) return {};
  const summary: FormSummary = {};
  const labels = ['Fecha', 'Pozo', 'Equipo', 'Operador', 'Cliente', 'Ubicacion', 'Turno'];
  labels.forEach(label => {
    const spans = Array.from(element.querySelectorAll('span'));
    const labelSpan = spans.find(s => s.textContent?.trim().toUpperCase() === label.toUpperCase());
    if (labelSpan) {
      const parent = labelSpan.closest('div, td');
      const next = parent?.nextElementSibling;
      if (next) summary[label.toLowerCase()] = next.textContent?.trim() ?? '';
    }
  });
  return summary;
}

/**
 * Capture `element` with html2canvas using its VISUAL (rendered) width,
 * not scrollWidth. This ensures no phantom whitespace on the sides.
 */
async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  const renderW = Math.round(element.getBoundingClientRect().width) || element.scrollWidth;
  await document.fonts.ready;
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: renderW,
    windowHeight: element.scrollHeight,
    onclone: (_doc, el) => {
      el.querySelectorAll<HTMLElement>('.pdf-gradient-text, .text-transparent')
        .forEach(n => {
          n.style.setProperty('-webkit-background-clip', 'unset', 'important');
          n.style.setProperty('background-clip', 'unset', 'important');
          n.style.setProperty('-webkit-text-fill-color', 'unset', 'important');
          n.style.setProperty('color', '#1e3a8a', 'important');
          n.style.setProperty('background', 'none', 'important');
        });
    },
  });
}

/**
 * Add a canvas to `pdf`, filling the printable width and splitting across
 * pages when the content is taller than one page. Returns final Y position.
 */
function addCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  startY: number,
  pageW: number,
  pageH: number,
  margin: number,
): number {
  const areaW    = pageW - 2 * margin;
  const imgH     = (canvas.height * areaW) / canvas.width; // mm
  const pxPerMm  = canvas.width / areaW;

  let srcY     = 0;
  let currentY = startY;

  while (srcY < imgH - 0.5) {
    const availH   = pageH - margin - currentY;
    const sliceH   = Math.min(availH, imgH - srcY);
    const srcPxY   = Math.round(srcY * pxPerMm);
    const slicePxH = Math.round(sliceH * pxPerMm);

    if (slicePxH > 0) {
      const slice = document.createElement('canvas');
      slice.width  = canvas.width;
      slice.height = slicePxH;
      slice.getContext('2d')!.drawImage(
        canvas,
        0, srcPxY, canvas.width, slicePxH,
        0, 0,      canvas.width, slicePxH,
      );
      pdf.addImage(slice.toDataURL('image/png'), 'PNG', margin, currentY, areaW, sliceH);
    }

    srcY     += sliceH;
    currentY += sliceH;

    if (srcY < imgH - 0.5) {
      pdf.addPage();
      currentY = margin;
    }
  }

  return currentY;
}

/**
 * Extract text data from a <table> element for jspdf-autotable.
 */
function extractTableData(table: HTMLTableElement): { head: string[][]; body: string[][] } {
  const head: string[][] = [];
  const body: string[][] = [];

  table.querySelectorAll('thead tr').forEach(row => {
    const cells = Array.from(row.querySelectorAll('th, td'))
      .filter(c => !(c as HTMLElement).classList.contains('no-print'))
      .map(c => c.textContent?.trim() ?? '');
    if (cells.length) head.push(cells);
  });

  table.querySelectorAll('tbody tr').forEach(row => {
    const cells = Array.from(row.querySelectorAll('td, th'))
      .filter(c => !(c as HTMLElement).classList.contains('no-print'))
      .map(c => c.textContent?.trim() ?? '');
    if (cells.length && cells.some(c => c !== '')) body.push(cells);
  });

  if (!head.length && !body.length) {
    table.querySelectorAll('tr').forEach(row => {
      const cells = Array.from(row.querySelectorAll('td, th'))
        .filter(c => !(c as HTMLElement).classList.contains('no-print'))
        .map(c => c.textContent?.trim() ?? '');
      if (cells.length) body.push(cells);
    });
  }

  return { head, body };
}

// ─── Segment types ────────────────────────────────────────────────────────────

type ImageSegment = { kind: 'image'; nodes: HTMLElement[] };
type TableSegment = { kind: 'table'; table: HTMLTableElement; caption?: string };
type Segment      = ImageSegment | TableSegment;

function buildSegments(root: HTMLElement): Segment[] {
  const segments: Segment[] = [];

  function pushImage(node: HTMLElement) {
    const last = segments[segments.length - 1];
    if (last?.kind === 'image') {
      last.nodes.push(node.cloneNode(true) as HTMLElement);
    } else {
      segments.push({ kind: 'image', nodes: [node.cloneNode(true) as HTMLElement] });
    }
  }

  function walk(parent: HTMLElement) {
    for (const child of Array.from(parent.children) as HTMLElement[]) {
      if (child.classList.contains('no-print')) continue;
      if (child.tagName === 'TABLE') {
        let caption: string | undefined;
        let prev = child.previousElementSibling as HTMLElement | null;
        while (prev) {
          const txt = prev.textContent?.trim();
          if (txt && !prev.querySelector('table')) { caption = txt; break; }
          prev = prev.previousElementSibling as HTMLElement | null;
        }
        segments.push({ kind: 'table', table: child as HTMLTableElement, caption });
      } else if (child.querySelector('table')) {
        walk(child);
      } else {
        pushImage(child);
      }
    }
  }

  walk(root);
  return segments;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export const exportToPdf = async (options: ExportPdfOptions = {}): Promise<ExportPdfResult> => {
  const {
    filename    = 'reporte',
    elementId   = 'print-area',
    orientation : orientationProp,
    to,
    message,
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    alert('No se encontró el área de impresión');
    return { emailSuccess: false, emailError: 'No se encontró el área de impresión' };
  }

  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'pdf-loading-overlay';
  loadingDiv.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.5);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;color:#fff;font-size:18px;font-family:sans-serif;
  `;
  loadingDiv.innerHTML = '<div style="background:#1f2937;padding:24px 40px;border-radius:12px;">📄 Generando PDF…</div>';
  document.body.appendChild(loadingDiv);

  try {
    // ── 1. Hide .no-print elements ────────────────────────────────────────────
    const noPrintEls = document.querySelectorAll<HTMLElement>('.no-print');
    noPrintEls.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });
    await document.fonts.ready;

    // ── 2. Determine orientation ──────────────────────────────────────────────
    const allTables = Array.from(element.querySelectorAll<HTMLTableElement>('table'));
    const maxCols   = allTables.reduce((mx, t) => {
      const cols = Math.max(
        ...Array.from(t.querySelectorAll('tr')).map(r =>
          Array.from(r.querySelectorAll('td,th'))
            .filter(c => !(c as HTMLElement).classList.contains('no-print')).length,
        ),
        0,
      );
      return Math.max(mx, cols);
    }, 0);

    // Landscape only for truly wide tables.
    // NEVER derive orientation from scrollWidth vs scrollHeight – browsers are
    // almost always wider than tall, so that comparison is always wrong.
    const autoOrientation: 'p' | 'l' = maxCols >= 10 ? 'l' : 'p';
    const orientation: 'p' | 'l'     = orientationProp ?? autoOrientation;

    const MARGIN = 8;
    const pdf    = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
    const pageW  = pdf.internal.pageSize.getWidth();
    const pageH  = pdf.internal.pageSize.getHeight();

    // ── 3. Render ─────────────────────────────────────────────────────────────
    const segments  = buildSegments(element);
    const hasTables = segments.some(s => s.kind === 'table');

    if (!hasTables) {
      // No tables: capture the whole element with its VISUAL width
      const canvas = await captureElement(element);
      addCanvasToPdf(pdf, canvas, MARGIN, pageW, pageH, MARGIN);

    } else {
      let currentY = MARGIN;
      const renderW = Math.round(element.getBoundingClientRect().width) || element.scrollWidth;

      for (const seg of segments) {

        if (seg.kind === 'image') {
          if (!seg.nodes.length) continue;

          const wrapper = document.createElement('div');
          wrapper.style.cssText = `
            position:fixed;left:-99999px;top:0;
            width:${renderW}px;background:#fff;z-index:-1;
          `;
          seg.nodes.forEach(n => wrapper.appendChild(n));
          document.body.appendChild(wrapper);
          await document.fonts.ready;

          let canvas: HTMLCanvasElement;
          try {
            canvas = await html2canvas(wrapper, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff',
              windowWidth: renderW,
              windowHeight: wrapper.scrollHeight,
              onclone: (_doc, el) => {
                el.querySelectorAll<HTMLElement>('.pdf-gradient-text, .text-transparent')
                  .forEach(n => {
                    n.style.setProperty('-webkit-background-clip', 'unset', 'important');
                    n.style.setProperty('background-clip', 'unset', 'important');
                    n.style.setProperty('-webkit-text-fill-color', 'unset', 'important');
                    n.style.setProperty('color', '#1e3a8a', 'important');
                    n.style.setProperty('background', 'none', 'important');
                  });
              },
            });
          } finally {
            document.body.removeChild(wrapper);
          }

          currentY = addCanvasToPdf(pdf, canvas, currentY, pageW, pageH, MARGIN);

        } else {
          const { head, body } = extractTableData(seg.table);
          if (!head.length && !body.length) continue;

          if (seg.caption) {
            if (currentY + 12 > pageH - MARGIN) { pdf.addPage(); currentY = MARGIN; }
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(30, 30, 30);
            pdf.text(seg.caption.substring(0, 120), MARGIN, currentY + 4);
            currentY += 7;
          }

          autoTable(pdf, {
            head,
            body,
            startY: currentY,
            margin: { left: MARGIN, right: MARGIN, top: MARGIN, bottom: MARGIN },
            tableWidth: 'auto',
            styles:     { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak', valign: 'middle' },
            headStyles: { fillColor: [55, 65, 81], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            showHead: 'everyPage',
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          currentY = ((pdf as any).lastAutoTable?.finalY ?? currentY) + 4;
        }
      }
    }

    // ── 4. Restore DOM ────────────────────────────────────────────────────────
    noPrintEls.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });

    // ── 5. Save ───────────────────────────────────────────────────────────────
    pdf.save(`${filename}.pdf`);

    // ── 6. Email ──────────────────────────────────────────────────────────────
    const recipient = to || 'jcastro@tackertools.com';
    const overlay   = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      overlay.innerHTML = `<div style="background:#1f2937;padding:24px 40px;border-radius:12px;">✉️ Enviando email a ${recipient}…</div>`;
    }

    const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://exgqsbvcyghrpmlawmaa.supabase.co';
    const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3FzYnZjeWdocnBtbGF3bWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQzMjEsImV4cCI6MjA4NjI4MDMyMX0.KlwrEfx9X5zQChoX84vjDViS9icGjkjPu_3W1SGh22k';

    const summary   = extractSummaryFromDOM(elementId);
    const pdfBase64 = pdf.output('datauristring').split(',')[1];

    try {
      const emailRes = await fetch(`${SUPABASE_URL}/functions/v1/send-report-email`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({
          pdfBase64,
          filename,
          formType: filename,
          to: recipient,
          ...(message ? { additionalMessage: message } : {}),
          summary: {
            fecha:    summary.fecha    ?? new Date().toLocaleDateString('es-AR'),
            pozo:     summary.pozo     ?? '',
            equipo:   summary.equipo   ?? '',
            operador: summary.operador ?? '',
          },
        }),
      });

      const emailData = await emailRes.json().catch(() => ({}));
      if (!emailRes.ok) {
        const errMsg = emailData?.error ?? emailData?.message ?? `HTTP ${emailRes.status}`;
        return { emailSuccess: false, emailError: errMsg };
      }
      return { emailSuccess: true, emailId: emailData.emailId };
    } catch (emailError) {
      return { emailSuccess: false, emailError: emailError instanceof Error ? emailError.message : 'Error de red' };
    }

  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Intente nuevamente.');
    return { emailSuccess: false, emailError: error instanceof Error ? error.message : 'Error generando PDF' };
  } finally {
    document.getElementById('pdf-loading-overlay')?.remove();
  }
};
