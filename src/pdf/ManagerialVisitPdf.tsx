import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { ManagerialVisitReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: ManagerialVisitReport;
}

const SCORE_LABELS: Record<number, string> = { 1: 'Deficiente', 2: 'Regular', 3: 'Bueno', 4: 'Muy Bueno', 5: 'Excelente' };

export const ManagerialVisitPdf: React.FC<Props> = ({ report }) => {
  const { metadata, items, conclusions, images, signatures } = report;

  const totalScore = items.reduce((sum, item) => sum + (item.score && item.score > 0 ? item.score : 0), 0);
  const totalPercent = ((totalScore / 50) * 100).toFixed(0);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="VISITA GERENCIAL EN OPERACIONES" code="POSGI010-A2-0" />

      <PdfFields columns={2} fields={[
        { label: 'LUGAR', value: metadata.location },
        { label: 'FECHA', value: metadata.date },
        { label: 'HORA', value: metadata.time },
        { label: 'APELLIDO Y NOMBRE', value: metadata.name },
        { label: 'N° DNI', value: metadata.dni },
        { label: 'CARGO', value: metadata.position },
        { label: 'ORDEN DE TRABAJO', value: metadata.workOrder },
        { label: 'TIPO ACTIVIDAD / OPERACIÓN', value: metadata.activityType },
      ]} />

      {/* Evaluators */}
      <View style={{ flexDirection: 'row', marginTop: 4, borderWidth: 1, borderColor: colors.borderLight, backgroundColor: '#f9fafb', padding: 4, gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 2 }}>Evaluador 1</Text>
          <Text style={{ fontSize: 8 }}>{metadata.coordinator1 || '—'}</Text>
          <Text style={{ fontSize: 6, color: colors.textMid, marginTop: 2 }}>{metadata.evaluatorPosition1 || ''}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: colors.borderLight }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 2 }}>Evaluador 2</Text>
          <Text style={{ fontSize: 8 }}>{metadata.coordinator2 || '—'}</Text>
          <Text style={{ fontSize: 6, color: colors.textMid, marginTop: 2 }}>{metadata.evaluatorPosition2 || ''}</Text>
        </View>
      </View>

      {/* Objective + Tasks */}
      <View style={{ flexDirection: 'row', marginTop: 6, borderWidth: 1, borderColor: colors.black }}>
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: colors.black, padding: 4, backgroundColor: '#f9fafb' }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>OBJETIVO:</Text>
          <Text style={{ fontSize: 7, color: '#374151', lineHeight: 1.4 }}>Evaluar los comportamientos, conocimientos y actitudes del personal ante la actividad seleccionada contemplando factores operativos y QHSE.</Text>
        </View>
        <View style={{ flex: 1, padding: 4 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>TAREAS A EVALUAR:</Text>
          {[
            'Conocimiento del programa del pozo y de la operación.',
            'Contacto con el representante del cliente en el pozo.',
            'Documentación soporte de la operación generada en la misma.',
            'Presencia personal, móvil y herramienta.',
            'Seguimiento QHSE.',
          ].map((t, i) => (
            <Text key={i} style={{ fontSize: 7, color: '#374151', marginBottom: 2, lineHeight: 1.3 }}>• {t}</Text>
          ))}
        </View>
      </View>

      {/* Criteria */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, padding: 3, backgroundColor: '#f3f4f6', borderWidth: 1, borderTopWidth: 0, borderColor: colors.black, marginBottom: 4 }}>
        <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: '#374151', textTransform: 'uppercase' }}>Criterio:</Text>
        {[1, 2, 3, 4, 5].map((s) => (
          <Text key={s} style={{ fontSize: 6, color: '#374151' }}>{s} – {SCORE_LABELS[s]}</Text>
        ))}
      </View>

      {/* Evaluation items table */}
      <View style={{ borderWidth: 1, borderColor: colors.black }}>
        {/* Table header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 3, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textTransform: 'uppercase' }}>Aspecto a Evaluar</Text>
          <Text style={{ width: 80, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.black, textTransform: 'uppercase' }}>Calificación</Text>
          <Text style={{ flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.black, textTransform: 'uppercase' }}>Observaciones</Text>
        </View>

        {items.map((item, idx) => (
          <View key={item.id} style={{ flexDirection: 'row', borderBottomWidth: idx < items.length - 1 ? 1 : 0, borderColor: colors.borderLight, backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb', minHeight: 22 }}>
            <Text style={{ flex: 3, fontSize: 7, padding: 3, lineHeight: 1.4 }}>{item.question}</Text>
            <View style={{ width: 80, borderLeftWidth: 1, borderColor: colors.black, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
              <View style={{ flexDirection: 'row', gap: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <View key={s} style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: colors.black, backgroundColor: item.score === s ? colors.black : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 6, color: item.score === s ? '#fff' : '#9ca3af', fontFamily: 'Helvetica-Bold' }}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={{ flex: 1, fontSize: 7, padding: 3, borderLeftWidth: 1, borderColor: colors.black }}>{item.observation || ''}</Text>
          </View>
        ))}

        {/* Total Row */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', borderTopWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 3, fontSize: 8, fontFamily: 'Helvetica-Bold', padding: 4, textTransform: 'uppercase' }}>Porcentaje Total:</Text>
          <View style={{ width: 80, borderLeftWidth: 1, borderColor: colors.black, alignItems: 'center', justifyContent: 'center', padding: 3 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>{totalPercent}%</Text>
          </View>
          <View style={{ flex: 1, borderLeftWidth: 1, borderColor: colors.black }} />
        </View>
      </View>

      {/* Conclusions */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 4 }}>Conclusiones y Recomendaciones:</Text>
        <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 6, minHeight: 50, lineHeight: 1.5 }}>{conclusions || ''}</Text>
      </View>

      {/* Photos */}
      {images && images.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 4 }}>Registro Fotográfico:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {images.map((img, i) => (
              <Image key={i} src={img} style={{ width: '23%', height: 80, objectFit: 'cover' }} />
            ))}
          </View>
        </View>
      )}

      {/* Signatures */}
      <PdfSignatures signatures={[
        { label: 'Firma Auditor 1', data: signatures.auditor1?.data, name: metadata.coordinator1 },
        { label: 'Firma Auditor 2', data: signatures.auditor2?.data, name: metadata.coordinator2 },
        { label: 'Firma Supervisor', data: signatures.supervisor?.data },
      ]} />
    </PdfDocument>
  );
};
