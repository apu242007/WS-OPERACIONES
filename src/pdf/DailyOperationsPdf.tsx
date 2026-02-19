import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { DailyReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { colors } from './styles';

interface Props {
  report: DailyReport;
}

export const DailyOperationsPdf: React.FC<Props> = ({ report }) => {
  const { metadata, entries } = report;

  const tableRows = entries.map(e => [
    e.from || '',
    e.to || '',
    e.hours || '',
    e.timeClass || '',
    e.tariff || '',
    e.detail || '',
  ]);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="PARTE DIARIO DE OPERACIONES" code="POWSG001-A3-1" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'EMPRESA',       value: metadata.companyInfo },
          { label: 'FECHA',         value: metadata.date },
          { label: 'CLIENTE',       value: metadata.client },
          { label: 'POZO',          value: metadata.well },
          { label: 'N° REPORTE',    value: metadata.reportNumber },
          { label: 'CAMPO',         value: metadata.field },
          { label: 'EQUIPO N°',     value: metadata.rigNumber },
          { label: 'PROVINCIA',     value: metadata.province },
        ]}
      />

      {metadata.objective ? (
        <View style={{ marginTop: 4, marginBottom: 4 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold',
            textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
          }}>
            OBJETIVO:
          </Text>
          <Text style={{
            fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4, minHeight: 28,
          }}>
            {metadata.objective}
          </Text>
        </View>
      ) : null}

      <PdfTable
        headers={['DESDE', 'HASTA', 'C. HORAS', 'CLASE DE TIEMPO', 'TARIFA', 'DETALLE DE OPERACIONES']}
        rows={tableRows}
        colWidths={['10%', '10%', '10%', '15%', '10%', '45%']}
        centerCols={[0, 1, 2, 3, 4]}
      />
    </PdfDocument>
  );
};
