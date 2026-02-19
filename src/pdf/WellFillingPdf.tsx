import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { WellFillingReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { base, colors } from './styles';

const s = StyleSheet.create({
  techSection: {
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.black,
  },
  techTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    backgroundColor: colors.tableHeaderBg,
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  techRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  techLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    width: '30%',
    textTransform: 'uppercase',
  },
  techCell: {
    fontSize: 8,
    flex: 1,
    textAlign: 'center',
  },
  techHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: colors.tableAltBg,
  },
  techHeaderEmpty: { width: '30%' },
  techHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  tableWrap: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.black,
  },
  thead: {
    flexDirection: 'row',
    backgroundColor: colors.tableHeaderBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  th: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    padding: 3,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.black,
  },
  thLast: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    padding: 3,
    flex: 2,
  },
  trow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    minHeight: 14,
    alignItems: 'center',
  },
  td: {
    fontSize: 8,
    textAlign: 'center',
    padding: 2,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
  },
  tdLast: {
    fontSize: 8,
    padding: 2,
    flex: 2,
  },

  sigRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 10,
  },
  sigBlock: {
    alignItems: 'center',
    width: '28%',
  },
  sigImage: {
    width: 80,
    height: 36,
    objectFit: 'contain',
  },
  sigLine: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.black,
    marginTop: 4,
    marginBottom: 2,
  },
  sigLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

const SIGNATURE_LABELS: Record<string, string> = {
  rigManager: 'Jefe de Equipo',
  shiftLeader: 'Encargado de Turno',
  machinist: 'Maquinista',
};

interface Props {
  report: WellFillingReport;
}

export const WellFillingPdf: React.FC<Props> = ({ report }) => {
  const { metadata, techData, rows, signatures } = report;

  const techRows: { label: string; diameter: string; innerDiameter?: string; displacementDry: string; displacementWet: string }[] = [
    { label: 'TUB. PERF.', ...techData.tubPerf },
    { label: 'BARRA', ...techData.barra },
    { label: 'TUBING', ...techData.tubing },
    { label: 'PORTAMECHA', ...techData.portamecha },
  ];

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader
        title="PLANILLA DE LLENADO DE POZO"
        code="ITWWO022-A1"
      />

      {/* Metadata */}
      <View style={base.metaRow}>
        <View style={base.metaCell}>
          <Text style={base.metaLabel}>EQUIPO</Text>
          <Text style={[base.metaValue, { textTransform: 'uppercase' }]}>{metadata.equipment || ''}</Text>
        </View>
        <View style={base.metaCell}>
          <Text style={base.metaLabel}>POZO</Text>
          <Text style={[base.metaValue, { textTransform: 'uppercase' }]}>{metadata.well || ''}</Text>
        </View>
        <View style={base.metaCellLast}>
          <Text style={base.metaLabel}>FECHA</Text>
          <Text style={base.metaValue}>{metadata.date || ''}</Text>
        </View>
      </View>

      {/* Technical Data */}
      <View style={s.techSection}>
        <Text style={s.techTitle}>Datos Técnicos</Text>
        <View style={s.techHeader}>
          <View style={s.techHeaderEmpty} />
          <Text style={s.techHeaderCell}>Ø Ext.</Text>
          <Text style={s.techHeaderCell}>D.I.</Text>
          <Text style={s.techHeaderCell}>Despl. Seco</Text>
          <Text style={s.techHeaderCell}>Despl. Mojado</Text>
        </View>
        {techRows.map((row, i) => (
          <View key={i} style={s.techRow}>
            <Text style={s.techLabel}>{row.label}</Text>
            <Text style={s.techCell}>{row.diameter || '-'}</Text>
            <Text style={s.techCell}>{('innerDiameter' in row ? (row as any).innerDiameter : '') || '-'}</Text>
            <Text style={s.techCell}>{row.displacementDry || '-'}</Text>
            <Text style={s.techCell}>{row.displacementWet || '-'}</Text>
          </View>
        ))}
      </View>

      {/* Main Table */}
      <View style={s.tableWrap}>
        <View style={s.thead}>
          <Text style={s.th}>TIRO Nº</Text>
          <Text style={s.th}>VOL. TANQUE</Text>
          <Text style={s.th}>Calc. Vol (Lts)</Text>
          <Text style={s.th}>Calc. Total</Text>
          <Text style={s.th}>Med. Vol (Lts)</Text>
          <Text style={s.th}>Med. Total</Text>
          <Text style={s.th}>TEND. BARRIL</Text>
          <Text style={s.thLast}>OBSERVACIONES</Text>
        </View>
        {rows.map((row, i) => (
          <View key={row.id} style={[s.trow, i % 2 === 1 ? { backgroundColor: colors.tableAltBg } : {}]}>
            <Text style={s.td}>{row.shotNumber}</Text>
            <Text style={s.td}>{row.tankVolume}</Text>
            <Text style={s.td}>{row.calcVol}</Text>
            <Text style={s.td}>{row.calcTotal}</Text>
            <Text style={s.td}>{row.measVol}</Text>
            <Text style={s.td}>{row.measTotal}</Text>
            <Text style={s.td}>{row.barrelTrend}</Text>
            <Text style={s.tdLast}>{row.observations}</Text>
          </View>
        ))}
      </View>

      {/* Signatures */}
      <View style={s.sigRow}>
        {(['rigManager', 'shiftLeader', 'machinist'] as const).map((role) => {
          const sig = signatures?.[role];
          return (
            <View key={role} style={s.sigBlock}>
              {sig?.data ? (
                <Image style={s.sigImage} src={sig.data} />
              ) : (
                <View style={{ height: 36 }} />
              )}
              <View style={s.sigLine} />
              <Text style={s.sigLabel}>{SIGNATURE_LABELS[role]}</Text>
            </View>
          );
        })}
      </View>
    </PdfDocument>
  );
};
