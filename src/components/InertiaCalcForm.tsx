
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
           <label htmlFor="equipment" className="font-bold w-24 uppercase text-xs text-gray-500">Equipo:</label>
           <select id="equipment" name="equipment" title="Equipo" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase">
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
           <label htmlFor="date" className="font-bold w-24 uppercase text-xs text-gray-500">Fecha:</label>
           <input 
             id="date"
             type="date"
             name="date" 
             title="Fecha"
             value={metadata.date} 
             onChange={handleMetadataChange}
             className="flex-1 outline-none bg-transparent"
           />
        </div>
        <div className="flex items-center border-b border-black border-dashed pb-1">
           <label htmlFor="field" className="font-bold w-24 uppercase text-xs text-gray-500">Yacimiento:</label>
           <input 
             id="field"
             name="field" 
             title="Yacimiento"
             placeholder="Yacimiento"
             value={metadata.field} 
             onChange={handleMetadataChange}
             className="flex-1 outline-none bg-transparent uppercase"
           />
        </div>
        <div className="flex items-center border-b border-black border-dashed pb-1">
           <label htmlFor="well" className="font-bold w-24 uppercase text-xs text-gray-500">Pozo:</label>
           <input 
             id="well"
             name="well" 
             title="Pozo"
             placeholder="Pozo"
             value={metadata.well} 
             onChange={handleMetadataChange}
             className="flex-1 outline-none bg-transparent uppercase"
           />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        
        {/* Diagram Column - Reference Image */}
        <div className="relative border border-gray-100 rounded bg-white flex flex-col items-center justify-center overflow-hidden p-2">
           <div className="text-xs text-gray-500 space-y-1 z-10 bg-white/80 p-2 rounded shadow-sm border border-gray-200 w-full mb-2">
              <p className="font-bold text-gray-700 mb-1">INSTRUCCIONES:</p>
              <p>1- Para el calculo de "Inercia", seguir referencias.</p>
              <p>2- Completar los casilleros en la tabla.</p>
           </div>
           <img
             src="https://raw.githubusercontent.com/apu242007/WS-OPERACIONES/main/src/inercia.png"
             alt="Diagrama de cálculo de inercia"
             className="w-full h-auto object-contain rounded max-h-[560px]"
           />
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
