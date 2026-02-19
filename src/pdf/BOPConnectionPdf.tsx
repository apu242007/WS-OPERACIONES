import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { BOPConnectionReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: BOPConnectionReport;
}

const SECTIONS  = ['ANULAR', 'PARCIAL', 'TOTAL']  as const;
const OPERATIONS = ['OPEN', 'CLOSE'] as const;
const COMPONENTS = ['CONECTOR', 'MANGUERA', 'ESLINGA'] as const;

export const BOPConnectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, items, observations, signatures } = report;

  const getStatus = (section: string, op: string, comp: string): string => {
    const found = items.find(
      i => i.section === section && i.operation === op && i.component === comp,
    );
    if (!found || !found.status) return '';
    return found.status === 'BUENO' ? 'OK' : 'NO';
  };

  // Rows: one per component, 6 status columns (AO, AC, PO, PC, TO, TC)
  const tableRows = COMPONENTS.map(comp => [
    comp,
    getStatus('ANULAR',  'OPEN',  comp),
    getStatus('ANULAR',  'CLOSE', comp),
    getStatus('PARCIAL', 'OPEN',  comp),
    getStatus('PARCIAL', 'CLOSE', comp),
    getStatus('TOTAL',   'OPEN',  comp),
    getStatus('TOTAL',   'CLOSE', comp),
  ]);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CONEXIÓN DE BOP" code="POWSG001-A5-1" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'JEFE DE EQUIPO',      value: metadata.rigManagerName },
          { label: 'EQUIPO N°',           value: metadata.rigNumber?.toUpperCase() },
          { label: 'FECHA',               value: metadata.date },
          { label: 'ENCARGADO TURNO',     value: metadata.shiftLeaderName },
          { label: 'CLIENTE',             value: metadata.client },
          { label: 'YACIMIENTO',          value: metadata.field },
          { label: 'POZO',                value: metadata.well },
          { label: 'N° SERIE ANULAR',     value: metadata.anularSerial },
          { label: 'N° SERIE PARCIAL',    value: metadata.parcialSerial },
        ]}
      />

      <View style={{ marginTop: 4, marginBottom: 2 }}>
        <Text style={{
          fontSize: 6.5, color: colors.textMid, textAlign: 'center',
          borderWidth: 1, borderColor: colors.borderLight,
          paddingTop: 3, paddingBottom: 3, paddingLeft: 4, paddingRight: 4,
        }}>
          REFERENCIA — BUENO: Conector hermetiza correctamente, estrella no golpeada/desgastada, sistema de traba limpio y operativo.
          MALO: Conector no hermetiza, estrella golpeada/gastada, sistema de traba no limpio.
        </Text>
      </View>

      <PdfTable
        headers={[
          'COMPONENTE',
          'ANULAR\nOPEN',  'ANULAR\nCLOSE',
          'PARCIAL\nOPEN', 'PARCIAL\nCLOSE',
          'TOTAL\nOPEN',   'TOTAL\nCLOSE',
        ]}
        rows={tableRows}
        colWidths={['22%', '13%', '13%', '13%', '13%', '13%', '13%']}
        centerCols={[1, 2, 3, 4, 5, 6]}
      />

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold',
            textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
          }}>
            OBSERVACIONES GENERALES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'FIRMA JEFE DE EQUIPO',      data: signatures['rigManager']?.data },
        { label: 'FIRMA ENCARGADO DE TURNO',  data: signatures['shiftLeader']?.data },
      ]} />
    </PdfDocument>
  );
};
