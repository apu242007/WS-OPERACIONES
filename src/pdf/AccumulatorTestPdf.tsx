import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { AccumulatorTestReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props { report: AccumulatorTestReport; }

const s = StyleSheet.create({
  sectionTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4, marginTop: 8 },
  bottleTable: { border: '1pt solid black', marginBottom: 4 },
  bottleRow: { flexDirection: 'row' },
  bottleHeader: { padding: 3, backgroundColor: colors.tableHeaderBg, fontSize: 7, fontWeight: 'bold', textAlign: 'center', borderRight: '1pt solid black' },
  bottleCell: { padding: 3, fontSize: 8, textAlign: 'center', borderRight: '1pt solid black' },
  bottleLabelCell: { width: '18%', padding: 3, fontSize: 7, fontWeight: 'bold', borderRight: '1pt solid black' },
  borderBottom: { borderBottom: '1pt solid black' },
  noteText: { fontSize: 7, color: '#555', marginTop: 4, marginBottom: 2 },
  reliefRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbdd', border: '1pt solid black', padding: 6, marginTop: 8, marginBottom: 8 },
  reliefLabel: { fontSize: 9, fontWeight: 'bold' },
  reliefValue: { fontSize: 11, fontWeight: 'bold', marginLeft: 8 },
  obsTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 3, marginTop: 8 },
  obsBox: { border: '1pt solid #ccc', padding: 6, minHeight: 40, fontSize: 9 },
});

export const AccumulatorTestPdf: React.FC<Props> = ({ report }) => {
  const { metadata, pumps, bottles, reliefValvePressure, observations, signatures } = report;

  const metaFields = [
    { label: 'Nombre Mecánico', value: metadata.mechanicName },
    { label: 'Nombre Encargado Turno', value: metadata.shiftLeaderName },
    { label: 'Equipo TKR N°', value: metadata.rigNumber?.toUpperCase() },
    { label: 'Fecha', value: metadata.date },
    { label: 'Cliente', value: metadata.client },
    { label: 'Yacimiento', value: metadata.field },
    { label: 'Pozo', value: metadata.well },
  ];

  const pumpRows = pumps.map(p => [p.type, p.startPressure, p.stopPressure, p.chargeTime]);

  const group1 = bottles.slice(0, 5);
  const group2 = bottles.slice(5, 10);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="PRUEBA DE FUNCIONAMIENTO DE ACUMULADOR" code="IT-WWO-007-A1" />
      <PdfFields fields={metaFields} columns={3} />

      {/* Bombas table */}
      <View style={s.sectionTitle}><Text>Sistema de Bombas</Text></View>
      <PdfTable
        headers={['Tipo Bomba', 'Presión Encendido (PSI)', 'Presión de Corte (PSI)', 'Tiempo de Carga (min.)']}
        rows={pumpRows}
        colWidths={['40%', '20%', '20%', '20%']}
        centerCols={[1, 2, 3]}
      />
      <View>
        <Text style={s.noteText}>• Presión máxima de corte: 3000 PSI.  Primaria eléctrica: inicia al perder 10%; Secundaria neumática: al perder 15%.</Text>
        <Text style={s.noteText}>• Tiempos máximos: Primaria eléctrica 15 min. — Secundaria neumática 30 min.</Text>
      </View>

      {/* Botellones */}
      <View style={s.sectionTitle}><Text>Sistema de Botellones</Text></View>
      <View style={s.bottleTable}>
        {/* Row 1 headers: N°1–5 */}
        <View style={[s.bottleRow, s.borderBottom]}>
          <View style={[s.bottleLabelCell, { backgroundColor: colors.tableHeaderBg }]}><Text style={{ fontSize: 7, fontWeight: 'bold' }}>Presión (PSI)</Text></View>
          {group1.map((b, i) => (
            <View key={b.id} style={[{ flex: 1, backgroundColor: colors.tableHeaderBg }, i < group1.length - 1 ? {} : {}]}>
              <Text style={[s.bottleHeader, i === group1.length - 1 ? { borderRight: undefined } : {}]}>N° {b.bottleNumber}</Text>
            </View>
          ))}
        </View>
        {/* Row 1 values */}
        <View style={[s.bottleRow, s.borderBottom]}>
          <View style={s.bottleLabelCell}><Text style={{ fontSize: 7 }}> </Text></View>
          {group1.map((b, i) => (
            <View key={b.id} style={{ flex: 1 }}>
              <Text style={[s.bottleCell, i === group1.length - 1 ? { borderRight: undefined } : {}]}>{b.pressure || ''}</Text>
            </View>
          ))}
        </View>
        {/* Row 2 headers: N°6–10 */}
        <View style={[s.bottleRow, s.borderBottom]}>
          <View style={[s.bottleLabelCell, { backgroundColor: colors.tableHeaderBg }]}><Text style={{ fontSize: 7 }}> </Text></View>
          {group2.map((b, i) => (
            <View key={b.id} style={{ flex: 1 }}>
              <Text style={[s.bottleHeader, i === group2.length - 1 ? { borderRight: undefined } : {}]}>N° {b.bottleNumber}</Text>
            </View>
          ))}
        </View>
        {/* Row 2 values */}
        <View style={s.bottleRow}>
          <View style={s.bottleLabelCell}><Text style={{ fontSize: 7 }}> </Text></View>
          {group2.map((b, i) => (
            <View key={b.id} style={{ flex: 1 }}>
              <Text style={[s.bottleCell, i === group2.length - 1 ? { borderRight: undefined } : {}]}>{b.pressure || ''}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Relief valve */}
      <View style={s.reliefRow}>
        <Text style={s.reliefLabel}>Presión de Regulación de Válvula de Alivio (PSI):</Text>
        <Text style={s.reliefValue}>{reliefValvePressure || '—'}</Text>
      </View>

      {/* Observations */}
      <Text style={s.obsTitle}>Observaciones Generales:</Text>
      <View style={s.obsBox}><Text style={{ fontSize: 9 }}>{observations || ''}</Text></View>

      <PdfSignatures signatures={[
        { label: 'Firma Mecánico', data: signatures?.mechanic?.data, name: metadata.mechanicName },
        { label: 'Firma Encargado de Turno', data: signatures?.shiftLeader?.data, name: metadata.shiftLeaderName },
      ]} />
    </PdfDocument>
  );
};
