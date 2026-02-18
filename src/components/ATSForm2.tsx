import React, { useState } from 'react';
import { ATSReport, ATSMetadata, ATSEpp, ATSRow } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ATSReport;
  onSave: (report: ATSReport) => void;
  onCancel: () => void;
}

const EQUIPOS = ['tacker01','tacker05','tacker06','tacker07','tacker08','tacker10','tacker11','mase01','mase02','mase03','mase04'];

const defaultEpp: ATSEpp = {
  casco: false, guantesPVC: false, barbijos: false, otrosEpp1: '',
  bloqueoRotulado: false, zapatoSeguridad: false, arnesSeguridad: false, proteccionRespiratoria: false, otrosEpp2: '',
  anteojos: false, proteccionFacial: false, proteccionAuditiva: false, otrosEpp3: '',
  guantessCuero: false, detectorGases: false, caretaSoldador: false, guantesDielectricos: false,
  permisoTrabajo: false, extintores: ''
};

const defaultRow = (): ATSRow => ({ id: crypto.randomUUID(), descripcion: '', peligros: '', riesgos: '', recomendaciones: '' });

export const ATSForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ATSMetadata>(initialData?.metadata || {
    numero: '', revision: '', fecha: new Date().toISOString().split('T')[0],
    sector: '', tarea: '', elaboradoPor: '', funcionElab: '',
    revisadoPor: '', funcionRev: '', aprobadoPor: '', funcionApro: ''
  });
  const [epp, setEpp] = useState<ATSEpp>(initialData?.epp || defaultEpp);
  const [rows, setRows] = useState<ATSRow[]>(initialData?.rows || [defaultRow(), defaultRow(), defaultRow()]);

  const handleMeta = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleEppCheck = (name: keyof ATSEpp) => {
    setEpp(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleEppText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEpp(prev => ({ ...prev, [name]: value }));
  };

  const handleRow = (id: string, field: keyof ATSRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(prev => [...prev, defaultRow()]);
  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const handleSave = () => {
    const report: ATSReport = { id: initialData?.id || crypto.randomUUID(), metadata, epp, rows };
    onSave(report);
  };

  const CheckItem = ({ label, field }: { label: string; field: keyof ATSEpp }) => (
    <label className="flex items-center gap-1 cursor-pointer text-xs">
      <input type="checkbox" checked={!!epp[field]} onChange={() => handleEppCheck(field)} className="w-3 h-3" />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="bg-white max-w-5xl mx-auto p-2 text-xs print:p-0" id="print-area">
      {/* Header */}
      <div className="flex items-center border border-black mb-0">
        <div className="w-24 h-16 border-r border-black flex items-center justify-center font-bold text-red-700 text-lg">WS</div>
        <div className="flex-1 text-center border-r border-black py-2">
          <div className="font-bold text-sm uppercase">Análisis de Trabajo Seguro (ATS)</div>
          <div className="text-xs text-gray-600">POSGI006-A1-0</div>
        </div>
        <div className="w-48 p-1 text-xs">
          <div className="flex gap-1"><span className="font-bold">N°:</span><input name="numero" value={metadata.numero} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
          <div className="flex gap-1"><span className="font-bold">Revisión:</span><input name="revision" value={metadata.revision} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
          <div className="flex gap-1"><span className="font-bold">Fecha:</span><input type="date" name="fecha" value={metadata.fecha} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
        </div>
      </div>

      {/* Sector / Fecha / Equipo */}
      <div className="grid grid-cols-3 border border-t-0 border-black">
        <div className="flex border-r border-black p-1"><span className="font-bold mr-1">Sector:</span><input name="sector" value={metadata.sector} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
        <div className="flex border-r border-black p-1"><span className="font-bold mr-1">Equipo:</span>
          <select name="equipo" value={(metadata as any).equipo || ''} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300">
            <option value="">-</option>
            {EQUIPOS.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="flex p-1"><span className="font-bold mr-1">Fecha:</span><input type="date" name="fecha" value={metadata.fecha} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
      </div>

      {/* Tarea */}
      <div className="border border-t-0 border-black p-1 flex">
        <span className="font-bold mr-1 whitespace-nowrap">Tarea u operación:</span>
        <input name="tarea" value={metadata.tarea} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" />
      </div>

      {/* Elaborado / Revisado / Aprobado */}
      <div className="grid grid-cols-3 border border-t-0 border-black text-xs">
        <div className="border-r border-black p-1">
          <div className="flex"><span className="font-bold mr-1 whitespace-nowrap">Elaborado por:</span><input name="elaboradoPor" value={metadata.elaboradoPor} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
          <div className="flex mt-1"><span className="font-bold mr-1">Función:</span><input name="funcionElab" value={metadata.funcionElab} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
        </div>
        <div className="border-r border-black p-1">
          <div className="flex"><span className="font-bold mr-1 whitespace-nowrap">Revisado por:</span><input name="revisadoPor" value={metadata.revisadoPor} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
          <div className="flex mt-1"><span className="font-bold mr-1">Función:</span><input name="funcionRev" value={metadata.funcionRev} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
        </div>
        <div className="p-1">
          <div className="flex"><span className="font-bold mr-1 whitespace-nowrap">Aprobado por:</span><input name="aprobadoPor" value={metadata.aprobadoPor} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
          <div className="flex mt-1"><span className="font-bold mr-1">Función:</span><input name="funcionApro" value={metadata.funcionApro} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300" /></div>
        </div>
      </div>

      {/* EPP Header */}
      <div className="border border-t-0 border-black p-1 bg-gray-100 font-bold text-xs uppercase">
        Equipos de protección personal y protección industrial específicamente recomendado o requerido por la tarea:
      </div>

      {/* EPP Grid */}
      <div className="border border-t-0 border-black p-2 grid grid-cols-4 gap-x-4 gap-y-1">
        <CheckItem label="Casco" field="casco" />
        <CheckItem label="Guantes de PVC" field="guantesPVC" />
        <CheckItem label="Barbijos" field="barbijos" />
        <div className="flex items-center gap-1 text-xs"><span className="font-bold">Otros:</span><input name="otrosEpp1" value={epp.otrosEpp1} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300" /></div>

        <CheckItem label="Bloqueo/rotulado" field="bloqueoRotulado" />
        <CheckItem label="Zapato de Seguridad" field="zapatoSeguridad" />
        <CheckItem label="Arnés de Seguridad" field="arnesSeguridad" />
        <CheckItem label="Protección respiratoria" field="proteccionRespiratoria" />

        <div className="col-span-4 flex items-center gap-1 text-xs"><span className="font-bold">Otros:</span><input name="otrosEpp2" value={epp.otrosEpp2} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300" /></div>

        <CheckItem label="Anteojos de Seguridad" field="anteojos" />
        <CheckItem label="Protección facial" field="proteccionFacial" />
        <CheckItem label="Protección auditiva" field="proteccionAuditiva" />
        <div className="flex items-center gap-1 text-xs"><span className="font-bold">Otros:</span><input name="otrosEpp3" value={epp.otrosEpp3} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300" /></div>

        <CheckItem label="Guantes de Cuero" field="guantessCuero" />
        <CheckItem label="Detector de gases" field="detectorGases" />
        <CheckItem label="Careta de soldador" field="caretaSoldador" />
        <CheckItem label="Guantes dieléctricos" field="guantesDielectricos" />

        <CheckItem label="Permiso de Trabajo Requerido" field="permisoTrabajo" />
        <div className="flex items-center gap-1 text-xs col-span-3"><span className="font-bold whitespace-nowrap">Extintores Kg:</span><input name="extintores" value={epp.extintores} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300" /></div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-t-0 border-black text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-1 w-1/4">Descripción de la tarea</th>
            <th className="border border-black p-1 w-1/4">Peligros/Aspectos potenciales</th>
            <th className="border border-black p-1 w-1/4">Riesgos/Impactos</th>
            <th className="border border-black p-1 w-1/4">Recomendaciones y pasos para eliminar o reducir los Peligros</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id}>
              <td className="border border-black p-0"><textarea value={row.descripcion} onChange={e => handleRow(row.id, 'descripcion', e.target.value)} className="w-full p-1 outline-none resize-none h-16" /></td>
              <td className="border border-black p-0"><textarea value={row.peligros} onChange={e => handleRow(row.id, 'peligros', e.target.value)} className="w-full p-1 outline-none resize-none h-16" /></td>
              <td className="border border-black p-0"><textarea value={row.riesgos} onChange={e => handleRow(row.id, 'riesgos', e.target.value)} className="w-full p-1 outline-none resize-none h-16" /></td>
              <td className="border border-black p-0 relative">
                <textarea value={row.recomendaciones} onChange={e => handleRow(row.id, 'recomendaciones', e.target.value)} className="w-full p-1 outline-none resize-none h-16" />
                {rows.length > 1 && (
                  <button onClick={() => removeRow(row.id)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 p-0.5 no-print" title="Eliminar fila">×</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add row */}
      <div className="no-print mt-2">
        <Button variant="secondary" onClick={addRow}>+ Agregar fila</Button>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4 no-print">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <div className="flex gap-2">
          <ExportPdfButton targetId="print-area" filename="ATS" />
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};
