import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { WasteSignData, WasteType } from '../types';
import { colors } from './styles';

const WASTE_CONFIG: Record<WasteType, { title: string; color: string; textColor: string; items: string[] }> = {
  AMARILLO: {
    title: 'PLÁSTICOS',
    color: '#FACC15',
    textColor: '#78350F',
    items: [
      'Envases en General', 'Bidones, envases pet', 'Bolsas de polietileno',
      'Envases de alimentos', 'Cascos, anteojos de seguridad', 'Sogas plásticas',
      'Botellas limpias', 'Plásticos libre de hidrocarburos',
    ],
  },
  AZUL: {
    title: 'METÁLICOS',
    color: '#2563EB',
    textColor: '#1E3A8A',
    items: [
      'Trozos de caños', 'Cables de acero', 'Alambres', 'Virutas de metales',
      'Electrodos', 'Recortes de chapa', 'Latas en gral.', 'Zunchos',
      'Repuestos vehículos', 'Válvulas', 'Cadenas transmisión', 'Bulones',
      'Transmisores', 'Manómetros', 'Sensores',
    ],
  },
  ROJO: {
    title: 'CONDICIONADOS / PELIGROSOS',
    color: '#DC2626',
    textColor: '#7F1D1D',
    items: [
      'Envases c/ resto HC', 'Restos de muestras', 'Pinceles',
      'Troz. caños pvc/erfv', 'Pz industr Automotriz', 'Guantes cuero y pvc c/ resto de HC',
      'Revest. de cañerias', 'Botines c/resto de HC', 'Máscaras / filtros',
      'Delantales de cuero, trapos c/resto de HC', 'Gomas, Correas en gral.',
      'Mangeras en gral.', 'Cámaras cubiertas', 'Pilas, baterías', 'Cartucho Tinta/Toner',
    ],
  },
  VERDE: {
    title: 'BIODEGRADABLES / DOMÉSTICOS',
    color: '#16A34A',
    textColor: '#14532D',
    items: [
      'Restos alimentos', 'Papel', 'Cartón', 'Maderas', 'Bolsas de papel',
      'Trapos sin H.C.', 'Envases grales.', 'Bidones', 'Envases pet',
      'Bolsas de polietileno', 'Envases alimentos', 'Anteojos seguridad',
      'Sogas plásticas', 'Botellas limpias', 'Otros vidrios',
    ],
  },
};

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    padding: 24,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 3,
    borderBottomColor: '#1F2937',
    paddingBottom: 10,
    marginBottom: 14,
  },
  company: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
  },
  typeLabel: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMid,
    textAlign: 'right',
  },
  locationLabel: {
    fontSize: 9,
    color: colors.textLight,
    textAlign: 'right',
  },
  headerBlock: {
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginRight: 10,
    lineHeight: 1.2,
  },
  itemText: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textTransform: 'uppercase',
    flex: 1,
    lineHeight: 1.2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 3,
    borderTopColor: '#1F2937',
    paddingTop: 8,
    marginTop: 14,
  },
  footerCode: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.textLight,
  },
  footerType: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    opacity: 0.2,
  },
});

interface Props {
  data: WasteSignData;
}

export const WasteClassificationSignPdf: React.FC<Props> = ({ data }) => {
  const cfg = WASTE_CONFIG[data.type];
  const items = data.customItems && data.customItems.length > 0 ? data.customItems : cfg.items;

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>

        {/* Top Bar */}
        <View style={s.topBar}>
          <Text style={s.company}>{data.company || 'EMPRESA'}</Text>
          <View>
            <Text style={s.typeLabel}>CLASIFICACIÓN DE RESIDUOS</Text>
            {data.location ? <Text style={s.locationLabel}>{data.location}</Text> : null}
          </View>
        </View>

        {/* Colored Header */}
        <View style={[s.headerBlock, { backgroundColor: cfg.color }]}>
          <Text style={s.headerTitle}>{cfg.title}</Text>
        </View>

        {/* Items */}
        <View style={s.itemsList}>
          {items.map((item, idx) => (
            <View key={idx} style={s.item}>
              <Text style={[s.bullet, { color: cfg.color }]}>•</Text>
              <Text style={s.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerCode}>POSGI003-A2-0</Text>
          <Text style={[s.footerType, { color: cfg.color }]}>{data.type}</Text>
        </View>

      </Page>
    </Document>
  );
};
