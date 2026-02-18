
import React, { useState } from 'react';
import { ElectricalToolChecklistReport, ElectricalToolChecklistMetadata, ElectricalToolChecklistRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ElectricalToolChecklistReport;
  onSave: (report: ElectricalToolChecklistReport) => void;
  onCancel: () => void;
}

const QUESTIONS = [
  "¿Conductores eléctricos se encuentra en buenas condiciones?",
  "¿Conector eléctrico y tomacorrientes en buenas condiciones?",
  "¿El circuito eléctrico cuenta con protección termomagnética y disyuntor diferencial funcionando correctamente?",
  "¿El sistema de alimentación eléctrica cuenta con sistema puesta a tierra?",
  "¿El interruptor de encendido y apagado de la herramienta está en condiciones?",
  "¿La carcasa de la herramienta está en buenas condiciones físicas para su uso?",
  "¿La herramienta cuenta con mango de sujeción ajustado correctamente?",
  "¿La herramienta cuenta con protección de partes móviles en buenas condiciones y ajustada correctamente?",
  "¿Disco de corte, mecha u otro dispositivo adicional acoplado a la herramienta se encuentra en buenas condiciones?",
  "¿Cuenta con la llave adecuada para ajustar los accesorios adicionales como disco, mecha u otro?",
  "¿La herramienta será utilizada para el fin que fue diseñada?"
];

