import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { ThicknessReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: ThicknessReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 16, backgroundColor: '#fff' },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb',
    borderTop: '1pt solid #000', borderBottom: '1pt solid #000',
    fontFamily: 'Helvetica-Bold', fontSize: 7.5, minHeight: 18, alignItems: 'center',
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 16, alignItems: 'center' },
  cell: { paddingHorizontal: 3, paddingVertical: 2, borderRight: '0.3pt solid #d1d5db', fontSize: 8, textAlign: 'center' },
  aptCell: { paddingHorizontal: 3, paddingVertical: 2, fontSize: 8, textAlign: 'center', fontFamily: 'Helvetica-Bold', borderRight: undefined },
  obsLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, marginTop: 10, marginBottom: 3 },
  obsBox: {
    border: '0.5pt solid #9ca3af', borderRadius: 3, padding: 6,
    minHeight: 40, fontSize: 8, marginBottom: 6,
  },
  noteBox: {
    border: '1pt solid #b91c1c', borderRadius: 3, padding: 6,
    backgroundColor: '#fef2f2', marginTop: 4,
  },
  noteText: { fontSize: 7.5, color: '#b91c1c', fontFamily: 'Helvetica-Bold' },
});

const COL = { point: 50, ref: 65, apt: 45 };

export const ThicknessMeasurementPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  const fields = [
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '33%' },
    { label: 'LOCACIÓN', value: metadata.location, width: '33%' },
    { label: 'FECHA', value: metadata.date, width: '34%' },
    { label: 'UBICACIÓN ESPECÍFICA', value: metadata.specificLocation, width: '33%' },
    { label: 'IDENTIFICACIÓN', value: metadata.identification, width: '33%' },
    { label: 'RESPONSABLE', value: metadata.responsible, width: '34%' },
    { label: 'CÓD. INSTRUMENTO', value: metadata.instrumentCode, width: '33%' },
  ];

  const sigEntries = [
    { label: 'Responsable de Medición', data: signatures?.['responsible']?.data, name: signatures?.['responsible']?.name },
    { label: 'Jefe de Equipo', data: signatures?.['rigManager']?.data, name: signatures?.['rigManager']?.name },
    { label: 'Representante de Compañía', data: signatures?.['companyRepresentative']?.data, name: signatures?.['companyRepresentative']?.name },
  ];

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="PLANILLA DE MEDICION DE ESPESORES EN LINEAS" code="IT-WFB-004-A1" />
        <PdfFields fields={fields} columns={3} />

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={{ ...s.cell, width: COL.point }}>PUNTO</Text>
          <Text style={{ ...s.cell, width: COL.ref }}>Ref 0°</Text>
          <Text style={{ ...s.cell, width: COL.ref }}>Ref 90°</Text>
          <Text style={{ ...s.cell, width: COL.ref }}>Ref 180°</Text>
          <Text style={{ ...s.cell, width: COL.ref }}>Ref 270°</Text>
          <Text style={{ ...s.cell, flex: 1, borderRight: undefined }}>APTO</Text>
        </View>

        {rows.map(row => {
          const aptBg = row.isApt === true ? '#dcfce7' : row.isApt === false ? '#fee2e2' : '#fff';
          const aptText = row.isApt === true ? 'SÍ' : row.isApt === false ? 'NO' : '—';
          const aptColor = row.isApt === true ? '#166534' : row.isApt === false ? '#991b1b' : '#6b7280';
          return (
            <View key={row.id} style={s.row}>
              <Text style={{ ...s.cell, width: COL.point, fontFamily: 'Helvetica-Bold' }}>{row.pointLabel}</Text>
              <Text style={{ ...s.cell, width: COL.ref }}>{row.measure0 ?? ''}</Text>
              <Text style={{ ...s.cell, width: COL.ref }}>{row.measure90 ?? ''}</Text>
              <Text style={{ ...s.cell, width: COL.ref }}>{row.measure180 ?? ''}</Text>
              <Text style={{ ...s.cell, width: COL.ref }}>{row.measure270 ?? ''}</Text>
              <Text style={{ ...s.aptCell, flex: 1, backgroundColor: aptBg, color: aptColor }}>{aptText}</Text>
            </View>
          );
        })}

        <Text style={s.obsLabel}>Observaciones:</Text>
        <View style={s.obsBox}>
          <Text>{observations ?? ''}</Text>
        </View>

        <View style={s.noteBox}>
          <Text style={s.noteText}>
            NOTA: El espesor mínimo calculado para esta línea es de 5.6 mm. Por debajo de este valor se considerará NO APTO.
          </Text>
        </View>

        <PdfSignatures signatures={sigEntries} />
      </Page>
    </Document>
  );
};
