
import React, { useState } from 'react';
import { IPCRReport, IPCRMetadata, IPCRRiskRow, IPCREPP, IPCRSignatures } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: IPCRReport;
  onSave: (report: IPCRReport) => void;
  onCancel: () => void;
}

const EmptyRow = (): IPCRRiskRow => ({
  id: crypto.randomUUID(),
  activitySteps: '',
  subTask: '',
  hazards: '',
  lossCategory: '',
  legalRequirement: null,
  initialProb: '',
  initialSev: '',
  initialRisk: '',
  preventiveMeasures: '',
  checkPreventive: false,
  mitigationMeasures: '',
  checkMitigation: false,
  residualProb: '',
  residualSev: '',
  residualRisk: ''
});

const EPP_GROUPS = [
  {
    title: 'Trabajo en Altura',
    items: [
      { id: 'arnes', label: 'Arnés seguridad integral' },
      { id: 'doble_cabo', label: 'Doble cabo vida (c/abs)' },
      { id: 'linea_vida', label: 'Línea de vida horiz/vert' },
      { id: 'cabo_vida_auto', label: 'Cabo vida (mosq. auto)' },
      { id: 'descensor', label: 'Descensor tipo 8 / ID' },
      { id: 'silleta', label: 'Silleta de suspensión' },
      { id: 'cuerda', label: 'Cuerda semiestática' },
      { id: 'casco_altura', label: 'Casco p/tareas altura' },
    ]
  },
  {
    title: 'Seguridad / Sujeción',
    items: [
      { id: 'casco_seguridad', label: 'Casco seguridad (Clase E)' },
      { id: 'casco_rescate', label: 'Casco rescate/confinado' },
      { id: 'eslingas', label: 'Eslingas / Conectores' },
      { id: 'anticaidas', label: 'Anticaídas retráctil' },
    ]
  },
  {
    title: 'Prot. Ocular / Facial',
    items: [
      { id: 'anteojos', label: 'Anteojos seguridad' },
      { id: 'antiparras', label: 'Antiparras (polvo/quím)' },
      { id: 'careta_facial', label: 'Careta facial completa' },
      { id: 'careta_esmerilador', label: 'Careta esmerilador' },
      { id: 'mascara_visor', label: 'Máscara visor integrado' },
    ]
  },
  {
    title: 'Prot. Respiratoria',
    items: [
      { id: 'barbijo', label: 'Barbijo descartable' },
      { id: 'respirador_media', label: 'Respirador media cara' },
      { id: 'respirador_full', label: 'Respirador full face' },
      { id: 'filtros', label: 'Filtros (gases/vapores)' },
      { id: 'era', label: 'Equipo autónomo (ERA)' },
      { id: 'linea_aire', label: 'Equipo aire línea/cascada' },
      { id: 'escafandra', label: 'Escafandra arenado' },
    ]
  },
  {
    title: 'Indumentaria Especial',
    items: [
      { id: 'ropa_ignifuga', label: 'Ropa ignífuga certif.' },
      { id: 'ropa_trabajo', label: 'Ropa trabajo estándar' },
      { id: 'ropa_soldador', label: 'Ropa soldador (cuero)' },
      { id: 'ropa_impermeable', label: 'Ropa impermeable' },
      { id: 'ropa_descartable', label: 'Ropa descartable (Tyvek)' },
      { id: 'ropa_termica', label: 'Ropa térmica / abrigo' },
      { id: 'traje_bombero', label: 'Traje bombero' },
      { id: 'traje_hidrocarb', label: 'Traje emerg. hidrocarb.' },
    ]
  },
  {
    title: 'Calzado Seguridad',
    items: [
      { id: 'botin', label: 'Botín c/puntera' },
      { id: 'calzado_dielectrico', label: 'Calzado dieléctrico' },
      { id: 'botas_goma', label: 'Botas goma / PVC' },
    ]
  },
  {
    title: 'Protección Manos',
    items: [
      { id: 'guantes_cuero', label: 'Guantes cuero' },
      { id: 'guantes_impacto', label: 'Guantes impacto' },
      { id: 'guantes_quimicos', label: 'Guantes químicos' },
      { id: 'guantes_dielectricos', label: 'Guantes dieléctricos' },
      { id: 'guantes_anticorte', label: 'Guantes anticorte' },
      { id: 'guantes_soldadura', label: 'Guantes soldadura' },
      { id: 'guantes_descartables', label: 'Guantes descartables' },
    ]
  },
  {
    title: 'Protección Auditiva',
    items: [
      { id: 'tapones', label: 'Tapones auditivos' },
      { id: 'orejeras', label: 'Orejeras alta atenuación' },
      { id: 'sist_combinados', label: 'Sistemas combinados' },
    ]
  },
  {
    title: 'Otros / Complem.',
    items: [
      { id: 'polainas', label: 'Polainas seguridad' },
      { id: 'rodilleras', label: 'Rodilleras' },
      { id: 'prot_solar', label: 'Protección solar' },
      { id: 'chaleco', label: 'Chaleco reflectivo' },
      { id: 'arnes_rescate', label: 'Arnés de rescate' },
    ]
  }
];

