import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { WelcomeSignData } from '../types';
import { colors } from './styles';

// 7 EPP badge labels
const EPP_ITEMS = ['Casco', 'Anteojos', 'Botines', 'Mameluco FR', 'Guantes', 'Prot. Auditiva', 'Chaleco'];

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  // ── Top bar ──────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.black,
    paddingBottom: 6,
    marginBottom: 8,
  },
  company: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
  },
  topRight: { alignItems: 'flex-end' },
  operationsLabel: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.brand,
    textAlign: 'right',
  },
  subLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMid,
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // ── Main ─────────────────────────────────────────────────
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bienvenidos: {
    fontSize: 64,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    letterSpacing: 6,
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    width: '75%',
    height: 2,
    backgroundColor: colors.textMid,
    opacity: 0.2,
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 10,
  },
  dataLabel: {
    fontSize: 16,
    color: colors.textMid,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontSize: 40,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    textTransform: 'uppercase',
  },
  wellValue: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
    textTransform: 'uppercase',
  },
  locationValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMid,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
  },
  additionalBg: {
    marginTop: 10,
    backgroundColor: colors.brand,
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 24,
  },
  additionalText: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  // ── Footer ───────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: colors.black,
    paddingTop: 6,
    marginTop: 8,
  },
  // EPP badges spread evenly in a single row
  eppList: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eppItem: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  eppText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  eppNote: {
    marginLeft: 14,
    alignItems: 'flex-end',
    width: 140,
  },
  eppNoteMain: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.brand,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  eppNoteSub: {
    fontSize: 7,
    color: colors.textMid,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
});

interface Props {
  data: WelcomeSignData;
}

export const WelcomeSignPdf: React.FC<Props> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={s.page} wrap={false}>

      {/* Top Bar */}
      <View style={s.topBar}>
        <Text style={s.company}>{data.company || 'EMPRESA'}</Text>
        <View style={s.topRight}>
          <Text style={s.operationsLabel}>OPERACIONES</Text>
          <Text style={s.subLabel}>SEGURIDAD INDUSTRIAL</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={s.main}>
        <Text style={s.bienvenidos}>BIENVENIDOS</Text>
        <View style={s.divider} />
        <View>
          {data.rigNumber ? (
            <View style={s.dataRow}>
              <Text style={s.dataLabel}>Equipo:</Text>
              <Text style={s.dataValue}>{data.rigNumber.toUpperCase()}</Text>
            </View>
          ) : null}
          {data.well ? (
            <View style={s.dataRow}>
              <Text style={s.dataLabel}>Pozo:</Text>
              <Text style={s.wellValue}>{data.well.toUpperCase()}</Text>
            </View>
          ) : null}
          {data.location ? (
            <Text style={s.locationValue}>{data.location.toUpperCase()}</Text>
          ) : null}
        </View>
        {data.additionalText ? (
          <View style={s.additionalBg}>
            <Text style={s.additionalText}>{data.additionalText.toUpperCase()}</Text>
          </View>
        ) : null}
      </View>

      {/* Footer — EPP badges + note */}
      <View style={s.footer}>
        <View style={s.eppList}>
          {EPP_ITEMS.map((label, i) => (
            <View key={i} style={s.eppItem}>
              <Text style={s.eppText}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={s.eppNote}>
          <Text style={s.eppNoteMain}>USO OBLIGATORIO{'\n'}DE E.P.P.</Text>
          <Text style={s.eppNoteSub}>Prohibido el ingreso a toda</Text>
          <Text style={s.eppNoteSub}>persona ajena a la operación</Text>
        </View>
      </View>

    </Page>
  </Document>
);
