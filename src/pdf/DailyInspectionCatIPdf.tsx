import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { DailyInspectionCatIReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: DailyInspectionCatIReport;
}

const MAIN_ITEMS = [
  { id: '1.0', item: '1.0', desc: 'Base de la Torre (Caballete):', isHeader: true },
  { id: '1.1', item: '1.1', desc: 'Largueros Principales:', isHeader: true },
  { id: '1.1.1', item: '1.1.1', desc: 'Rectitud de Perfiles' },
  { id: '1.1.2', item: '1.1.2', desc: 'Agujero de pernos' },
  { id: '1.1.3', item: '1.1.3', desc: 'Soldaduras' },
  { id: '1.1.4', item: '1.1.4', desc: 'Pernos' },
  { id: '1.1.5', item: '1.1.5', desc: 'Seguros / Alfileres' },
  { id: '1.2', item: '1.2', desc: 'Diagonales y Refuerzos:', isHeader: true },
  { id: '1.2.1', item: '1.2.1', desc: 'Rectitud de Perfiles' },
  { id: '1.2.2', item: '1.2.2', desc: 'Soldaduras' },
  { id: '1.3', item: '1.3', desc: 'Tensores Principales:', isHeader: true },
  { id: '1.3.1', item: '1.3.1', desc: 'Estado de Gusanos / Tuercas' },
  { id: '1.3.2', item: '1.3.2', desc: 'Soldaduras' },
  { id: '1.3.3', item: '1.3.3', desc: 'Estado de Ojales' },
  { id: '1.3.4', item: '1.3.4', desc: 'Pernos y Seguros' },
  { id: '1.4', item: '1.4', desc: 'Gusanos de Patas de Apoyo:', isHeader: true },
  { id: '1.4.1', item: '1.4.1', desc: 'Estado de Gusanos / Tuercas' },
  { id: '1.4.2', item: '1.4.2', desc: 'Soldaduras' },
  { id: '2.0', item: '2.0', desc: 'Subestructura:', isHeader: true },
  { id: '2.1', item: '2.1', desc: 'Placas Piso Antideslizante' },
  { id: '2.2', item: '2.2', desc: 'Pasamanos y rodapiés' },
  { id: '2.3', item: '2.3', desc: 'Soldaduras' },
  { id: '2.4', item: '2.4', desc: 'Conexiones de pasamanos' },
  { id: '2.5', item: '2.5', desc: 'Refuerzo del piso' },
  { id: '3.0', item: '3.0', desc: 'Nivelación de Equipo', isHeader: true },
  { id: '3.1', item: '3.1', desc: 'Nivelación Equipo / Subestructura' },
  { id: '3.2', item: '3.2', desc: 'Aparejo centrado en BdP sin peso' },
  { id: '3.3', item: '3.3', desc: 'Tensión de Cables de Vientos' },
  { id: '4.0', item: '4.0', desc: 'Sistemas Mecánicos / Frenos', isHeader: true },
  { id: '4.1', item: '4.1', desc: 'Pernos y Seguros' },
  { id: '4.2', item: '4.2', desc: 'Func. Frenos Tambor Ppal / Altura Palanca' },
];

const cell = {
  fontSize: 7,
  padding: 2,
  borderRightWidth: 1,
  borderRightColor: colors.black,
  borderBottomWidth: 1,
  borderBottomColor: colors.black,
};

