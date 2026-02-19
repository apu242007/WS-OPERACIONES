import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { autoTable, applyPlugin } from 'jspdf-autotable';

// Apply the jsPDF-AutoTable plugin once at module load so that
// jsPDF instances expose `.lastAutoTable` / `.getLastAutoTable()` correctly.
applyPlugin(jsPDF);

// ─── Public interfaces ───────────────────────────────────────────────────────

export interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  /** 'p' | 'l' – if omitted, auto-detected */
  orientation?: 'p' | 'l';
  to?: string;
  message?: string;
}

export interface ExportPdfResult {
  emailSuccess: boolean;
  emailId?: string;
  emailError?: string;
}

// ─── Internal segment types ──────────────────────────────────────────────────

type ImageSegment = { kind: 'image'; nodes: HTMLElement[] };
type TableSegment = { kind: 'table'; table: HTMLTableElement; caption?: string };
type Segment = ImageSegment | TableSegment;

// ─── DOM helpers ─────────────────────────────────────────────────────────────

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
 * Walk `root`'s DOM tree and build an ordered list of segments to render.
 *
 * Rules (applied top-down, stopping at `.no-print` nodes):
 *  • A `<table>` element      → TableSegment
 *  • An element that CONTAINS a `<table>` → recurse into it so the table is
 *    extracted; any surrounding non-table children become ImageSegment nodes.
 *  • Everything else          → appended to the last ImageSegment (or a new one).
 *
 * We keep cloneNode(true) copies at push-time so the real DOM is never mutated.
 */
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
        // Find the closest preceding text-only sibling as caption
        let caption: string | undefined;
        let prev = child.previousElementSibling as HTMLElement | null;
        while (prev) {
          const txt = prev.textContent?.trim();
          if (txt && !prev.querySelector('table')) { caption = txt; break; }
          prev = prev.previousElementSibling as HTMLElement | null;
        }
        segments.push({ kind: 'table', table: child as HTMLTableElement, caption });
      } else if (child.querySelector('table')) {
        // Recurse — this element contains tables somewhere inside it
        walk(child);
      } else {
        pushImage(child);
      }
    }
  }

  walk(root);
  return segments;
}

/**
 * Render a list of cloned DOM nodes into a temporary off-screen container and
 * capture it with html2canvas.  Returns the resulting canvas element.
 */
