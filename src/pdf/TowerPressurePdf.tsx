import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { TowerPressureReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: TowerPressureReport;
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 16, backgroundColor: '#fff' },
  sectionTitle: {
    backgroundColor: '#e5e7eb', fontFamily: 'Helvetica-Bold', fontSize: 8,
    padding: 4, marginTop: 8, marginBottom: 4, textTransform: 'uppercase',
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottom: '0.3pt solid #e5e7eb' },
  checkLabel: { flex: 1, fontSize: 8 },
  btn: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3, marginLeft: 4, fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  pressureGrid: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  pressureBox: { flex: 1, border: '0.5pt solid #9ca3af', borderRadius: 3, padding: 6 },
  pressureLabel: { fontSize: 6.5, color: '#6b7280', fontFamily: 'Helvetica-Bold', marginBottom: 2, textTransform: 'uppercase' },
  pressureValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  obsBox: { border: '0.5pt solid #9ca3af', borderRadius: 3, padding: 6, minHeight: 36, fontSize: 8, marginTop: 8 },
  sigBox: { marginTop: 12, alignItems: 'center' },
  sigLine: { width: 160, height: 40, borderBottom: '1pt solid #000', marginBottom: 3 },
  sigImage: { width: 130, height: 40, objectFit: 'contain' },
  sigLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
});

const stateColor = (val: 'Correcto' | 'Incorrecto' | null, type: 'Correcto' | 'Incorrecto') => {
  if (val === type) {
    return type === 'Correcto'
      ? { backgroundColor: '#16a34a', color: '#fff' }
      : { backgroundColor: '#dc2626', color: '#fff' };
  }
  return { backgroundColor: '#f3f4f6', color: '#374151' };
};

const CheckRow: React.FC<{ label: string; value: 'Correcto' | 'Incorrecto' | null }> = ({ label, value }) => (
  <View style={s.checkRow}>
    <Text style={s.checkLabel}>{label}</Text>
    <Text style={{ ...s.btn, ...stateColor(value, 'Correcto') }}>Correcto</Text>
    <Text style={{ ...s.btn, ...stateColor(value, 'Incorrecto') }}>Incorrecto</Text>
  </View>
);

export const TowerPressurePdf: React.FC<Props> = ({ report }) => {
  const { metadata, data, observations, signature } = report;

  const fields = [
    { label: 'EQUIPO', value: metadata.equipment?.toUpperCase(), width: '50%' },
    { label: 'FECHA', value: metadata.date, width: '50%' },
  ];

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="REGISTRO DE PRESIONES DE TORRE" code="IT-WWO-021-A1-0" />
        <PdfFields fields={fields} columns={2} />

        {/* Pre-Check */}
        <Text style={s.sectionTitle}>Verificaciones Previas</Text>
        <CheckRow label="Nivelación del Chasis (Verificar con nivel)" value={data.chassisLeveling} />

        {/* Section 1 */}
        <Text style={s.sectionTitle}>1° Sección (Izaje de la Torre)</Text>
        <View style={s.pressureGrid}>
          <View style={s.pressureBox}>
            <Text style={s.pressureLabel}>Presión Inicial (PSI)</Text>
            <Text style={s.pressureValue}>{data.section1_initialPressure || '—'}</Text>
          </View>
          <View style={s.pressureBox}>
            <Text style={s.pressureLabel}>Presión Intermedia (PSI)</Text>
            <Text style={s.pressureValue}>{data.section1_intermediatePressure || '—'}</Text>
          </View>
          <View style={s.pressureBox}>
            <Text style={s.pressureLabel}>Presión Final (PSI)</Text>
            <Text style={s.pressureValue}>{data.section1_finalPressure || '—'}</Text>
          </View>
        </View>
        <CheckRow label="Estado de los Cilindros (Fugas, daños)" value={data.section1_cylinderState} />
        <CheckRow label="Seguros de pernos colocados" value={data.section1_pinsSafety} />

        {/* Section 2 */}
        <Text style={s.sectionTitle}>2° Sección (Telescopado)</Text>
        <View style={{ ...s.pressureBox, maxWidth: 160, marginBottom: 6 }}>
          <Text style={s.pressureLabel}>Presión de Trabajo (PSI)</Text>
          <Text style={s.pressureValue}>{data.section2_pressure || '—'}</Text>
        </View>
        <CheckRow label="Estado de los Cilindros (Fugas, daños)" value={data.section2_cylinderState} />
        <CheckRow label="Trabas Mecánicas accionadas" value={data.section2_mechanicalLocks} />
        <CheckRow label="Seguros de pernos colocados" value={data.section2_pinsSafety} />

        {/* Observations */}
        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, marginTop: 8, textTransform: 'uppercase' }}>Observaciones:</Text>
        <View style={s.obsBox}>
          <Text>{observations ?? ''}</Text>
        </View>

        {/* Signature */}
        <View style={s.sigBox}>
          {signature?.data
            ? <Image src={signature.data} style={s.sigImage} />
            : <View style={s.sigLine} />
          }
          <Text style={s.sigLabel}>Firma Jefe de Equipo</Text>
        </View>
      </Page>
    </Document>
  );
};
