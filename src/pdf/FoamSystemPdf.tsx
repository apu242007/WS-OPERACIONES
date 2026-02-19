import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { FoamSystemReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';
import { colors } from './styles';

interface Props {
  report: FoamSystemReport;
}

export const FoamSystemPdf: React.FC<Props> = ({ report }) => {
  const { rows, signature } = report;

  const tableRows = rows.map(r => [
    r.equipment || '',
    r.date || '',
    r.well || '',
    r.pneumaticValve || '',
    r.fluidLevel || '',
    r.reliefValve || '',
    r.dischargeTime || '',
    r.observations || '',
    r.systemState || '',
    r.nextRevision || '',
  ]);

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader title="REGISTRO DE FUNCIONAMIENTO DE SISTEMA DE ESPUMÍGENO" code="POWSG004-A1-0" />

      <View style={{ marginTop: 4, marginBottom: 2 }}>
        <Text style={{
          fontSize: 6.5, color: colors.textMid, textAlign: 'center',
          borderWidth: 1, borderColor: colors.borderLight,
          paddingTop: 3, paddingBottom: 3, paddingLeft: 4, paddingRight: 4,
        }}>
          ESTADO: B: Bien — R: Regular — M: Mal — N/C: No Corresponde
        </Text>
      </View>

      <PdfTable
        headers={[
          'EQUIPO', 'FECHA', 'POZO',
          'VÁLV. NEUMÁTICA', 'NIVEL FLUIDO', 'VÁLV. ALIVIO',
          'TIEMPO DESCARGA', 'OBSERVACIONES', 'ESTADO SISTEMA', 'PRÓX. REVISIÓN',
        ]}
        rows={tableRows}
        colWidths={['10%', '9%', '9%', '9%', '9%', '9%', '9%', '18%', '9%', '9%']}
        centerCols={[0, 1, 2, 3, 4, 5, 6, 8, 9]}
      />

      <PdfSignatures signatures={[
        { label: 'FIRMA DEL RESPONSABLE', data: signature?.data },
      ]} />
    </PdfDocument>
  );
};
