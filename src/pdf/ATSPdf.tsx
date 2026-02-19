import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ATSReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { colors } from './styles';

interface Props { report: ATSReport; }

const s = StyleSheet.create({
  sectionBar: { backgroundColor: colors.tableHeaderBg, padding: '4 6', fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 6, marginBottom: 2, border: '1pt solid black' },
  eppGrid: { flexDirection: 'row', flexWrap: 'wrap', border: '1pt solid black', padding: 6, gap: 4 },
  eppItem: { flexDirection: 'row', alignItems: 'center', width: '23%', marginBottom: 3 },
  eppBox: { width: 10, height: 10, border: '1pt solid black', marginRight: 4, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  eppChecked: { backgroundColor: '#000' },
  eppMark: { fontSize: 7, color: '#fff', fontWeight: 'bold' },
  eppLabel: { fontSize: 7, flex: 1 },
  eppOtros: { flexDirection: 'row', alignItems: 'center', marginTop: 2, width: '100%' },
  eppOtrosLabel: { fontSize: 7, fontWeight: 'bold', marginRight: 4 },
  eppOtrosValue: { fontSize: 7, borderBottom: '0.5pt solid #999', flex: 1 },
  permisoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, width: '100%' },
});

const EPP_ITEMS: { label: string; field: string }[] = [
  { label: 'Casco', field: 'casco' },
  { label: 'Guantes de PVC', field: 'guantesPVC' },
  { label: 'Barbijos', field: 'barbijos' },
  { label: 'Bloqueo/Rotulado', field: 'bloqueoRotulado' },
  { label: 'Zapato de Seguridad', field: 'zapatoSeguridad' },
  { label: 'Arnés de Seguridad', field: 'arnesSeguridad' },
  { label: 'Prot. Respiratoria', field: 'proteccionRespiratoria' },
  { label: 'Anteojos de Seguridad', field: 'anteojos' },
  { label: 'Protección Facial', field: 'proteccionFacial' },
  { label: 'Protección Auditiva', field: 'proteccionAuditiva' },
  { label: 'Guantes de Cuero', field: 'guantessCuero' },
  { label: 'Detector de Gases', field: 'detectorGases' },
  { label: 'Careta Soldador', field: 'caretaSoldador' },
  { label: 'Guantes Dieléctricos', field: 'guantesDielectricos' },
];

export const ATSPdf: React.FC<Props> = ({ report }) => {
  const { metadata, epp, rows } = report;

  const metaFields = [
    { label: 'N°', value: metadata.numero },
    { label: 'Revisión', value: metadata.revision },
    { label: 'Fecha', value: metadata.fecha },
    { label: 'Sector', value: metadata.sector },
    { label: 'Equipo', value: (metadata as any).equipo?.toUpperCase() },
    { label: 'Tarea u Operación', value: metadata.tarea, width: '100%' },
  ];

  const processFields = [
    { label: 'Elaborado por', value: metadata.elaboradoPor },
    { label: 'Función', value: metadata.funcionElab },
    { label: 'Revisado por', value: metadata.revisadoPor },
    { label: 'Función', value: metadata.funcionRev },
    { label: 'Aprobado por', value: metadata.aprobadoPor },
    { label: 'Función', value: metadata.funcionApro },
  ];

  const tableRows = rows.map(r => [r.descripcion, r.peligros, r.riesgos, r.recomendaciones]);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="ANÁLISIS DE TRABAJO SEGURO (ATS)" code="POSGI006-A1-0" />
      <PdfFields fields={metaFields} columns={3} />
      <PdfFields fields={processFields} columns={3} />

      {/* EPP Section */}
      <Text style={s.sectionBar}>
        Equipos de Protección Personal y Protección Industrial requeridos por la tarea:
      </Text>
      <View style={s.eppGrid}>
        {EPP_ITEMS.map(item => {
          const checked = !!(epp as any)[item.field];
          return (
            <View key={item.field} style={s.eppItem}>
              <View style={[s.eppBox, checked ? s.eppChecked : {}]}>
                {checked && <Text style={s.eppMark}>✓</Text>}
              </View>
              <Text style={s.eppLabel}>{item.label}</Text>
            </View>
          );
        })}
        {/* Otros fields */}
        <View style={s.eppOtros}>
          <Text style={s.eppOtrosLabel}>Otros:</Text>
          <Text style={s.eppOtrosValue}>{epp.otrosEpp1 || ''}</Text>
          <Text style={[s.eppOtrosLabel, { marginLeft: 12 }]}>Otros:</Text>
          <Text style={s.eppOtrosValue}>{epp.otrosEpp2 || ''}</Text>
          <Text style={[s.eppOtrosLabel, { marginLeft: 12 }]}>Otros:</Text>
          <Text style={s.eppOtrosValue}>{epp.otrosEpp3 || ''}</Text>
        </View>
        <View style={s.permisoRow}>
          <View style={[s.eppBox, epp.permisoTrabajo ? s.eppChecked : {}]}>
            {epp.permisoTrabajo && <Text style={s.eppMark}>✓</Text>}
          </View>
          <Text style={[s.eppLabel, { marginRight: 12 }]}>Permiso de Trabajo Requerido</Text>
          <Text style={[s.eppOtrosLabel]}>Extintores Kg:</Text>
          <Text style={[s.eppOtrosValue, { maxWidth: 60 }]}>{epp.extintores || ''}</Text>
        </View>
      </View>

      {/* Main ATS table */}
      <View style={{ marginTop: 8 }}>
        <PdfTable
          headers={['Descripción de la Tarea', 'Peligros / Aspectos', 'Riesgos / Impactos', 'Recomendaciones']}
          rows={tableRows}
          colWidths={['25%', '25%', '25%', '25%']}
        />
      </View>
    </PdfDocument>
  );
};
