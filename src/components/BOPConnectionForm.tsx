
import React, { useState } from 'react';
import { BOPConnectionReport, BOPConnectionMetadata, BOPItem } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { BOPConnectionPdf } from '../pdf/BOPConnectionPdf';

interface Props {
  initialData?: BOPConnectionReport;
  onSave: (report: BOPConnectionReport) => void;
  onCancel: () => void;
}

const ITEMS_STRUCTURE: { section: 'ANULAR' | 'PARCIAL' | 'TOTAL'; operation: 'OPEN' | 'CLOSE'; components: ('CONECTOR' | 'MANGUERA' | 'ESLINGA')[] }[] = [
  // Anular Open
  { section: 'ANULAR', operation: 'OPEN', components: ['CONECTOR', 'MANGUERA', 'ESLINGA'] },
  // Anular Close
  { section: 'ANULAR', operation: 'CLOSE', components: ['CONECTOR', 'MANGUERA', 'ESLINGA'] },
  
  // Parcial Open
  { section: 'PARCIAL', operation: 'OPEN', components: ['CONECTOR', 'MANGUERA', 'ESLINGA'] },
  // Parcial Close
  { section: 'PARCIAL', operation: 'CLOSE', components: ['CONECTOR', 'MANGUERA', 'ESLINGA'] },

  // Total Open
  { section: 'TOTAL', operation: 'OPEN', components: ['CONECTOR', 'MANGUERA', 'ESLINGA'] },
  // Total Close
  { section: 'TOTAL', operation: 'CLOSE', components: ['CONECTOR', 'MANGUERA', 'ESLINGA'] },
];

