import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { FirstAidReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable, CellStyle } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: FirstAidReport;
}

export const FirstAidInspectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  const tableRows = rows.map(r => [
    r.quantity,
    r.unit,
    r.conditionB ? 'X' : '',
    r.conditionM ? 'X' : '',
    r.expiration || '',
    r.description,
  ]);

  const cellStyles: Record<string, CellStyle> = {};
  rows.forEach((r, ri) => {
    if (r.conditionB) cellStyles[`${ri}-2`] = 'approved';
    if (r.conditionM) cellStyles[`${ri}-3`] = 'failed';
  });

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="INSPECCIÓN BOTIQUÍN PRIMEROS AUXILIOS" code="POSGI001-A13-1" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'EQUIPO / BASE',           value: metadata.equipmentBase },
          { label: 'YACIMIENTO / LOCACIÓN',   value: metadata.location },
          { label: 'FECHA',                   value: metadata.date },
          { label: 'TÉCNICO HSE',             value: metadata.hseTech },
          { label: 'JEFE DE EQUIPO / BASE',   value: metadata.teamLeader },
          { label: 'REPRESENTANTE CLIENTE',   value: metadata.clientRep },
        ]}
      />

      <PdfTable
        headers={['CANT.', 'UM', 'B', 'M', 'VENCIMIENTO', 'DESCRIPCIÓN']}
        rows={tableRows}
        colWidths={['8%', '10%', '6%', '6%', '15%', '55%']}
        centerCols={[0, 1, 2, 3, 4]}
        cellStyles={cellStyles}
      />

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold',
            textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
          }}>
            OBSERVACIONES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'FIRMA TEC. HSE',             data: signatures['hseTech']?.data },
        { label: 'FIRMA JEFE DE EQUIPO / BASE', data: signatures['teamLeader']?.data },
      ]} />
    </PdfDocument>
  );
};
