import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { InertiaReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { colors } from './styles';

interface Props {
  report: InertiaReport;
}

const FIELDS = [
  { key: 'towerHeight', label: 'Altura torre - Tablón (AC)' },
  { key: 'inertia', label: 'Inercia (DF)' },
  { key: 'blockHeight', label: 'Aparejo' },
  { key: 'linksHeight', label: 'Amela' },
  { key: 'toolStringLength', label: 'Tiro o herramienta' },
  { key: 'couplingHeight', label: 'Altura de Cupla' },
  { key: 'workFloorHeight', label: 'Altura Piso de Trabajo' },
] as const;

export const InertiaCalcPdf: React.FC<Props> = ({ report }) => {
  const { metadata, data, signature } = report;

  const totalOccupied =
    data.inertia +
    data.blockHeight +
    data.linksHeight +
    data.toolStringLength +
    data.couplingHeight +
    data.workFloorHeight;
  const safetyMargin = data.towerHeight - totalOccupied;
  const isOk = safetyMargin >= 0;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title='REGISTRO DE "CALCULO DE INERCIA"' code="POWSG005-A1-1" />

      <PdfFields columns={2} fields={[
        { label: 'EQUIPO', value: metadata.equipment?.toUpperCase() },
        { label: 'FECHA', value: metadata.date },
        { label: 'YACIMIENTO', value: metadata.field },
        { label: 'POZO', value: metadata.well },
      ]} />

      {/* Calculation Table */}
      <View style={{ marginTop: 8, borderWidth: 1, borderColor: colors.black }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 2, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 4, textTransform: 'uppercase' }}>Parámetro</Text>
          <Text style={{ width: 60, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 4, textAlign: 'center', textTransform: 'uppercase', borderLeftWidth: 1, borderColor: colors.black }}>Valor (mts)</Text>
        </View>

        {FIELDS.map((field, idx) => (
          <View
            key={field.key}
            style={{
              flexDirection: 'row',
              borderBottomWidth: idx < FIELDS.length - 1 ? 1 : 0,
              borderColor: colors.borderLight,
              backgroundColor: idx % 2 === 1 ? colors.tableAltBg : '#fff',
            }}
          >
            <Text style={{ flex: 2, fontSize: 8, padding: 4 }}>{field.label}</Text>
            <Text style={{ width: 60, fontSize: 8, padding: 4, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.borderLight, fontFamily: 'Helvetica-Bold' }}>
              {data[field.key]?.toFixed(2) ?? '—'}
            </Text>
          </View>
        ))}
      </View>

      {/* Safety Margin Result */}
      <View style={{ marginTop: 12, padding: 10, borderWidth: 2, borderColor: isOk ? '#16a34a' : '#dc2626', backgroundColor: isOk ? '#f0fdf4' : '#fef2f2', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' }}>
          Distancia Libre a Tablón (Margen de Seguridad)
        </Text>
        <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: isOk ? '#15803d' : '#b91c1c' }}>
          {safetyMargin.toFixed(2)} mts
        </Text>
        <Text style={{ fontSize: 9, marginTop: 4, fontFamily: 'Helvetica-Bold', color: isOk ? '#15803d' : '#b91c1c' }}>
          {isOk ? '✓ MARGEN POSITIVO – OPERACIÓN SEGURA' : '✗ MARGEN NEGATIVO – REVISAR PARÁMETROS'}
        </Text>
      </View>

      {/* Calculation breakdown */}
      <View style={{ marginTop: 8, padding: 6, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: colors.borderLight }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>DETALLE DEL CÁLCULO:</Text>
        <Text style={{ fontSize: 7, color: colors.textMid }}>
          Total ocupado = Inercia + Aparejo + Amela + Herramienta + Cupla + Piso = {totalOccupied.toFixed(2)} mts
        </Text>
        <Text style={{ fontSize: 7, color: colors.textMid, marginTop: 2 }}>
          Distancia libre = Altura Torre ({data.towerHeight.toFixed(2)}) − Total ocupado ({totalOccupied.toFixed(2)}) = {safetyMargin.toFixed(2)} mts
        </Text>
      </View>

      {/* References */}
      <View style={{ marginTop: 12, padding: 6, backgroundColor: '#f9fafb', borderTopWidth: 1, borderColor: colors.black }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 4, textDecoration: 'underline' }}>REFERENCIAS:</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Text style={{ fontSize: 7 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>AC:</Text> Altura total torre a terreno.</Text>
          <Text style={{ fontSize: 7 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>DF:</Text> Inercia.</Text>
          <Text style={{ fontSize: 7 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>DL:</Text> Margen seguridad al tablón.</Text>
        </View>
        <Text style={{ fontSize: 7, marginTop: 4, color: colors.textMid }}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>NOTA:</Text> El corte de carrera del aparejo para las pruebas de inercia debe estar regulado a la altura del piso de enganche. Los resultados deben ser comunicados al Supervisor de Campo.
        </Text>
      </View>

      {/* Signature */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <View style={{ width: 200, alignItems: 'center' }}>
          {signature?.data ? (
            <Image src={signature.data} style={{ width: 100, height: 50, marginBottom: 4 }} />
          ) : (
            <View style={{ height: 50, width: 200, borderBottomWidth: 1, borderColor: colors.black }} />
          )}
          <View style={{ width: 200, borderTopWidth: 1, borderColor: colors.black, paddingTop: 2 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', textTransform: 'uppercase' }}>Jefe de Equipo</Text>
            <Text style={{ fontSize: 6, color: colors.textMid, textAlign: 'center' }}>Firma y Aclaración</Text>
          </View>
        </View>
      </View>
    </PdfDocument>
  );
};
