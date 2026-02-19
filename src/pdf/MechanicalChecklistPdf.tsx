import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { MechanicalChecklistReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: MechanicalChecklistReport;
}

const STOPPED_SECTIONS = [
  'Equipo:', 'Motobomba:', 'Usina 1:', 'Usina 2:', 'Venturtech:',
  'Compresor AtlasCopco:', 'Acumuladores:', 'Hidrolavadora:', 'Accesorios:',
];

const RUNNING_SECTIONS = [
  'Equipo:', 'Motobomba:', 'Usina 1:', 'Usina 2:', 'Venturtech:',
  'Compresor AtlasCopco:', 'Acumulador:', 'Equipo (Transporte)',
];

export const MechanicalChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, stoppedItems, runningItems, observations, signatures } = report;

  // Build stopped table rows
  const stoppedRows: string[][] = [];
  STOPPED_SECTIONS.forEach(section => {
    const items = stoppedItems.filter(i => i.section === section);
    if (items.length === 0) return;
    stoppedRows.push([`▶ ${section}`, '', '', '']);
    items.forEach(item => {
      stoppedRows.push([`    ${item.name}`, item.level || '', item.litersAdded || '', item.hours || '']);
    });
  });

  // Build running table rows
  const runningRows: string[][] = [];
  RUNNING_SECTIONS.forEach(section => {
    const items = runningItems.filter(i => i.section === section);
    if (items.length === 0) return;
    runningRows.push([`▶ ${section}`, '', '']);
    items.forEach(item => {
      runningRows.push([`    ${item.name}`, item.value || '', item.state || '']);
    });
  });

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CHECK-LIST MECÁNICO" code="IT-WSM-001-A1" subtitle="REVISIÓN 02" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'NOMBRE Y APELLIDO MECÁNICO',   value: metadata.mechanicName },
          { label: 'NOMBRE Y APELLIDO SUPERVISOR',  value: metadata.supervisorName },
          { label: 'EQUIPO TKR N°',                value: metadata.equipmentNumber?.toUpperCase() },
          { label: 'CLIENTE',                       value: metadata.client },
          { label: 'YACIMIENTO',                    value: metadata.field },
          { label: 'POZO',                          value: metadata.well },
          { label: 'FECHA',                         value: metadata.date },
        ]}
      />

      <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
        {/* Left: Motor detenido */}
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: colors.tableHeaderBg, borderWidth: 1, borderBottomWidth: 0, borderColor: colors.black, padding: 3 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', textAlign: 'center' }}>
              MEDIR CON MOTOR DETENIDO
            </Text>
          </View>
          <PdfTable
            headers={['ÍT.', 'NIVEL', 'LTS AGREG.', 'HRS']}
            rows={stoppedRows}
            colWidths={['52%', '16%', '16%', '16%']}
            centerCols={[1, 2, 3]}
          />
        </View>

        {/* Right: Motor en marcha */}
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: colors.tableHeaderBg, borderWidth: 1, borderBottomWidth: 0, borderColor: colors.black, padding: 3 }}>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', textAlign: 'center' }}>
              MEDIR CON MOTOR EN MARCHA
            </Text>
          </View>
          <PdfTable
            headers={['ÍT.', '°C/PSI', 'ESTADO']}
            rows={runningRows}
            colWidths={['55%', '22%', '23%']}
            centerCols={[1, 2]}
          />
        </View>
      </View>

      <View style={{ marginTop: 4, backgroundColor: '#fefce8', borderWidth: 1, borderColor: colors.borderLight, padding: 3 }}>
        <Text style={{ fontSize: 6.5, textAlign: 'center', fontFamily: 'Helvetica-Bold' }}>
          NOTA: En estado se deberá completar: OK (bien), Bajo, Alto.
        </Text>
      </View>

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2, color: colors.textMid }}>
            OBSERVACIONES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <View style={{ marginTop: 4, borderTopWidth: 1, borderColor: colors.borderLight, paddingTop: 3 }}>
        <Text style={{ fontSize: 6, color: colors.textMid }}>
          Confeccionar esta planilla diariamente por personal mecánico. N = Estado Normal del equipo.
        </Text>
      </View>

      <PdfSignatures signatures={[
        { label: 'FIRMA PERSONAL MECÁNICO',          data: signatures['mechanic']?.data },
        { label: 'FIRMA JEFE DE EQUIPO / JEFE DE CAMPO', data: signatures['supervisor']?.data },
      ]} />
    </PdfDocument>
  );
};
