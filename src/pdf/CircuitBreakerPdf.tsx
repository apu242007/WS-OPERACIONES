import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { CircuitBreakerReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props { report: CircuitBreakerReport; }

const CATEGORIES = [
  'SALA DE TABLEROS', 'EQUIPO', 'PILETAS',
  'TRAILER COMPANY MAN', 'TRAILER JE', 'TRAILER ET', 'CENTRIFUGAS',
];

const COLS = [
  { key: 'description', label: 'Descripción', width: '32%', align: 'left' as const },
  { key: 'voltage', label: 'Voltaje (V)\n220/380 V', width: '10%', align: 'center' as const },
  { key: 'amperage', label: 'Amper (A)\n160/40/25 A', width: '10%', align: 'center' as const },
  { key: 'sensitivityNominal', label: 'mA Nominal\n300/30 mA', width: '10%', align: 'center' as const },
  { key: 'sensitivityMeasured', label: 'mA Medido', width: '10%', align: 'center' as const },
  { key: 'responseTime', label: 'T. Resp. (ms)', width: '10%', align: 'center' as const },
  { key: 'observations', label: 'Observaciones', width: '18%', align: 'left' as const },
];

const s = StyleSheet.create({
  sectionRow: { flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderBottom: '0.5pt solid black', padding: '3 4' },
  sectionText: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  tableContainer: { border: '1pt solid black', marginTop: 8 },
  headerRow: { flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderBottom: '1pt solid black' },
  headerCell: { padding: '3 2', fontSize: 7, fontWeight: 'bold', textAlign: 'center', borderRight: '0.5pt solid black' },
  dataRow: { flexDirection: 'row', borderBottom: '0.5pt solid black', minHeight: 18 },
  dataCell: { padding: '2 3', fontSize: 8, borderRight: '0.5pt solid black' },
  analyzerTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 8, marginBottom: 4 },
  analyzerGrid: { flexDirection: 'row', flexWrap: 'wrap', border: '1pt solid #ccc', padding: 6, gap: 8, backgroundColor: '#f9f9f9' },
  analyzerItem: { flexDirection: 'column', width: '12%' },
  analyzerLabel: { fontSize: 6, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', marginBottom: 2 },
  analyzerValue: { fontSize: 9, fontWeight: 'bold', borderBottom: '0.5pt solid #999', paddingBottom: 1 },
  obsTitle: { fontSize: 8, fontWeight: 'bold', marginTop: 8, marginBottom: 3 },
  obsBox: { border: '1pt solid #ccc', padding: 6, minHeight: 32, fontSize: 9 },
  noteText: { fontSize: 7, color: '#555', textAlign: 'center', marginTop: 6, borderTop: '0.5pt solid #ccc', paddingTop: 4 },
});

export const CircuitBreakerPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, analyzer, generalObservations, signatures } = report;

  const metaFields = [
    { label: 'Eléctrico N. y Apellido', value: metadata.electricianName },
    { label: 'Equipo TKR N°', value: metadata.equipmentNumber?.toUpperCase() },
    { label: 'Fecha', value: metadata.date },
    { label: 'Supervisor N. y Apellido', value: metadata.supervisorName },
    { label: 'Cliente', value: metadata.client },
    { label: 'Yacimiento', value: metadata.field },
    { label: 'Pozo', value: metadata.well },
    { label: 'Instrumento Marca', value: metadata.instrumentBrand },
    { label: 'Instrumento Modelo', value: metadata.instrumentModel },
    { label: 'Instrumento N° Serie', value: metadata.instrumentSerial },
  ];

  const analyzerFields = [
    { label: 'R - Volt', value: analyzer.v_r },
    { label: 'R - Amp', value: analyzer.i_r },
    { label: 'S - Volt', value: analyzer.v_s },
    { label: 'S - Amp', value: analyzer.i_s },
    { label: 'T - Volt', value: analyzer.v_t },
    { label: 'T - Amp', value: analyzer.i_t },
    { label: 'Frecuencia (Hz)', value: analyzer.freq },
  ];

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="REGISTRO DE PRUEBA DE DISYUNTORES" code="IT-WSM-003-A1" subtitle="REVISIÓN 04" />
      <PdfFields fields={metaFields} columns={3} />

      {/* Sectionable disyuntor table */}
      <View style={s.tableContainer} wrap={false}>
        {/* Header */}
        <View style={s.headerRow}>
          {COLS.map((col, i) => (
            <View key={col.key} style={[s.headerCell, { width: col.width }, i === COLS.length - 1 ? { borderRight: undefined } : {}]}>
              <Text>{col.label}</Text>
            </View>
          ))}
        </View>

        {/* Sections */}
        {CATEGORIES.map(cat => {
          const catRows = rows.filter(r => r.category === cat);
          return (
            <View key={cat}>
              <View style={s.sectionRow}>
                <Text style={s.sectionText}>{cat}</Text>
              </View>
              {catRows.map((row, ri) => (
                <View key={row.id} style={[s.dataRow, { backgroundColor: ri % 2 === 1 ? colors.tableAltBg : '#fff' }]} wrap={false}>
                  {COLS.map((col, ci) => (
                    <View key={col.key} style={[s.dataCell, { width: col.width }, ci === COLS.length - 1 ? { borderRight: undefined } : {}]}>
                      <Text style={{ textAlign: col.align }}>{(row as any)[col.key] || ''}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          );
        })}
      </View>

      {/* Network Analyzer */}
      <Text style={s.analyzerTitle}>Analizador de Red</Text>
      <PdfFields fields={analyzerFields} columns={4} />

      {/* Observations */}
      <Text style={s.obsTitle}>Observaciones Generales:</Text>
      <View style={s.obsBox}><Text style={{ fontSize: 9 }}>{generalObservations || ''}</Text></View>

      <Text style={s.noteText}>
        NOTA: El documento Original debe ser archivado en Oficina de Mantenimiento y la Copia en Carpeta de Equipo destinada a Mantenimiento
      </Text>

      <PdfSignatures signatures={[
        { label: 'Firma Personal Eléctrico', data: signatures?.electrician?.data, name: metadata.electricianName },
        { label: 'Firma Supervisor / Jefe de Equipo', data: signatures?.supervisor?.data, name: metadata.supervisorName },
      ]} />
    </PdfDocument>
  );
};
