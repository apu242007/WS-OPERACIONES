import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PerformanceEvaluationReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: PerformanceEvaluationReport;
}

const CATEGORIES = [
  { title: 'CONOCIMIENTOS DE TRABAJO (TEORICO Y PRACTICO)', items: ['Conoce las funciones de su puesto de trabajo.', 'Posee los conocimientos necesarios para desempeñar su función.', 'Conoce y cumple los procedimientos de la operadora y de la Cia.', 'Conoce los riesgos asociados a su puesto de trabajo.'] },
  { title: 'CALIDAD DE TRABAJO', items: ['Realiza su trabajo con exactitud, pulcritud y minuciosidad.', 'Se preocupa por el orden y limpieza de su sector.', 'Hace uso racional de los recursos.'] },
  { title: 'CANTIDAD DE TRABAJO', items: ['Volumen de trabajo realizado normalmente.', 'Rapidez y dinamismo en la ejecución de la tarea.', 'Cumplimiento de las instrucciones recibidas.'] },
  { title: 'DISCIPLINA', items: ['Posee buena conducta y comportamiento personal.', 'Se adapta a las normas y reglamentos internos de la Cia.', 'Cumple los horarios de trabajo.', 'Acatamiento de órdenes.'] },
  { title: 'COOPERACION', items: ['Colaboración con sus compañeros y jefes.', 'Actitud ante situaciones imprevistas y/o de emergencia.', 'Disposición para realizar tareas fuera de su rutina.'] },
  { title: 'SEGURIDAD, SALUD Y MEDIO AMBIENTE', items: ['Utiliza correctamente los EPP.', 'Cumple con las normas de seguridad, salud y medio ambiente.', 'Participa en las charlas de seguridad y simulacros.', 'Reporta actos y condiciones inseguras.'] },
];

export const PerformanceEvaluationPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, trainingNeeds, averageScore, signatures } = report;

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="EVALUACIÓN DE DESEMPEÑO" code="RRHH-001-A1" />

      {/* Evaluado + Evaluador + Date grid */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: colors.borderLight, padding: 6 }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 4 }}>Datos del Evaluado</Text>
          {[['Nombre', metadata.evaluatedName], ['Puesto', metadata.evaluatedPosition], ['Área/Sector', metadata.evaluatedArea]].map(([label, val]) => (
            <View key={label} style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'center' }}>
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', width: 60, textTransform: 'uppercase', color: colors.textMid }}>{label}:</Text>
              <Text style={{ flex: 1, fontSize: 8, borderBottomWidth: 1, borderColor: colors.borderLight, paddingBottom: 1 }}>{val || ''}</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: colors.borderLight, padding: 6 }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 4 }}>Datos del Evaluador</Text>
          {[['Nombre', metadata.evaluatorName], ['Puesto', metadata.evaluatorPosition], ['Área/Sector', metadata.evaluatorArea]].map(([label, val]) => (
            <View key={label} style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'center' }}>
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', width: 60, textTransform: 'uppercase', color: colors.textMid }}>{label}:</Text>
              <Text style={{ flex: 1, fontSize: 8, borderBottomWidth: 1, borderColor: colors.borderLight, paddingBottom: 1 }}>{val || ''}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Date row */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 6 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: colors.textMid, textTransform: 'uppercase', marginRight: 6 }}>Fecha de Evaluación:</Text>
        <Text style={{ fontSize: 8 }}>{metadata.date}</Text>
      </View>

      {/* Criteria */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, padding: 3, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: colors.borderLight, marginBottom: 4, flexWrap: 'wrap' }}>
        {[['1', 'Malo'], ['2', 'Regular'], ['3', 'Bueno'], ['4', 'Muy Bueno'], ['5', 'Excelente']].map(([n, label]) => (
          <Text key={n} style={{ fontSize: 6, color: '#374151' }}>{n} – {label}</Text>
        ))}
      </View>

      {/* Evaluation Table */}
      <View style={{ borderWidth: 1, borderColor: colors.black }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottomWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 3, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textTransform: 'uppercase' }}>Factor de Evaluación</Text>
          <Text style={{ width: 80, fontSize: 7, fontFamily: 'Helvetica-Bold', padding: 3, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.black, textTransform: 'uppercase' }}>Puntaje</Text>
        </View>

        {CATEGORIES.map((cat, catIdx) => {
          const catRows = rows.filter(r => r.category === cat.title);
          return (
            <React.Fragment key={catIdx}>
              <View style={{ backgroundColor: '#f3f4f6', borderBottomWidth: 1, borderColor: colors.black, padding: 3 }}>
                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' }}>{cat.title}</Text>
              </View>
              {catRows.map((row, rowIdx) => (
                <View key={row.id} style={{ flexDirection: 'row', borderBottomWidth: rowIdx < catRows.length - 1 || catIdx < CATEGORIES.length - 1 ? 1 : 0, borderColor: colors.borderLight, minHeight: 18 }}>
                  <Text style={{ flex: 3, fontSize: 7, padding: 3, lineHeight: 1.3 }}>{row.question}</Text>
                  <View style={{ width: 80, borderLeftWidth: 1, borderColor: colors.black, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                    <View style={{ flexDirection: 'row', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <View key={s} style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: row.score === s ? colors.black : '#d1d5db', backgroundColor: row.score === s ? colors.black : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 5, color: row.score === s ? '#fff' : '#9ca3af', fontFamily: 'Helvetica-Bold' }}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </React.Fragment>
          );
        })}

        {/* Average Row */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', borderTopWidth: 1, borderColor: colors.black }}>
          <Text style={{ flex: 3, fontSize: 8, fontFamily: 'Helvetica-Bold', padding: 4, textTransform: 'uppercase' }}>Promedio General:</Text>
          <View style={{ width: 80, borderLeftWidth: 1, borderColor: colors.black, alignItems: 'center', justifyContent: 'center', padding: 3 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>{averageScore || '0'}</Text>
          </View>
        </View>
      </View>

      {/* Training Needs */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: colors.textMid, marginBottom: 4 }}>Necesidades de Capacitación / Entrenamiento Detectadas:</Text>
        <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 6, minHeight: 50, lineHeight: 1.5 }}>{trainingNeeds || ''}</Text>
      </View>

      <PdfSignatures signatures={[
        { label: 'Firma del Evaluado', data: signatures.evaluated?.data, name: metadata.evaluatedName },
        { label: 'Firma del Evaluador', data: signatures.evaluator?.data, name: metadata.evaluatorName },
        { label: 'Firma Gerencia', data: signatures.manager?.data },
      ]} />
    </PdfDocument>
  );
};
