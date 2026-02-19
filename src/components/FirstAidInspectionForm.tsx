
import React, { useState } from 'react';
import { FirstAidReport, FirstAidMetadata, FirstAidRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: FirstAidReport;
  onSave: (report: FirstAidReport) => void;
  onCancel: () => void;
}

const ITEMS_DATA = [
  { q: "1", u: "CAJA", desc: "GASA HIDRÓFILA" },
  { q: "1", u: "PAQUETE", desc: "ALGODÓN HIDRÓFILO" },
  { q: "1", u: "U", desc: "VENDA DE DISTINTO DIÁMETRO" },
  { q: "2", u: "10 U", desc: "APÓSITO PROTECTOR ADHESIVO" },
  { q: "1", u: "U", desc: "TUBO DE LATEX PARA LIGADURAS" },
  { q: "1", u: "500 CC", desc: "AGUA OXIGENADA" },
  { q: "1", u: "Fco", desc: "SOLUCIÓN ANTICÉPTICA" },
  { q: "1", u: "Fco", desc: "SOLUCIÓN PARA QUEMADURAS" },
  { q: "1", u: "U", desc: "JERINGA DESCARTABLE DE 5cm" },
  { q: "1", u: "U", desc: "TELA ADHESIVA 12,5 mm x 4 mtrs" },
  { q: "1", u: "U", desc: "TELA ADHESIVA 25 mm x 4 mtrs" },
  { q: "1", u: "U", desc: "COPITA LAVA OJOS" },
  { q: "1", u: "PAR", desc: "GUANTES DE LATEX DESCARTABLES" },
  { q: "1", u: "U", desc: "PINZA PARA SACAR ASTILLAS" },
  { q: "1", u: "U", desc: "TIJERA MEDIANA" },
  { q: "5", u: "PAR", desc: "GUANTES DESCARTABLES DE POLIETILENO" }
];

