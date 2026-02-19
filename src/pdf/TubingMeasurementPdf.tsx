import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { TubingMeasurementReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { colors } from './styles';

const s = StyleSheet.create({
  // Header
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    marginBottom: 6,
  },
  headerLeft: {
    width: '25%',
    borderRightWidth: 2,
    borderRightColor: '#000000',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: '20%',
    borderLeftWidth: 2,
    borderLeftColor: '#000000',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: colors.brand },
  brandSub: { fontSize: 6, color: colors.textMid, letterSpacing: 2 },
  formTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  formCode: { fontSize: 8, color: colors.textMid, fontFamily: 'Helvetica-Bold' },

  // Meta section
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 6,
  },
  metaCell: {
    width: '25%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  metaCellHalf: {
    width: '50%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  metaLabel: { fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 1 },
  metaValue: { fontSize: 9, color: colors.textDark },

  // Columns layout
  twoCol: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  leftCol: { flex: 1 },
  rightCol: { flex: 1 },

  // Specs section
  specTable: {
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 6,
  },
  specTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    backgroundColor: colors.tableHeaderBg,
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  specRow: { flexDirection: 'row', padding: 3 },
  specCell: { flex: 1, fontSize: 7, textAlign: 'center', borderRightWidth: 1, borderRightColor: colors.borderLight, paddingHorizontal: 2 },
  specCellLast: { flex: 1, fontSize: 7, textAlign: 'center', paddingHorizontal: 2 },
  specHeader: { flexDirection: 'row', padding: 3, backgroundColor: colors.tableAltBg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  specHCell: { flex: 1, fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center', borderRightWidth: 1, borderRightColor: colors.borderLight, textTransform: 'uppercase', paddingHorizontal: 1 },
  specHCellLast: { flex: 1, fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center', textTransform: 'uppercase', paddingHorizontal: 1 },

  // Pool table
  poolTable: { borderWidth: 1, borderColor: colors.black, marginBottom: 6 },
  poolTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', backgroundColor: colors.tableHeaderBg, padding: 3, borderBottomWidth: 1, borderBottomColor: colors.black },
  poolHeader: { flexDirection: 'row', backgroundColor: colors.tableAltBg, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  poolTh: { flex: 2, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderRightWidth: 1, borderRightColor: colors.borderLight },
  poolThLast: { flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center' },
  poolRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  poolTd: { flex: 2, fontSize: 8, padding: 3, borderRightWidth: 1, borderRightColor: colors.borderLight },
  poolTdLast: { flex: 1, fontSize: 8, padding: 3, textAlign: 'center' },

  // Tubos grid
  tubosSection: { borderWidth: 1, borderColor: colors.black, marginBottom: 6 },
  tubosTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', backgroundColor: colors.tableHeaderBg, padding: 3, borderBottomWidth: 1, borderBottomColor: colors.black },
  tubosGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 3, gap: 3 },
  tuboCell: { width: '9%', alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, borderRadius: 2 },
  tuboNum: { fontSize: 5.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', textAlign: 'center', backgroundColor: colors.tableAltBg, width: '100%', paddingVertical: 1, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  tuboVal: { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center', padding: 2 },

  // Extra fields
  extraRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  extraCell: { flex: 1, borderWidth: 1, borderColor: colors.borderLight, borderRadius: 2, padding: 4 },
  extraLabel: { fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 1 },
  extraValue: { fontSize: 9, color: colors.textDark },

  // Calculados boxes
  calcRow: { flexDirection: 'row', gap: 4, marginBottom: 6 },
  calcBox: { flex: 1, borderWidth: 1, borderRadius: 3, padding: 6, alignItems: 'center' },
  calcBoxLabel: { fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 },
  calcBoxValue: { fontSize: 16, fontFamily: 'Helvetica-Bold' },

  // Signatures
  sigRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
    justifyContent: 'center',
  },
  sigBlock: {
    alignItems: 'center',
    width: '35%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 4,
    padding: 6,
  },
  sigNameLabel: { fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 2, textAlign: 'center' },
  sigName: { fontSize: 8, marginBottom: 4, textAlign: 'center' },
  sigImage: { width: 80, height: 36, objectFit: 'contain' },
  sigLine: { width: '100%', borderTopWidth: 1, borderTopColor: colors.black, marginTop: 4, marginBottom: 2 },
  sigRoleLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', textAlign: 'center' },
});

interface Props {
  report: TubingMeasurementReport;
}

export const TubingMeasurementPdf: React.FC<Props> = ({ report }) => {
  const { metadata, tubos, poolHerramientas, specs, calculados, signatures } = report;

  return (
    <PdfDocument orientation="landscape">

      {/* Custom Header */}
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <Text style={s.brandName}>TACKER</Text>
          <Text style={s.brandSub}>solutions</Text>
        </View>
        <View style={s.headerCenter}>
          <Text style={s.formTitle}>PLANILLA DE MEDICIÓN DE TUBING</Text>
        </View>
        <View style={s.headerRight}>
          <Text style={s.formCode}>Formulario Técnico</Text>
        </View>
      </View>

      {/* Metadata */}
      <View style={s.metaGrid}>
        <View style={s.metaCell}>
          <Text style={s.metaLabel}>Grado</Text>
          <Text style={s.metaValue}>{metadata.grado || '-'}</Text>
        </View>
        <View style={s.metaCell}>
          <Text style={s.metaLabel}>Diámetro</Text>
          <Text style={s.metaValue}>{metadata.diametro ? `${metadata.diametro}"` : '-'}</Text>
        </View>
        <View style={s.metaCell}>
          <Text style={s.metaLabel}>N° de Pieza</Text>
          <Text style={s.metaValue}>{metadata.nPieza || '-'}</Text>
        </View>
        <View style={s.metaCell}>
          <Text style={s.metaLabel}>Equipo</Text>
          <Text style={[s.metaValue, { textTransform: 'uppercase' }]}>{metadata.equipo || '-'}</Text>
        </View>
        <View style={s.metaCell}>
          <Text style={s.metaLabel}>Fecha</Text>
          <Text style={s.metaValue}>{metadata.fecha || '-'}</Text>
        </View>
        <View style={s.metaCell}>
          <Text style={s.metaLabel}>Pozo</Text>
          <Text style={[s.metaValue, { textTransform: 'uppercase' }]}>{metadata.pozo || '-'}</Text>
        </View>
        <View style={s.metaCellHalf}>
          <Text style={s.metaLabel}>Observaciones</Text>
          <Text style={s.metaValue}>{metadata.observations || '-'}</Text>
        </View>
      </View>

      {/* Two-column layout */}
      <View style={s.twoCol}>

        {/* Left: Pool + Extra */}
        <View style={s.leftCol}>
          {/* Pool de Herramientas */}
          <View style={s.poolTable}>
            <Text style={s.poolTitle}>Pool de Herramientas</Text>
            <View style={s.poolHeader}>
              <Text style={s.poolTh}>Herramienta</Text>
              <Text style={s.poolThLast}>Metros</Text>
            </View>
            {poolHerramientas.map((tool, i) => (
              <View key={i} style={s.poolRow}>
                <Text style={s.poolTd}>{tool.herramienta}</Text>
                <Text style={s.poolTdLast}>{tool.metros.toFixed(2)}</Text>
              </View>
            ))}
            <View style={[s.poolRow, { backgroundColor: colors.tableAltBg }]}>
              <Text style={[s.poolTd, { fontFamily: 'Helvetica-Bold', textAlign: 'right' }]}>Total Pool:</Text>
              <Text style={[s.poolTdLast, { fontFamily: 'Helvetica-Bold', color: '#1E40AF' }]}>{calculados.totalPoolMetros.toFixed(2)} m</Text>
            </View>
          </View>

          {/* Extra metadata */}
          <View style={s.extraRow}>
            <View style={s.extraCell}>
              <Text style={s.extraLabel}>Carrera Zto Tope Final</Text>
              <Text style={s.extraValue}>{metadata.carreraZtoTopeFinal || '-'}</Text>
            </View>
            <View style={s.extraCell}>
              <Text style={s.extraLabel}>HTA C/B N°</Text>
              <Text style={s.extraValue}>{metadata.htaCbNumero || '-'}</Text>
            </View>
          </View>

          {/* Calculados */}
          <View style={s.calcRow}>
            <View style={[s.calcBox, { borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }]}>
              <Text style={[s.calcBoxLabel, { color: '#1D4ED8' }]}>Total Metros</Text>
              <Text style={[s.calcBoxValue, { color: '#1E3A8A' }]}>{calculados.totalMetros.toFixed(2)} m</Text>
            </View>
            <View style={[s.calcBox, { borderColor: colors.borderLight, backgroundColor: colors.tableAltBg }]}>
              <Text style={s.calcBoxLabel}>Cant. Tubos</Text>
              <Text style={s.calcBoxValue}>{calculados.cantidadTubos}</Text>
            </View>
          </View>
          <View style={s.calcRow}>
            <View style={[s.calcBox, { borderColor: '#FDE68A', backgroundColor: '#FEFCE8' }]}>
              <Text style={[s.calcBoxLabel, { color: '#B45309' }]}>Peso Total</Text>
              <Text style={[s.calcBoxValue, { color: '#92400E' }]}>{calculados.pesoTotalKg.toFixed(2)} kg</Text>
            </View>
            <View style={[s.calcBox, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}>
              <Text style={[s.calcBoxLabel, { color: '#15803D' }]}>Volumen Total</Text>
              <Text style={[s.calcBoxValue, { color: '#14532D' }]}>{calculados.totalVolumeLts.toFixed(2)} lts</Text>
            </View>
          </View>

          {/* Specs (if available) */}
          {specs ? (
            <View style={s.specTable}>
              <Text style={s.specTitle}>Propiedades de la Cañería</Text>
              <View style={s.specHeader}>
                <Text style={s.specHCell}>Diám.</Text>
                <Text style={s.specHCell}>Grado</Text>
                <Text style={s.specHCell}>Peso kg/m</Text>
                <Text style={s.specHCell}>Diám.Int</Text>
                <Text style={s.specHCell}>Torque Op</Text>
                <Text style={s.specHCell}>Torque Máx</Text>
                <Text style={s.specHCellLast}>Desplaz.</Text>
              </View>
              <View style={s.specRow}>
                <Text style={s.specCell}>{specs.tbg}</Text>
                <Text style={s.specCell}>{specs.grado}</Text>
                <Text style={s.specCell}>{specs.peso}</Text>
                <Text style={s.specCell}>{specs.diamInt}</Text>
                <Text style={s.specCell}>{specs.torqueOp}</Text>
                <Text style={s.specCell}>{specs.torqueMax}</Text>
                <Text style={s.specCellLast}>{specs.desplazamiento}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Right: Tubos Grid */}
        <View style={s.rightCol}>
          <View style={s.tubosSection}>
            <Text style={s.tubosTitle}>Medición de Tubos (Metros)</Text>
            <View style={s.tubosGrid}>
              {tubos.map((val, idx) => (
                <View key={idx} style={s.tuboCell}>
                  <Text style={s.tuboNum}>{idx + 1}</Text>
                  <Text style={s.tuboVal}>{val > 0 ? val.toFixed(2) : '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </View>

      {/* Signatures */}
      <View style={s.sigRow}>
        {(['inspector', 'supervisor'] as const).map((role) => {
          const sig = signatures?.[role];
          return (
            <View key={role} style={s.sigBlock}>
              {sig?.name ? <Text style={s.sigName}>{sig.name}</Text> : <View style={{ height: 12 }} />}
              {sig?.data ? (
                <Image style={s.sigImage} src={sig.data} />
              ) : (
                <View style={{ height: 36 }} />
              )}
              <View style={s.sigLine} />
              <Text style={s.sigRoleLabel}>Firma {role === 'inspector' ? 'Inspector' : 'Supervisor'}</Text>
            </View>
          );
        })}
      </View>

    </PdfDocument>
  );
};