export const DailyInspectionCatIPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, additionalRows, images, signatures } = report;

  const getRow = (num: string) => rows.find(r => r.itemNumber === num);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="INSPECCIÓN VISUAL DIARIA EN CAMPO – Cat. I" code="IT-WSG-030-A1-2" />

      {/* Instructions */}
      <View style={{ borderWidth: 1, borderColor: colors.borderLight, padding: 3, marginBottom: 4, backgroundColor: '#f9f9f9' }}>
        <Text style={{ fontSize: 6, color: colors.textMid }}>
          PROPÓSITO: Formulario para realizar y reportar inspecciones de campo de forma completa y uniforme.{'\n'}
          MARCADO: OK = En condiciones | NA = No aplica | X = Reemplazo/Reparación
        </Text>
      </View>

      <PdfFields columns={3} fields={[
        { label: 'FECHA', value: metadata.date },
        { label: 'POZO', value: metadata.well },
        { label: 'EQUIPO', value: metadata.equipment?.toUpperCase() },
      ]} />

      {/* Table Header */}
      <View style={{ flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderTopWidth: 1, borderLeftWidth: 1, borderColor: colors.black, marginTop: 4 }}>
        <Text style={[cell, { width: '8%', fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center' }]}>ART.</Text>
        <Text style={[cell, { flex: 1, fontSize: 6, fontFamily: 'Helvetica-Bold' }]}>DESCRIPCIÓN</Text>
        <Text style={[cell, { width: '6%', fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center' }]}>CAT.</Text>
        <Text style={[cell, { width: '12%', fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center' }]}>INSP.</Text>
        <Text style={[{ ...cell, borderRightWidth: 0 }, { flex: 1, fontSize: 6, fontFamily: 'Helvetica-Bold' }]}>COMENTARIOS</Text>
      </View>

      {/* Table Rows */}
      <View style={{ borderLeftWidth: 1, borderColor: colors.black }}>
        {MAIN_ITEMS.map((item) => {
          if (item.isHeader) {
            return (
              <View key={item.id} style={{ flexDirection: 'row', backgroundColor: colors.tableAltBg, borderBottomWidth: 1, borderBottomColor: colors.black }}>
                <Text style={{ width: '8%', fontSize: 6.5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderRightColor: colors.black, textAlign: 'center' }}>{item.item}</Text>
                <Text style={{ flex: 1, fontSize: 6.5, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderRightColor: colors.black }}>{item.desc}</Text>
                <Text style={{ width: '6%', padding: 2, borderRightWidth: 1, borderRightColor: colors.black }} />
                <Text style={{ width: '12%', padding: 2, borderRightWidth: 1, borderRightColor: colors.black }} />
                <Text style={{ flex: 1, padding: 2 }} />
              </View>
            );
          }
          const row = getRow(item.item);
          return (
            <View key={item.id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.borderLight, minHeight: 14 }}>
              <Text style={[cell, { width: '8%', fontSize: 6.5, textAlign: 'center' }]}>{item.item}</Text>
              <Text style={[cell, { flex: 1, fontSize: 7 }]}>{item.desc}</Text>
              <Text style={[cell, { width: '6%', fontSize: 6.5, textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>I</Text>
              <Text style={[cell, { width: '12%', fontSize: 7, textAlign: 'center', fontFamily: 'Helvetica-Bold', color: row?.status === 'X' ? '#cc0000' : colors.black }]}>
                {row?.status || ''}
              </Text>
              <Text style={[{ ...cell, borderRightWidth: 0 }, { flex: 1, fontSize: 6.5, color: colors.textMid }]}>{row?.comments || ''}</Text>
            </View>
          );
        })}
      </View>

      {/* Additional Inspections */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 }}>INSPECCIONES DIARIAS ADICIONALES</Text>
        <Text style={{ fontSize: 6, textAlign: 'center', color: colors.textMid, marginBottom: 3, fontStyle: 'italic' }}>Tildar con "√" si es correcto, caso contrario informar.</Text>
        {/* Additional table header */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 1, fontSize: 6, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderRightColor: colors.black }}>DESCRIPCIÓN</Text>
          <Text style={{ width: '8%', fontSize: 6, fontFamily: 'Helvetica-Bold', padding: 2, borderRightWidth: 1, borderRightColor: colors.black, textAlign: 'center' }}>✓</Text>
          <Text style={{ flex: 1, fontSize: 6, fontFamily: 'Helvetica-Bold', padding: 2 }}>OBSERVACIÓN</Text>
        </View>
        {additionalRows.map((row) => (
          <View key={row.id} style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.black, minHeight: 14 }}>
            <Text style={{ flex: 1, fontSize: 6.5, padding: 2, borderRightWidth: 1, borderRightColor: colors.black }}>{row.description}</Text>
            <Text style={{ width: '8%', fontSize: 8, textAlign: 'center', padding: 2, borderRightWidth: 1, borderRightColor: colors.black, fontFamily: 'Helvetica-Bold' }}>{row.checked ? '√' : ''}</Text>
            <Text style={{ flex: 1, fontSize: 6.5, padding: 2, color: colors.textMid }}>{row.observation || ''}</Text>
          </View>
        ))}
      </View>

      {/* Photo grid */}
      {images.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 3 }}>Registro Fotográfico</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {images.map((img, i) => (
              <Image key={i} src={img} style={{ width: '48%', height: 110, objectFit: 'contain', borderWidth: 1, borderColor: colors.borderLight }} />
            ))}
          </View>
        </View>
      )}

      <PdfSignatures signatures={[
        { label: 'Firma J.E. / E.T', data: signatures['je_et']?.data },
        { label: 'Firma Sup. Mantenimiento', data: signatures['sup_mto']?.data },
      ]} />
    </PdfDocument>
  );
};
