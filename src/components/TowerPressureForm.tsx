
import React, { useState } from 'react';
import { TowerPressureReport, TowerPressureMetadata, TowerPressureData } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { TowerPressurePdf } from '../pdf/TowerPressurePdf';

interface Props {
  initialData?: TowerPressureReport;
  onSave: (report: TowerPressureReport) => void;
  onCancel: () => void;
}

export const TowerPressureForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<TowerPressureMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: ''
  });

  const [data, setData] = useState<TowerPressureData>(initialData?.data || {
    chassisLeveling: null,
    section1_initialPressure: '',
    section1_intermediatePressure: '',
    section1_finalPressure: '',
    section1_cylinderState: null,
    section1_pinsSafety: null,
    section2_pressure: '',
    section2_cylinderState: null,
    section2_mechanicalLocks: null,
    section2_pinsSafety: null
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signature, setSignature] = useState(initialData?.signature);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleDataChange = (field: keyof TowerPressureData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const CheckboxGroup = ({ label, value, onChange }: { label: string, value: 'Correcto' | 'Incorrecto' | null, onChange: (val: 'Correcto' | 'Incorrecto' | null) => void }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-300 gap-2">
      <span className="font-medium text-xs sm:text-sm flex-1">{label}</span>
      <div className="flex gap-2">
        <button 
          onClick={() => onChange(value === 'Correcto' ? null : 'Correcto')}
          className={`px-3 py-1 text-xs border rounded transition-colors ${value === 'Correcto' ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-300 hover:bg-green-50'}`}
        >
          Correcto
        </button>
        <button 
          onClick={() => onChange(value === 'Incorrecto' ? null : 'Incorrecto')}
          className={`px-3 py-1 text-xs border rounded transition-colors ${value === 'Incorrecto' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-300 hover:bg-red-50'}`}
        >
          Incorrecto
        </button>
      </div>
    </div>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">REGISTRO DE PRESIONES DE TORRE</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WWO-021-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-16 text-xs uppercase">EQUIPO:</span>
               <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} title="Equipo" className="flex-1 outline-none bg-transparent uppercase">
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
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-16 text-xs uppercase">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} title="Fecha" className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Pre-Check */}
      <div className="p-4 border-b border-black">
         <h3 className="font-bold mb-2 uppercase border-b border-gray-300 pb-1 text-sm">Verificaciones Previas</h3>
         <CheckboxGroup 
            label="Nivelación del Chasis (Verificar con nivel)"
            value={data.chassisLeveling}
            onChange={(val) => handleDataChange('chassisLeveling', val)}
         />
      </div>

      {/* Section 1 */}
      <div className="p-4 border-b border-black">
         <h3 className="font-bold mb-4 uppercase border-b border-gray-300 pb-1 bg-gray-100 p-1 text-sm">1º Sección (Izaje de la Torre)</h3>
         
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            <div className="flex flex-col gap-1">
               <label className="text-[10px] font-bold uppercase text-gray-500">Presión Inicial (PSI)</label>
               <input 
                  type="number"
                  title="Presión Inicial (PSI)"
                  className="border border-gray-300 p-2 rounded outline-none"
                  value={data.section1_initialPressure}
                  onChange={(e) => handleDataChange('section1_initialPressure', e.target.value)}
                  placeholder="0"
               />
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-[10px] font-bold uppercase text-gray-500">Presión Intermedia (PSI)</label>
               <input 
                  type="number"
                  title="Presión Intermedia (PSI)"
                  className="border border-gray-300 p-2 rounded outline-none"
                  value={data.section1_intermediatePressure}
                  onChange={(e) => handleDataChange('section1_intermediatePressure', e.target.value)}
                  placeholder="0"
               />
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-[10px] font-bold uppercase text-gray-500">Presión Final (PSI)</label>
               <input 
                  type="number"
                  title="Presión Final (PSI)"
                  className="border border-gray-300 p-2 rounded outline-none"
                  value={data.section1_finalPressure}
                  onChange={(e) => handleDataChange('section1_finalPressure', e.target.value)}
                  placeholder="0"
               />
            </div>
         </div>

         <div className="space-y-1">
            <CheckboxGroup 
                label="Estado de los Cilindros (Fugas, daños)"
                value={data.section1_cylinderState}
                onChange={(val) => handleDataChange('section1_cylinderState', val)}
            />
            <CheckboxGroup 
                label="Seguros de pernos colocados"
                value={data.section1_pinsSafety}
                onChange={(val) => handleDataChange('section1_pinsSafety', val)}
            />
         </div>
      </div>

      {/* Section 2 */}
      <div className="p-4 border-b border-black">
         <h3 className="font-bold mb-4 uppercase border-b border-gray-300 pb-1 bg-gray-100 p-1 text-sm">2º Sección (Telescopado)</h3>
         
         <div className="flex flex-col gap-1 mb-4 max-w-xs">
            <label className="text-[10px] font-bold uppercase text-gray-500">Presión de Trabajo (PSI)</label>
            <input 
               type="number"
               title="Presión de Trabajo (PSI)"
               className="border border-gray-300 p-2 rounded outline-none"
               value={data.section2_pressure}
               onChange={(e) => handleDataChange('section2_pressure', e.target.value)}
               placeholder="0"
            />
         </div>

         <div className="space-y-1">
            <CheckboxGroup 
                label="Estado de los Cilindros (Fugas, daños)"
                value={data.section2_cylinderState}
                onChange={(val) => handleDataChange('section2_cylinderState', val)}
            />
            <CheckboxGroup 
                label="Trabas Mecánicas accionadas"
                value={data.section2_mechanicalLocks}
                onChange={(val) => handleDataChange('section2_mechanicalLocks', val)}
            />
            <CheckboxGroup 
                label="Seguros de pernos colocados"
                value={data.section2_pinsSafety}
                onChange={(val) => handleDataChange('section2_pinsSafety', val)}
            />
         </div>
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-1 uppercase text-xs">Observaciones:</div>
         <textarea 
            title="Observaciones"
            className="w-full h-24 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6 [background-size:100%_24px]"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signature */}
      <div className="p-8 page-break-inside-avoid flex justify-center">
         <div className="text-center w-64">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label=""
                   className="h-full border-0 w-full"
                   value={signature?.data}
                   onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Jefe de Equipo</div>
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
               filename={`presiones_torre_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<TowerPressurePdf report={{ id: initialData?.id ?? '', metadata, data, observations, signature }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              data,
              observations,
              signature 
            })} className="w-full sm:w-auto">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
