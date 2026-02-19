import React from 'react';
import { CableWorkReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';

interface Props { report: CableWorkReport; }

export const CableWorkReportPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows } = report;

  const metaFields1 = [
    { label: 'Compañía', value: metadata.company },
    { label: 'Pozo', value: metadata.well },
    { label: 'Equipo', value: metadata.equipment?.toUpperCase() },
    { label: 'Marca/Tipo Cuadro', value: metadata.frameType },
    { label: 'Diam. Tambor', value: metadata.drumDiameter },
    { label: 'Liso o Acanot.', value: metadata.drumType },
    { label: 'Diam. Poleas', value: metadata.pulleyDiameter },
    { label: 'Peso Aparejo', value: metadata.blockWeight },
    { label: 'Medida y Peso B/S', value: metadata.bsMeasureWeight },
    { label: 'Marca Cable', value: metadata.cableBrand },
    { label: 'Medidas/Long.', value: metadata.cableMeasureLength },
    { label: 'Construcción', value: metadata.construction },
    { label: 'Grado', value: metadata.grade },
    { label: 'Bobina N°', value: metadata.reelNumber },
    { label: 'Puesta en Servicio', value: metadata.serviceStartDate },
    { label: 'Retiro', value: metadata.retirementDate },
    { label: 'N° Líneas', value: metadata.linesNumber },
    { label: 'Cambio', value: metadata.change },
    { label: 'Prof. Cambio Sarta', value: metadata.stringChangeDepth },
  ];

  const headers = [
    'Fecha', 'N° Carr.', 'Prof. Carr.', 'Operación', 'Dens. Lodo',
    'Peso Efect.', 'Diam.Ext', 'Peso Ef.P', 'Exceso', 'Long.P',
    'Fc', 'Fm', 'TKm Op.', 'TKm Ac.CC', 'Long.Corr.',
    'TKm Ac.Corte', 'Long.Corte', 'Long.Rem.',
  ];

  const colWidths = [
    '6%', '4%', '5%', '12%', '4%',
    '5%', '4%', '4%', '4%', '4%',
    '4%', '4%', '5%', '5%', '5%',
    '6%', '5%', '4%',
  ];

  // center all columns except index 3 (Operación)
  const centerCols = headers.map((_, i) => i).filter(i => i !== 3);

  const tableRows = rows.map(r => [
    r.date, r.runNumber, r.runDepth, r.operation, r.mudDensity,
    r.effectiveWeight, r.collarDiameter, r.collarWeight, r.excessWeight, r.collarLength,
    r.factorC, r.factorM, r.tonKmOperation, r.tonKmAccumLastRun, r.runLength,
    r.tonKmAccumLastCut, r.cutLength, r.remainingCableLength,
  ]);

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader title="REGISTRO DE TRABAJO DEL CABLE" code="POWWO011-A1-0" />
      <PdfFields fields={metaFields1} columns={4} />
      <PdfTable
        headers={headers}
        rows={tableRows}
        colWidths={colWidths}
        centerCols={centerCols}
      />
    </PdfDocument>
  );
};
