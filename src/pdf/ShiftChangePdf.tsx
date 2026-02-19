import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ShiftChangeReport, OperationalAspects } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfMetadata } from './PdfMetadata';
import { PdfFields } from './PdfFields';
import { PdfChecklist, ChecklistItem } from './PdfChecklist';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: ShiftChangeReport;
}

const CHECKLIST_ITEMS = [
  { id: 'ppe',          label: 'Poseen todos los EPP en la Operación' },
  { id: 'ats',          label: 'Se leen los ATS - IPCR de las tareas' },
  { id: 'h2s',          label: 'Usan detectores H2S personales' },
  { id: 'monitor',      label: 'Asignan el Monitor del día' },
  { id: 'permits',      label: 'Completan Permisos de Trabajo' },
  { id: 'cableClamp',   label: 'Control grampa cable de tambor principal' },
  { id: 'bop',          label: 'Chequear Conjunto de BOP' },
  { id: 'accumulator',  label: 'Chequear Acumulador de presión' },
  { id: 'choke',        label: 'Chequear Choke Manifold' },
  { id: 'tankLevels',   label: 'Chequear Niveles de Pileta' },
  { id: 'testTank',     label: 'Chequear Pileta Ensayo y Golpeador' },
  { id: 'otherEquip',   label: 'Otros Aspectos del Equipamiento' },
  { id: 'serviceCo',    label: 'Opera Cia Servicio. Evidencia' },
  { id: 'cleanPits',    label: 'Barcachos ordenado y limpio' },
  { id: 'cleanWarehouse', label: 'Depósito ordenado y limpio' },
  { id: 'tools',        label: 'Herramientas en condiciones' },
  { id: 'waste',        label: 'Residuos clasificados' },
  { id: 'otherClean',   label: 'Otros Aspectos Orden y Limpieza' },
];

export const ShiftChangePdf: React.FC<Props> = ({ report }) => {
  const { metadata, operational, checklist, observations, signatures } = report;
  const op = operational as OperationalAspects;

  const checklistItems: ChecklistItem[] = CHECKLIST_ITEMS.map(item => ({
    label: item.label,
    status: checklist[item.id] ? 'OK' : null,
  }));

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="REUNION CAMBIO DE TURNO" code="POWSG015-A1-3" />

      <PdfMetadata fields={[
        { label: 'EQUIPO', value: metadata.equipment?.toUpperCase() },
        { label: 'POZO',   value: metadata.well },
        { label: 'FECHA',  value: metadata.date },
        { label: 'HORA',   value: metadata.time },
      ]} />

      <PdfFields
        columns={3}
        fields={[
          { label: 'TIPO DE REUNIÓN',       value: metadata.meetingType },
          { label: 'COORDINADOR',           value: metadata.coordinator },
          { label: 'OPERACIÓN EN EL EQUIPO', value: metadata.operation },
        ]}
      />

      {metadata.topic ? (
        <View style={{ marginTop: 4, borderWidth: 1, borderColor: colors.black }}>
          <Text style={{
            fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase',
            color: colors.textMid, paddingTop: 2, paddingBottom: 2,
            paddingLeft: 5, paddingRight: 5,
            backgroundColor: colors.tableHeaderBg,
          }}>
            TEMA DE REUNIÓN
          </Text>
          <Text style={{ fontSize: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 5, paddingRight: 5 }}>
            {metadata.topic}
          </Text>
        </View>
      ) : null}

      <PdfFields
        title="ASPECTOS OPERATIVOS EN EL CAMBIO DE TURNO"
        columns={4}
        fields={[
          { label: 'HTA EN EL POZO',    value: op.htaWell },
          { label: 'TBG POZO',          value: op.tbgWell },
          { label: 'V/B POZO',          value: op.vbWell },
          { label: 'NIVEL PILETA 1',    value: op.tankLevel1 },
          { label: 'PM POZO',           value: op.pmWell },
          { label: 'TBG TORRE',         value: op.tbgTower },
          { label: 'V/B CABALLETE',     value: op.vbScaffold },
          { label: 'NIVEL PILETA 2',    value: op.tankLevel2 },
          { label: 'PM CABALLETE',      value: op.pmScaffold },
          { label: 'TBG CABALLETE',     value: op.tbgScaffold },
          { label: 'FUNC. BOMBA',       value: op.pumpFunc },
          { label: 'NIVEL PILETA 3',    value: op.tankLevel3 },
        ]}
      />

      <PdfChecklist
        title="ASPECTOS DE SEGURIDAD, EQUIPAMIENTO, ORDEN Y LIMPIEZA"
        items={checklistItems}
        columns={3}
        showObservations={false}
      />

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase',
            marginBottom: 2, color: colors.textMid,
          }}>
            OBSERVACIONES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'JEFE DE EQUIPO', data: signatures['rigManager']?.data },
        { label: 'JEFE DE CAMPO',  data: signatures['companyRepresentative']?.data },
      ]} />
    </PdfDocument>
  );
};
