import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { WorkoverChecklistReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { base, colors } from './styles';

// ─── Sections (mirrored from form) ──────────────────────────────────────────
const ALL_SECTIONS = [
  {
    title: 'GENERAL',
    items: [
      'a. Distancia de la Línea de Potencia', 'b. Señales de Peligro desplegadas',
      'c. Conjunto de Primeros Auxilios', 'd. Señalización de los Contravientos',
      'e. Zona para descenso de la torre despejada', 'f. Vehículo fuera de la zona de Contravientos',
      'g. Limpieza general', 'h. Cañería sobre caballetes', 'i. Riesgo de fuego controlados',
    ],
  },
  {
    title: 'CONTRAVIENTOS',
    items: [
      'I. Contravientos desde la corona', 'a. Número de contravientos',
      'b. Condiciones de los contravientos', 'c. Diámetro de los contravientos',
      'd. Tres grampas como mínimo', 'e. Anclajes a tierra',
      'II. Contravientos del Piso de Enganche', 'a. Estirado y cruzado para el piso',
      'b. Tres grampas mínimo', 'III. Contravientos internos para tensión',
    ],
  },
  { title: 'FUNDACIÓN', items: ['A. Suplemento para apoyo adecuado provisto'] },
  {
    title: 'HERRAMIENTAS DE MANO',
    items: ['a. Condición', 'b. Limpieza', 'c. Almacenamiento'],
  },
  {
    title: 'MASTIL - TORRE',
    items: [
      'a. Especificaciones del fabricante placa de operación', 'b. Daños y corrosión excesiva',
      'c. Escalera', 'd. Pasillo de piso de enganche', 'e. Canasta de Varillas',
      'f. Corona', 'g. Mecanismo de izaje del equipo', 'h. Inspección visual de pasadores',
      'i. Brazos estabilizadores', 'j. Protectores de poleas de la corona',
      'k. Cables de seguridad de los dientes del peine',
      'L. Fisuras o fallas de metal en puntos de articulación',
      'm. Pasadores de seguro de la torre en su lugar', 'n. Los puntos de articulación tiene seguros',
      'o. Sistema hidráulico de la torre', 'p. Sistema de iluminación',
      'q. Purgado de aire del sistema hidráulico cilindro izador',
    ],
  },
  {
    title: 'VEHÍCULOS',
    items: [
      'a. Vidrios, espejos', 'b. Neumáticos, luces y realce', 'c. Mantenimiento de cabina',
      'd. Casilla de personal', '1. Mantenimiento y Limpieza', '2. Condiciones de la estufa',
      '3. Instalación eléctrica, luces', '4. Enganche y cadena de seguridad',
      '5. Aseguramiento para Izaje con petrolero', 'e. Vestuario, Baños, Cocina, Oficina',
    ],
  },
  {
    title: 'CAMIÓN DE TRANSPORTE',
    items: [
      'a. Barandas en elevaciones y escalones aseguradas correctamente',
      'b. Luces delanteras y traseras', 'c. Ruedas acuñadas', 'd. Condición de llantas y neumáticos',
      'e. Tanque de combustible rotulado', 'f. Pérdida de combustible',
      'g. No debe haber materiales sueltos e inflamables en la cabina', 'h. Vidrios y espejo',
      'i. Limpiaparabrisas', 'j. Equipamiento de emergencia',
      'k. Gatos hidráulicos de elevación asegurados por mecanismos de contratuercas',
    ],
  },
  {
    title: 'CONDICIÓN DE TRABAJO',
    items: [
      'a. Protectores', 'b. Líneas de tubing y stand pipe', 'c. Cable de pistoneo',
      'd. Suficientes vueltas de cable de tambor cuando el aparejo se encuentra abajo',
      'e. Anclaje de línea muerta y retenedor', 'f. Sistema de Frenado',
      'g. Superficie de fricción del carretel de maniobra',
      'h. Separador de línea de carretel abrazadera', 'i. Cable de maniobra',
      'j. Frenos / Pare de Emergencia', 'k. Traba de caja tractora para camino',
      'l. Manipulación del guinche. Señalización',
    ],
  },
  {
    title: 'ESTACIÓN DE OPERACIÓN / PLATAFORMA / PISO',
    items: ['a. Todos los controles rotulados', 'b. Piso de trabajo', 'c. Escalones y barandas'],
  },
  {
    title: 'HERRAMIENTAS - CONDICIONES LLAVE DE POTENCIA',
    items: [
      'a. Cierre de seguridad.', 'b. Llave contra.', 'c. Línea retenida. Brazo fijo.',
      'd. Cobertura de la válvula de control', 'e. Abrazaderas y conexiones.',
      'f. Posicionador de la pinza.',
    ],
  },
  {
    title: 'CONDICIONES DEL CONJUNTO DE APAREJO',
    items: [
      'a. Aparejo y Gancho', 'b. Protector de rondanas./ Seguro.',
      'c. Amelas. Eslabones.', 'd. Elevadores.', 'e. Perno de gancho.',
      'f. Elevadores de transferencia.',
    ],
  },
  {
    title: 'SISTEMA DE CIRCULACION/LODO',
    items: [
      'a. Caño de elevación de lodo firme y asegurado',
      'b. Manguera de inyección asegurada al cuello de cisne y la cabeza de inyección cadenas de seguridad',
      'c. Accesorios de alta presión en el sistema de alta presión.',
      'd. Válvula de seguridad para alivio de presión.',
      'e. Líneas de descarga de válvulas de seguridad ancladas.',
      'f. Protecciones de la bomba', 'g. Pasillos y escaleras de la pileta.',
      'h. Area de mezcla de lodo.',
    ],
  },
  {
    title: 'EQUIPAMIENTO PARA CONTROL DEL POZO',
    items: ['a. BOP instalada, probada y en funcionamiento.', 'b. Entrenamiento sobre su uso.'],
  },
  {
    title: 'EQUIPAMIENTO DE SEGURIDAD',
    items: [
      'a. Arnés de Seguridad, enganches en el piso de enganche, canasta de varillas y plataforma de trabajo.',
      'b. Sistema de ascenso en la escalera de la torre (T3 - T5)',
      'c. Equipo para escape de emergencia de la torre.',
      'd. Extintores de fuego portátiles sobre ruedas',
      'e. Equipamiento de protección personal.',
    ],
  },
  {
    title: 'ANEXO',
    items: [
      '1.a. Limitador carrera de Aparejo', '1.b. Motores: Arrestallamas / Pare rapido.',
      '1.c. Puesta a tierra. Gral.',
      '2.a. Usina / Llave de Corte Gral / Piso Aislado / Instalacion Electrica / Luz de emergencia',
      '3.a. Comando BOP a distancia', '4.a Casilla : Inst. Sanitarias', '4.b Agua Potable',
      '4.c. Recipiente Residuos', '4.d. Laboratorio', '4.e. Instrumentos',
      '4.f. Sistema de Comunicacion', '4.g. Cartelera Objetivos.',
      '5.a. Equipo Espuma c/Incendio', '5.b. Caballetes / Planchada c/b', '5.c. Cartel de Presentacion',
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  SI: colors.green,
  NO: colors.red,
  NA: colors.textMid,
};

const s = StyleSheet.create({
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 6,
    marginTop: 4,
  },
  metaItem: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemFull: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaKey: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    width: 80,
  },
  metaVal: {
    fontSize: 8,
    flex: 1,
  },

  columnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: colors.tableHeaderBg,
    padding: 3,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 2,
    paddingLeft: 3,
    minHeight: 12,
  },
  checkLabel: {
    flex: 1,
    fontSize: 6.5,
    paddingRight: 4,
    lineHeight: 1.3,
  },
  statusCell: {
    width: 14,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },

  obsSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.black,
    paddingTop: 4,
  },
  obsTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  obsTable: {
    borderWidth: 1,
    borderColor: colors.black,
  },
  obsThead: {
    flexDirection: 'row',
    backgroundColor: colors.tableHeaderBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  obsTh: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    padding: 3,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.black,
  },
  obsTrow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    minHeight: 16,
    alignItems: 'center',
  },
  obsTd: {
    fontSize: 7,
    padding: 2,
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
  },
});

