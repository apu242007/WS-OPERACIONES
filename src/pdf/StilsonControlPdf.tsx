import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { StilsonControlReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: StilsonControlReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 14, backgroundColor: '#fff' },
  infoBox: {
    border: '1pt solid #1d4ed8', backgroundColor: '#eff6ff', borderRadius: 3,
    padding: 4, marginBottom: 6, fontSize: 7,
  },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000', fontFamily: 'Helvetica-Bold', fontSize: 7,
    alignItems: 'center', minHeight: 20,
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 18, alignItems: 'center' },
  cell: { paddingHorizontal: 2, paddingVertical: 2, borderRight: '0.3pt solid #d1d5db', fontSize: 7 },
  sigBox: { width: 36, height: 18, borderRight: '0.3pt solid #d1d5db' },
  sigImage: { width: 32, height: 16, objectFit: 'contain' },
});

const CONDITION_BG: Record<string, string> = {
  Bueno: '#dcfce7', Malo: '#fee2e2',
};

export const StilsonControlPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows } = report;

  const fields = [
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '33%' },
    { label: 'MES / AÑO', value: metadata.month, width: '33%' },
    { label: 'LOCACIÓN', value: metadata.location, width: '34%' },
  ];

  const COL = { date: 40, from: 28, resp: 60, act: 80, cond: 24, to: 28, sig: 36, obs: 70 };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfHeader title="PLANILLA DE CONTROL PARA USO / ESTADO DE LLAVES STILSON" code="IT-SGI-001-A1-2" />
        <PdfFields fields={fields} columns={3} />

        <View style={s.infoBox}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Bueno:</Text>
          <Text> No se evidencia desgaste y/o rotura que perjudique el funcionamiento.</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', marginTop: 1 }}>Malo:</Text>
          <Text> Se evidencia desgaste y/o rotura que perjudica el funcionamiento correcto.</Text>
        </View>

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={{ ...s.cell, width: COL.date, textAlign: 'center' }}>FECHA</Text>
          <Text style={{ ...s.cell, width: COL.from, textAlign: 'center' }}>DESDE</Text>
          <Text style={{ ...s.cell, width: COL.resp }}>RESPONSABLE</Text>
          <Text style={{ ...s.cell, flex: 1 }}>ACTIVIDAD</Text>
          <Text style={{ ...s.cell, width: COL.cond, textAlign: 'center' }}>TALÓN</Text>
          <Text style={{ ...s.cell, width: COL.cond, textAlign: 'center' }}>GAVILÁN</Text>
          <Text style={{ ...s.cell, width: COL.cond, textAlign: 'center' }}>AGARRE</Text>
          <Text style={{ ...s.cell, width: COL.cond, textAlign: 'center' }}>TUERCAS</Text>
          <Text style={{ ...s.cell, width: COL.to, textAlign: 'center' }}>HASTA</Text>
          <Text style={{ ...s.cell, width: COL.sig, textAlign: 'center' }}>FIRMA</Text>
          <Text style={{ ...s.cell, width: COL.obs, borderRight: undefined }}>OBSERVACIONES</Text>
        </View>

        {rows.map(row => (
          <View key={row.id} style={s.row}>
            <Text style={{ ...s.cell, width: COL.date, textAlign: 'center' }}>{row.date}</Text>
            <Text style={{ ...s.cell, width: COL.from, textAlign: 'center' }}>{row.timeFrom}</Text>
            <Text style={{ ...s.cell, width: COL.resp }}>{row.responsible}</Text>
            <Text style={{ ...s.cell, flex: 1 }}>{row.activity}</Text>
            {[row.talon, row.gavilan, row.gripPoint, row.nuts].map((cond, i) => (
              <Text key={i} style={{ ...s.cell, width: COL.cond, textAlign: 'center', fontSize: 6.5, fontFamily: 'Helvetica-Bold', backgroundColor: CONDITION_BG[cond] || 'transparent' }}>
                {cond ? cond[0] : ''}
              </Text>
            ))}
            <Text style={{ ...s.cell, width: COL.to, textAlign: 'center' }}>{row.timeTo}</Text>
            <View style={{ ...s.sigBox }}>
              {row.signature?.data && <Image src={row.signature.data} style={s.sigImage} />}
            </View>
            <Text style={{ ...s.cell, width: COL.obs, borderRight: undefined }}>{row.observations}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};
