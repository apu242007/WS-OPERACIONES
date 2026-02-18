
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  orientation?: 'p' | 'l';
  scale?: number;
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

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF. Intente nuevamente.');
  } finally {
    document.getElementById('pdf-loading-overlay')?.remove();
  }
};