interface Props {
  report: WorkoverChecklistReport;
}

const getStatus = (rows: WorkoverChecklistReport['rows'], id: string) => {
  return rows.find(r => r.id === id)?.status || null;
};

export const WorkoverChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signature } = report;

  // Split sections into 2 columns
  const leftSections = ALL_SECTIONS.slice(0, 8);
  const rightSections = ALL_SECTIONS.slice(8);

  const renderSection = (section: { title: string; items: string[] }, idx: number) => (
    <View key={idx} style={{ marginBottom: 4 }} wrap={false}>
      {section.title ? <Text style={s.sectionTitle}>{section.title}</Text> : null}
      {section.items.map((item) => {
        const status = getStatus(rows, item);
        return (
          <View key={item} style={s.checkRow}>
            <Text style={s.checkLabel}>{item}</Text>
            <Text style={[s.statusCell, { color: status === 'SI' ? STATUS_COLORS.SI : colors.borderLight }]}>
              {status === 'SI' ? 'SI' : '·'}
            </Text>
            <Text style={[s.statusCell, { color: status === 'NO' ? STATUS_COLORS.NO : colors.borderLight }]}>
              {status === 'NO' ? 'NO' : '·'}
            </Text>
            <Text style={[s.statusCell, { color: status === 'NA' ? STATUS_COLORS.NA : colors.borderLight }]}>
              {status === 'NA' ? 'NA' : '·'}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader
        title="CHECK LIST EQUIPO DE WORKOVER"
        code="POWWO001-A2-1"
      />

      {/* Metadata */}
      <View style={s.metaGrid}>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Compañía:</Text>
          <Text style={s.metaVal}>{metadata.company}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Nº Equipo:</Text>
          <Text style={s.metaVal}>{metadata.equipmentNumber?.toUpperCase()}</Text>
          <Text style={[s.metaKey, { marginLeft: 8 }]}>Yacimiento:</Text>
          <Text style={s.metaVal}>{metadata.field}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Locación:</Text>
          <Text style={s.metaVal}>{metadata.location}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Fecha:</Text>
          <Text style={s.metaVal}>{metadata.date}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Supervisor:</Text>
          <Text style={s.metaVal}>{metadata.supervisor}</Text>
        </View>
        <View style={s.metaItem}>
          <Text style={s.metaKey}>Inspeccionado por:</Text>
          <Text style={s.metaVal}>{metadata.inspectedBy}</Text>
        </View>
        <View style={s.metaItemFull}>
          <Text style={s.metaKey}>Operación:</Text>
          <Text style={s.metaVal}>{metadata.operation}</Text>
        </View>
      </View>

      {/* Checklist Columns */}
      <View style={s.columnsRow}>
        <View style={s.column}>
          {leftSections.map((section, idx) => renderSection(section, idx))}
        </View>
        <View style={s.column}>
          {rightSections.map((section, idx) => renderSection(section, idx + 100))}
        </View>
      </View>

      {/* Observations */}
      <View style={s.obsSection}>
        <Text style={s.obsTitle}>
          Detallar todas las Observaciones detectadas en el Check list del Equipo, adoptando medidas correctivas y preventivas.
        </Text>
        <View style={s.obsTable}>
          <View style={s.obsThead}>
            <Text style={[s.obsTh, { flex: 3 }]}>OBSERVACIONES RELEVANTES</Text>
            <Text style={[s.obsTh, { flex: 2 }]}>RESPONSABLE DE ACCIÓN</Text>
            <Text style={[s.obsTh, { flex: 1 }]}>CUMPLIMIENTO</Text>
            <Text style={[s.obsTh, { flex: 1, borderRightWidth: 0 }]}>FECHA</Text>
          </View>
          {observations.map((obs) => (
            <View key={obs.id} style={s.obsTrow}>
              <Text style={[s.obsTd, { flex: 3 }]}>{obs.observation}</Text>
              <Text style={[s.obsTd, { flex: 2 }]}>{obs.responsible}</Text>
              <Text style={[s.obsTd, { flex: 1, textAlign: 'center' }]}>{obs.compliance}</Text>
              <Text style={[s.obsTd, { flex: 1, textAlign: 'center', borderRightWidth: 0 }]}>{obs.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Signature */}
      <View style={{ alignItems: 'center', marginTop: 14 }}>
        {signature?.data ? (
          <Image style={base.sigImage} src={signature.data} />
        ) : (
          <View style={{ width: 120, height: 40, borderBottomWidth: 1, borderBottomColor: colors.black }} />
        )}
        <Text style={{ fontSize: 8, marginTop: 2 }}>Firma del Inspector / Supervisor</Text>
      </View>
    </PdfDocument>
  );
};
