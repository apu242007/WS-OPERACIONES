import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { SwabbingReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: SwabbingReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 7.5, padding: 14, backgroundColor: '#fff' },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1pt solid #000',
    borderBottom: '1pt solid #000', fontFamily: 'Helvetica-Bold', fontSize: 7,
    alignItems: 'flex-end', minHeight: 28,
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 14, alignItems: 'center' },
  cell: { paddingHorizontal: 2, paddingVertical: 1, borderRight: '0.3pt solid #d1d5db', fontSize: 7, textAlign: 'center' },
  sigBox: { marginTop: 12, alignItems: 'center' },
  sigLine: { width: 160, height: 40, borderBottom: '1pt solid #000', marginBottom: 3 },
  sigImage: { width: 130, height: 40, objectFit: 'contain' },
  sigLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
});

export const SwabbingReportPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signature } = report;

  const fields = [
    { label: 'FECHA', value: metadata.date, width: '25%' },
    { label: 'POZO', value: metadata.well, width: '25%' },
    { label: 'COMPAÑÍA', value: metadata.company, width: '25%' },
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '25%' },
  ];

  const COL = { time: 24, depth: 26, fluid: 26, liters: 26, accum: 26, water: 20, emuls: 20, sand: 20, imp: 22, cl: 18, strokes: 22, obs: 60 };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfHeader title="PLANILLA DE ENSAYO — INFORME DE PISTONEO" code="POWWO006-A1-0" />
        <PdfFields fields={fields} columns={4} />

        {/* Table header top row */}
        <View style={[s.tableHeader, { alignItems: 'center' }]}>
          <Text style={{ ...s.cell, width: COL.time * 2 + 1, textAlign: 'center', borderBottom: '0.5pt solid #9ca3af', fontFamily: 'Helvetica-Bold' }}>Tiempo</Text>
          <Text style={{ ...s.cell, width: COL.depth, paddingBottom: 1 }}>Prof.{'\n'}Mts.</Text>
          <Text style={{ ...s.cell, width: COL.fluid, paddingBottom: 1 }}>Nivel{'\n'}Mts.</Text>
          <Text style={{ ...s.cell, width: COL.liters + COL.accum + 1, textAlign: 'center', borderBottom: '0.5pt solid #9ca3af' }}>Vol. Pistoneado</Text>
          <Text style={{ ...s.cell, width: COL.water + COL.emuls + 1, textAlign: 'center', borderBottom: '0.5pt solid #9ca3af' }}>Agua</Text>
          <Text style={{ ...s.cell, width: COL.sand, paddingBottom: 1 }}>Arena{'\n'}%</Text>
          <Text style={{ ...s.cell, width: COL.imp, paddingBottom: 1 }}>Impurez.{'\n'}%</Text>
          <Text style={{ ...s.cell, width: COL.cl }}>Cl{'\n'}g/l</Text>
          <Text style={{ ...s.cell, width: COL.strokes, paddingBottom: 1 }}>Carreras{'\n'}p/h</Text>
          <Text style={{ ...s.cell, flex: 1, borderRight: undefined }}>Observaciones</Text>
        </View>

        {/* Sub-header */}
        <View style={[s.tableHeader, { backgroundColor: '#f3f4f6', minHeight: 14 }]}>
          <Text style={{ ...s.cell, width: COL.time }}>de Hs.</Text>
          <Text style={{ ...s.cell, width: COL.time }}>a Hs.</Text>
          <Text style={{ ...s.cell, width: COL.depth }} />
          <Text style={{ ...s.cell, width: COL.fluid }} />
          <Text style={{ ...s.cell, width: COL.liters }}>Extr. Lts.</Text>
          <Text style={{ ...s.cell, width: COL.accum }}>Acum M3</Text>
          <Text style={{ ...s.cell, width: COL.water }}>%</Text>
          <Text style={{ ...s.cell, width: COL.emuls }}>Emuls</Text>
          <Text style={{ ...s.cell, width: COL.sand }} />
          <Text style={{ ...s.cell, width: COL.imp }} />
          <Text style={{ ...s.cell, width: COL.cl }} />
          <Text style={{ ...s.cell, width: COL.strokes }} />
          <Text style={{ ...s.cell, flex: 1, borderRight: undefined }} />
        </View>

        {rows.map(row => (
          <View key={row.id} style={s.row}>
            <Text style={{ ...s.cell, width: COL.time }}>{row.timeFrom}</Text>
            <Text style={{ ...s.cell, width: COL.time }}>{row.timeTo}</Text>
            <Text style={{ ...s.cell, width: COL.depth }}>{row.depth}</Text>
            <Text style={{ ...s.cell, width: COL.fluid }}>{row.fluidLevel}</Text>
            <Text style={{ ...s.cell, width: COL.liters }}>{row.extractedLiters}</Text>
            <Text style={{ ...s.cell, width: COL.accum }}>{row.accumulatedM3}</Text>
            <Text style={{ ...s.cell, width: COL.water }}>{row.waterCut}</Text>
            <Text style={{ ...s.cell, width: COL.emuls }}>{row.emulsion}</Text>
            <Text style={{ ...s.cell, width: COL.sand }}>{row.sandMud}</Text>
            <Text style={{ ...s.cell, width: COL.imp }}>{row.totalImpurities}</Text>
            <Text style={{ ...s.cell, width: COL.cl }}>{row.chlorides}</Text>
            <Text style={{ ...s.cell, width: COL.strokes }}>{row.strokesPerHour}</Text>
            <Text style={{ ...s.cell, flex: 1, borderRight: undefined, textAlign: 'left' }}>{row.observations}</Text>
          </View>
        ))}

        <View style={s.sigBox}>
          {signature?.data
            ? <Image src={signature.data} style={s.sigImage} />
            : <View style={s.sigLine} />
          }
          <Text style={s.sigLabel}>Firma Responsable</Text>
        </View>
      </Page>
    </Document>
  );
};
