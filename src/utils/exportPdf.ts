
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { uploadFileToDrive } from '../lib/uploadToDrive';

interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  orientation?: 'p' | 'l';
  scale?: number;
}


function extractSummaryFromDOM(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return {};
  const summary = {};
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
    orientation = 'p',
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
          // Additional safety for cloned element
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

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // First page
    let yOffset = 0;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Additional pages: shift image up by one pageHeight each time
    while (yOffset + pageHeight < imgHeight) {
      yOffset += pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -yOffset, imgWidth, imgHeight);
    }

    pdf.save(`${filename}.pdf`);

    // Subir automaticamente a Google Drive
    try {
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File(
        [pdfBlob],
        `${filename}_${new Date().toISOString().slice(0,10)}.pdf`,
        { type: 'application/pdf' }
      );
      await uploadFileToDrive(pdfFile);
      console.log('PDF subido a Google Drive correctamente');
    // Enviar email
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
            fecha: summary.fecha ?? new Date().toLocaleDateString('es-AR'),
            pozo: summary.pozo ?? '',
            equipo: summary.equipo ?? '',
            operador: summary.operador ?? '',
          }
        }),
      });
      console.log('Email enviado correctamente');
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
    }

    } catch (driveError) {
      console.error('Error subiendo PDF a Drive:', driveError);
    }
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Intente nuevamente.');
  } finally {
    document.getElementById('pdf-loading-overlay')?.remove();
  }
};