export const FirstAidInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<FirstAidMetadata>(initialData?.metadata || {
    equipmentBase: '',
    date: new Date().toISOString().split('T')[0],
    teamLeader: '',
    location: '',
    hseTech: '',
    clientRep: ''
  });

  const [rows, setRows] = useState<FirstAidRow[]>(() => {
    if (initialData?.rows) {
        // Merge with static data to ensure order/structure
        return ITEMS_DATA.map(item => {
            const existing = initialData.rows.find(r => r.description === item.desc);
            if (existing) return existing;
            return {
                id: crypto.randomUUID(),
                quantity: item.q,
                unit: item.u,
                description: item.desc,
                conditionB: false,
                conditionM: false,
                expiration: ''
            };
        });
    }
    return ITEMS_DATA.map(item => ({
        id: crypto.randomUUID(),
        quantity: item.q,
        unit: item.u,
        description: item.desc,
        conditionB: false,
        conditionM: false,
        expiration: ''
    }));
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof FirstAidRow, value: any) => {
    setRows(prev => prev.map(row => {
        if (row.id === id) {
            // Toggle logic for B/M (mutually exclusive per row usually, but flexible here)
            if (field === 'conditionB' && value === true) {
                return { ...row, conditionB: true, conditionM: false };
            }
            if (field === 'conditionM' && value === true) {
                return { ...row, conditionB: false, conditionM: true };
            }
            return { ...row, [field]: value };
        }
        return row;
    }));
  };

  const handleSignatureChange = (role: 'hseTech' | 'teamLeader', dataUrl: string | undefined) => {
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
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-lg sm:text-xl uppercase leading-tight">INSPECCION BOTIQUIN PRIMEROS AUXILIOS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POSGI001-A13-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-4">
         {/* Row 1 */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs text-gray-500 uppercase">Equipo/Base</span>
               <input name="equipmentBase" value={metadata.equipmentBase} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs text-gray-500 uppercase">Yacimiento/ Locacion</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
         </div>
         {/* Row 2 */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs text-gray-500 uppercase">Fecha</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs text-gray-500 uppercase">Tecnicio HSE</span>
               <input name="hseTech" value={metadata.hseTech} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
         </div>
         {/* Row 3 */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs text-gray-500 uppercase">Jefe de equipo/ Base</span>
               <input name="teamLeader" value={metadata.teamLeader} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs text-gray-500 uppercase">Representante cliente</span>
               <input name="clientRep" value={metadata.clientRep} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="w-full">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-400 text-black border-b border-black font-bold text-sm text-center">
           <div className="col-span-1 p-2 border-r border-black">Cant.</div>
           <div className="col-span-1 p-2 border-r border-black">UM</div>
           <div className="col-span-1 p-2 border-r border-black">B</div>
           <div className="col-span-1 p-2 border-r border-black">M</div>
           <div className="col-span-2 p-2 border-r border-black">Vencimiento</div>
           <div className="col-span-6 p-2 text-left pl-4">Descripción</div>
        </div>

        {/* Rows */}
        <div className="sm:block hidden">
           {rows.map((row) => (
             <div key={row.id} className="grid grid-cols-12 border-b border-black hover:bg-gray-50 text-sm h-8 items-center">
                <div className="col-span-1 border-r border-black p-1 text-center font-medium bg-gray-50 print:bg-transparent">{row.quantity}</div>
                <div className="col-span-1 border-r border-black p-1 text-center font-medium bg-gray-50 print:bg-transparent">{row.unit}</div>
                
                {/* Checkbox B */}
                <div className="col-span-1 border-r border-black p-0 text-center cursor-pointer hover:bg-gray-100 h-full flex items-center justify-center" onClick={() => handleRowChange(row.id, 'conditionB', !row.conditionB)}>
                   <div className={`w-full h-full flex items-center justify-center ${row.conditionB ? 'font-bold bg-black text-white' : ''}`}>
                      {row.conditionB && 'X'}
                   </div>
                </div>
                
                {/* Checkbox M */}
                <div className="col-span-1 border-r border-black p-0 text-center cursor-pointer hover:bg-gray-100 h-full flex items-center justify-center" onClick={() => handleRowChange(row.id, 'conditionM', !row.conditionM)}>
                   <div className={`w-full h-full flex items-center justify-center ${row.conditionM ? 'font-bold bg-red-600 text-white' : ''}`}>
                      {row.conditionM && 'X'}
                   </div>
                </div>

                <div className="col-span-2 border-r border-black p-0 h-full">
                   <input 
                     type="date"
                     className="w-full h-full p-1 text-center outline-none bg-transparent text-xs"
                     value={row.expiration}
                     onChange={(e) => handleRowChange(row.id, 'expiration', e.target.value)}
                   />
                </div>
                <div className="col-span-6 p-1 pl-4 uppercase font-medium text-xs">{row.description}</div>
             </div>
           ))}
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden p-4 space-y-3">
           {rows.map((row) => (
              <div key={row.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm">
                 <div className="flex justify-between items-start mb-2 border-b pb-2">
                    <div className="font-bold text-sm uppercase text-gray-800">{row.description}</div>
                    <div className="text-xs bg-white px-2 py-1 rounded border">{row.quantity} {row.unit}</div>
                 </div>
                 
                 <div className="flex gap-2 mb-3">
                    <button 
                       className={`flex-1 py-1.5 rounded text-xs font-bold border ${row.conditionB ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300'}`}
                       onClick={() => handleRowChange(row.id, 'conditionB', !row.conditionB)}
                    >
                       BUENO
                    </button>
                    <button 
                       className={`flex-1 py-1.5 rounded text-xs font-bold border ${row.conditionM ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-600 border-gray-300'}`}
                       onClick={() => handleRowChange(row.id, 'conditionM', !row.conditionM)}
                    >
                       MALO
                    </button>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">VENCIMIENTO</label>
                    <input 
                       type="date" 
                       className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white"
                       value={row.expiration}
                       onChange={(e) => handleRowChange(row.id, 'expiration', e.target.value)}
                    />
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black border-dashed">
         <div className="font-bold mb-1 text-sm uppercase text-gray-500">Observaciones:</div>
         <textarea 
            className="w-full h-24 p-2 bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6 resize-none outline-none border border-gray-300 rounded text-sm"
            style={{ backgroundSize: '100% 24px', lineHeight: '24px' }}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 pt-4 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black border-dotted mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full w-full border-0"
                   value={signatures.hseTech?.data} 
                   onChange={(val) => handleSignatureChange('hseTech', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Tec. HSE</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black border-dotted mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full w-full border-0"
                   value={signatures.teamLeader?.data} 
                   onChange={(val) => handleSignatureChange('teamLeader', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Jefe de Equipo / Base</div>
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
               filename={`botiquin_${metadata.date}`}
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
            })} className="w-full sm:w-auto">
             Guardar Inspección
           </Button>
        </div>

    </div>
  );
};
