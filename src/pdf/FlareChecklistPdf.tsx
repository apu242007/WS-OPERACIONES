import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { FlareChecklistReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfChecklist, ChecklistItem } from './PdfChecklist';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: FlareChecklistReport;
}

export const FlareChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  const items: ChecklistItem[] = rows.map(row => ({
    label: row.description,
    // B = Bueno → OK,  M = Malo → X
    status: (row as any).status === 'B' ? 'OK'
          : (row as any).status === 'M' ? 'X'
          : null,
    observations: row.observations,
  }));

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CHECK LIST FLARE MÓVIL" code="IT-WWO-007-A3" />

      <PdfFields
        columns={2}
        fields={[
          { label: 'UBICACIÓN',           value: metadata.location },
          { label: 'FECHA',               value: metadata.date },
          { label: 'USUARIO',             value: metadata.user },
          { label: 'PRÓX. MANTENIMIENTO', value: metadata.nextMaintenance },
        ]}
      />

      <PdfChecklist
        title="ITEMS DE INSPECCIÓN  (B = ✓ BUENO   M = ✗ MALO)"
        items={items}
        columns={1}
      />

      {observations ? (
        <View style={{ marginTop: 6 }}>
          <Text style={{
            fontSize: 7, fontFamily: 'Helvetica-Bold',
            textTransform: 'uppercase', marginBottom: 2, color: colors.textMid,
          }}>
            OBSERVACIONES GENERALES:
          </Text>
          <Text style={{ fontSize: 8, borderWidth: 1, borderColor: colors.black, padding: 4 }}>
            {observations}
          </Text>
        </View>
      ) : null}

      <PdfSignatures signatures={[
        { label: 'FIRMA RESPONSABLE', data: (signatures as any)['responsible']?.data },
      ]} />
    </PdfDocument>
  );
};
