import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { ForkliftLiftingPlanReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfChecklist, ChecklistItem } from './PdfChecklist';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: ForkliftLiftingPlanReport;
}

export const ForkliftLiftingPlanPdf: React.FC<Props> = ({ report }) => {
  const { general, equipment, personnel, checklist, sketch, signatures } = report;

  const checklistItems: ChecklistItem[] = (checklist ?? []).map((item: any) => ({
    label: item.question,
    status: item.status === 'SI' ? 'OK'
          : item.status === 'NO' ? 'X'
          : item.status === 'NA' ? 'NA'
          : null,
  }));

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader
        title="PLAN DE IZAJE (CRÍTICO / NO CRÍTICO) — MONTACARGAS / MANITOU"
        code="POWWO001-A23-0"
      />

      <PdfFields
        title="1. INFORMACIÓN GENERAL"
        columns={3}
        fields={[
          { label: 'FECHA',           value: general?.date },
          { label: 'LOCACIÓN',        value: general?.location },
          { label: 'ORDEN DE TRABAJO', value: general?.workOrder },
          { label: 'HORA INICIO',     value: general?.startTime },
          { label: 'HORA FIN',        value: general?.endTime },
          { label: 'DESC. MANIOBRA',  value: general?.description },
        ]}
      />

      <PdfFields
        title="2. DATOS DEL EQUIPO"
        columns={3}
        fields={[
          { label: 'TIPO',             value: equipment?.type },
          { label: 'MARCA',            value: equipment?.brand },
          { label: 'MODELO',           value: equipment?.model },
          { label: 'INTERNO N°',       value: equipment?.internalNumber },
          { label: 'CAPACIDAD MÁX.',   value: equipment?.capacity },
          { label: 'ACCESORIO',        value: equipment?.accessory ?? null },
        ]}
      />

      <PdfFields
        title="3. PERSONAL INVOLUCRADO"
        columns={3}
        fields={[
          { label: 'SUPERVISOR', value: personnel?.supervisor },
          { label: 'OPERADOR',   value: personnel?.operator },
          { label: 'SEÑALERO',   value: personnel?.rigger },
        ]}
      />

      <PdfChecklist
        title="4. CHECKLIST PRE-MANIOBRA (SI = ✓  NO = ✗  NA = —)"
        items={checklistItems}
        columns={1}
        showObservations={false}
      />

      {sketch ? (
        <View style={{
          marginTop: 6, borderWidth: 1, borderColor: colors.black,
          padding: 4,
        }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>
            5. CROQUIS / ESQUEMA DE IZAJE
          </Text>
          <Image src={sketch} style={{ maxHeight: 120, objectFit: 'contain' }} />
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'FIRMA SUPERVISOR',         data: signatures?.supervisor?.data },
        { label: 'FIRMA EJECUTOR / OPERADOR', data: signatures?.executor?.data },
      ]} />
    </PdfDocument>
  );
};
