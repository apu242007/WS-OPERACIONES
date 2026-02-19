import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { TorqueReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: TorqueReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 7.5, padding: 16, backgroundColor: '#fff' },
  th: {
    paddingHorizontal: 3, paddingVertical: 2, borderRight: '0.5pt solid #9ca3af',
    fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center',
    backgroundColor: '#e5e7eb',
  },
  td: { paddingHorizontal: 3, paddingVertical: 1, borderRight: '0.3pt solid #d1d5db', fontSize: 7.5, textAlign: 'center' },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 14, alignItems: 'center' },
  check: { width: 7, height: 7, border: '0.5pt solid #374151', borderRadius: 1, marginHorizontal: 'auto', backgroundColor: '#1f2937' },
  checkEmpty: { width: 7, height: 7, border: '0.5pt solid #9ca3af', borderRadius: 1, marginHorizontal: 'auto' },
});

const indicatorCell = (value: string | null, trueVal: 'SI' | 'NO') => {
  const active = value === trueVal;
  const bg = active ? (trueVal === 'SI' ? '#166534' : '#991b1b') : '#fff';
  const color = active ? '#fff' : '#6b7280';
  return { backgroundColor: bg, color };
};

export const TorqueRegisterPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signatures } = report;

  const fields = [
    { label: 'FECHA', value: metadata.date, width: '33%' },
    { label: 'NOMBRE Y APELLIDO', value: metadata.responsible1, width: '34%' },
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '33%' },
    { label: '', value: '', width: '33%' },
    { label: 'NOMBRE Y APELLIDO', value: metadata.responsible2, width: '34%' },
    { label: '', value: '', width: '33%' },
    { label: 'CLIENTE', value: metadata.client, width: '33%' },
    { label: 'YACIMIENTO', value: metadata.field, width: '34%' },
    { label: 'POZO', value: metadata.well, width: '33%' },
  ];

  const sigEntries = [
    { label: 'Firma Responsable', data: signatures?.['responsible1']?.data, name: metadata.responsible1 },
    { label: 'Firma Responsable', data: signatures?.['responsible2']?.data, name: metadata.responsible2 },
  ];

  const COL = { selItem: 28, loc: 80, lub: 22, torque: 45, obs: 70 };

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="REGISTRO DE TORQUE" code="IT-WFB-002-A1" subtitle="Revisión 00" />
        <PdfFields fields={fields} columns={3} />

        {/* Table header row 1 */}
        <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1pt solid #000', borderBottom: '0.5pt solid #9ca3af' }}>
          <Text style={{ ...s.th, width: COL.selItem * 3 + 2 }}>ELEMENTO</Text>
          <Text style={{ ...s.th, width: COL.loc, borderBottom: undefined }}>UBICACION</Text>
          <Text style={{ ...s.th, width: COL.lub * 2 + 1 }}>LUBRICADO</Text>
          <Text style={{ ...s.th, width: COL.torque, borderBottom: undefined }}>TORQUE{'\n'}RECOMENDADO</Text>
          <Text style={{ ...s.th, width: COL.torque, borderBottom: undefined }}>TORQUE{'\n'}APLICADO</Text>
          <Text style={{ ...s.th, flex: 1, borderRight: undefined, borderBottom: undefined }}>OBSERVACIONES</Text>
        </View>

        {/* Table header row 2 */}
        <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottom: '1pt solid #000' }}>
          <Text style={{ ...s.th, width: COL.selItem }}>ESPARRAGO</Text>
          <Text style={{ ...s.th, width: COL.selItem }}>BULON</Text>
          <Text style={{ ...s.th, width: COL.selItem }}>GRAMPA</Text>
          <Text style={{ ...s.th, width: COL.loc, borderBottom: undefined }} />
          <Text style={{ ...s.th, width: COL.lub }}>SI</Text>
          <Text style={{ ...s.th, width: COL.lub }}>NO</Text>
          <Text style={{ ...s.th, width: COL.torque, borderBottom: undefined }} />
          <Text style={{ ...s.th, width: COL.torque, borderBottom: undefined }} />
          <Text style={{ ...s.th, flex: 1, borderRight: undefined, borderBottom: undefined }} />
        </View>

        {rows.map(row => {
          const siStyle = indicatorCell(row.lubrication, 'SI');
          const noStyle = indicatorCell(row.lubrication, 'NO');
          return (
            <View key={row.id} style={s.row}>
              <View style={{ width: COL.selItem, alignItems: 'center', justifyContent: 'center', borderRight: '0.3pt solid #d1d5db' }}>
                {row.selection === 'ESPARRAGO' ? <View style={s.check} /> : <View style={s.checkEmpty} />}
              </View>
              <View style={{ width: COL.selItem, alignItems: 'center', justifyContent: 'center', borderRight: '0.3pt solid #d1d5db' }}>
                {row.selection === 'BULON' ? <View style={s.check} /> : <View style={s.checkEmpty} />}
              </View>
              <View style={{ width: COL.selItem, alignItems: 'center', justifyContent: 'center', borderRight: '0.3pt solid #d1d5db' }}>
                {row.selection === 'GRAMPA' ? <View style={s.check} /> : <View style={s.checkEmpty} />}
              </View>
              <Text style={{ ...s.td, width: COL.loc, textAlign: 'left' }}>{row.location}</Text>
              <Text style={{ ...s.td, width: COL.lub, backgroundColor: siStyle.backgroundColor, color: siStyle.color, fontFamily: siStyle.backgroundColor !== '#fff' ? 'Helvetica-Bold' : 'Helvetica' }}>
                {row.lubrication === 'SI' ? 'X' : ''}
              </Text>
              <Text style={{ ...s.td, width: COL.lub, backgroundColor: noStyle.backgroundColor, color: noStyle.color, fontFamily: noStyle.backgroundColor !== '#fff' ? 'Helvetica-Bold' : 'Helvetica' }}>
                {row.lubrication === 'NO' ? 'X' : ''}
              </Text>
              <Text style={{ ...s.td, width: COL.torque }}>{row.recommendedTorque}</Text>
              <Text style={{ ...s.td, width: COL.torque }}>{row.appliedTorque}</Text>
              <Text style={{ ...s.td, flex: 1, borderRight: undefined, textAlign: 'left' }}>{row.observations}</Text>
            </View>
          );
        })}

        <PdfSignatures signatures={sigEntries} />
      </Page>
    </Document>
  );
};
