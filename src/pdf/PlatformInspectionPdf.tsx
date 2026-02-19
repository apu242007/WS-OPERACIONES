import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PlatformInspectionReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: PlatformInspectionReport;
}

const SECTIONS = [
  {
    title: "INSPECCION BASICA (A nivel)",
    items: [
      "Manual del fabricante",
      "Plataforma/Barandas (dobladuras, desgaste, rotura, trabas)",
      "Neumaticos (desgastados, aire)",
      "Extintor (carga, fecha vto.)",
      "Bocina / Baliza",
      "Fuido Hidraulico",
      "Mangueras"
    ]
  },
  {
    title: "COMBUSTION INTERNA",
    items: [
      "Tanque propano (perdidas)",
      "Tapa de tanque de gas (operativa)",
      "Condicion de aceite de motor (Chequeo con unidad apagada)",
      "Radiador (chequeo en frio)",
      "Condicion de fluido hidraulico (chequeo con plataforma a nivel)",
      "Mangueras y correas",
      "Bateria (conexiones, nivel de celdas)"
    ]
  },
  {
    title: "INSPECCION EN PLATAFORMA",
    items: [
      "Alimentacion Electrica (Cables y conexiones)",
      "Frenos",
      "Direccion (funcionamiento leve)",
      "Perdida de fluido (debajo de plataforma)",
      "Controles Hidraulicos (funcionamiento normal)",
      "Funciones hidraulicas (Elevacion/descenso)",
      "Controles direccionales (Desplazamientos laterales)"
    ]
  }
];

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 20, backgroundColor: '#fff' },
  legend: {
    backgroundColor: '#f3f4f6', padding: 4, fontSize: 7, textAlign: 'center',
    borderBottom: '1pt solid #000', fontFamily: 'Helvetica-Bold', marginBottom: 6,
  },
  grid: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  sectionHeader: {
    backgroundColor: '#e5e7eb', padding: 3, fontFamily: 'Helvetica-Bold', fontSize: 7.5,
    flexDirection: 'row', justifyContent: 'space-between',
    borderBottom: '0.5pt solid #000', borderTop: '0.5pt solid #000',
  },
  row: { flexDirection: 'row', borderBottom: '0.5pt solid #d1d5db', minHeight: 15, alignItems: 'center' },
  itemText: { flex: 1, fontSize: 7, paddingHorizontal: 3, paddingVertical: 1 },
  statusCell: {
    width: 26, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Bold',
    borderLeft: '0.5pt solid #9ca3af', paddingVertical: 1,
  },
  certBox: {
    border: '0.5pt solid #d1d5db', borderRadius: 2, padding: 4, marginTop: 6,
  },
  fieldLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: '#6b7280', marginBottom: 2 },
  fieldValue: { fontSize: 8, borderBottom: '0.5pt solid #9ca3af', paddingBottom: 2, minHeight: 12 },
  obsLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#6b7280', marginTop: 8, marginBottom: 2 },
  obsBox: { border: '0.5pt solid #d1d5db', borderRadius: 2, padding: 4, minHeight: 44, fontSize: 8 },
  sigContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 14 },
  sigBox: { alignItems: 'center', width: 160 },
  sigLine: { width: 160, height: 44, borderBottom: '1pt solid #000', marginBottom: 3 },
  sigImage: { width: 130, height: 44, objectFit: 'contain' },
  sigLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
});

export const PlatformInspectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  const fields = [
    { label: 'FECHA INSPECCIÓN', value: metadata.date, width: '25%' },
    { label: 'MARCA', value: metadata.brand, width: '25%' },
    { label: 'INTERNO Nº', value: metadata.internalNumber, width: '25%' },
    { label: 'NUMERO SERIE', value: metadata.serialNumber, width: '25%' },
    { label: 'OPERADOR', value: metadata.operator, width: '40%' },
    { label: 'CAPACIDAD CARGA', value: metadata.loadCapacity, width: '20%' },
    { label: 'LICENCIA Nº', value: metadata.licenseNumber, width: '20%' },
    { label: 'TIPO', value: metadata.type, width: '10%' },
    { label: 'VTO.', value: metadata.expiration, width: '10%' },
    { label: 'LUGAR DE OPERACION', value: metadata.location, width: '100%' },
  ];

  const getStatus = (category: string, item: string) =>
    rows.find(r => r.category === category && r.item === item)?.status || '';

  const renderSection = (section: { title: string; items: string[] }) => (
    <View key={section.title} style={{ marginBottom: 4 }}>
      <View style={s.sectionHeader}>
        <Text>{section.title}</Text>
        <Text style={{ width: 26, textAlign: 'center' }}>REF</Text>
      </View>
      {section.items.map(item => (
        <View key={item} style={s.row}>
          <Text style={s.itemText}>{item}</Text>
          <Text style={s.statusCell}>{getStatus(section.title, item)}</Text>
        </View>
      ))}
    </View>
  );

  const sigEntries = [
    { label: 'OPERADOR MANLIFT', data: signatures.operator?.data },
    { label: 'RESPONSABLE DE SECTOR', data: signatures.sectorResponsible?.data },
  ];

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={s.page}>
        <PdfHeader title="INSPECCIÓN PARA PLATAFORMA DE TRABAJO EN ALTURA" code="ITWSG023-A1-0" />

        <PdfFields fields={fields} columns={4} />

        <View style={s.legend}>
          <Text>TERMINOLOGÍA: Normal (N) - Corregir (Co) - Faltante (F) - Verificar (V) - Reparar (R) - Limpiar (L) - No Corresponde (NC)</Text>
        </View>

        <View style={s.grid}>
          <View style={s.col}>
            {renderSection(SECTIONS[0])}
            {renderSection(SECTIONS[1])}
          </View>
          <View style={s.col}>
            {renderSection(SECTIONS[2])}
            <View style={s.certBox}>
              <Text style={s.fieldLabel}>ENTE CERTIFICADOR DEL EQUIPO:</Text>
              <Text style={s.fieldValue}>{metadata.certifyingEntity}</Text>
            </View>
          </View>
        </View>

        <Text style={s.obsLabel}>OBSERVACIONES:</Text>
        <View style={s.obsBox}>
          <Text>{observations}</Text>
        </View>

        <View style={s.sigContainer}>
          {sigEntries.map(sig => (
            <View key={sig.label} style={s.sigBox}>
              {sig.data
                ? <Image src={sig.data} style={s.sigImage} />
                : <View style={s.sigLine} />
              }
              <Text style={s.sigLabel}>{sig.label}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
