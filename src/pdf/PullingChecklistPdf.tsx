import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PullingChecklistReport } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';

interface Props {
  report: PullingChecklistReport;
}

const LEFT_COLUMN = [
  { title: "1.- PLATAFORMA DE TRABAJO", items: ["Escalera de acceso","Barandas de Seguridad","Cable de retención de llave hidráulica","Retención rígida de llave hidráulica"] },
  { title: "2.- MASTIL DE EQUIPO", items: ["Escalera de acceso","Limitador de carrera de aparejo","Guia cable de coronas","Barandas y resalte corona","Cadena de peines del puente","Iluminación e instalación electrica","Puesta a tierra centralizada en b.p."] },
  { title: "3.- MOTOR CUADRO DE MANIOBRAS", items: ["Arrestachispas caño escape motor","Paros emergencia motor","Protector tambor principal","Instalación eléctrica y puesta a tierra en b.p."] },
  { title: "4.- BOCA DE POZO", items: ["BOP para varillas de bombeo","Cierre hidráulico BOP","Cierre mecánico o manual BOP","Vástago y volante accionamiento manual BOP","Válvulas laterales y de maniobras","Líneas y conexiones de alta presión","*** Se exigirá la existencia del dispositivo obturador para pruebas de BOP"] },
  { title: "5.- BOMBAS Y PILETAS", items: ["Arrestachispas en motor","Paro de emergencias en motores de bombas","Protecciones y guardacorreas en bombas","Puesta a tierra de bombas y piletas"] },
  { title: "6.- USINAS E INSTALACIÓN ELÉCTRICA", items: ["Arrestachispas de motor","Pare de emergencia usina a distancia","Tablero general y protección de comandos","Cables conductores y distribución","Reflectores y vidrios especiales","Cajas de conexión y sellos","Disyuntores diferenciales y protecciones térmicas","Puesta a tierra centralizada en b.p."] },
  { title: "7.- PREVENCIÓN DE INCENDIOS", items: ["Mínimo 1 extintor de 100 kg. P.Q.S.","Mínimo 6 extintores de 10 kg P.Q.S.","Mínimo 1 extintor de 05 kg CO2"] },
  { title: "13.- PTA. MOTRIZ - CUADRO DE MANIOBRAS", items: ["Dispositivo guía cable tambor pistoneo","Pernos, chavetas y regulación de frenos","Freno de tambor principal","Estado de malacate hidráulico"] },
];

const RIGHT_COLUMN = [
  { title: "8.- PROTECCIÓN PERSONAL", items: ["Cascos","Botines de seguridad","Guantes de cuero","Guantes de P.V.C.","Indumentaria general","Protección ocular","Protección auditiva","Protección respiratoria","Cinto de seguridad enganchador","Cabos o colas de amarre","Equipo deslizador","Equipo salvacaidas","Cinturon inercial"] },
  { title: "9.- PRIMEROS AUXILIOS", items: ["Botiquín","Camilla","Férulas neumoplásticas","Equipo lavaojos","Comunicación","Suero antiofídico (Decadrón inyectable)"] },
  { title: "10.- MÁSTIL DE EQUIPO", items: ["Estado de la corona y protectores","Piso de enganche","Peines del piso de enganche","Estado de los tensores y grampas","Pernos pasantes y seguros","Seguros de tramos","Contravientos, grampas y pernos","Indicadores de contravientos (chapas-valizas)","Criques mecánicos e hidráulicos de nivel."] },
  { title: "11.- APAREJO Y ACCESORIOS", items: ["Estado del aparejo","Cable del aparejo","Punto muerto cable del aparejo","Indicadores de peso","Economizador de pistoneo (hid. o mec.)","Elevador de caños","Elevador de varillas"] },
  { title: "12.- USINA E INSTALACIÓN ELECTRICA", items: ["Estado general de la usina","Distancia de la boca de pozo","Aislación térmica de escape","Luces transporte de usina","Cadena de seguridad arrastre de transporte","Toma corriente e interruptores","Luces de Emergencia"] },
  { title: "18.- BOCA DE POZO", items: ["Amarre de B.O.P.","Acceso y limpieza de boca de pozo","Estado de mangueras hidráulicas"] },
];

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 16, backgroundColor: '#fff' },
  cols: { flexDirection: 'row', gap: 8, flex: 1 },
  col: { flex: 1 },
  sectionTitle: {
    backgroundColor: '#e5e7eb', padding: 2, fontFamily: 'Helvetica-Bold', fontSize: 7,
    border: '0.5pt solid #9ca3af', marginBottom: 1,
  },
  colHeader: { flexDirection: 'row', fontSize: 6.5, fontFamily: 'Helvetica-Bold', borderBottom: '0.5pt solid #000', marginBottom: 1 },
  itemRow: { flexDirection: 'row', borderBottom: '0.3pt solid #e5e7eb', minHeight: 11, alignItems: 'center' },
  itemText: { flex: 1, fontSize: 6.5, paddingRight: 2, paddingVertical: 1 },
  statusCell: { width: 14, textAlign: 'center', fontSize: 7, fontFamily: 'Helvetica-Bold', borderLeft: '0.3pt solid #d1d5db' },
  sectionWrap: { marginBottom: 5 },
  sigBox: { marginTop: 10, alignItems: 'center' },
  sigLine: { width: 160, height: 40, borderBottom: '1pt solid #000', marginBottom: 3 },
  sigImage: { width: 130, height: 40, objectFit: 'contain' },
  sigLabel: { fontSize: 8, textAlign: 'center' },
});

