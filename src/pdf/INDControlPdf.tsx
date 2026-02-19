import React from 'react';
import { INDControlReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';

interface Props {
  report: INDControlReport;
}

const getExpirationDate = (serviceDate: string, months: number): string => {
  if (!serviceDate) return '';
  const d = new Date(serviceDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
};

export const INDControlPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows } = report;

  const tableRows = rows.map(r => [
    String(r.itemNumber),
    r.element || '',
    r.description || '',
    r.identificationNumber || '',
    r.tag || '',
    r.validityMonths ? String(r.validityMonths) : '',
    r.inspectionDate || '',
    r.serviceDate || '',
    r.serviceDate ? getExpirationDate(r.serviceDate, r.validityMonths) : '',
    '',  // OBSERVACIONES left blank — editable in form
  ]);

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader title="PLANILLAS DE CONTROL DE IND" code="IT-WFB-003-A1" subtitle="REVISION 00" />

      <PdfFields
        columns={2}
        fields={[
          { label: 'EQUIPO', value: metadata.equipment },
          { label: 'FECHA',  value: metadata.date },
        ]}
      />

      <PdfTable
        headers={[
          'N°', 'ELEMENTOS', 'DESCRIPCIÓN',
          'N° IDENTIFICACIÓN', 'TAG CUÑO', 'VIGENCIA (MESES)',
          'FECHA INSPECCIÓN', 'FECHA PUESTA EN SERVICIO', 'VENCIMIENTO', 'OBSERVACIONES',
        ]}
        rows={tableRows}
        colWidths={['4%', '12%', '16%', '12%', '8%', '6%', '10%', '10%', '10%', '12%']}
        centerCols={[0, 3, 4, 5, 6, 7, 8]}
      />
    </PdfDocument>
  );
};
