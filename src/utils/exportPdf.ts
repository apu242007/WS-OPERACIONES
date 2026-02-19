
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  /** 'p' | 'l' — if omitted, auto-detected from canvas dimensions */
  orientation?: 'p' | 'l';
  scale?: number;
}

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

export const exportToPdf = async (options: ExportPdfOptions = {}): Promise<void> => {
  const {
    filename = 'reporte',
    elementId = 'print-area',
    orientation: orientationProp,
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    alert('No se encontró el área de impresión');
    return;
  }

  // Create loading overlay
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
    // Hide non-printable elements temporarily
    const noPrintEls = document.querySelectorAll<HTMLElement>('.no-print');
    noPrintEls.forEach(el => {
      el.dataset.prevDisplay = el.style.display;
      el.style.display = 'none';
    });

    // --- Decide orientation BEFORE capture, based on real scroll dimensions ---
    const contentW = element.scrollWidth;
    const contentH = element.scrollHeight;
    const autoOrientation: 'p' | 'l' = contentW > contentH ? 'l' : 'p';
    const orientation: 'p' | 'l' = orientationProp ?? autoOrientation;

    // A4 at 96 dpi: portrait 794×1123 px, landscape 1123×794 px
    const pageWidthPx = orientation === 'p' ? 794 : 1123;

    // Dynamic scale: fit the full content width into the A4 page width
    const fitScale = pageWidthPx / contentW;
    // Clamp: don't go below 1 (blurry) or above 2 (unnecessarily heavy)
    const scale = Math.min(2, Math.max(1, fitScale));

    // --- Force element to its full scroll width so html2canvas captures everything ---
    const originalWidth    = element.style.width;
    const originalOverflow = element.style.overflow;
    const originalBg       = element.style.backgroundColor;
    element.style.width    = contentW + 'px';
    element.style.overflow = 'visible';
    element.style.backgroundColor = '#ffffff';

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: contentW,
      windowHeight: contentH,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = contentW + 'px';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.backgroundColor = '#ffffff';
        }
      },
    });

    // Restore element styles
    element.style.width           = originalWidth;
    element.style.overflow        = originalOverflow;
    element.style.backgroundColor = originalBg;
    noPrintEls.forEach(el => {
      el.style.display = el.dataset.prevDisplay || '';
    });

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidthMm  = pdf.internal.pageSize.getWidth();
    const pageHeightMm = pdf.internal.pageSize.getHeight();

    const imgWidthMm  = pageWidthMm;
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

    // Single toDataURL call — reused across all pages
    const imgData = canvas.toDataURL('image/png');

    // Render first page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

    // Render additional pages by shifting the image upward
    let pagesRendered = 1;
    while (pagesRendered * pageHeightMm < imgHeightMm) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -(pagesRendered * pageHeightMm), imgWidthMm, imgHeightMm);
      pagesRendered++;
    }

    pdf.save(`${filename}.pdf`);

    // Send email with PDF attached
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) overlay.innerHTML = '<div style="background:#1f2937;padding:24px 40px;border-radius:12px;">✉️ Enviando email...</div>';

    const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://exgqsbvcyghrpmlawmaa.supabase.co';
    const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3FzYnZjeWdocnBtbGF3bWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQzMjEsImV4cCI6MjA4NjI4MDMyMX0.KlwrEfx9X5zQChoX84vjDViS9icGjkjPu_3W1SGh22k';

    try {
      const summary = extractSummaryFromDOM(elementId);
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      const emailRes = await fetch(SUPABASE_URL + '/functions/v1/send-report-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + SUPABASE_ANON,
          'apikey': SUPABASE_ANON,
        },
        body: JSON.stringify({
          pdfBase64,
          filename,
          formType: filename,
          to: 'jcastro@tackertools.com',
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
        console.error('[exportPdf] ❌ Error enviando email:', emailData);
      } else {
        console.log('[exportPdf] ✅ Email enviado. ID:', emailData.emailId);
      }
    } catch (emailError) {
      console.error('[exportPdf] ❌ Error enviando email:', emailError);
    }

  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Intente nuevamente.');
  } finally {
    document.getElementById('pdf-loading-overlay')?.remove();
  }
};