export const IPCRForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<IPCRMetadata>(initialData?.metadata || {
    task: '',
    evaluatorTeam: '',
    ipcrNumber: '',
    subtask: '',
    location: '',
    res5197: 'NO',
    artDate: '',
    creationDate: new Date().toISOString().split('T')[0],
    safetyResponsible: 'Lic. Jorge Esteban Castro - Gerente QHSE',
    executionDate: new Date().toISOString().split('T')[0],
    revision: '05',
    sheet: '1 de 1',
    contractor: 'TACKER SRL',
    criticalTask: null,
    workPermit: null,
    otherIpcr: ''
  });

  const [rows, setRows] = useState<IPCRRiskRow[]>(initialData?.rows || [
    EmptyRow(), EmptyRow(), EmptyRow()
  ]);

  const [epp, setEpp] = useState<IPCREPP>(initialData?.epp || {});
  
  const [signatures, setSignatures] = useState<IPCRSignatures>(initialData?.signatures || {
    receiverName: '',
    approverName: '',
    shiName: ''
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof IPCRRiskRow, value: any) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        if (['initialProb', 'initialSev'].includes(field as string)) {
          const p = parseInt(updated.initialProb) || 0;
          const s = parseInt(updated.initialSev) || 0;
          updated.initialRisk = (p * s).toString();
        }
        if (['residualProb', 'residualSev'].includes(field as string)) {
          const p = parseInt(updated.residualProb) || 0;
          const s = parseInt(updated.residualSev) || 0;
          updated.residualRisk = (p * s).toString();
        }
        return updated;
      }
      return row;
    }));
  };

  const addRow = () => setRows(prev => [...prev, EmptyRow()]);
  const removeRow = (id: string) => {
    if (rows.length > 1) setRows(prev => prev.filter(r => r.id !== id));
  };
  const toggleEpp = (id: string) => setEpp(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSignatureDataChange = (role: 'receiver' | 'approver' | 'shi', dataUrl: string | undefined) => {
    setSignatures(prev => {
      const next = { ...prev };
      if (dataUrl) {
        next[role] = { data: dataUrl, timestamp: new Date().toISOString() };
      } else {
        delete next[role];
      }
      return next;
    });
  };

  const handleSignatureNameChange = (role: 'receiverName' | 'approverName' | 'shiName', name: string) => {
    setSignatures(prev => ({ ...prev, [role]: name }));
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header with Logo and Title */}
      <div className="bg-blue-900 text-white p-2 flex items-center">
         <div className="w-1/4 font-black text-xl sm:text-2xl italic tracking-tighter">TACKER</div>
         <div className="w-3/4 text-center font-bold text-base sm:text-lg uppercase">Identificación de Peligros y Control de Riesgos</div>
      </div>

      {/* Metadata Form - Responsive Grid */}
      <div className="border border-black grid grid-cols-1 md:grid-cols-2">
         {/* Left Col */}
         <div className="md:border-r border-black">
            <div className="flex border-b border-gray-300">
               <span className="w-32 md:w-48 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Tarea / Actividad:</span>
               <input name="task" value={metadata.task} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
            </div>
            <div className="flex border-b border-gray-300">
               <span className="w-24 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Subtarea:</span>
               <input name="subtask" value={metadata.subtask} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
            </div>
            <div className="flex border-b border-black">
               <span className="w-32 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Lugar ejecución:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
            </div>
            
            <div className="flex border-b border-gray-300">
               <span className="w-32 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Fecha confección:</span>
               <input type="date" name="creationDate" value={metadata.creationDate} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
            </div>
            <div className="flex border-b border-black">
               <span className="w-32 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Fecha ejecución:</span>
               <input type="date" name="executionDate" value={metadata.executionDate} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
            </div>

            <div className="flex border-b border-black">
               <div className="flex-1 flex border-r border-gray-300">
                  <span className="w-16 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Revisión:</span>
                  <input name="revision" value={metadata.revision} onChange={handleMetadataChange} className="flex-1 outline-none px-1 text-center py-1" />
               </div>
               <div className="flex-1 flex">
                  <span className="w-32 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Cant. Hojas:</span>
                  <input name="sheet" value={metadata.sheet} onChange={handleMetadataChange} className="flex-1 outline-none px-1 text-center py-1" />
               </div>
            </div>

            <div className="p-1.5">
               <div className="flex items-center gap-4 mb-1">
                  <span className="font-medium text-[10px]">Tarea Crítica:</span>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="criticalTask" checked={metadata.criticalTask === 'SI'} onChange={() => setMetadata({...metadata, criticalTask: 'SI'})} /> SI</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="criticalTask" checked={metadata.criticalTask === 'NO'} onChange={() => setMetadata({...metadata, criticalTask: 'NO'})} /> NO</label>
               </div>
               <div className="flex items-center gap-4">
                  <span className="font-medium text-[10px]">Permiso Trabajo:</span>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="workPermit" checked={metadata.workPermit === 'SI'} onChange={() => setMetadata({...metadata, workPermit: 'SI'})} /> SI</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="workPermit" checked={metadata.workPermit === 'NO'} onChange={() => setMetadata({...metadata, workPermit: 'NO'})} /> NO</label>
               </div>
            </div>
         </div>

         {/* Right Col */}
         <div>
            <div className="flex border-b border-black">
               <span className="w-32 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Equipo Eval.:</span>
               <input name="evaluatorTeam" value={metadata.evaluatorTeam} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
               <div className="border-l border-black pl-1 flex items-center">
                  <span className="bg-gray-100 print:bg-transparent font-medium mr-1 text-[10px] p-1">N° IPCR:</span>
                  <input name="ipcrNumber" value={metadata.ipcrNumber} onChange={handleMetadataChange} className="w-16 outline-none py-1" />
               </div>
            </div>
            
            <div className="border-b border-black">
               <div className="flex border-b border-gray-300">
                  <span className="w-48 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Res. 51/97?</span>
                  <input name="res5197" value={metadata.res5197} onChange={handleMetadataChange} className="w-12 outline-none px-1 py-1" />
               </div>
               <div className="flex">
                  <span className="w-48 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">ART/Fecha:</span>
                  <input name="artDate" value={metadata.artDate} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
               </div>
            </div>

            <div className="border-b border-black">
               <div className="p-1 font-medium bg-gray-100 print:bg-transparent border-b border-gray-300 text-[10px]">Resp. Seguridad / Matrícula:</div>
               <input name="safetyResponsible" value={metadata.safetyResponsible} onChange={handleMetadataChange} className="w-full p-1 outline-none" />
            </div>

            <div className="flex border-b border-black">
               <span className="w-48 p-1 font-medium bg-gray-100 print:bg-transparent text-[10px] flex items-center">Contratista:</span>
               <input name="contractor" value={metadata.contractor} onChange={handleMetadataChange} className="flex-1 outline-none px-1 py-1" />
            </div>

            <div className="flex p-1">
               <span className="font-medium mr-2 text-[10px] p-1">Otros IPCR:</span>
               <input name="otherIpcr" value={metadata.otherIpcr} onChange={handleMetadataChange} className="flex-1 outline-none py-1" />
            </div>
         </div>
      </div>

      {/* Main Risk Table - Optimized for density & mobile scroll */}
      <div className="overflow-x-auto w-full border-l border-r border-black mt-[-1px]">
         <table className="w-full border-collapse border-b border-black min-w-[1400px] table-fixed">
            <colgroup>
               {/* 1. Pasos */} <col className="w-32" />
               {/* 2. Subtarea */} <col className="w-24" />
               {/* 3. Peligros */} <col className="w-32" />
               {/* 4. Perdidas */} <col className="w-24" />
               {/* 5. Req */} <col className="w-8" />
               {/* 6. Prob */} <col className="w-8" />
               {/* 7. Sev */} <col className="w-8" />
               {/* 8. Risk */} <col className="w-10" />
               {/* 9. Prev */} <col className="w-48" />
               {/* 10. Chk */} <col className="w-6" />
               {/* 11. Mitig */} <col className="w-48" />
               {/* 12. Chk */} <col className="w-6" />
               {/* 13. Prob */} <col className="w-8" />
               {/* 14. Sev */} <col className="w-8" />
               {/* 15. Risk */} <col className="w-10" />
               {/* 16. Del */} <col className="w-6" />
            </colgroup>
            <thead>
               <tr className="bg-blue-900 text-white text-center font-bold h-6 text-[10px]">
                  <th colSpan={2} className="border-r border-white">Tarea</th>
                  <th colSpan={2} className="border-r border-white">Peligros</th>
                  <th className="border-r border-white"></th>
                  <th colSpan={3} className="border-r border-white">Riesgo Inicial</th>
                  <th colSpan={4} className="border-r border-white">Medidas de Control</th>
                  <th colSpan={3}>Riesgo Residual</th>
                  <th className="bg-white no-print"></th>
               </tr>
               <tr className="bg-gray-200 text-center font-bold text-[8px] h-8 border-b border-black">
                  <th className="border-r border-black p-0.5">Pasos actividad</th>
                  <th className="border-r border-black p-0.5">SUB Tarea</th>
                  <th className="border-r border-black p-0.5">Peligros</th>
                  <th className="border-r border-black p-0.5">Cat. pérdidas</th>
                  <th className="border-r border-black p-0"><div className="transform -rotate-90 whitespace-nowrap">Legal</div></th>
                  
                  <th className="border-r border-black p-0"><div className="transform -rotate-90">Prob</div></th>
                  <th className="border-r border-black p-0"><div className="transform -rotate-90">Sev</div></th>
                  <th className="border-r border-black p-0.5 bg-yellow-100">Nivel</th>
                  
                  <th className="border-r border-black p-0.5">Medidas Prevención (reducir prob)</th>
                  <th className="border-r border-black p-0">Ok</th>
                  <th className="border-r border-black p-0.5">Medidas Mitigación (reducir cons)</th>
                  <th className="border-r border-black p-0">Ok</th>

                  <th className="border-r border-black p-0"><div className="transform -rotate-90">Prob</div></th>
                  <th className="border-r border-black p-0"><div className="transform -rotate-90">Sev</div></th>
                  <th className="bg-green-100 p-0.5">Nivel</th>
                  
                  <th className="no-print bg-white"></th>
               </tr>
            </thead>
            <tbody>
               {rows.map((row) => (
                  <tr key={row.id} className="border-b border-black hover:bg-gray-50 text-[9px] align-top">
                     <td className="border-r border-black p-0 h-full"><textarea rows={3} className="w-full h-full p-0.5 outline-none resize-none bg-transparent" value={row.activitySteps} onChange={e => handleRowChange(row.id, 'activitySteps', e.target.value)} /></td>
                     <td className="border-r border-black p-0 h-full"><textarea rows={3} className="w-full h-full p-0.5 outline-none resize-none bg-transparent" value={row.subTask} onChange={e => handleRowChange(row.id, 'subTask', e.target.value)} /></td>
                     <td className="border-r border-black p-0 h-full"><textarea rows={3} className="w-full h-full p-0.5 outline-none resize-none bg-transparent" value={row.hazards} onChange={e => handleRowChange(row.id, 'hazards', e.target.value)} /></td>
                     <td className="border-r border-black p-0 h-full"><textarea rows={3} className="w-full h-full p-0.5 outline-none resize-none bg-transparent" value={row.lossCategory} onChange={e => handleRowChange(row.id, 'lossCategory', e.target.value)} /></td>
                     
                     <td className="border-r border-black p-0 text-center align-middle">
                        <select className="w-full bg-transparent outline-none text-[8px]" value={row.legalRequirement || ''} onChange={e => handleRowChange(row.id, 'legalRequirement', e.target.value)}>
                           <option value=""></option>
                           <option value="SI">S</option>
                           <option value="NO">N</option>
                        </select>
                     </td>

                     <td className="border-r border-black p-0 align-middle"><input className="w-full text-center outline-none bg-transparent" type="number" min="1" max="5" value={row.initialProb} onChange={e => handleRowChange(row.id, 'initialProb', e.target.value)} /></td>
                     <td className="border-r border-black p-0 align-middle"><input className="w-full text-center outline-none bg-transparent" type="number" min="1" max="5" value={row.initialSev} onChange={e => handleRowChange(row.id, 'initialSev', e.target.value)} /></td>
                     <td className="border-r border-black p-0 bg-yellow-50 text-center font-bold align-middle">{row.initialRisk}</td>

                     <td className="border-r border-black p-0 h-full"><textarea rows={3} className="w-full h-full p-0.5 outline-none resize-none bg-transparent" value={row.preventiveMeasures} onChange={e => handleRowChange(row.id, 'preventiveMeasures', e.target.value)} /></td>
                     <td className="border-r border-black p-0 text-center align-middle"><input type="checkbox" checked={row.checkPreventive} onChange={e => handleRowChange(row.id, 'checkPreventive', e.target.checked)} /></td>
                     
                     <td className="border-r border-black p-0 h-full"><textarea rows={3} className="w-full h-full p-0.5 outline-none resize-none bg-transparent" value={row.mitigationMeasures} onChange={e => handleRowChange(row.id, 'mitigationMeasures', e.target.value)} /></td>
                     <td className="border-r border-black p-0 text-center align-middle"><input type="checkbox" checked={row.checkMitigation} onChange={e => handleRowChange(row.id, 'checkMitigation', e.target.checked)} /></td>

                     <td className="border-r border-black p-0 align-middle"><input className="w-full text-center outline-none bg-transparent" type="number" min="1" max="5" value={row.residualProb} onChange={e => handleRowChange(row.id, 'residualProb', e.target.value)} /></td>
                     <td className="border-r border-black p-0 align-middle"><input className="w-full text-center outline-none bg-transparent" type="number" min="1" max="5" value={row.residualSev} onChange={e => handleRowChange(row.id, 'residualSev', e.target.value)} /></td>
                     <td className="p-0 bg-green-50 text-center font-bold align-middle">{row.residualRisk}</td>
                     
                     <td className="no-print p-0 text-center align-middle">
                        <button onClick={() => removeRow(row.id)} className="text-red-500 font-bold hover:bg-red-50 w-full h-full flex items-center justify-center text-lg leading-none">×</button>
                     </td>
                  </tr>
               ))}
               <tr className="no-print">
                  <td colSpan={16} className="p-2 bg-gray-100 text-center border-t border-black">
                     <button onClick={addRow} className="text-brand-red font-bold text-xs uppercase hover:underline">+ Agregar Fila de Riesgo</button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      {/* EPP Section */}
      <div className="border border-black border-t-0 bg-gray-100 text-center font-bold text-[10px] p-1 uppercase">
         ELEMENTOS DE PROTECCION PERSONAL (EPP)
      </div>
      <div className="border border-black border-t-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 text-[9px]">
         {EPP_GROUPS.map((group, idx) => (
            <div key={idx} className="border-r border-black border-b lg:border-b-0 last:border-r-0 last:border-b-0">
               <div className="font-bold text-center border-b border-black bg-gray-50 p-1 h-8 flex items-center justify-center leading-tight">
                  {group.title}
               </div>
               <div className="p-1 space-y-1">
                  {group.items.map(item => (
                     <div key={item.id} className="flex items-start gap-1 cursor-pointer" onClick={() => toggleEpp(item.id)}>
                        <div 
                           className={`w-3 h-3 border border-black flex-shrink-0 flex items-center justify-center ${epp[item.id] ? 'bg-black text-white' : 'bg-white'}`}
                        >
                           {epp[item.id] && 'X'}
                        </div>
                        <span className="leading-tight select-none">{item.label}</span>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>

      {/* Footer Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-black border-t-0">
         {/* Validation TACKER */}
         <div className="border-b md:border-b-0 md:border-r border-black p-2 flex flex-col justify-between min-h-[120px]">
            <div className="font-bold text-center mb-4">Validación por<br/>TACKER S.A.</div>
            <div className="text-center h-20 flex items-end justify-center">
                {/* Space for stamp/signature */}
            </div>
         </div>

         {/* Receiver */}
         <div className="border-b md:border-b-0 md:border-r border-black p-2 flex flex-col justify-between min-h-[120px]">
            <div className="font-bold text-center border-b border-gray-300 pb-1 mb-2">Apellido y Nombre<br/>Legajo ó DNI</div>
            <input 
               placeholder="Nombre y Apellido" 
               className="w-full text-center outline-none text-[10px] mb-2 p-1 border border-gray-100 rounded"
               value={signatures.receiverName || ''}
               onChange={e => handleSignatureNameChange('receiverName', e.target.value)}
            />
            <div className="flex-1 flex flex-col justify-end items-center">
                <SignaturePad 
                   label="" 
                   value={signatures.receiver?.data} 
                   onChange={(val) => handleSignatureDataChange('receiver', val)}
                   className="h-16 w-48 border-0"
                />
                <div className="text-[9px] font-bold mt-1">Firma y Fecha de Recepción</div>
            </div>
         </div>

         {/* Approver & SHI */}
         <div className="flex flex-col min-h-[120px]">
            <div className="flex-1 border-b border-black p-2 flex flex-col justify-between">
               <div className="font-bold text-center mb-1">Aprobó por la Contratista<br/>Apellido y Nombre RT / DNI</div>
               <input 
                  placeholder="Nombre y Apellido" 
                  className="w-full text-center outline-none text-[10px] mb-1 p-1 border border-gray-100 rounded"
                  value={signatures.approverName || ''}
                  onChange={e => handleSignatureNameChange('approverName', e.target.value)}
               />
               <div className="flex flex-col items-center">
                   <SignaturePad 
                      label="" 
                      value={signatures.approver?.data} 
                      onChange={(val) => handleSignatureDataChange('approver', val)}
                      className="h-12 w-40 border-0"
                   />
                   <div className="text-[9px] font-bold">Firma y Fecha</div>
               </div>
            </div>
            <div className="flex-1 p-2 flex flex-col justify-between">
               <div className="font-bold text-center mb-1">Visado SHI<br/>Matrícula</div>
               <input 
                  placeholder="Nombre y Matrícula" 
                  className="w-full text-center outline-none text-[10px] mb-1 p-1 border border-gray-100 rounded"
                  value={signatures.shiName || ''}
                  onChange={e => handleSignatureNameChange('shiName', e.target.value)}
               />
               <div className="flex flex-col items-center">
                   <SignaturePad 
                      label="" 
                      value={signatures.shi?.data} 
                      onChange={(val) => handleSignatureDataChange('shi', val)}
                      className="h-12 w-40 border-0"
                   />
                   <div className="text-[9px] font-bold">Firma</div>
               </div>
            </div>
         </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50 sm:justify-end">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`ipcr_${metadata.ipcrNumber}_${metadata.executionDate}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows,
              epp,
              signatures
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar IPCR
           </Button>
        </div>

    </div>
  );
};
