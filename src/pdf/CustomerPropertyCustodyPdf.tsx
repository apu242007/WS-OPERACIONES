import React from 'react';
import { CustomerPropertyCustodyReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfTable } from './PdfTable';

interface Props { report: CustomerPropertyCustodyReport; }

const HEADERS = [
  'Item', 'F.Ingreso', 'Doc.Ingreso', 'Trans.In', 'Área Recibe',
  'Cliente', 'Contacto', 'Cód.Prod.', 'Descripción', 'Serial',
  'Estado Recep.', 'Tratamiento', 'Ubicación', 'F.Prevista', 'Estado',
  'Desc.Entregado', 'F.Efectiva', 'Doc.Egreso', 'Resp.Entrega', 'Trans.Out',
];

const COL_WIDTHS = [
  '2%', '4%', '5%', '4%', '5%',
  '5%', '5%', '4%', '8%', '4%',
  '4%', '4%', '5%', '4%', '3%',
  '8%', '4%', '4%', '5%', '4%',
];

const CENTER_COLS = HEADERS.map((_, i) => i).filter(i => i !== 8 && i !== 15);

export const CustomerPropertyCustodyPdf: React.FC<Props> = ({ report }) => {
  const { metadata, items } = report;

  const tableRows = items.map((item, idx) => [
    String(idx + 1),
    item.entryDate,
    item.entryDocument,
    item.transportIn,
    item.receivingArea,
    item.client,
    item.clientContact,
    item.productCode,
    item.productDescription,
    item.serialNumber,
    item.receptionStatus,
    item.requiredTreatment,
    item.storageLocation,
    item.estimatedDeliveryDate,
    item.status,
    item.deliveryDescription,
    item.actualDeliveryDate,
    item.exitDocument,
    item.deliveryResponsible,
    item.transportOut,
  ]);

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader
        title="CUSTODIA PROPIEDAD DEL CLIENTE"
        code="PGTAC011-A1-0"
        subtitle={`Rev. ${metadata.revision}  —  Fecha: ${metadata.date}`}
      />
      <PdfTable
        headers={HEADERS}
        rows={tableRows}
        colWidths={COL_WIDTHS}
        centerCols={CENTER_COLS}
      />
    </PdfDocument>
  );
};
