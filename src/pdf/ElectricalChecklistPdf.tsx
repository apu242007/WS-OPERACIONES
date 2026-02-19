import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ElectricalChecklistReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: ElectricalChecklistReport;
}

const COL_1_SECTIONS = [
  { title: 'Equipo:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Luces de Emergencia', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Baterias//Arranque', 'Instalación Eléctrica 12/24V', 'Bocina', 'Estado general de tablero Ex', 'Estufa maquinista Ex', 'Electro valvula refrigeración'] },
  { title: 'Venturtech:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Luces de Emergencia', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Baterias//Arranque', 'Instalación Eléctrica 12/24V'] },
  { title: 'Acumuladores:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Luces de Emergencia', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Estado de Motor de Bomba', 'Presostato'] },
  { title: 'Motobomba:', items: ['PAT', 'Luminarias//Reflectores', 'Luces de Emergencia', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Baterias//Arranque', 'Consola de maq. 12-24V'] },
  { title: 'Pileta 1:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Luces de Emergencia', 'Estado de Tablero Ex y Pulsador de Removedores', 'Instalación Eléctrica Ex 220V', 'Zaranda'] },
];

const COL_2_SECTIONS = [
  { title: 'Pileta 2:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Luces de Emergencia', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Estado de tablero Ex y Pulsador de Removedores', 'Motor Ex de 50 HP Kayak'] },
  { title: 'Pileta 3:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Luces de Emergencia', 'Instalación Eléctrica Ex 220V', 'Acometida'] },
  { title: 'Casilla de JE:', items: ['PAT', 'Luminarias//Reflectores', 'Luces de emergencia', 'Instalación eléctrica 220V', 'Artefactos eléctricos', 'Acometida'] },
  { title: 'Casilla de ET:', items: ['PAT', 'Luminarias', 'Luces de emergencia', 'Instalación eléctrica 220V', 'Artefactos eléctricos', 'Acometida'] },
  { title: 'Casilla de Personal:', items: ['PAT', 'Luminarias', 'Luces de emergencia', 'Instalación eléctrica 220V', 'Artefactos eléctricos', 'Acometida'] },
  { title: 'Casilla de Company Representative:', items: ['PAT', 'Luminarias', 'Luces de emergencia', 'Instalación eléctrica 220V', 'Artefactos eléctricos', 'Acometida'] },
];

const COL_3_SECTIONS = [
  { title: 'Patin Cisterna:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Controlar bomba de Gas Oil', 'Controlar presostato', 'Controlar Bomba de Agua'] },
  { title: 'Hidrolavadora:', items: ['PAT', 'Estado de Tablero y pulsador', 'Instalación eléctrica 220V'] },
  { title: 'Labortorio - Taller Depocito Sala de Tableros - Usinas', items: ['Acometida', 'PAT', 'Luminarias//Reflectores', 'Luces de emergencia', 'Instalacion eléctricas 220V', 'Instalación eléctrica 12/24V', 'Baterias//Arranque// Alternador', 'Tableros', 'Acometida', 'Alternador Trifásico', 'Compresor Atlascopco'] },
  { title: 'Bandeja Hidráulica:', items: ['PAT', 'Estado de Tablero y comando.', 'Instalación eléctrica 220V'] },
  { title: 'Trip-Tank:', items: ['PAT', 'Luminarias Ex // Reflectores Ex', 'Instalación Eléctrica Ex 220V', 'Acometida', 'Controlar Bomba', 'Controlar Motor Ex'] },
];

const ALL_SECTIONS = [...COL_1_SECTIONS, ...COL_2_SECTIONS, ...COL_3_SECTIONS];

export const ElectricalChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, analyzer, observations, signatures } = report;

  const getStatus = (category: string, item: string) =>
    rows.find(r => r.category === category && r.item === item)?.status || '';

  const tableRows: string[][] = [];
  ALL_SECTIONS.forEach(section => {
    tableRows.push([`▶ ${section.title}`, '', '', '']);
    section.items.forEach(item => {
      const s = getStatus(section.title, item);
      tableRows.push([
        `    ${item}`,
        s === 'BIEN' ? '✓' : '',
        s === 'REG'  ? '~' : '',
        s === 'MAL'  ? '✕' : '',
      ]);
    });
  });

  const analyzerRows = [
    ['R', analyzer.v_r || '', analyzer.i_r || ''],
    ['S', analyzer.v_s || '', analyzer.i_s || ''],
    ['T', analyzer.v_t || '', analyzer.i_t || ''],
    ['FRECUENCIA', analyzer.freq || '', ''],
  ];

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CHECK-LIST ELÉCTRICO ÁREAS CLASIFICADAS Y CAMPAMENTO" code="ITWSM002-A1-3" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'NOMBRE Y APELLIDO ELÉCTRICO', value: metadata.electricianName },
          { label: 'NOMBRE Y APELLIDO SUPERVISOR',  value: metadata.supervisorName },
          { label: 'EQUIPO TKR N°',                value: metadata.equipmentNumber?.toUpperCase() },
          { label: 'CLIENTE',                       value: metadata.client },
          { label: 'CAMPO',                         value: metadata.field },
          { label: 'POZO',                          value: metadata.well },
          { label: 'FECHA',                         value: metadata.date },
        ]}
      />

      <View style={{ marginTop: 4, marginBottom: 2 }}>
        <Text style={{
          fontSize: 6.5, color: colors.textMid, textAlign: 'center',
          borderWidth: 1, borderColor: colors.borderLight,
          paddingTop: 3, paddingBottom: 3, paddingLeft: 4, paddingRight: 4,
        }}>
          ESTADO: BIEN (✓) — REGULAR (~) — MAL (✕)
        </Text>
      </View>

      <PdfTable
        headers={['ÍTEM', 'BIEN', 'REG', 'MAL']}
        rows={tableRows}
        colWidths={['70%', '10%', '10%', '10%']}
        centerCols={[1, 2, 3]}
      />

      <View style={{ marginTop: 6 }}>
        <Text style={{
          fontSize: 7, fontFamily: 'Helvetica-Bold',
          textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
        }}>
          ANALIZADOR DE REDES:
        </Text>
        <PdfTable
          headers={['FASE', 'TENSIÓN (V)', 'CORRIENTE (A)']}
          rows={analyzerRows}
          colWidths={['34%', '33%', '33%']}
          centerCols={[0, 1, 2]}
        />
      </View>

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold',
            textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
          }}>
            OBSERVACIONES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'FIRMA PERSONAL ELÉCTRICO',         data: signatures['electrician']?.data },
        { label: 'FIRMA JEFE DE EQUIPO / JEFE DE CAMPO', data: signatures['supervisor']?.data },
      ]} />
    </PdfDocument>
  );
};