async function captureNodes(
  nodes: HTMLElement[],
  containerWidth: number,
  winW: number,
  winH: number,
): Promise<HTMLCanvasElement> {
  // Off-screen wrapper that matches the form's content width
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    left: -99999px;
    top: 0;
    width: ${containerWidth}px;
    background: #fff;
    z-index: -1;
  `;
  for (const node of nodes) wrapper.appendChild(node);
  document.body.appendChild(wrapper);

  await document.fonts.ready;

  try {
    return await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: winW,
      windowHeight: winH,
      onclone: (_doc, el) => {
        // Fix Tailwind bg-clip-text – html2canvas can't render it
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
}

/**
 * Extract header rows and body rows from a <table> element.
 * Cells with `.no-print` class are skipped (e.g. delete buttons).
 */
function extractTableData(table: HTMLTableElement): {
  head: string[][];
  body: string[][];
  colCount: number;
} {
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

  // Fallback: table has no thead/tbody, just rows
  if (!head.length && !body.length) {
    table.querySelectorAll('tr').forEach(row => {
      const cells = Array.from(row.querySelectorAll('td, th'))
        .filter(c => !(c as HTMLElement).classList.contains('no-print'))
        .map(c => c.textContent?.trim() ?? '');
      if (cells.length) body.push(cells);
    });
  }

  const colCount = Math.max(
    ...head.map(r => r.length),
    ...body.map(r => r.length),
    1,
  );
  return { head, body, colCount };
}

/**
 * Add a canvas image to `pdf`, splitting across A4 pages automatically.
 * Returns the Y position (in mm) where the image ends on the last page.
 */
function addCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  startY: number,
  pageWidthMm: number,
  pageHeightMm: number,
  margin: number,
): number {
  const areaW = pageWidthMm - 2 * margin;
  const imgH = (canvas.height * areaW) / canvas.width; // proportional height in mm
  const imgData = canvas.toDataURL('image/png');

  let currentY = startY;
  let srcY = 0; // mm into the total image
  const pxPerMm = canvas.width / areaW; // canvas pixels per mm

  while (srcY < imgH) {
    const availH = pageHeightMm - margin - currentY;
    const sliceH = Math.min(availH, imgH - srcY);

    // Slice the canvas vertically
    const srcPxY = Math.round(srcY * pxPerMm);
    const slicePxH = Math.round(sliceH * pxPerMm);

    if (slicePxH > 0) {
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = slicePxH;
      sliceCanvas.getContext('2d')!.drawImage(
        canvas,
        0, srcPxY, canvas.width, slicePxH,
        0, 0, canvas.width, slicePxH,
      );
      pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, currentY, areaW, sliceH);
    }

    srcY += sliceH;
    currentY += sliceH;

    if (srcY < imgH) {
      pdf.addPage();
      currentY = margin;
    }
  }

  return currentY;
}

// ─── Main export function ─────────────────────────────────────────────────────

export const exportToPdf = async (options: ExportPdfOptions = {}): Promise<ExportPdfResult> => {
  const {
    filename  = 'reporte',
    elementId = 'print-area',
    orientation: orientationProp,
    to,
    message,
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    alert('No se encontró el área de impresión');
    return { emailSuccess: false, emailError: 'No se encontró el área de impresión' };
  }

  // Loading overlay
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'pdf-loading-overlay';
  loadingDiv.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; color: white; font-size: 18px; font-family: sans-serif;
  `;
  loadingDiv.innerHTML = '<div style="background:#1f2937;padding:24px 40px;border-radius:12px;">📄 Generando PDF...</div>';
  document.body.appendChild(loadingDiv);

  try {
    // ── 1. Hide .no-print elements ──────────────────────────────────────────
    const noPrintEls = document.querySelectorAll<HTMLElement>('.no-print');
    noPrintEls.forEach(el => { el.dataset.prevDisplay = el.style.display; el.style.display = 'none'; });

    await document.fonts.ready;

    // ── 2. Orientation ──────────────────────────────────────────────────────
    const contentW = element.scrollWidth;
    const contentH = element.scrollHeight;

    // Count max columns across all tables to decide orientation
    const allTables = Array.from(element.querySelectorAll<HTMLTableElement>('table'));
    const maxCols = allTables.reduce((mx, t) => {
      const cols = Math.max(
        ...Array.from(t.querySelectorAll('tr'))
          .map(r => Array.from(r.querySelectorAll('td,th'))
            .filter(c => !(c as HTMLElement).classList.contains('no-print')).length),
        0,
      );
      return Math.max(mx, cols);
    }, 0);

    const autoOrientation: 'p' | 'l' =
      maxCols >= 7 || contentW > contentH ? 'l' : 'p';
    const orientation: 'p' | 'l' = orientationProp ?? autoOrientation;

    const MARGIN = 10; // mm
    const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // ── 3. Build segments ────────────────────────────────────────────────────
    const segments = buildSegments(element);

    // If the form has NO tables at all, fall back to capturing the whole thing
    if (segments.every(s => s.kind === 'image')) {
      const fullCanvas = await captureNodes(
        [element.cloneNode(true) as HTMLElement],
        contentW, winW, winH,
      );
      addCanvasToPdf(pdf, fullCanvas, MARGIN, pageW, pageH, MARGIN);
    } else {
      // ── 4. Render each segment ─────────────────────────────────────────────
      let currentY = MARGIN;

      for (const seg of segments) {

        if (seg.kind === 'image') {
          if (!seg.nodes.length) continue;
          const canvas = await captureNodes(seg.nodes, contentW, winW, winH);
          currentY = addCanvasToPdf(pdf, canvas, currentY, pageW, pageH, MARGIN);

        } else {
          // Table segment – render with autoTable
          const { head, body, colCount } = extractTableData(seg.table);
          if (!head.length && !body.length) continue;

          // Add section caption as a bold label above the table
          if (seg.caption) {
            // Ensure enough room for caption + at least one row; otherwise new page
            if (currentY + 12 > pageH - MARGIN) {
              pdf.addPage();
              currentY = MARGIN;
            }
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(30, 30, 30);
            pdf.text(seg.caption.substring(0, 120), MARGIN, currentY + 4);
            currentY += 7;
          }

          // Distribute columns evenly; very narrow for boolean/date columns
          const usableW = pageW - 2 * MARGIN;
          const colW = usableW / colCount;
          const columnStyles: Record<number, { cellWidth: number }> = {};
          for (let i = 0; i < colCount; i++) columnStyles[i] = { cellWidth: colW };

          autoTable(pdf, {
            head,
            body,
            startY: currentY,
            margin: { left: MARGIN, right: MARGIN, top: MARGIN, bottom: MARGIN },
            tableWidth: 'wrap',
            styles: {
              fontSize: 8,
              cellPadding: 1.5,
              overflow: 'linebreak',
              valign: 'middle',
            },
            headStyles: {
              fillColor: [55, 65, 81],   // gray-700
              textColor: 255,
              fontStyle: 'bold',
              fontSize: 8,
            },
            alternateRowStyles: { fillColor: [249, 250, 251] }, // gray-50
            columnStyles,
            // Trigger a new page if the table doesn't fit
            showHead: 'everyPage',
            didParseCell: (data) => {
              // Mark the last column as smaller if it looks like a control col
              if (data.column.index === colCount - 1) {
                const txt = String(data.cell.raw ?? '').trim();
                if (txt.length < 4) data.cell.styles.cellWidth = 'wrap';
              }
            },
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const finalY = (pdf as any).lastAutoTable?.finalY ?? currentY;
          currentY = finalY + 4; // 4 mm gap after each table
        }
      }
    }

    // ── 5. Restore DOM ───────────────────────────────────────────────────────
    noPrintEls.forEach(el => { el.style.display = el.dataset.prevDisplay || ''; });

    // ── 6. Save PDF ──────────────────────────────────────────────────────────
    pdf.save(`${filename}.pdf`);

    // ── 7. Send email ─────────────────────────────────────────────────────────
    const recipient = to || 'jcastro@tackertools.com';
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      overlay.innerHTML = `<div style="background:#1f2937;padding:24px 40px;border-radius:12px;">✉️ Enviando email a ${recipient}...</div>`;
    }

    const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://exgqsbvcyghrpmlawmaa.supabase.co';
    const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3FzYnZjeWdocnBtbGF3bWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQzMjEsImV4cCI6MjA4NjI4MDMyMX0.KlwrEfx9X5zQChoX84vjDViS9icGjkjPu_3W1SGh22k';

    const summary  = extractSummaryFromDOM(elementId);
    const pdfBase64 = pdf.output('datauristring').split(',')[1];

    try {
      const emailRes = await fetch(`${SUPABASE_URL}/functions/v1/send-report-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'apikey': SUPABASE_ANON,
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
