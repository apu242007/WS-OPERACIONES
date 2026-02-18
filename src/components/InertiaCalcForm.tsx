
import React, { useState } from 'react';
import { InertiaReport, InertiaMetadata, InertiaData } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: InertiaReport;
  onSave: (report: InertiaReport) => void;
  onCancel: () => void;
}

export const InertiaCalcForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<InertiaMetadata>(initialData?.metadata || {
    equipment: '',
    date: new Date().toISOString().split('T')[0],
    field: '',
    well: ''
  });

  const [data, setData] = useState<InertiaData>(initialData?.data || {
    towerHeight: 0,
    blockHeight: 0,
    linksHeight: 0,
    toolStringLength: 0,
    couplingHeight: 0,
    workFloorHeight: 0,
    inertia: 0
  });

  const [signature, setSignature] = useState(initialData?.signature);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleDataChange = (name: keyof InertiaData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => ({ ...prev, [name]: numValue }));
  };

  // Cálculo Automático: Distancia libre (Margen de seguridad)
  // Fórmula inferida: Altura Torre - (Inercia + Aparejo + Amela + Tiro + Cupla + Piso)
  const totalOccupied = data.inertia + data.blockHeight + data.linksHeight + data.toolStringLength + data.couplingHeight + data.workFloorHeight;
  const safetyMargin = data.towerHeight - totalOccupied;

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-2xl uppercase leading-tight">Registro de "Calculo de inercia"</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG005-A1-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
        <div className="flex items-center border-b border-black border-dashed pb-1">
           <label className="font-bold w-24 uppercase text-xs text-gray-500">Equipo:</label>
           <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase">
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
        <div className="flex items-center border-b border-black border-dashed pb-1">
           <label className="font-bold w-24 uppercase text-xs text-gray-500">Fecha:</label>
           <input 
             type="date"
             name="date" 
             value={metadata.date} 
             onChange={handleMetadataChange}
             className="flex-1 outline-none bg-transparent"
           />
        </div>
        <div className="flex items-center border-b border-black border-dashed pb-1">
           <label className="font-bold w-24 uppercase text-xs text-gray-500">Yacimiento:</label>
           <input 
             name="field" 
             value={metadata.field} 
             onChange={handleMetadataChange}
             className="flex-1 outline-none bg-transparent uppercase"
           />
        </div>
        <div className="flex items-center border-b border-black border-dashed pb-1">
           <label className="font-bold w-24 uppercase text-xs text-gray-500">Pozo:</label>
           <input 
             name="well" 
             value={metadata.well} 
             onChange={handleMetadataChange}
             className="flex-1 outline-none bg-transparent uppercase"
           />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        
        {/* Diagram Column - SVG Recreation of the provided image */}
        <div className="relative h-[600px] border border-gray-100 rounded bg-white flex items-center justify-center overflow-hidden">
           <div className="absolute top-4 left-4 text-xs text-gray-500 space-y-1 z-10 bg-white/80 p-2 rounded shadow-sm border border-gray-200">
              <p className="font-bold text-gray-700 mb-1">INSTRUCCIONES:</p>
              <p>1- Para el calculo de "Inercia", seguir referencias.</p>
              <p>2- Completar los casilleros en la tabla.</p>
           </div>
           
           <svg viewBox="0 0 400 800" className="h-full w-auto select-none" style={{maxHeight: '100%'}}>
              <defs>
                  <marker id="arrow-start" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                    <path d="M6,0 L6,6 L0,3 z" fill="#000" />
                  </marker>
                  <marker id="arrow-end" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#000" />
                  </marker>
              </defs>

              {/* TRUCK BASE */}
              <g transform="translate(10, 700) scale(0.9)">
                 {/* Wheels */}
                 <circle cx="40" cy="40" r="18" fill="white" stroke="black" strokeWidth="1.5"/>
                 <circle cx="110" cy="40" r="18" fill="white" stroke="black" strokeWidth="1.5"/>
                 <circle cx="160" cy="40" r="18" fill="white" stroke="black" strokeWidth="1.5"/>
                 <circle cx="280" cy="40" r="18" fill="white" stroke="black" strokeWidth="1.5"/>
                 <circle cx="330" cy="40" r="18" fill="white" stroke="black" strokeWidth="1.5"/>
                 
                 {/* Cabin */}
                 <path d="M5 20 L5 -30 L15 -40 L40 -45 L50 -45 L50 20 Z" fill="none" stroke="black" strokeWidth="1.5"/>
                 <path d="M50 -45 L50 -20 L70 -20 L70 20" fill="none" stroke="black" strokeWidth="1.5"/>
                 {/* Chassis */}
                 <rect x="50" y="0" width="300" height="20" fill="none" stroke="black" strokeWidth="1.5"/>
                 
                 {/* Equipment on bed */}
                 <rect x="180" y="-30" width="40" height="30" fill="none" stroke="black" strokeWidth="1"/>
                 <circle cx="240" cy="-15" r="15" fill="none" stroke="black" strokeWidth="1"/>
                 <rect x="280" y="-35" width="60" height="35" fill="none" stroke="black" strokeWidth="1"/>
                 <circle cx="300" cy="-17" r="5" fill="black"/>
                 <circle cx="320" cy="-17" r="5" fill="black"/>
                 
                 {/* Support leg */}
                 <line x1="380" y1="10" x2="380" y2="40" stroke="black" strokeWidth="2"/>
                 <line x1="370" y1="40" x2="390" y2="40" stroke="black" strokeWidth="2"/>
              </g>

              {/* TOWER */}
              {/* Main structure: Tapered Lattice */}
              <g transform="translate(250, 700)">
                 {/* Base Pivot */}
                 <path d="M0 0 L20 -50 L-20 -50 Z" fill="none" stroke="black" strokeWidth="1.5"/>
                 
                 {/* Tower Body - Angled slightly right */}
                 <path d="M-20 -50 L40 -650" fill="none" stroke="black" strokeWidth="2"/>
                 <path d="M20 -50 L60 -650" fill="none" stroke="black" strokeWidth="2"/>
                 
                 {/* Lattice Zig Zags */}
                 <path d="M-20 -50 L60 -100 L-10 -150 L58 -200 L-5 -250 L55 -300 L0 -350 L52 -400 L5 -450 L50 -500 L10 -550 L48 -600 L15 -650" 
                       fill="none" stroke="black" strokeWidth="1"/>
                 
                 {/* Top Sheave */}
                 <circle cx="50" cy="-660" r="12" fill="none" stroke="black" strokeWidth="2"/>
                 <circle cx="50" cy="-660" r="5" fill="black"/>
              </g>

              {/* DIMENSIONS */}
              {/* Reference Lines */}
              <line x1="310" y1="40" x2="395" y2="40" stroke="black" strokeWidth="1"/> {/* Top Ref */}
              <line x1="305" y1="150" x2="355" y2="150" stroke="black" strokeWidth="1"/> {/* DL Bottom Ref */}
              <line x1="300" y1="240" x2="355" y2="240" stroke="black" strokeWidth="1"/> {/* DF Bottom Ref */}
              <line x1="10" y1="780" x2="395" y2="780" stroke="black" strokeWidth="1"/> {/* Ground Ref */}

              {/* AC: Total Height */}
              <line x1="390" y1="40" x2="390" y2="780" stroke="black" strokeWidth="1" markerStart="url(#arrow-start)" markerEnd="url(#arrow-end)"/>
              <text x="375" y="410" className="text-xl font-bold" style={{writingMode: 'vertical-rl', textAnchor: 'middle'}}>AC</text>

              {/* DL: Safety Margin */}
              <line x1="350" y1="40" x2="350" y2="150" stroke="black" strokeWidth="1" markerStart="url(#arrow-start)" markerEnd="url(#arrow-end)"/>
              <text x="335" y="100" className="text-xl font-bold" style={{writingMode: 'vertical-rl', textAnchor: 'middle'}}>DL</text>

              {/* DF: Inertia */}
              <line x1="350" y1="150" x2="350" y2="240" stroke="black" strokeWidth="1" markerStart="url(#arrow-start)" markerEnd="url(#arrow-end)"/>
              <text x="335" y="200" className="text-xl font-bold" style={{writingMode: 'vertical-rl', textAnchor: 'middle'}}>DF</text>

           </svg>
        </div>

        {/* Calculation Table Column */}
        <div className="flex flex-col justify-center space-y-6">
            
            {/* Main Result Card */}
            <div className={`p-4 rounded-lg border-2 text-center ${safetyMargin >= 0 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <div className="text-xs uppercase font-bold text-gray-500 mb-1">Distancia Libre a Tablón (Margen Seguridad)</div>
                <div className={`text-4xl font-black ${safetyMargin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                   {safetyMargin.toFixed(2)} <span className="text-sm font-medium text-gray-400">mts</span>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-3">
               
               <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-gray-600">Altura torre - Tablón (AC)</label>
                  <div className="flex items-center gap-2">
                     <input 
                       type="number" 
                       className="w-20 p-1 border border-gray-300 rounded text-center font-medium"
                       value={data.towerHeight || ''}
                       onChange={(e) => handleDataChange('towerHeight', e.target.value)}
                       placeholder="0.00"
                     />
                     <span className="text-xs text-gray-400">mts</span>
                  </div>
               </div>

               <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300 shadow-sm flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-yellow-800">Inercia (DF)</label>
                  <div className="flex items-center gap-2">
                     <input 
                       type="number" 
                       className="w-20 p-1 border border-yellow-400 rounded text-center font-bold bg-white text-yellow-900"
                       value={data.inertia || ''}
                       onChange={(e) => handleDataChange('inertia', e.target.value)}
                       placeholder="0.00"
                     />
                     <span className="text-xs text-yellow-600">mts</span>
                  </div>
               </div>

               <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase ml-1">Componentes de la Sarta</div>
                  {[
                    { key: 'blockHeight', label: 'Aparejo' },
                    { key: 'linksHeight', label: 'Amela' },
                    { key: 'toolStringLength', label: 'Tiro o herramienta' },
                    { key: 'couplingHeight', label: 'Altura de Cupla' },
                    { key: 'workFloorHeight', label: 'Altura Piso de Trabajo' }
                  ].map((field) => (
                     <div key={field.key} className="flex justify-between items-center px-2 py-1 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-600">{field.label}</span>
                        <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             className="w-20 p-1 bg-gray-50 border-b border-gray-300 text-center text-sm outline-none focus:bg-white focus:border-brand-red transition-colors"
                             value={data[field.key as keyof InertiaData] || ''}
                             onChange={(e) => handleDataChange(field.key as keyof InertiaData, e.target.value)}
                             placeholder="-"
                           />
                           <span className="text-xs text-gray-400 w-6">mts</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
        </div>
      </div>

      {/* Aclaraciones / Footer Text */}
      <div className="px-6 py-4 bg-gray-50 border-t border-black text-xs text-gray-600 space-y-2">
          <div className="font-bold text-gray-800 underline">REFERENCIAS:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
             <div><span className="font-bold">AC:</span> Altura total torre a terreno.</div>
             <div><span className="font-bold">DF:</span> Inercia.</div>
             <div><span className="font-bold">DL:</span> Margen seguridad al tablón.</div>
          </div>
          <div className="mt-2 border-t border-gray-300 pt-2">
             <span className="font-bold text-gray-800">NOTA:</span> El corte de carrera del aparejo para las pruebas de inercia debe estar regulado a la altura del piso de enganche. Los resultados deben ser comunicados al Supervisor de Campo.
          </div>
      </div>

      {/* Signature */}
      <div className="p-8 mt-4 page-break flex justify-center">
         <div className="max-w-xs w-full text-center">
            <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                  label=""
                  className="w-full h-full border-0"
                  value={signature?.data}
                  onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                />
            </div>
            <div className="font-bold text-xs uppercase text-gray-500">Jefe de Equipo</div>
            <div className="text-[10px] text-gray-400">Firma y Aclaración</div>
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
               filename={`calculo_inercia_${metadata.date}_${metadata.well || 'pozo'}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              data, 
              signature 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Calculo
           </Button>
      </div>

    </div>
  );
};
