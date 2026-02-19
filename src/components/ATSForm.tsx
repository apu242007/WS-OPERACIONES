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
    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
      <input type="checkbox" checked={!!epp[field]} onChange={() => handleEppCheck(field)} className="w-3.5 h-3.5 accent-red-600" />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="bg-white max-w-5xl mx-auto p-4 print:p-0 text-xs" id="print-area">

      {/* HEADER - igual al resto de formularios */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
          <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl sm:text-2xl uppercase leading-tight">ANÁLISIS DE TRABAJO SEGURO (ATS)</h1>
          <div className="text-xs text-gray-500 mt-1">POSGI006-A1-0</div>
        </div>
        <div className="col-span-3 p-3 flex flex-col justify-center gap-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-bold w-16">N°:</span>
            <input name="numero" value={metadata.numero} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold w-16">Revisión:</span>
            <input name="revision" value={metadata.revision} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold w-16">Fecha:</span>
            <input type="date" name="fecha" value={metadata.fecha} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
          </div>
        </div>
      </div>

      {/* Sector / Equipo / Fecha */}
      <div className="grid grid-cols-3 border-b border-black">
        <div className="flex items-center border-r border-black p-2 gap-1">
          <span className="font-bold whitespace-nowrap">Sector:</span>
          <input name="sector" value={metadata.sector} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
        </div>
        <div className="flex items-center border-r border-black p-2 gap-1">
          <span className="font-bold whitespace-nowrap">Equipo:</span>
          <select name="equipo" value={(metadata as any).equipo || ''} onChange={handleMeta} className="flex-1 outline-none bg-transparent border-b border-gray-300">
            <option value="">-</option>
            {EQUIPOS.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="flex items-center p-2 gap-1">
          <span className="font-bold whitespace-nowrap">Fecha:</span>
          <input type="date" name="fecha" value={metadata.fecha} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
        </div>
      </div>

      {/* Tarea */}
      <div className="flex items-center border-b border-black p-2 gap-1">
        <span className="font-bold whitespace-nowrap">Tarea u operación:</span>
        <input name="tarea" value={metadata.tarea} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
      </div>

      {/* Elaborado / Revisado / Aprobado */}
      <div className="grid grid-cols-3 border-b border-black">
        <div className="border-r border-black p-2">
          <div className="flex gap-1 mb-1"><span className="font-bold whitespace-nowrap">Elaborado por:</span><input name="elaboradoPor" value={metadata.elaboradoPor} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" /></div>
          <div className="flex gap-1"><span className="font-bold">Función:</span><input name="funcionElab" value={metadata.funcionElab} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" /></div>
        </div>
        <div className="border-r border-black p-2">
          <div className="flex gap-1 mb-1"><span className="font-bold whitespace-nowrap">Revisado por:</span><input name="revisadoPor" value={metadata.revisadoPor} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" /></div>
          <div className="flex gap-1"><span className="font-bold">Función:</span><input name="funcionRev" value={metadata.funcionRev} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" /></div>
        </div>
        <div className="p-2">
          <div className="flex gap-1 mb-1"><span className="font-bold whitespace-nowrap">Aprobado por:</span><input name="aprobadoPor" value={metadata.aprobadoPor} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" /></div>
          <div className="flex gap-1"><span className="font-bold">Función:</span><input name="funcionApro" value={metadata.funcionApro} onChange={handleMeta} className="flex-1 outline-none border-b border-gray-300 bg-transparent" /></div>
        </div>
      </div>

      {/* EPP Header */}
      <div className="border-b border-black p-2 bg-gray-100 font-bold text-xs uppercase print:bg-transparent">
        Equipos de protección personal y protección industrial específicamente recomendado o requerido por la tarea:
      </div>

      {/* EPP Grid */}
      <div className="border-b border-black p-3 grid grid-cols-4 gap-x-6 gap-y-2">
        <CheckItem label="Casco" field="casco" />
        <CheckItem label="Guantes de PVC" field="guantesPVC" />
        <CheckItem label="Barbijos" field="barbijos" />
        <div className="flex items-center gap-1 text-xs col-span-1">
          <span className="font-bold whitespace-nowrap">Otros:</span>
          <input name="otrosEpp1" value={epp.otrosEpp1} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300 bg-transparent min-w-0" />
        </div>

        <CheckItem label="Bloqueo/rotulado" field="bloqueoRotulado" />
        <CheckItem label="Zapato de Seguridad" field="zapatoSeguridad" />
        <CheckItem label="Arnés de Seguridad" field="arnesSeguridad" />
        <CheckItem label="Protección respiratoria" field="proteccionRespiratoria" />

        <div className="col-span-4 flex items-center gap-1 text-xs">
          <span className="font-bold whitespace-nowrap">Otros:</span>
          <input name="otrosEpp2" value={epp.otrosEpp2} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300 bg-transparent" />
        </div>

        <CheckItem label="Anteojos de Seguridad" field="anteojos" />
        <CheckItem label="Protección facial" field="proteccionFacial" />
        <CheckItem label="Protección auditiva" field="proteccionAuditiva" />
        <div className="flex items-center gap-1 text-xs">
          <span className="font-bold whitespace-nowrap">Otros:</span>
          <input name="otrosEpp3" value={epp.otrosEpp3} onChange={handleEppText} className="flex-1 outline-none border-b border-gray-300 bg-transparent min-w-0" />
        </div>

        <CheckItem label="Guantes de Cuero" field="guantessCuero" />
        <CheckItem label="Detector de gases" field="detectorGases" />
        <CheckItem label="Careta de soldador" field="caretaSoldador" />
        <CheckItem label="Guantes dieléctricos" field="guantesDielectricos" />

        <CheckItem label="Permiso de Trabajo Requerido" field="permisoTrabajo" />
        <div className="flex items-center gap-1 text-xs col-span-3">
          <span className="font-bold whitespace-nowrap">Extintores Kg:</span>
          <input name="extintores" value={epp.extintores} onChange={handleEppText} className="w-24 outline-none border-b border-gray-300 bg-transparent" />
        </div>
      </div>

      {/* Tabla */}
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-200 print:bg-gray-200">
            <th className="border border-black p-2 w-1/4 text-left">Descripción de la tarea</th>
            <th className="border border-black p-2 w-1/4 text-left">Peligros/Aspectos potenciales</th>
            <th className="border border-black p-2 w-1/4 text-left">Riesgos/Impactos</th>
            <th className="border border-black p-2 w-1/4 text-left">Recomendaciones y pasos para eliminar o reducir los Peligros</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border border-black p-0 align-top">
                <textarea value={row.descripcion} onChange={e => handleRow(row.id, 'descripcion', e.target.value)} className="w-full p-2 outline-none resize-none h-20 bg-transparent" />
              </td>
              <td className="border border-black p-0 align-top">
                <textarea value={row.peligros} onChange={e => handleRow(row.id, 'peligros', e.target.value)} className="w-full p-2 outline-none resize-none h-20 bg-transparent" />
              </td>
              <td className="border border-black p-0 align-top">
                <textarea value={row.riesgos} onChange={e => handleRow(row.id, 'riesgos', e.target.value)} className="w-full p-2 outline-none resize-none h-20 bg-transparent" />
              </td>
              <td className="border border-black p-0 align-top relative">
                <textarea value={row.recomendaciones} onChange={e => handleRow(row.id, 'recomendaciones', e.target.value)} className="w-full p-2 outline-none resize-none h-20 bg-transparent" />
                {rows.length > 1 && (
                  <button onClick={() => removeRow(row.id)} className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-lg leading-none no-print" title="Eliminar fila">×</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add row */}
      <div className="no-print mt-3">
        <Button variant="secondary" onClick={addRow}>+ Agregar fila</Button>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4 no-print">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <div className="flex gap-2">
          <ExportPdfButton elementId="print-area" filename="ATS" />
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};
