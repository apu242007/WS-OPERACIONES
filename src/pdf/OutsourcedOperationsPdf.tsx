import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { OutsourcedReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: OutsourcedReport;
}

const SECTIONS = [
  {
    title: 'PLANIFICACION DE LA TAREA',
    items: [
      { id: 'p1', text: 'Instructivos de Trabajo / Procedimientos', subtext: 'Objetivo: Comprensión y entendimiento de responsabilidades, funciones y comunicación. Acciones ante contingencias.' },
      { id: 'p2', text: 'Analisis y Evaluación de Riesgos: ATS N°', subtext: 'Objetivo: Comprensión de los riesgos durante la operación y accionar medidas preventivas, de contingencia, rol de emergencia, cambios de condiciones de trabajo y detención de las tareas ante situaciones inseguras.' },
    ],
  },
  {
    title: 'INFRAESTRUCTURA',
    items: [
      { id: 'i1', text: 'Verificación de instrumentos y equipos de trabajo // Aplicación de Checklist / Certificaciones', subtext: 'Objetivo: Asegurase contar con equipamiento en condiciones operativas y preveer contingencias en caso de anomalías.' },
      { id: 'i2', text: 'Acondicionamiento de área de trabajo' },
      { id: 'i3', text: '1, Señalizaciones' },
      { id: 'i4', text: '2, Determinación de espacio adecuado (Revision de matriz de riesgos, medidas y contingencias)' },
      { id: 'i5', text: '3, Revision de plan de emergencia (Roles, responsables)' },
    ],
  },
  {
    title: 'REVISIÓN DE REQUERIMIENTOS DEL PROCESO',
    items: [
      { id: 'r1', text: '1, ¿Están definidos los roles y responsabilidades de la operación?' },
      { id: 'r2', text: '2, ¿Comprensión del paso a paso de la operación por parte de los involucrados?' },
      { id: 'r3', text: '3, ¿Comprensión de la política de planificación y control operacional?' },
      { id: 'r4', text: '4, ¿Comprensión de la política de detención de tareas?' },
    ],
  },
];

const CheckMark: React.FC<{ value: 'si' | 'no' | null; label: string }> = ({ value, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
    <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: colors.black, backgroundColor: value === label.toLowerCase() ? colors.black : '#fff', alignItems: 'center', justifyContent: 'center' }}>
      {value === label.toLowerCase() && <Text style={{ fontSize: 7, color: '#fff', fontFamily: 'Helvetica-Bold' }}>{label === 'Si' ? '✓' : '✕'}</Text>}
    </View>
    <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold' }}>{label}</Text>
  </View>
);

export const OutsourcedOperationsPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signatures } = report;

  const getRow = (id: string) => rows.find(r => r.id === id) || { value: null, observation: '' };

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="REGISTRO DE PLANIFICACIÓN Y CONTROL DE OPERACIONES TERCERIZADAS" code="POWSG001-A6-0" />

      <PdfFields columns={2} fields={[
        { label: 'SECTOR / EQUIPO', value: metadata.sector },
        { label: 'FECHA', value: metadata.date },
        { label: 'POZO', value: metadata.well },
        { label: 'SUB-CONTRATISTA', value: metadata.subContractor },
        { label: 'DESCRIPCIÓN DEL TRABAJO', value: metadata.jobDescription, width: '100%' },
        { label: 'OBJETIVO', value: metadata.objective, width: '100%' },
      ]} />

      {/* Checklist Table */}
      <View style={{ marginTop: 8, borderWidth: 1, borderColor: colors.black }}>
        {/* Table header */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.tableHeaderBg, borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textTransform: 'uppercase', borderRightWidth: 1, borderColor: colors.black }}>Actividades de Gestión Operacional</Text>
          <Text style={{ width: 22, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderRightWidth: 1, borderColor: colors.black }}>Si</Text>
          <Text style={{ width: 22, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderRightWidth: 1, borderColor: colors.black }}>No</Text>
          <Text style={{ width: 120, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', textTransform: 'uppercase' }}>Observaciones</Text>
        </View>

        {SECTIONS.map((section, sIdx) => (
          <React.Fragment key={sIdx}>
            {/* Section Header */}
            <View style={{ backgroundColor: '#e5e7eb', borderBottomWidth: 1, borderColor: colors.black, padding: 4 }}>
              <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' }}>{section.title}</Text>
            </View>

            {section.items.map((item, iIdx) => {
              const rowData = getRow(item.id);
              const lastInSection = iIdx === section.items.length - 1;
              const lastSection = sIdx === SECTIONS.length - 1;
              return (
                <View key={item.id} style={{ flexDirection: 'row', borderBottomWidth: lastInSection && lastSection ? 0 : 1, borderColor: colors.borderLight, minHeight: 24 }}>
                  <View style={{ flex: 1, padding: 3, borderRightWidth: 1, borderColor: colors.borderLight }}>
                    <Text style={{ fontSize: 7 }}>{item.text}</Text>
                    {'subtext' in item && item.subtext && (
                      <Text style={{ fontSize: 6, color: colors.textMid, fontStyle: 'italic', marginTop: 1 }}>{item.subtext}</Text>
                    )}
                  </View>
                  <View style={{ width: 22, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>
                    <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: colors.black, backgroundColor: rowData.value === 'si' ? colors.black : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                      {rowData.value === 'si' && <Text style={{ fontSize: 7, color: '#fff', fontFamily: 'Helvetica-Bold' }}>✓</Text>}
                    </View>
                  </View>
                  <View style={{ width: 22, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: colors.borderLight }}>
                    <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: colors.black, backgroundColor: rowData.value === 'no' ? colors.black : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                      {rowData.value === 'no' && <Text style={{ fontSize: 7, color: '#fff', fontFamily: 'Helvetica-Bold' }}>✕</Text>}
                    </View>
                  </View>
                  <Text style={{ width: 120, fontSize: 7, padding: 3 }}>{rowData.observation || ''}</Text>
                </View>
              );
            })}
          </React.Fragment>
        ))}
      </View>

      <PdfSignatures signatures={[
        { label: 'Sub Contratista Líder de la Operación', data: signatures.subContractor?.data },
        { label: 'Responsable TACKER', data: signatures.responsible?.data },
      ]} />
    </PdfDocument>
  );
};
