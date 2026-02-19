import React from 'react';
import { VehicleInspectionReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: VehicleInspectionReport;
}

export const VehicleInspectionPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, signature } = report;

  const tableRows = rows.map(row => [
    row.item,
    row.status === 'BIEN' ? 'X' : '',
    row.status === 'MAL'  ? 'X' : '',
    row.status === 'N/C'  ? 'X' : '',
    row.observations || '',
  ]);

  return (
    <PdfDocument orientation="portrait">
      <PdfHeader title="CHECK LIST VEHÍCULOS" code="POSGI001-A1-2" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'VEHÍCULO',        value: metadata.vehicle },
          { label: 'KILOMETRAJE',     value: metadata.mileage ? `${metadata.mileage} kms` : null },
          { label: 'TARJETA VERDE',   value: metadata.greenCard },
          { label: 'PATENTE',         value: metadata.plate },
          { label: 'ÚLTIMO SERVICIO', value: metadata.lastServiceKms ? `${metadata.lastServiceKms} kms` : null },
          { label: 'S.O. VTO.',       value: metadata.soExpiration },
          { label: 'INTERNO N°',      value: metadata.internalNumber },
          { label: 'VTV VTO.',        value: metadata.vtvExpiration },
          { label: 'RUTA VTO.',       value: metadata.routeExpiration },
          { label: 'FECHA',           value: metadata.date },
        ]}
      />

      <PdfTable
        headers={['ÍTEM', 'BIEN', 'MAL', 'N/C', 'OBSERVACIONES']}
        rows={tableRows}
        colWidths={['50%', '8%', '8%', '8%', '26%']}
        centerCols={[1, 2, 3]}
      />

      <PdfSignatures signatures={[
        { label: 'FIRMA CONDUCTOR / RESPONSABLE', data: signature?.data },
      ]} />
    </PdfDocument>
  );
};
