
import React, { useState } from 'react';
import { FlareChecklistReport, FlareChecklistMetadata, FlareChecklistRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { FlareChecklistPdf } from '../pdf/FlareChecklistPdf';

interface Props {
  initialData?: FlareChecklistReport;
  onSave: (report: FlareChecklistReport) => void;
  onCancel: () => void;
}

const ITEMS = [
  "Revisión de válvulas del acumulador de gas.",
  "Revisión de válvulas de retención (check).",
  "Revisión de válvula de alivio de presión.",
  "Revisión de chispero manual.",
  "Revisión de electrodo de encendido.",
  "Revisión de aislador de electrodo de encendido.",
  "Revisión de estado general de estructura.",
  "Revisión de estado de vientos de sujeción.",
  "Revisión de estado de estacas de sujeción.",
  "Revisión de estado de mangueras de gas.",
  "Revisión de estado de mangueras de aire.",
  "Limpieza de pico de quemador.",
  "Verificación de funcionamiento de piloto."
];

export const FlareChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<FlareChecklistMetadata>(initialData?.metadata || {
    location: '',
    date: new Date().toISOString().split('T')[0],
    user: '',
    nextMaintenance: ''
  });

  const [rows, setRows] = useState<FlareChecklistRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    return ITEMS.map(item => ({
      id: crypto.randomUUID(),
      description: item,
      status: null,
      observations: ''
    }));
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof FlareChecklistRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (role: 'responsible', dataUrl: string | undefined) => {
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
          <h1 className="font-black text-xl uppercase leading-tight">CHECK LIST FLARE MOVIL</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WWO-007-A3</div>
          <div className="text-xs font-normal mt-1">Revisión 00</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">UBICACIÓN:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" title="Ubicación" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" title="Fecha" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">USUARIO:</span>
               <input name="user" value={metadata.user} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" title="Usuario" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">PRÓX. MANTENIMIENTO:</span>
               <input type="date" name="nextMaintenance" value={metadata.nextMaintenance} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" title="Próximo Mantenimiento" />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="grid grid-cols-12 bg-gray-200 border-b border-black font-bold text-center text-sm">
           <div className="col-span-8 p-2 border-r border-black text-left pl-4">DESCRIPCIÓN</div>
           <div className="col-span-2 border-r border-black">
              <div className="border-b border-black p-1 text-[10px]">ESTADO</div>
              <div className="flex h-full">
                 <div className="flex-1 border-r border-black">B</div>
                 <div className="flex-1">M</div>
              </div>
           </div>
           <div className="col-span-2 p-2">OBSERVACIONES</div>
        </div>

        {rows.map((row) => (
           <div key={row.id} className="grid grid-cols-12 border-b border-black hover:bg-gray-50 min-h-[32px] items-center">
              <div className="col-span-8 border-r border-black p-2 font-medium">{row.description}</div>
              
              <div className="col-span-2 border-r border-black p-0 h-full">
                 <div className="flex h-full">
                    {/* B Status */}
                    <div 
                       className={`flex-1 flex items-center justify-center cursor-pointer border-r border-black hover:bg-gray-200 ${row.status === 'B' ? 'bg-black text-white font-bold' : ''}`}
                       onClick={() => handleRowChange(row.id, 'status', row.status === 'B' ? null : 'B')}
                    >
                       {row.status === 'B' && 'X'}
                    </div>
                    {/* M Status */}
                    <div 
                       className={`flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-200 ${row.status === 'M' ? 'bg-red-600 text-white font-bold' : ''}`}
                       onClick={() => handleRowChange(row.id, 'status', row.status === 'M' ? null : 'M')}
                    >
                       {row.status === 'M' && 'X'}
                    </div>
                 </div>
              </div>

              <div className="col-span-2 p-0 h-full">
                 <input 
                    className="w-full h-full px-2 outline-none bg-transparent"
                    value={row.observations}
                    onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)}
                    title="Observaciones"
                 />
              </div>
           </div>
        ))}
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-1 uppercase text-xs">Observaciones Generales:</div>
         <textarea 
            className="w-full h-24 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6 [background-size:100%_24px]"
            title="Observaciones Generales"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="p-8 page-break-inside-avoid flex justify-center">
         <div className="text-center w-64">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label=""
                   className="h-full border-0 w-full"
                   value={signatures.responsible?.data}
                   onChange={(val) => handleSignatureChange('responsible', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Responsable</div>
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
               filename={`checklist_flare_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<FlareChecklistPdf report={{ id: initialData?.id ?? '', metadata, rows, observations, signatures }} />}
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
