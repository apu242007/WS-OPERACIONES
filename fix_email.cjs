const fs = require('fs');
let content = fs.readFileSync('src/utils/exportPdf.ts', 'utf8');

const extractFn = `
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
`;

const emailBlock = `
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
`;

// Insertar extractFn antes de exportToPdf
content = content.replace('export const exportToPdf', extractFn + '\nexport const exportToPdf');

// Insertar emailBlock despues del bloque de Drive
const driveBlock = "      console.log('PDF subido a Google Drive correctamente');";
content = content.replace(driveBlock, driveBlock + emailBlock);

fs.writeFileSync('src/utils/exportPdf.ts', content, 'utf8');
console.log('OK: exportPdf.ts actualizado');