export const ElectricalToolChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ElectricalToolChecklistMetadata>(initialData?.metadata || {
    toolName: '',
    area: '',
    inspectorName: '',
    inspectorJobTitle: '',
    inspectorDate: new Date().toISOString().split('T')[0],
    supervisorName: '',
    supervisorDate: new Date().toISOString().split('T')[0]
  });

  const [rows, setRows] = useState<ElectricalToolChecklistRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    return QUESTIONS.map(q => ({
      id: crypto.randomUUID(),
      question: q,
      status: null
    }));
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, status: 'SI' | 'NO' | 'NA') => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, status: row.status === status ? null : status } : row));
  };

  const handleSignatureChange = (role: 'inspector' | 'supervisor', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl uppercase leading-tight">CHECK LIST HERRAMIENTAS ELECTRICAS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POSGI001-A21-0</div>
          <div className="text-xs font-normal mt-1">REV: 0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col sm:flex-row border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="flex-1 flex border-b sm:border-b-0 sm:border-r border-black p-4 items-center">
            <span className="font-bold mr-2 uppercase w-32">HERRAMIENTA:</span>
            <input 
               name="toolName" 
               value={metadata.toolName} 
               onChange={handleMetadataChange} 
               className="flex-1 outline-none bg-transparent"
            />
         </div>
         <div className="flex-1 flex p-4 items-center">
            <span className="font-bold mr-2 uppercase w-16">ÁREA:</span>
            <input 
               name="area" 
               value={metadata.area} 
               onChange={handleMetadataChange} 
               className="flex-1 outline-none bg-transparent"
            />
         </div>
      </div>

      {/* Table */}
      <div className="w-full">
         {/* Table Header */}
         <div className="hidden sm:grid grid-cols-12 border-b-2 border-black bg-white font-bold text-sm text-center">
            <div className="col-span-9 border-r border-black p-2 text-left pl-4">ELEMENTOS A INSPECCIONAR</div>
            <div className="col-span-1 border-r border-black p-2">SI</div>
            <div className="col-span-1 border-r border-black p-2">NO</div>
            <div className="col-span-1 p-2">N.A</div>
         </div>

         {/* Rows */}
         {rows.map((row) => (
            <div key={row.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-sm hover:bg-gray-50 min-h-[32px]">
               <div className="col-span-9 border-r border-black p-2 sm:p-1 sm:pl-4 flex items-center font-medium sm:font-normal">
                  {row.question}
               </div>
               
               {/* Mobile Checkboxes */}
               <div className="flex sm:contents border-t sm:border-t-0 border-gray-100">
                   {/* SI Checkbox */}
                   <div 
                     className={`flex-1 sm:col-span-1 border-r border-black p-2 sm:p-0 flex items-center justify-center cursor-pointer ${row.status === 'SI' ? 'bg-black text-white font-bold' : 'hover:bg-gray-200'}`}
                     onClick={() => handleRowChange(row.id, 'SI')}
                   >
                      <span className="sm:hidden text-xs mr-2 font-bold text-gray-500">SI</span>
                      {row.status === 'SI' && <span className="font-bold">X</span>}
                   </div>

                   {/* NO Checkbox */}
                   <div 
                     className={`flex-1 sm:col-span-1 border-r border-black p-2 sm:p-0 flex items-center justify-center cursor-pointer ${row.status === 'NO' ? 'bg-black text-white font-bold' : 'hover:bg-gray-200'}`}
                     onClick={() => handleRowChange(row.id, 'NO')}
                   >
                      <span className="sm:hidden text-xs mr-2 font-bold text-gray-500">NO</span>
                      {row.status === 'NO' && <span className="font-bold">X</span>}
                   </div>

                   {/* NA Checkbox */}
                   <div 
                     className={`flex-1 sm:col-span-1 p-2 sm:p-0 flex items-center justify-center cursor-pointer ${row.status === 'NA' ? 'bg-black text-white font-bold' : 'hover:bg-gray-200'}`}
                     onClick={() => handleRowChange(row.id, 'NA')}
                   >
                      <span className="sm:hidden text-xs mr-2 font-bold text-gray-500">N.A</span>
                      {row.status === 'NA' && <span className="font-bold">X</span>}
                   </div>
               </div>
            </div>
         ))}
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold text-sm mb-1 uppercase">OBSERVACIONES:</div>
         <textarea 
            className="w-full h-24 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-black page-break-inside-avoid">
          {/* REALIZÓ Section */}
          <div className="border-r border-black p-4 flex flex-col justify-between">
             <div className="font-bold text-center border-b border-black pb-1 mb-4">REALIZÓ</div>
             
             <div className="flex gap-2 mb-2 items-end">
                <span className="font-bold text-xs w-16">NOMBRE:</span>
                <input name="inspectorName" value={metadata.inspectorName} onChange={handleMetadataChange} className="flex-1 border-b border-gray-400 outline-none text-xs bg-transparent" />
             </div>
             <div className="flex gap-2 mb-4 items-end">
                <span className="font-bold text-xs w-16">CARGO:</span>
                <input name="inspectorJobTitle" value={metadata.inspectorJobTitle} onChange={handleMetadataChange} className="flex-1 border-b border-gray-400 outline-none text-xs bg-transparent" />
             </div>

             <div className="flex gap-4 items-end mt-4">
                <div className="flex-1">
                   <div className="text-xs font-bold mb-1">FIRMA</div>
                   <SignaturePad 
                      label=""
                      value={signatures.inspector?.data}
                      onChange={(val) => handleSignatureChange('inspector', val)}
                      className="h-16"
                   />
                </div>
                <div className="w-24">
                   <div className="text-xs font-bold mb-1">FECHA</div>
                   <input type="date" name="inspectorDate" value={metadata.inspectorDate} onChange={handleMetadataChange} className="w-full border-b border-black outline-none text-xs bg-transparent" />
                </div>
             </div>
          </div>

          {/* REVISÓ Section */}
          <div className="p-4 flex flex-col justify-between">
             <div className="font-bold text-center border-b border-black pb-1 mb-4">REVISÓ</div>
             
             <div className="flex gap-2 mb-10 items-end">
                <span className="font-bold text-xs w-24">SUPERVISOR:</span>
                <input name="supervisorName" value={metadata.supervisorName} onChange={handleMetadataChange} className="flex-1 border-b border-gray-400 outline-none text-xs bg-transparent" />
             </div>

             <div className="flex gap-4 items-end mt-4">
                <div className="flex-1">
                   <div className="text-xs font-bold mb-1">FIRMA</div>
                   <SignaturePad 
                      label=""
                      value={signatures.supervisor?.data}
                      onChange={(val) => handleSignatureChange('supervisor', val)}
                      className="h-16"
                   />
                </div>
                <div className="w-24">
                   <div className="text-xs font-bold mb-1">FECHA</div>
                   <input type="date" name="supervisorDate" value={metadata.supervisorDate} onChange={handleMetadataChange} className="w-full border-b border-black outline-none text-xs bg-transparent" />
                </div>
             </div>
          </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`checklist_herramientas_${metadata.inspectorDate}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              observations,
              signatures
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
