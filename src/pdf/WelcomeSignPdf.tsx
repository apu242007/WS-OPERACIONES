import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { WelcomeSignData } from '../types';
import { colors } from './styles';

const EPP_ITEMS = ['Casco', 'Anteojos', 'Botines', 'Mameluco FR', 'Guantes', 'Protección Auditiva', 'Chaleco'];

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 3,
    borderBottomColor: colors.black,
    paddingBottom: 8,
    marginBottom: 12,
  },
  company: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
  },
  operationsLabel: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.brand,
    textAlign: 'right',
  },
  subLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMid,
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bienvenidos: {
    fontSize: 80,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    letterSpacing: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: colors.textMid,
    opacity: 0.2,
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 12,
  },
  dataLabel: {
    fontSize: 22,
    color: colors.textMid,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    textTransform: 'uppercase',
  },
  wellValue: {
    fontSize: 38,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
    textTransform: 'uppercase',
  },
  locationValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMid,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 6,
  },
  additionalBg: {
    marginTop: 18,
    backgroundColor: colors.brand,
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 32,
  },
  additionalText: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 3,
    borderTopColor: colors.black,
    paddingTop: 8,
    marginTop: 12,
  },
  eppList: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    flex: 1,
  },
  eppItem: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eppText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  eppNote: {
    flex: 0,
    marginLeft: 16,
    alignItems: 'flex-end',
  },
  eppNoteMain: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.brand,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  eppNoteSub: {
    fontSize: 8,
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
    <Page size="A4" orientation="landscape" style={s.page}>

      {/* Top Bar */}
      <View style={s.topBar}>
        <Text style={s.company}>{data.company || 'EMPRESA'}</Text>
        <View>
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

      {/* Footer */}
      <View style={s.footer}>
        <View style={s.eppList}>
          {EPP_ITEMS.map((item, i) => (
            <View key={i} style={s.eppItem}>
              <Text style={s.eppText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={s.eppNote}>
          <Text style={s.eppNoteMain}>USO OBLIGATORIO DE E.P.P.</Text>
          <Text style={s.eppNoteSub}>Prohibido el ingreso a toda persona</Text>
          <Text style={s.eppNoteSub}>ajena a la operación</Text>
        </View>
      </View>

    </Page>
  </Document>
);
