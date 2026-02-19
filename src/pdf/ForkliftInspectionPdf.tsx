import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ForkliftReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: ForkliftReport;
}

const ALL_SECTIONS = [
  'SISTEMA HIDRAULICO',
  'DESCRIPCION GENERAL',
  'TREN RODANTE',
  'SISTEMA FUNCIONAL',
  'LIQUIDOS MOTOR',
  'SISTEMA ELÉCTRICO',
  'INTERIOR',
  'ELEMENTOS / ACCESORIOS',
];

export const ForkliftInspectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  // Build a flat table with section-header rows merged in
  const tableRows: string[][] = [];
  ALL_SECTIONS.forEach(section => {
    const sectionRows = rows.filter(r => r.category === section);
    if (sectionRows.length === 0) return;
    // Section heading row (bold background handled by header alt — fake it via caps)
    tableRows.push([`▶ ${section}`, '']);
    sectionRows.forEach(r => {
      tableRows.push([`    ${r.item}`, r.status || '']);
    });
  });

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="INSPECCIÓN DE MONTACARGAS" code="POSGI001-A12-0" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'MONTACARGA',           value: metadata.forklift },
          { label: 'HORÓMETRO',            value: metadata.hourMeter },
          { label: 'INTERNO N°',           value: metadata.internalNumber },
          { label: 'N° DE SERIE',          value: metadata.serialNumber },
          { label: 'OPERADOR',             value: metadata.operator },
          { label: 'FECHA INSPECCIÓN',     value: metadata.date },
          { label: 'LICENCIA N°',          value: metadata.licenseNumber },
          { label: 'TIPO',                 value: metadata.type },
          { label: 'VTO. LICENCIA',        value: metadata.licenseExpiration },
          { label: 'HABILITACIÓN',         value: metadata.enablement },
          { label: 'VTO. HABILITACIÓN',    value: metadata.enablementExpiration },
        ]}
      />

      <View style={{ marginTop: 4, marginBottom: 2 }}>
        <Text style={{
          fontSize: 6.5, color: colors.textMid, textAlign: 'center',
          borderWidth: 1, borderColor: colors.borderLight,
          paddingTop: 3, paddingBottom: 3, paddingLeft: 4, paddingRight: 4,
        }}>
          TERMINOLOGÍA: Normal (N) — Corregir (Co) — Faltante (F) — Verificar (V) — Reparar (R) — Limpiar (L) — No Corresponde (NC)
        </Text>
      </View>

      <PdfTable
        headers={['ÍTEM', 'REF']}
        rows={tableRows}
        colWidths={['85%', '15%']}
        centerCols={[1]}
      />

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold',
            textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
          }}>
            OBSERVACIONES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'OPERADOR DE MONTACARGAS', data: signatures['operator']?.data },
        { label: 'RESPONSABLE DE SECTOR',  data: signatures['sectorResponsible']?.data },
        { label: 'JEFE DE EQUIPO',         data: signatures['rigManager']?.data },
      ]} />
    </PdfDocument>
  );
};
