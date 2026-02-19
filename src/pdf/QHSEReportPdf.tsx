import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { QHSEReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: QHSEReport;
}

const TextBlock: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <View style={{ marginTop: 6 }}>
    <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2, color: colors.textMid }}>
      {title}
    </Text>
    <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4, minHeight: 40 }}>
      {text || ''}
    </Text>
  </View>
);

export const QHSEReportPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, footerStats, observations, pendingTasks, nextMonthCommitment, signature } = report;

  const tableRows = rows.map(row => [
    String(row.item),
    row.description || '',
    row.meta || '',
    row.realized || '',
    row.detail1 || '',
    row.detail2 || '',
    row.detail3 || '',
  ]);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="INFORME DE PRO ACTIVIDADES MENSUALES QHSE" code="POWSG001-A2-0" />

      <View style={{ borderWidth: 1, borderColor: colors.borderLight, padding: 3, marginBottom: 4 }}>
        <Text style={{ fontSize: 6.5, color: colors.textMid }}>
          1- Para ser completado por JEFE DE CAMPO{'\n'}
          2- Enviar a la Gerencia Well Service y Seguridad entre los días 01 y 5 de cada mes.
        </Text>
      </View>

      <PdfFields
        columns={2}
        fields={[
          { label: 'FECHA DE INFORME', value: metadata.reportDate },
          { label: 'MES QUE CORRESPONDE', value: metadata.month },
          { label: 'NOMBRE Y APELLIDO', value: metadata.name },
        ]}
      />

      <PdfTable
        headers={['#', 'TIPO DE ACTIVIDAD REALIZADA HS&E', 'META', 'CANTIDAD', 'DETALLE 1', 'DETALLE 2', 'DETALLE 3']}
        rows={tableRows}
        colWidths={['4%', '32%', '6%', '10%', '16%', '16%', '16%']}
        centerCols={[0, 2, 3]}
      />

      {/* Footer Stats */}
      <View style={{ marginTop: 4, flexDirection: 'row', borderWidth: 1, borderColor: colors.black }}>
        {[
          { label: 'EQ Tck 1', value: footerStats.eqTck1 },
          { label: 'EQ Tck 2', value: footerStats.eqTck2 },
          { label: 'EQ Tck 3', value: footerStats.eqTck3 },
          { label: 'EQ Tck 4', value: footerStats.eqTck4 },
          { label: 'Base Operativa', value: footerStats.baseOperativa },
        ].map((stat, i, arr) => (
          <View key={i} style={{ flex: 1, borderRightWidth: i < arr.length - 1 ? 1 : 0, borderColor: colors.black, alignItems: 'center', padding: 4 }}>
            <Text style={{ fontSize: 6.5, color: colors.textMid, fontFamily: 'Helvetica-Bold' }}>{stat.label}</Text>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginTop: 2 }}>{stat.value || '—'}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 4, borderWidth: 1, borderColor: colors.borderLight, padding: 3 }}>
        <Text style={{ fontSize: 6, color: colors.textMid, fontStyle: 'italic' }}>
          SC - Si corresponde. | 2- A todo el personal del Equipo | 4 a 10- Detallar y enviar el Informe con las observaciones detectadas.{'\n'}
          12- Dejar evidencias sobre la implementación. | 13-14- Enviar el Informe y dejar evidencias de los hallazgos observados.
        </Text>
      </View>

      <TextBlock title="OBSERVACIONES EN EL TRANSCURSO DEL MES" text={observations} />
      <TextBlock title="TAREAS PENDIENTES A REALIZAR" text={pendingTasks} />
      <TextBlock title="COMPROMISO PARA EL PRÓXIMO MES" text={nextMonthCommitment} />

      <PdfSignatures signatures={[
        { label: 'FIRMA Y ACLARACIÓN', data: signature?.data, name: metadata.name },
      ]} />
    </PdfDocument>
  );
};
