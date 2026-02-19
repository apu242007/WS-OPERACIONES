
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { uploadFileToDrive } from '../lib/uploadToDrive';

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
    scale = 2,
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

    // Force background color on element to ensure white background
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = '#ffffff';

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.backgroundColor = '#ffffff';
        }
      }
    });

    // Restore elements
    element.style.backgroundColor = originalBg;
    noPrintEls.forEach(el => {
      el.style.display = el.dataset.prevDisplay || '';
    });

    // Auto-detect orientation from canvas aspect ratio if not explicitly provided
    // canvas.width > canvas.height means the content is wider than tall → landscape
    const autoOrientation: 'p' | 'l' = canvas.width > canvas.height ? 'l' : 'p';
    const orientation: 'p' | 'l' = orientationProp ?? autoOrientation;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidthMm  = pdf.internal.pageSize.getWidth();
    const pageHeightMm = pdf.internal.pageSize.getHeight();

    // Scale the image so its width fits exactly within the page width.
    // imgHeight is the total rendered height in mm at this scale.
    const imgWidthMm  = pageWidthMm;
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

    // Render first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidthMm, imgHeightMm);

    // Render additional pages by shifting the image upward
    let pagesRendered = 1;
    while (pagesRendered * pageHeightMm < imgHeightMm) {
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        -(pagesRendered * pageHeightMm),
        imgWidthMm,
        imgHeightMm
      );
      pagesRendered++;
    }

    pdf.save(`${filename}.pdf`);

    // Upload to Google Drive
    try {
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File(
        [pdfBlob],
        `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`,
        { type: 'application/pdf' }
      );
      console.log('[exportPdf] Iniciando subida a Drive, tamaño blob:', pdfBlob.size, 'bytes');
      const driveUrl = await uploadFileToDrive(pdfFile);
      console.log('[exportPdf] ✅ PDF subido a Google Drive:', driveUrl);
    } catch (driveError) {
      console.error('[exportPdf] ❌ Error subiendo PDF a Drive:', driveError);
      // No bloqueamos la descarga local, pero informamos en consola
    }

    // Send email
    try {
      const summary = extractSummaryFromDOM(elementId);
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      await fetch(import.meta.env.VITE_SUPABASE_URL + '/functions/v1/send-report-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          pdfBase64,
          filename,
          formType: filename,
          summary: {
            fecha:    summary.fecha    ?? new Date().toLocaleDateString('es-AR'),
            pozo:     summary.pozo     ?? '',
            equipo:   summary.equipo   ?? '',
            operador: summary.operador ?? '',
          }
        }),
      });
      console.log('Email enviado correctamente');
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
    }

  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Intente nuevamente.');
  } finally {
    document.getElementById('pdf-loading-overlay')?.remove();
  }
};
