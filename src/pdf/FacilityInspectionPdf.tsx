import React from 'react';
import { FacilityInspectionReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfMetadata } from './PdfMetadata';
import { PdfChecklist, ChecklistItem } from './PdfChecklist';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: FacilityInspectionReport;
}

const SECTIONS = [
  'Condición Vestidor/Baño',
  'Condición Cocina / Comedor',
  'Condición oficinas',
  'Estructura de Trailer Vivienda/Oficina',
];

export const FacilityInspectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signatures } = report;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="INSPECCIÓN DE MANTENIMIENTO DE INSTALACIONES" code="POSGI001-A10-1" />

      <PdfMetadata fields={[
        { label: 'BASE',  value: metadata.base },
        { label: 'FECHA', value: metadata.date },
      ]} />

      {SECTIONS.map(section => {
        const sectionRows = rows.filter(r => r.category === section);
        if (sectionRows.length === 0) return null;

        const items: ChecklistItem[] = sectionRows.map(r => ({
          label: r.item,
          status: r.status === 'SI' ? 'OK'
                : r.status === 'NO' ? 'X'
                : r.status === 'NA' ? 'NA'
                : null,
          observations: r.observations,
        }));

        return (
          <PdfChecklist
            key={section}
            title={section.toUpperCase()}
            items={items}
            columns={1}
          />
        );
      })}

      <PdfSignatures signatures={[
        { label: 'CONTROLÓ',       data: signatures['controller']?.data },
        { label: 'JEFE DE SECTOR', data: signatures['sectorChief']?.data },
      ]} />
    </PdfDocument>
  );
};
