import React from 'react';
import { BumpTestReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfTable, CellStyle } from './PdfTable';

interface BumpTestPdfProps {
  report: BumpTestReport;
}

const HEADERS = ['FECHA', 'MARCA Y MODELO', 'N° DE SERIE', 'APROBADO', 'FALLIDO', 'RESPONSABLE'];
const COL_WIDTHS = ['14%', '28%', '20%', '12%', '12%', '14%'];
const CENTER_COLS = [0, 2, 3, 4]; // fecha, serie, aprobado, fallido

/**
 * @react-pdf/renderer document for the Bump-Test form.
 *
 * Pass this element to <ExportPdfButton pdfComponent={<BumpTestPdf report={...} />} />
 * and the button will use it instead of the html2canvas fallback.
 */
export const BumpTestPdf: React.FC<BumpTestPdfProps> = ({ report }) => {
  const rows: string[][] = report.rows.map(row => [
    row.date,
    row.brandModel,
    row.serialNumber,
    row.result === 'APROBADO' ? 'X' : '',
    row.result === 'FALLIDO'  ? 'X' : '',
    row.responsible,
  ]);

  // Build per-cell style overrides for the pass/fail columns
  const cellStyles: Record<string, CellStyle> = {};
  report.rows.forEach((row, ri) => {
    if (row.result === 'APROBADO') {
      cellStyles[`${ri}-3`] = 'approved';
    } else if (row.result === 'FALLIDO') {
      cellStyles[`${ri}-4`] = 'failed';
    }
  });

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader
        title="REGISTRO BUMP TEST EQUIPO MULTIGAS"
        code="IT-WWO-007-A2"
      />
      <PdfTable
        headers={HEADERS}
        rows={rows}
        colWidths={COL_WIDTHS}
        centerCols={CENTER_COLS}
        cellStyles={cellStyles}
      />
    </PdfDocument>
  );
};
