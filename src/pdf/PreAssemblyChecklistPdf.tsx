import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PreAssemblyChecklistReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: PreAssemblyChecklistReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 20, backgroundColor: '#fff' },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000', fontFamily: 'Helvetica-Bold', fontSize: 8,
    alignItems: 'center', minHeight: 20,
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 18, alignItems: 'center' },
  numCell: { width: 20, textAlign: 'center', borderRight: '0.5pt solid #9ca3af', paddingVertical: 2, fontSize: 7.5 },
  descCell: { flex: 1, paddingHorizontal: 4, paddingVertical: 2, fontSize: 7.5, borderRight: '0.5pt solid #9ca3af' },
  siCell: { width: 22, textAlign: 'center', borderRight: '0.5pt solid #9ca3af', paddingVertical: 2, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  noCell: { width: 22, textAlign: 'center', borderRight: '0.5pt solid #9ca3af', paddingVertical: 2, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  obsCell: { flex: 1.5, paddingHorizontal: 4, paddingVertical: 2, fontSize: 7 },
  photosLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, marginTop: 8, marginBottom: 4 },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  photo: { width: 80, height: 80, objectFit: 'cover' },
});

export const PreAssemblyChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, items, signatures, images } = report;

  const fields = [
    { label: 'FECHA', value: metadata.date, width: '33%' },
    { label: 'POZO', value: metadata.well, width: '33%' },
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '34%' },
  ];

  const sigEntries = [
    { label: 'Jefe de Equipo', data: signatures.rigManager?.data },
    { label: 'Encargado de Turno', data: signatures.shiftLeader?.data },
  ];

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="CHECK LIST PRE-MONTAJE" code="IT-WWO-003-A2-0" />

        <PdfFields fields={fields} columns={3} />

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={s.numCell}>#</Text>
          <Text style={s.descCell}>DESCRIPCION</Text>
          <Text style={s.siCell}>SI</Text>
          <Text style={s.noCell}>NO</Text>
          <Text style={s.obsCell}>OBSERVACIONES</Text>
        </View>

        {items.map(item => (
          <View key={item.id} style={s.row}>
            <Text style={s.numCell}>{item.id}</Text>
            <Text style={s.descCell}>{item.question}</Text>
            <Text style={{
              ...s.siCell,
              backgroundColor: item.status === 'SI' ? '#16a34a' : 'transparent',
              color: item.status === 'SI' ? '#fff' : '#000',
            }}>{item.status === 'SI' ? '✓' : ''}</Text>
            <Text style={{
              ...s.noCell,
              backgroundColor: item.status === 'NO' ? '#dc2626' : 'transparent',
              color: item.status === 'NO' ? '#fff' : '#000',
            }}>{item.status === 'NO' ? '✕' : ''}</Text>
            <Text style={s.obsCell}>{item.observation}</Text>
          </View>
        ))}

        {images && images.length > 0 && (
          <View>
            <Text style={s.photosLabel}>EVIDENCIA FOTOGRÁFICA</Text>
            <View style={s.photosGrid}>
              {images.map((src, i) => (
                <Image key={i} src={src} style={s.photo} />
              ))}
            </View>
          </View>
        )}

        <PdfSignatures signatures={sigEntries} />
      </Page>
    </Document>
  );
};