export const PullingChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signature } = report;

  const getStatus = (item: string) => rows.find(r => r.id === item)?.status || '';

  const renderSection = (section: { title: string; items: string[] }) => (
    <View key={section.title} style={s.sectionWrap}>
      <Text style={s.sectionTitle}>{section.title}</Text>
      <View style={s.colHeader}>
        <Text style={{ flex: 1 }}></Text>
        <Text style={{ width: 14, textAlign: 'center' }}>B</Text>
        <Text style={{ width: 14, textAlign: 'center' }}>M</Text>
        <Text style={{ width: 14, textAlign: 'center' }}>NC</Text>
      </View>
      {section.items.map(item => {
        const status = getStatus(item);
        return (
          <View key={item} style={s.itemRow}>
            <Text style={s.itemText}>{item}</Text>
            <Text style={{ ...s.statusCell, backgroundColor: status === 'BIEN' ? '#000' : 'transparent', color: status === 'BIEN' ? '#fff' : '#000' }}>{status === 'BIEN' ? 'X' : ''}</Text>
            <Text style={{ ...s.statusCell, backgroundColor: status === 'MAL' ? '#000' : 'transparent', color: status === 'MAL' ? '#fff' : '#000' }}>{status === 'MAL' ? 'X' : ''}</Text>
            <Text style={{ ...s.statusCell, backgroundColor: status === 'NC' ? '#000' : 'transparent', color: status === 'NC' ? '#fff' : '#000' }}>{status === 'NC' ? 'X' : ''}</Text>
          </View>
        );
      })}
    </View>
  );

  const fields = [
    { label: 'COMPAÑÍA', value: metadata.company, width: '33%' },
    { label: 'Nº EQUIPO', value: metadata.equipmentNumber?.toUpperCase(), width: '33%' },
    { label: 'YACIMIENTO', value: metadata.field, width: '34%' },
    { label: 'LOCACIÓN', value: metadata.location, width: '33%' },
    { label: 'FECHA', value: metadata.date, width: '33%' },
    { label: 'RESP. DEL EQUIPO', value: metadata.equipmentResponsible, width: '34%' },
    { label: 'INSPECCIONADO POR', value: metadata.inspectedBy, width: '50%' },
    { label: 'OPERACIÓN', value: metadata.operation, width: '50%' },
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfHeader title="CHECK LIST EQUIPO DE PULLING" code="POWPU001-A1-1" />
        <PdfFields fields={fields} columns={3} />

        <View style={s.cols}>
          <View style={s.col}>
            {LEFT_COLUMN.map(sec => renderSection(sec))}
          </View>
          <View style={s.col}>
            {RIGHT_COLUMN.map(sec => renderSection(sec))}
          </View>
        </View>

        <View style={s.sigBox}>
          {signature?.data
            ? <Image src={signature.data} style={s.sigImage} />
            : <View style={s.sigLine} />
          }
          <Text style={s.sigLabel}>Firma del Inspector / Supervisor</Text>
        </View>
      </Page>
    </Document>
  );
};
