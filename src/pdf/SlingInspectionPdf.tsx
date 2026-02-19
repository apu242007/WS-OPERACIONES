import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { SlingInspectionReport } from '../types';
import { PdfHeader } from './PdfHeader';

interface Props {
  report: SlingInspectionReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 16, backgroundColor: '#fff' },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000', fontFamily: 'Helvetica-Bold', fontSize: 7,
    alignItems: 'center', minHeight: 18,
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 16, alignItems: 'center' },
  cell: { paddingHorizontal: 2, paddingVertical: 2, borderRight: '0.3pt solid #d1d5db', fontSize: 7 },
  statusContainer: { flexDirection: 'row', flex: 0 },
  statusCell: { width: 14, textAlign: 'center', fontSize: 7, fontFamily: 'Helvetica-Bold', borderRight: '0.3pt solid #d1d5db' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'flex-end' },
  nameBox: { flex: 1 },
  nameLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, marginBottom: 2 },
  nameLine: { borderBottom: '1pt solid #000', paddingBottom: 2, fontSize: 8 },
  sigBox: { width: 200, alignItems: 'center' },
  sigLine: { width: 180, height: 40, borderBottom: '1pt solid #000', marginBottom: 3 },
  sigImage: { width: 150, height: 40, objectFit: 'contain' },
  sigLabel: { fontSize: 7.5, textAlign: 'center' },
  stateCol: { width: 28, borderRight: '0.3pt solid #d1d5db' },
  stateHeader: { textAlign: 'center', borderBottom: '0.5pt solid #9ca3af', paddingBottom: 1, marginBottom: 1 },
  stateCols: { flexDirection: 'row' },
});

const COL_WIDTHS = {
  num: 16, qty: 36, svcDate: 40, inspDate: 40, lot: 32, cert: 32,
  length: 28, diam: 30, type: 36, load: 32, color: 34, state: 28,
  location: 50, obs: 60,
};

const C: React.FC<{ w: number; bold?: boolean; center?: boolean; bg?: string; color?: string; children?: React.ReactNode }> = ({ w, bold, center, bg, color, children }) => (
  <Text style={{ ...s.cell, width: w, fontFamily: bold ? 'Helvetica-Bold' : 'Helvetica', textAlign: center ? 'center' : 'left', backgroundColor: bg || 'transparent', color: color || '#000' }}>
    {children}
  </Text>
);

export const SlingInspectionPdf: React.FC<Props> = ({ report }) => {
  const { rows, inspectorName, signature, date } = report;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfHeader title="Planilla de Inspección y Control de Eslingas" code="POWSG022-A1-0" />

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={{ ...s.cell, width: COL_WIDTHS.num, textAlign: 'center' }}>N°</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.qty, textAlign: 'center' }}>Cantidad</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.svcDate, textAlign: 'center' }}>Puesta Serv.</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.inspDate, textAlign: 'center' }}>Fecha Insp.</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.lot, textAlign: 'center' }}>N° Lote</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.cert, textAlign: 'center' }}>N° Cert.</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.length, textAlign: 'center' }}>Long cm</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.diam, textAlign: 'center' }}>Diam plg</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.type, textAlign: 'center' }}>Tipo</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.load, textAlign: 'center' }}>Carga Kg</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.color, textAlign: 'center' }}>Color</Text>
          <View style={{ ...s.stateCol }}>
            <Text style={{ ...s.cell, textAlign: 'center', borderRight: undefined }}>Estado</Text>
            <View style={s.stateCols}>
              <Text style={{ width: 14, textAlign: 'center', fontSize: 6.5 }}>B</Text>
              <Text style={{ width: 14, textAlign: 'center', fontSize: 6.5 }}>FS</Text>
            </View>
          </View>
          <Text style={{ ...s.cell, width: COL_WIDTHS.location, textAlign: 'center' }}>Ubicación</Text>
          <Text style={{ ...s.cell, width: COL_WIDTHS.obs, textAlign: 'center', borderRight: undefined }}>Observaciones</Text>
        </View>

        {rows.map((row, index) => (
          <View key={row.id} style={s.row}>
            <C w={COL_WIDTHS.num} bold center>{index + 1}</C>
            <C w={COL_WIDTHS.qty} center>{row.quantity}</C>
            <C w={COL_WIDTHS.svcDate} center>{row.serviceDate}</C>
            <C w={COL_WIDTHS.inspDate} center>{row.inspectionDate}</C>
            <C w={COL_WIDTHS.lot} center>{row.lotNumber}</C>
            <C w={COL_WIDTHS.cert} center>{row.certNumber}</C>
            <C w={COL_WIDTHS.length} center>{row.length}</C>
            <C w={COL_WIDTHS.diam} center>{row.diameter}</C>
            <C w={COL_WIDTHS.type} center>{row.type}</C>
            <C w={COL_WIDTHS.load} center>{row.workingLoad}</C>
            <C w={COL_WIDTHS.color} center>{row.color}</C>
            <View style={s.stateCol}>
              <View style={s.stateCols}>
                <Text style={{ width: 14, textAlign: 'center', backgroundColor: row.condition === 'B' ? '#000' : 'transparent', color: row.condition === 'B' ? '#fff' : '#000', fontSize: 7, fontFamily: 'Helvetica-Bold' }}>
                  {row.condition === 'B' ? 'X' : ''}
                </Text>
                <Text style={{ width: 14, textAlign: 'center', backgroundColor: row.condition === 'FS' ? '#dc2626' : 'transparent', color: row.condition === 'FS' ? '#fff' : '#000', fontSize: 7, fontFamily: 'Helvetica-Bold' }}>
                  {row.condition === 'FS' ? 'X' : ''}
                </Text>
              </View>
            </View>
            <C w={COL_WIDTHS.location}>{row.location}</C>
            <Text style={{ ...s.cell, width: COL_WIDTHS.obs, borderRight: undefined }}>{row.observations}</Text>
          </View>
        ))}

        <View style={s.footer}>
          <View style={s.nameBox}>
            <Text style={s.nameLabel}>Nombre y Apellido del Inspector:</Text>
            <Text style={s.nameLine}>{inspectorName}</Text>
          </View>
          <View style={s.sigBox}>
            {signature?.data
              ? <Image src={signature.data} style={s.sigImage} />
              : <View style={s.sigLine} />
            }
            <Text style={s.sigLabel}>Firma</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
