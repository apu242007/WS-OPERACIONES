import React from 'react';
import { EmergencyDrillReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: EmergencyDrillReport;
}

const label = (val: string | null | undefined): string => (val ? String(val) : '—');

export const EmergencyDrillPdf: React.FC<Props> = ({ report }) => {
  const { metadata, data, signature } = report;
  const md = metadata as any;
  const d = data as any;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="REGISTRO DE SIMULACRO DE EMERGENCIA" code="POSGI008-A1-0" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'FECHA REALIZACIÓN',   value: metadata.date },
          { label: 'REALIZADO POR',       value: metadata.performedBy },
          { label: 'EQUIPO',              value: md.equipment?.toUpperCase() ?? '—' },
          { label: 'LUGAR',               value: metadata.location },
          { label: 'TIPO DE SIMULACRO',   value: metadata.type },
          { label: 'UNIDAD DE NEGOCIO',   value: metadata.businessUnit },
          { label: 'PARTICIPANTES',       value: metadata.participants },
          { label: 'OBSERVADORES',        value: metadata.observers },
          { label: 'SITIO',               value: metadata.site },
        ]}
      />

      <PdfFields
        title="OBJETIVO Y ASPECTOS A REVISAR"
        columns={2}
        fields={[
          { label: 'OBJETIVOS',           value: d.objectives?.join(', ') || '—' },
          { label: 'ASPECTOS A REVISAR',  value: d.aspectsToReview?.join(', ') || '—' },
        ]}
      />

      <PdfFields
        title="ESCENARIO Y RECURSOS"
        columns={2}
        fields={[
          { label: 'DESCRIPCIÓN DEL ESCENARIO', value: d.scenarioDescription },
          { label: 'RECURSOS UTILIZADOS',       value: d.resourcesUsed?.join(', ') || '—' },
        ]}
      />

      <PdfFields
        title="EVALUACIÓN DEL SIMULACRO"
        columns={3}
        fields={[
          { label: 'ADECUACIÓN RECURSOS',             value: label(d.resourceAdequacy) },
          { label: 'UBICACIÓN SIMULACRO',             value: label(d.locationSuitability) },
          { label: 'ALARMA SONORA',                   value: label(d.soundAlarm) },
          { label: 'ALARMA VISUAL',                   value: label(d.visualAlarm) },
          { label: 'PUNTOS DE REUNIÓN',               value: label(d.meetingPoints) },
          { label: 'PERSONAL DIRIGIDO CORRECTAMENTE', value: d.personnelDirectedCorrectly === true ? 'Sí' : d.personnelDirectedCorrectly === false ? 'No' : '—' },
          { label: 'COMUNICACIÓN TEL/RADIAL',         value: label(d.phoneCommunication) },
        ]}
      />

      <PdfFields
        title="TIEMPOS DE RESPUESTA"
        columns={4}
        fields={[
          { label: 'HORA INICIO',              value: metadata.startTime },
          { label: 'T. AVISO ALARMA',          value: d.alarmTime },
          { label: 'T. COMUNICACIÓN',          value: d.communicationTime },
          { label: 'T. LLEGADA PTO. REUNIÓN',  value: d.meetingTime },
          { label: 'HORA INICIO ACCIONES',     value: d.actionStartTime },
          { label: 'HORA FINALIZACIÓN',        value: metadata.endTime },
          { label: 'T. DE RESPUESTA',          value: label(d.responseTimeStatus) },
          { label: 'DESARROLLO SIMULACRO',     value: label(d.drillDevelopmentStatus) },
        ]}
      />

      <PdfFields
        title="OBSERVACIONES Y RESULTADO"
        columns={2}
        fields={[
          { label: 'OBSERVACIONES',                     value: d.observations },
          { label: 'MEJORAS IMPLEMENTADAS / PROPUESTAS', value: d.improvements },
          { label: 'RESULTADO FINAL DEL SIMULACRO',      value: label(d.finalResult) },
        ]}
      />

      <PdfSignatures signatures={[
        { label: 'FIRMA RESPONSABLE', data: signature?.data },
      ]} />
    </PdfDocument>
  );
};