export const BOPConnectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<BOPConnectionMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    rigManagerName: '',
    rigNumber: '',
    shiftLeaderName: '',
    client: '',
    field: '',
    well: '',
    anularSerial: '',
    parcialSerial: ''
  });

  const [items, setItems] = useState<BOPItem[]>(() => {
    if (initialData?.items && initialData.items.length > 0) return initialData.items;
    const initialItems: BOPItem[] = [];
    ITEMS_STRUCTURE.forEach(group => {
      group.components.forEach(comp => {
        initialItems.push({
          id: crypto.randomUUID(),
          section: group.section,
          operation: group.operation,
          component: comp,
          status: null
        });
      });
    });
    return initialItems;
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, status: 'BUENO' | 'MALO') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: item.status === status ? null : status } : item));
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

  const renderSection = (section: 'ANULAR' | 'PARCIAL' | 'TOTAL') => {
    const sectionItems = items.filter(i => i.section === section);
    const openItems = sectionItems.filter(i => i.operation === 'OPEN');
    const closeItems = sectionItems.filter(i => i.operation === 'CLOSE');

    return (
      <div className="mb-6 text-xs bg-white p-3 rounded border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 border-b border-black pb-2">
            <span className="font-bold text-sm uppercase bg-gray-100 px-2 py-1 rounded inline-block mb-2 sm:mb-0">
               BOP {section === 'ANULAR' ? 'Anular' : section === 'PARCIAL' ? 'Parcial' : 'Total'}
            </span>
            {section !== 'TOTAL' && (
               <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-500">N° Serie:</span>
                  <input 
                    className="border-b border-gray-400 outline-none bg-transparent w-32 font-mono" 
                    value={section === 'ANULAR' ? metadata.anularSerial : metadata.parcialSerial}
                    onChange={(e) => setMetadata(prev => ({ ...prev, [section === 'ANULAR' ? 'anularSerial' : 'parcialSerial']: e.target.value }))}
                    title="N° Serie"
                  />
               </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="pl-0 sm:pl-2">
               <div className="font-bold mb-2 text-green-700 uppercase tracking-wide text-[10px]">Conexión Open (Abre)</div>
               {openItems.map(item => (
                 <div key={item.id} className="flex justify-between items-center mb-2 border-b border-gray-100 pb-1">
                    <span className="capitalize text-gray-700">{item.component.toLowerCase()}</span>
                    <div className="flex gap-1">
                       <button 
                          className={`px-2 py-1 rounded text-[10px] border transition-colors ${item.status === 'BUENO' ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => handleItemChange(item.id, 'BUENO')}
                       >
                          OK
                       </button>
                       <button 
                          className={`px-2 py-1 rounded text-[10px] border transition-colors ${item.status === 'MALO' ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => handleItemChange(item.id, 'MALO')}
                       >
                          NO
                       </button>
                    </div>
                 </div>
               ))}
            </div>

            <div className="pl-0 sm:pl-2">
               <div className="font-bold mb-2 text-red-700 uppercase tracking-wide text-[10px]">Conexión Close (Cierra)</div>
               {closeItems.map(item => (
                 <div key={item.id} className="flex justify-between items-center mb-2 border-b border-gray-100 pb-1">
                    <span className="capitalize text-gray-700">{item.component.toLowerCase()}</span>
                    <div className="flex gap-1">
                       <button 
                          className={`px-2 py-1 rounded text-[10px] border transition-colors ${item.status === 'BUENO' ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => handleItemChange(item.id, 'BUENO')}
                       >
                          OK
                       </button>
                       <button 
                          className={`px-2 py-1 rounded text-[10px] border transition-colors ${item.status === 'MALO' ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => handleItemChange(item.id, 'MALO')}
                       >
                          NO
                       </button>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      </div>
    );
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
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">Conexión de BOP</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG001-A5-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-xs bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-48 text-gray-500 uppercase">Jefe de Equipo:</span>
               <input name="rigManagerName" value={metadata.rigManagerName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent font-medium" title="Jefe de Equipo" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-24 text-gray-500 uppercase">Equipo N°:</span>
               <select name="rigNumber" value={metadata.rigNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent font-medium" title="Equipo N°">
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
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-48 text-gray-500 uppercase">Encargado Turno:</span>
               <input name="shiftLeaderName" value={metadata.shiftLeaderName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent font-medium" title="Encargado Turno" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-12 text-gray-500 uppercase">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" title="Fecha" />
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-16 text-gray-500 uppercase">Cliente:</span>
               <input name="client" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" title="Cliente" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-20 text-gray-500 uppercase">Yacimiento:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" title="Yacimiento" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-12 text-gray-500 uppercase">Pozo:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" title="Pozo" />
            </div>
         </div>
      </div>

      {/* Instructions */}
      <div className="p-3 border-b border-black text-[10px] italic bg-yellow-50 text-gray-700 print:bg-transparent">
         <span className="font-bold not-italic">REFERENCIA:</span> <span className="font-bold underline">BUENO</span>: Conector hermetiza correctamente, estrella no se observa golpeada y/o desgastada, sistema de traba limpio y operativo.
         <span className="font-bold underline ml-2">MALO</span>: Conector no hermetiza correctamente, estrella se observa golpeada y/o gastada, sistema de traba no se encuentra limpio y cuesta conectar.
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row border-b border-black">
         {/* Diagram */}
         <div className="md:w-1/3 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black bg-white">
            <div className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400">Esquema BOP</div>
            {/* Simple SVG representation of BOP Stack */}
            <svg viewBox="0 0 200 400" className="h-64 w-auto drop-shadow-md">
               <rect x="70" y="50" width="60" height="60" fill="#f3f4f6" stroke="black" strokeWidth="2" /> {/* Annular */}
               <text x="100" y="85" fontSize="10" textAnchor="middle" fill="#666">ANULAR</text>
               <path d="M70 110 L80 140 L120 140 L130 110" fill="none" stroke="black" strokeWidth="2" />
               
               <rect x="60" y="150" width="80" height="40" fill="#e5e7eb" stroke="black" strokeWidth="2" /> {/* Ram 1 */}
               <rect x="40" y="160" width="20" height="20" fill="white" stroke="black" strokeWidth="2" />
               <rect x="140" y="160" width="20" height="20" fill="white" stroke="black" strokeWidth="2" />
               <text x="100" y="175" fontSize="10" textAnchor="middle" fill="#666">PARCIAL</text>

               <rect x="60" y="200" width="80" height="40" fill="#e5e7eb" stroke="black" strokeWidth="2" /> {/* Ram 2 */}
               <rect x="40" y="210" width="20" height="20" fill="white" stroke="black" strokeWidth="2" />
               <rect x="140" y="210" width="20" height="20" fill="white" stroke="black" strokeWidth="2" />
               <text x="100" y="225" fontSize="10" textAnchor="middle" fill="#666">TOTAL</text>

               <rect x="80" y="250" width="40" height="20" fill="none" stroke="black" strokeWidth="2" /> {/* Spool */}
               <line x1="100" y1="20" x2="100" y2="380" stroke="blue" strokeWidth="1" strokeDasharray="5 5" /> {/* Centerline */}
               <rect x="20" y="280" width="160" height="20" fill="#d1d5db" stroke="black" strokeWidth="2" /> {/* Base */}
               <circle x="30" y="320" r="5" stroke="black" fill="none" />
               <circle x="170" y="320" r="5" stroke="black" fill="none" />
            </svg>
         </div>

         {/* Checklist Items */}
         <div className="md:w-2/3 p-4 bg-gray-50 print:bg-white">
            <div className="font-bold underline text-center mb-4 text-sm text-gray-800">Conexiones de "STACK BOP"</div>
            {renderSection('ANULAR')}
            {renderSection('PARCIAL')}
            {renderSection('TOTAL')}
         </div>
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold underline mb-2 text-xs uppercase text-gray-500">Observaciones Generales:</div>
         <textarea 
            className="w-full h-24 p-3 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6 [background-size:100%_24px]"
            title="Observaciones Generales"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
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
             <div className="font-bold text-xs uppercase text-gray-500">Firma Jefe de Equipo</div>
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
             <div className="font-bold text-xs uppercase text-gray-500">Firma Encargado de Turno</div>
          </div>
      </div>
      
      <div className="border-t border-black p-2 text-[9px] font-bold text-center text-gray-400 bg-gray-50">
         NOTA: El documento Original debe ser archivado en Oficina de Jefe de Equipo / Encargado de Turno y la Copia se entrega al Company Representative.
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50 sm:justify-end">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`bop_connection_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<BOPConnectionPdf report={{ id: initialData?.id ?? '', metadata, items, observations, signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              items, 
              observations, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar
           </Button>
        </div>

    </div>
  );
};
