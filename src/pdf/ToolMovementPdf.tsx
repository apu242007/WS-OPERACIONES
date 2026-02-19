import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ToolMovementReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: ToolMovementReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 7.5, padding: 14, backgroundColor: '#fff' },
  tableHeader: {
    flexDirection: 'row', backgroundColor: '#e5e7eb',
    borderTop: '1pt solid #000', borderBottom: '1pt solid #000',
    fontFamily: 'Helvetica-Bold', fontSize: 7, minHeight: 28, alignItems: 'flex-end',
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 14, alignItems: 'center' },
  cell: { paddingHorizontal: 2, paddingVertical: 1, borderRight: '0.3pt solid #d1d5db', fontSize: 7.5, textAlign: 'center' },
  calcCell: { paddingHorizontal: 2, paddingVertical: 1, borderRight: '0.3pt solid #d1d5db', fontSize: 7.5, textAlign: 'center', backgroundColor: '#f9fafb', fontFamily: 'Helvetica-Bold', color: '#374151' },
});

const W = { tubing: 55, vol: 52, obs: 80 };

export const ToolMovementPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signatures } = report;

  const fields = [
    { label: 'FECHA', value: metadata.date, width: '25%' },
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '25%' },
    { label: 'POZO', value: metadata.well, width: '25%' },
    { label: 'FLUIDO TERMINATOR', value: metadata.termFluid, width: '25%' },
  ];

  const calcAdmitted = (row: { steelVol: string; pumpVol: string }) => {
    const a = parseFloat(row.steelVol);
    const b = parseFloat(row.pumpVol);
    return (!isNaN(a) && !isNaN(b)) ? (b + a).toFixed(2) : '';
  };

  const calcProduced = (row: { steelVol: string; returnVol: string }) => {
    const a = parseFloat(row.steelVol);
    const c = parseFloat(row.returnVol);
    return (!isNaN(a) && !isNaN(c)) ? (c - a).toFixed(2) : '';
  };

  const sigEntries = [
    { label: 'Elabora', data: signatures?.['elaborator']?.data, name: signatures?.['elaborator']?.name },
    { label: 'Aprueba', data: signatures?.['approver']?.data, name: signatures?.['approver']?.name },
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfHeader title="PLANILLA DE CONTROL DE LLENADO — MANIOBRA DE MOVIMIENTO DE HERRAMIENTAS" code="POWWO003-A1-0" />
        <PdfFields fields={fields} columns={4} />

        <View style={s.tableHeader}>
          <Text style={{ ...s.cell, width: W.tubing }}>Long. Tubing{'\n'}Lts/10 tiros</Text>
          <Text style={{ ...s.cell, width: W.vol }}>Vol. Acero{'\n'}Lts/10 tiros{'\n'}(A)</Text>
          <Text style={{ ...s.cell, width: W.vol }}>Vol Bombeo{'\n'}Lts.{'\n'}(B)</Text>
          <Text style={{ ...s.cell, width: W.vol }}>Nivel Pileta{'\n'}cm{'\n'}(Niv. Inicial)</Text>
          <Text style={{ ...s.cell, width: W.vol }}>Vol Retorno{'\n'}Lts.{'\n'}(C)</Text>
          <Text style={{ ...s.calcCell, width: W.vol }}>Vol Admitido{'\n'}Lts.{'\n'}(B + A)</Text>
          <Text style={{ ...s.calcCell, width: W.vol }}>Vol Producido{'\n'}Lts.{'\n'}(C - A)</Text>
          <Text style={{ ...s.cell, flex: 1, borderRight: undefined }}>Observaciones{'\n'}Generales</Text>
        </View>

        {rows.map(row => (
          <View key={row.id} style={s.row}>
            <Text style={{ ...s.cell, width: W.tubing }}>{row.tubingLength}</Text>
            <Text style={{ ...s.cell, width: W.vol }}>{row.steelVol}</Text>
            <Text style={{ ...s.cell, width: W.vol }}>{row.pumpVol}</Text>
            <Text style={{ ...s.cell, width: W.vol }}>{row.tankLevel}</Text>
            <Text style={{ ...s.cell, width: W.vol }}>{row.returnVol}</Text>
            <Text style={{ ...s.calcCell, width: W.vol }}>{calcAdmitted(row)}</Text>
            <Text style={{ ...s.calcCell, width: W.vol }}>{calcProduced(row)}</Text>
            <Text style={{ ...s.cell, flex: 1, borderRight: undefined, textAlign: 'left' }}>{row.observations}</Text>
          </View>
        ))}

        <PdfSignatures signatures={sigEntries} />
      </Page>
    </Document>
  );
};
