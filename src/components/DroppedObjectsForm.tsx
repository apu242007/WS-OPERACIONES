
import React, { useState } from 'react';
import { DroppedObjectsReport, DroppedObjectsMetadata, DroppedObjectsRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: DroppedObjectsReport;
  onSave: (report: DroppedObjectsReport) => void;
  onCancel: () => void;
}

const ITEMS = [
  "Verificar el aseguramiento de la Baliza del Equipo. Encendido y/o intermitencia de la baliza?",
  "Chequear los pernos y seguros varios del Aparejo del Equipo, aseguramiento correcto?",
  "Verificar planilla de Inspección de Elementos para Trabajos y Rescate en Altura POSGI015-A1-0?",
  "Verificar ojales, pernos y seguros inferior y superior de pistón principal?",
  "Verificar el estado de los peines en el Piso de Enganche y su aseguramiento?",
  "Chequear todos los grilletes, pasadores y seguros de las eslingas del Piso de Enganche?",
  "Verificar el estado de la compuerta y triangulo del aseguramiento del Pirosalva?",
  "Estado de cable, guardacabo, seguro y gancho del guinche del equipo, aseguramiento correcto?",
  "Verificar la correcta colocación de todos los pernos, tuercas y seguros en la corona?",
  "Chequear la colocación de los seguros (alfiler-chaveta) de elevadores y ámelas en el aparejo?",
  "Verificar que todos las luminarias en la Torre estén aseguradas correctamente (eslinga)?",
  "Chequear el estado de las eslingas y grampas colocadas en la linea del stand pipe y manguerote?",
  "Verificar que seguros, y pernos estén colocados en la cabeza de circulación o power swivel?",
  "Control visual de poleas, eslingas y cabrestantes montados sobre la corona?"
];

export const DroppedObjectsForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<DroppedObjectsMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    well: ''
  });

  const [rows, setRows] = useState<DroppedObjectsRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    return ITEMS.map((desc, index) => ({
      id: crypto.randomUUID(),
      description: `${index + 1}. ${desc}`,
      status: null,
      observations: ''
    }));
  });

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof DroppedObjectsRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (role: 'rigManager' | 'shiftLeader', dataUrl: string | undefined) => {
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

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-xl uppercase leading-tight">CHECK LIST DE CAÍDAS DE OBJETOS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>PO-WSG-020-A1-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">FECHA</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white w-full" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">EQUIPO</span>
               <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white w-full uppercase">
                  <option value="tacker01">TACKER01</option>
                  <option value="tacker05">TACKER05</option>
                  <option value="tacker06">TACKER06</option>
                  <option value="tacker07">TACKER07</option>
                  <option value="tacker08">TACKER08</option>
                  <option value="tacker10">TACKER10</option>
                  <option value="tacker11">TACKER11</option>
                  <option value="mase01">MASE01</option>
                  <option value="mase02">MASE02</option>
                  <option value="mase03">MASE03</option>
                  <option value="mase04">MASE04</option>
                </select>
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">POZO</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white w-full uppercase" />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-12 border-b border-black bg-gray-200 font-bold text-center text-sm h-10 items-center">
           <div className="col-span-6 border-r border-black pl-4 text-left">Inspección Caída de Objetos</div>
           <div className="col-span-1 border-r border-black">Si</div>
           <div className="col-span-1 border-r border-black">No</div>
           <div className="col-span-4 pl-4 text-left">Observaciones</div>
        </div>

        {/* Rows */}
        {rows.map((row) => (
           <div key={row.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-sm hover:bg-gray-50 min-h-[40px] items-center">
              <div className="col-span-6 sm:border-r border-black p-2 font-medium w-full">{row.description}</div>
              
              {/* Mobile Actions */}
              <div className="flex w-full sm:contents border-t sm:border-t-0 border-gray-200">
                  {/* SI Checkbox */}
                  <div 
                    className={`flex-1 sm:col-span-1 sm:border-r border-black p-2 sm:p-0 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors border-r border-gray-200`}
                    onClick={() => handleRowChange(row.id, 'status', row.status === 'SI' ? null : 'SI')}
                  >
                     <div className="flex items-center gap-2 sm:block">
                        <span className="sm:hidden font-bold text-gray-500 text-xs">SI</span>
                        <div className={`w-5 h-5 flex items-center justify-center border border-gray-400 rounded sm:border-0 sm:rounded-none ${row.status === 'SI' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                           {row.status === 'SI' && 'X'}
                        </div>
                     </div>
                  </div>

                  {/* NO Checkbox */}
                  <div 
                    className={`flex-1 sm:col-span-1 sm:border-r border-black p-2 sm:p-0 flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors`}
                    onClick={() => handleRowChange(row.id, 'status', row.status === 'NO' ? null : 'NO')}
                  >
                     <div className="flex items-center gap-2 sm:block">
                        <span className="sm:hidden font-bold text-gray-500 text-xs">NO</span>
                        <div className={`w-5 h-5 flex items-center justify-center border border-gray-400 rounded sm:border-0 sm:rounded-none ${row.status === 'NO' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                           {row.status === 'NO' && 'X'}
                        </div>
                     </div>
                  </div>
              </div>

              <div className="col-span-4 w-full h-full p-0 border-t sm:border-t-0 border-gray-200">
                 <textarea 
                    className="w-full h-full min-h-[40px] px-2 pt-2 outline-none bg-transparent resize-none placeholder-gray-400 sm:placeholder-transparent text-xs"
                    value={row.observations}
                    onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)}
                    placeholder="Observaciones..."
                 />
              </div>
           </div>
        ))}
      </div>

      <div className="p-2 border-b border-black text-[10px] italic bg-gray-50 print:bg-transparent text-center sm:text-left">
         <strong>Nota:</strong> Completar los ítem de la Inspección de Caída de Objetos con un tilde (x) y en caso de observaciones relevantes aclarar e informar.
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Jefe de Equipo</div>
             <div className="text-[10px]">Firma y Aclaración</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.shiftLeader?.data} 
                   onChange={(val) => handleSignatureChange('shiftLeader', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Encargado de Turno</div>
             <div className="text-[10px]">Firma y Aclaración</div>
          </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-last sm:order-first">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto">
             <ExportPdfButton 
               filename={`checklist_caida_objetos_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              signatures 
            })} className="w-full sm:w-auto">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
