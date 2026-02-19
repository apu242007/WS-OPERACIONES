import React from 'react';
import { FBUChecklistReport } from '../types';
import { PdfDocument } from './PdfDocument';
import { PdfHeader } from './PdfHeader';
import { PdfFields } from './PdfFields';
import { PdfTable } from './PdfTable';
import { PdfSignatures } from './PdfSignatures';

interface Props {
  report: FBUChecklistReport;
}

const LEFT_COLUMN = [
  { title: '1.- PLUG CATCHER',         items: ['Valvulas y seguros','Corrosion excesiva','Bandeja ecologica','Conexionado'] },
  { title: '2.- CHOKE MANIFOLD',       items: ['Valvulas y seguros','Bandeja ecologica','Corrosion excesiva','Conexionado','Lineas de venteo'] },
  { title: '3.- SAND KNOCK OUT (DESARENADOR)', items: ['Escalera de acceso','Pisadera','Corrosion excesiva','Valvulas y seguros','Lineas de vida'] },
  { title: '4.- BOMBA KAYAK',          items: ['Arrestachispas en motor','Paro de emergencias en motores de bombas','Protecciones y guardacorreas en bombas','Puesta a tierra','Luces','Estabilizadores','Calzas','Rueda de auxilio','Neumaticos','Enganche y cadena seguridad','Tablero electrico'] },
  { title: '5.- USINA/LABORATORIO',    items: ['Arrestachispas de motor','Pare de emergencia usina a distancia','Tablero general y protección de comandos','Cables conductores y distribución','Luminarias','Cajas de conexión y sellos','Disyuntores diferenciales y protecciones térmicas','Puesta a tierra','Orden y Limpieza','Carteleria de seguridad','Luces de emergencia'] },
  { title: '6.- TANQUE DE GAS OIL / AGUA', items: ['Perdidas','Valvulas','Bandejas ecologicas','Conexionado electrico','Puesta a tierra','Orden y limpieza'] },
  { title: '7.- TRAILERS',             items: ['Estado general','Instalaciones eléctricas','Artefactos instalados','Iluminación','Sala de refrigerio/vestuario/oficina','Luces de emergencia','Puertas y ventanas','Puesta a tierra','Orden y limpieza'] },
];

const RIGHT_COLUMN = [
  { title: '8.- PROTECCIÓN PERSONAL',  items: ['Cascos','Botines de seguridad','Guantes de cuero','Guantes de P.V.C.','Indumentaria general','Protección ocular','Protección auditiva','Protección respiratoria','Arnes de Seguridad','Colas de amarre','Equipos Autonomos Rescate'] },
  { title: '9.- PRIMEROS AUXILIOS',    items: ['Botiquín','Camilla','Férulas neumoplásticas','Equipos lavaojos','Comunicación','Cuello de Philadelphia'] },
  { title: '10.- PREVENCION DE ACCIDENTES', items: ['Carteleria','Ubicacion extintores y autonomos','Puntos de reunion','Roles de emergencia','Orden y limpieza'] },
  { title: '11.- PROTECCION CONTRA INCENDIO', items: ['Minimo 10 Extintores PQS','Minimo 1 Extintor CO2','Espumigenos en Piletas','Detectores de humo'] },
  { title: '12.- ILUMINACION AUTONOMA', items: ['Neumaticos','Patas estabilizadoras','Luminarias','Enganche y cadenas','Tablero electrico','Puesta a tierra'] },
  { title: '13.- CONTROL AMBIENTAL',   items: ['Recipientes de residuos','Mantas ecologicas','Bandejas ecologicas'] },
  { title: '14.- PILETAS',             items: ['Luminarias','Pernos y seguros','Escalera de acceso','Barandas','Lineas del circuito','Valvulas y conexiones','Puesta a tierra','Orden y limpieza'] },
  { title: '15.- VARIOS',              items: ['Libro de visitas','Barrera de ingreso','Ingreso a locacion','Alarmas sonoras visibles','Orden y limpieza','Carteles de Ingreso a Locación','Carteles Indicador de Camino'] },
  { title: '16.- Cabina de control',   items: ['Puesta a tierra','Conexiones electricas','Conexiones hidraulicas','Luces de emergencia','Bocina','Luces','Orden y limpieza','Politicas y Roles'] },
];

const ALL_SECTIONS = [...LEFT_COLUMN, ...RIGHT_COLUMN];

const getUniqueId = (sectionTitle: string, itemName: string) => `${sectionTitle}_${itemName}`;

export const FBUChecklistPdf: React.FC<Props> = ({ report }) => {
  const { metadata, rows, observations, signatures } = report;

  const getStatus = (sectionTitle: string, item: string) => {
    const rowId = getUniqueId(sectionTitle, item);
    return rows.find(r => r.id === rowId)?.status || null;
  };

  const tableRows: string[][] = [];
  ALL_SECTIONS.forEach(section => {
    tableRows.push([`▶ ${section.title}`, '', '', '']);
    section.items.forEach(item => {
      const s = getStatus(section.title, item);
      tableRows.push([
        `    ${item}`,
        s === 'BIEN' ? '✓' : '',
        s === 'MAL'  ? '✕' : '',
        s === 'NC'   ? 'N/C' : '',
      ]);
    });
  });

  const obsRows = observations
    .filter(o => o.observation || o.responsible || o.compliance || o.date)
    .map(o => [o.observation || '', o.responsible || '', o.compliance || '', o.date || '']);

  return (
    <PdfDocument orientation="landscape">
      <PdfHeader title="CHECK LIST FBU" code="POWFB01-A1-1" />

      <PdfFields
        columns={3}
        fields={[
          { label: 'EMPRESA',              value: metadata.company },
          { label: 'N° FBU',               value: metadata.fbuNumber },
          { label: 'CAMPO',                value: metadata.field },
          { label: 'LOCACIÓN',             value: metadata.location },
          { label: 'FECHA',                value: metadata.date },
          { label: 'JEFE DE EQUIPO',       value: metadata.teamLeader },
          { label: 'INSPECCIONADO POR',    value: metadata.inspectedBy },
          { label: 'OPERACIÓN',            value: metadata.operation },
          { label: 'INSPECTOR CLIENTE',    value: metadata.clientInspector },
        ]}
      />

      <PdfTable
        headers={['ÍTEM', 'BIEN', 'MAL', 'N/C']}
        rows={tableRows}
        colWidths={['76%', '8%', '8%', '8%']}
        centerCols={[1, 2, 3]}
      />

      {obsRows.length > 0 && (
        <PdfTable
          headers={['OBSERVACIONES', 'RESPONSABLE', 'CUMPLIMIENTO', 'FECHA']}
          rows={obsRows}
          colWidths={['45%', '25%', '15%', '15%']}
          centerCols={[2, 3]}
        />
      )}

      <PdfSignatures signatures={[
        { label: 'JEFE DE EQUIPO',           data: signatures['teamLeader']?.data },
        { label: 'TÉCNICO EN SEGURIDAD',     data: signatures['safetyTech']?.data },
        { label: 'COMPANY REPRESENTATIVE',   data: signatures['companyRepresentative']?.data },
      ]} />
    </PdfDocument>
  );
};
