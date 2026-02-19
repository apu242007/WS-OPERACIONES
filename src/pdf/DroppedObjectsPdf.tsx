import React from 'react';
import { DroppedObjectsReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfMetadata } from './PdfMetadata';
import { PdfChecklist, ChecklistItem } from './PdfChecklist';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: DroppedObjectsReport;
}

export const DroppedObjectsPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signatures } = report;

  const items: ChecklistItem[] = rows.map(row => ({
    label: row.description,
    status: row.status === 'SI' ? 'OK'
          : row.status === 'NO' ? 'X'
          : null,
    observations: row.observations,
  }));

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CHECK LIST DE CAÍDAS DE OBJETOS" code="PO-WSG-020-A1-1" />

      <PdfMetadata fields={[
        { label: 'FECHA',  value: metadata.date },
        { label: 'EQUIPO', value: metadata.equipment?.toUpperCase() },
        { label: 'POZO',   value: metadata.well },
      ]} />

      <PdfChecklist items={items} columns={1} />

      <PdfSignatures signatures={[
        { label: 'JEFE DE EQUIPO',      data: signatures['rigManager']?.data },
        { label: 'ENCARGADO DE TURNO',  data: signatures['shiftLeader']?.data },
      ]} />
    </PdfDocument>
  );
};
