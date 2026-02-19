import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { colors } from './styles';

interface Props {}

interface FrequencyRow {
  component: string;
  daily: string;
  weekly: string;
  semiannual: string;
  annual: string;
  fiveYear: string;
}

const ROWS: FrequencyRow[] = [
  { component: 'Polea del bloque Corona y Rodamiento', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Gancho de taladro (diferente al gancho de succión)', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Bloque viajero, gancho de bloque adaptador de gancho p/bloque', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Conectores y adaptadores de eslabón', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Ganchos de tubería y ganchos de succión', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores de eslabón', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores de rev., Tubería, de taladro, tubería con cuello', daily: 'II', weekly: '', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores de cabillas de succión', daily: 'II', weekly: '', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Asa de la unión giratoria', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Unión giratoria (Rotatory Swivel)', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Unión giratoria de potencia (Power Swivel)', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Potencia rotaria', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Arañas cuando sean usadas como elevadores', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Final línea de amarre / Anclaje de líneas', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Compensador de movimiento de la línea de perforación', daily: 'II', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Cuadrante al ser utilizado como equipo de izamiento', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Top Drive', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores y herramientas de corrida de cabezal cuando sean utilizados como equipo de izamiento', daily: 'II', weekly: '', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Estructura y Sub-estructura UPSP (1) de servicios a pozo', daily: 'I', weekly: 'II', semiannual: '', annual: 'III', fiveYear: 'IV' },
  { component: 'Estructura y Sub-estructura de taladros de perforación', daily: 'I', weekly: 'II', semiannual: '', annual: 'III CADA 2 AÑOS', fiveYear: 'IV' },
  { component: 'Estructura y Sub-estructura UPSP (1) de servicios a pozo (Cat. 5)', daily: 'I', weekly: 'II', semiannual: '', annual: '', fiveYear: 'IV' },
];

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  I:   { bg: '#dcfce7', text: '#166534' },
  II:  { bg: '#dbeafe', text: '#1e40af' },
  III: { bg: '#fef9c3', text: '#92400e' },
  IV:  { bg: '#fee2e2', text: '#991b1b' },
};

const CatCell: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <Text style={{ fontSize: 7, color: '#d1d5db', textAlign: 'center', width: 56, padding: 3 }}>—</Text>;
  const firstChar = value.trim().charAt(0);
  const col = CAT_COLORS[firstChar] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <View style={{ width: 56, padding: 2, alignItems: 'center' }}>
      <View style={{ backgroundColor: col.bg, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 }}>
        <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: col.text, textAlign: 'center' }}>{value}</Text>
      </View>
    </View>
  );
};

export const InspectionFrequencyPdf: React.FC<Props> = () => {
  return (
    <PdfDocument orientation="landscape">
      <PdfHeader title="FRECUENCIA MÍNIMA DE INSPECCIÓN" code="REF-INSP-001" />

      {/* Category Legend */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 6, padding: 4, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#374151', textTransform: 'uppercase' }}>Categorías:</Text>
        {Object.entries(CAT_COLORS).map(([cat, col]) => {
          const labels: Record<string, string> = {
            I: 'Inspección visual diaria',
            II: 'Inspección visual frecuente',
            III: 'Inspección no destructiva',
            IV: 'Inspección certificada periódica',
          };
          return (
            <View key={cat} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <View style={{ width: 14, height: 14, backgroundColor: col.bg, borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: col.text }}>{cat}</Text>
              </View>
              <Text style={{ fontSize: 6, color: '#374151' }}>{labels[cat]}</Text>
            </View>
          );
        })}
      </View>

      {/* Table */}
      <View style={{ borderWidth: 1, borderColor: colors.black }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#1f2937', borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 4, textTransform: 'uppercase' }}>Componente</Text>
          {['Diaria', 'Semanal', 'Semestral', 'Anual', 'Cada 5 años'].map((h) => (
            <Text key={h} style={{ width: 56, fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#fff', padding: 4, textAlign: 'center', borderLeftWidth: 1, borderColor: '#374151', textTransform: 'uppercase' }}>{h}</Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#374151', borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 1, fontSize: 6, color: '#d1d5db', padding: 3 }}></Text>
          <Text style={{ width: 280, fontSize: 6, color: '#d1d5db', padding: 3, textAlign: 'center', borderLeftWidth: 1, borderColor: '#4b5563', textTransform: 'uppercase' }}>Categoría de Inspección</Text>
        </View>

        {/* Rows */}
        {ROWS.map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', borderBottomWidth: idx < ROWS.length - 1 ? 1 : 0, borderColor: colors.borderLight, backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
            <Text style={{ flex: 1, fontSize: 7, padding: 4, color: '#1f2937' }}>{row.component}</Text>
            <CatCell value={row.daily} />
            <CatCell value={row.weekly} />
            <CatCell value={row.semiannual} />
            <CatCell value={row.annual} />
            <CatCell value={row.fiveYear} />
          </View>
        ))}
      </View>

      {/* Notes */}
      <View style={{ marginTop: 8, padding: 6, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: colors.borderLight }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 4, textDecoration: 'underline' }}>NOTAS:</Text>
        <Text style={{ fontSize: 7, color: colors.textMid, marginBottom: 2 }}>(1) UPSP: Unidad de Perforación y Servicios a Pozo.</Text>
        <Text style={{ fontSize: 7, color: colors.textMid, marginBottom: 2 }}>Las frecuencias indicadas son mínimas. El Supervisor de Campo puede aumentar la frecuencia según condiciones operativas.</Text>
        <Text style={{ fontSize: 7, color: colors.textMid }}>Toda inspección de Categoría III y IV debe ser realizada por personal certificado y registrada en el sistema de gestión.</Text>
      </View>
    </PdfDocument>
  );
};
