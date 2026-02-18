
import React, { useState } from 'react';
import { ShiftChangeReport, ShiftChangeMetadata, OperationalAspects, ShiftChangeChecklist } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ShiftChangeReport;
  onSave: (report: ShiftChangeReport) => void;
  onCancel: () => void;
}

// Checklist items configuration
const CHECKLIST_ITEMS = [
  // Col 1
  { id: 'ppe', label: 'Poseen todos los EPP en la Operación' },
  { id: 'ats', label: 'Se leen los ATS - IPCR de las tareas' },
  { id: 'h2s', label: 'Usan detectores H2S personales' },
  { id: 'monitor', label: 'Asignan el Monitor del día' },
  { id: 'permits', label: 'Completan Permisos de Trabajo' },
  { id: 'cableClamp', label: 'Control grampa cable de tambor principal' },
  // Col 2
  { id: 'bop', label: 'Chequear Conjunto de BOP' },
  { id: 'accumulator', label: 'Chequear Acumulador de presión' },
  { id: 'choke', label: 'Chequear Choke Manifold' },
  { id: 'tankLevels', label: 'Chequear Niveles de Pileta' },
  { id: 'testTank', label: 'Chequear Pileta Ensayo y Golpeador' },
  { id: 'otherEquip', label: 'Otros Aspectos del Equipamiento' },
  // Col 3
  { id: 'serviceCo', label: 'Opera Cia Servicio. Evidencia' },
  { id: 'cleanPits', label: 'Barcachos ordenado y limpio' },
  { id: 'cleanWarehouse', label: 'Depósito ordenado y limpio' },
  { id: 'tools', label: 'Herramientas en condiciones' },
  { id: 'waste', label: 'Residuos clasificados' },
  { id: 'otherClean', label: 'Otros Aspectos Orden y Limpieza' },
];

export const ShiftChangeForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  
  // -- Metadata State --
  const [metadata, setMetadata] = useState<ShiftChangeMetadata>(initialData?.metadata || {
    equipment: '',
    well: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    meetingType: '',
    coordinator: '',
    operation: '',
    topic: ''
  });

  // -- Operational Data State --
  const [operational, setOperational] = useState<OperationalAspects>(initialData?.operational || {
    htaWell: '', tbgWell: '', vbWell: '', tankLevel1: '',
    pmWell: '', tbgTower: '', vbScaffold: '', tankLevel2: '',
    pmScaffold: '', tbgScaffold: '', pumpFunc: '', tankLevel3: ''
  });

  // -- Checklist State --
  const [checklist, setChecklist] = useState<ShiftChangeChecklist>(initialData?.checklist || {});

  // -- Observations State --
  const [observations, setObservations] = useState(initialData?.observations || '');

  // -- Signatures State --
  const [signatures, setSignatures] = useState(initialData?.signatures || {});


  // Handlers
  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleOpChange = (name: keyof OperationalAspects, value: string) => {
    setOperational(prev => ({ ...prev, [name]: value }));
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSignatureChange = (role: 'rigManager' | 'companyRepresentative', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl sm:text-2xl uppercase leading-tight">REUNION CAMBIO DE TURNO</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG015-A1-3</div>
        </div>
      </div>

      {/* Basic Info Bar */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 text-sm border-b border-black">
         <div className="col-span-4 flex flex-col sm:flex-row border-b sm:border-b-0 sm:border-r border-black">
            <div className="font-bold p-1 pl-2 bg-gray-50 print:bg-transparent uppercase w-full sm:w-auto">EQUIPO:</div>
            <input name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none font-medium sm:text-center uppercase w-full" />
         </div>
         <div className="col-span-4 flex flex-col sm:flex-row border-b sm:border-b-0 sm:border-r border-black">
            <div className="font-bold p-1 pl-2 bg-gray-50 print:bg-transparent uppercase w-full sm:w-auto">POZO:</div>
            <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none font-medium sm:text-center uppercase w-full" />
         </div>
         <div className="col-span-2 flex flex-col sm:flex-row border-b sm:border-b-0 sm:border-r border-black">
            <div className="font-bold p-1 pl-2 bg-gray-50 print:bg-transparent uppercase w-full sm:w-auto">FECHA:</div>
            <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none font-medium sm:text-center w-full" />
         </div>
         <div className="col-span-2 flex flex-col sm:flex-row">
            <div className="font-bold p-1 pl-2 bg-gray-50 print:bg-transparent uppercase w-full sm:w-auto">HORA:</div>
            <input type="time" name="time" value={metadata.time} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none font-medium sm:text-center w-full" />
         </div>
      </div>

      {/* Meeting Details */}
      <div className="text-sm border-b-2 border-black">
         <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-400">
            <div className="font-bold p-2 sm:p-1 sm:pl-2 w-full sm:w-48 bg-gray-50 print:bg-transparent uppercase">TIPO DE REUNION:</div>
            <input name="meetingType" value={metadata.meetingType} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none w-full" />
         </div>
         <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-400">
            <div className="font-bold p-2 sm:p-1 sm:pl-2 w-full sm:w-56 bg-gray-50 print:bg-transparent uppercase">COORDINADOR DE REUNION:</div>
            <input name="coordinator" value={metadata.coordinator} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none w-full" />
         </div>
         <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="font-bold p-2 sm:p-1 sm:pl-2 w-full sm:w-48 bg-gray-50 print:bg-transparent uppercase">OPERACIÓN EN EL EQUIPO:</div>
            <input name="operation" value={metadata.operation} onChange={handleMetadataChange} className="flex-1 p-2 sm:p-1 outline-none w-full" />
         </div>
      </div>

      {/* Meeting Topic */}
      <div className="border-b-2 border-black">
          <div className="font-bold p-2 sm:p-1 sm:pl-2 text-sm bg-gray-100 border-b border-gray-400 print:bg-transparent">Tema de Reunión (breve detalle):</div>
          <textarea 
            name="topic"
            value={metadata.topic}
            onChange={handleMetadataChange}
            rows={5}
            className="w-full p-2 text-sm outline-none resize-none bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
          />
      </div>

      {/* Operational Aspects */}
      <div className="border-b-2 border-black text-sm">
         <div className="font-bold italic p-2 sm:p-1 sm:pl-2 border-b border-black">Aspectos OPERATIVOS en el Cambio de Turno:</div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 p-2">
            {/* Column 1 */}
            <div className="space-y-2">
                <div className="flex items-end gap-1">
                   <span className="italic whitespace-nowrap w-24 sm:w-auto">HTA en el Pozo</span>
                   <input 
                      value={operational.htaWell} 
                      onChange={(e) => handleOpChange('htaWell', e.target.value)} 
                      className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                   />
                </div>
                <div className="flex items-end gap-1">
                   <span className="italic whitespace-nowrap w-24 sm:w-auto">Tbg Pozo</span>
                   <input 
                      value={operational.tbgWell} 
                      onChange={(e) => handleOpChange('tbgWell', e.target.value)} 
                      className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                   />
                </div>
                <div className="flex gap-4">
                   <div className="flex items-end gap-1 flex-1">
                      <span className="italic whitespace-nowrap">V/B Pozo</span>
                      <input 
                         value={operational.vbWell} 
                         onChange={(e) => handleOpChange('vbWell', e.target.value)} 
                         className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                      />
                   </div>
                   <div className="flex items-end gap-1 flex-1">
                      <span className="italic whitespace-nowrap">Nivel Pileta 1</span>
                      <input 
                         value={operational.tankLevel1} 
                         onChange={(e) => handleOpChange('tankLevel1', e.target.value)} 
                         className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                      />
                   </div>
                </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
                <div className="flex items-end gap-1">
                   <span className="italic whitespace-nowrap w-24 sm:w-auto">PM Pozo</span>
                   <input 
                      value={operational.pmWell} 
                      onChange={(e) => handleOpChange('pmWell', e.target.value)} 
                      className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                   />
                </div>
                <div className="flex items-end gap-1">
                   <span className="italic whitespace-nowrap w-24 sm:w-auto">Tbg Torre</span>
                   <input 
                      value={operational.tbgTower} 
                      onChange={(e) => handleOpChange('tbgTower', e.target.value)} 
                      className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                   />
                </div>
                <div className="flex gap-4">
                   <div className="flex items-end gap-1 flex-1">
                      <span className="italic whitespace-nowrap">V/B Caballete</span>
                      <input 
                         value={operational.vbScaffold} 
                         onChange={(e) => handleOpChange('vbScaffold', e.target.value)} 
                         className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                      />
                   </div>
                   <div className="flex items-end gap-1 flex-1">
                      <span className="italic whitespace-nowrap">Nivel Pileta 2</span>
                      <input 
                         value={operational.tankLevel2} 
                         onChange={(e) => handleOpChange('tankLevel2', e.target.value)} 
                         className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                      />
                   </div>
                </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
                <div className="flex items-end gap-1">
                   <span className="italic whitespace-nowrap w-24 sm:w-auto">PM Caballete</span>
                   <input 
                      value={operational.pmScaffold} 
                      onChange={(e) => handleOpChange('pmScaffold', e.target.value)} 
                      className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                   />
                </div>
                <div className="flex items-end gap-1">
                   <span className="italic whitespace-nowrap w-24 sm:w-auto">Tbg Caballete</span>
                   <input 
                      value={operational.tbgScaffold} 
                      onChange={(e) => handleOpChange('tbgScaffold', e.target.value)} 
                      className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                   />
                </div>
                <div className="flex gap-4">
                   <div className="flex items-end gap-1 flex-1">
                      <span className="italic whitespace-nowrap">Func. Bomba</span>
                      <input 
                         value={operational.pumpFunc} 
                         onChange={(e) => handleOpChange('pumpFunc', e.target.value)} 
                         className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                      />
                   </div>
                   <div className="flex items-end gap-1 flex-1">
                      <span className="italic whitespace-nowrap">Nivel Pileta 3</span>
                      <input 
                         value={operational.tankLevel3} 
                         onChange={(e) => handleOpChange('tankLevel3', e.target.value)} 
                         className="flex-1 border-b border-gray-400 outline-none text-center px-1" 
                      />
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* Safety & Equipment Checklist */}
      <div className="border-b-2 border-black text-sm">
          <div className="font-bold p-2 sm:p-1 sm:pl-2 border-b border-black bg-gray-50 print:bg-transparent">
             Aspectos de SEGURIDAD, EQUIPAMIENTO y de ORDEN y LIMPIEZA a Verificar en el Cambio de Turno:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 p-2 gap-x-4 gap-y-4 sm:gap-y-0">
             {/* Render Items Logic */}
             {[0, 1, 2].map(colIndex => (
               <div key={colIndex} className="space-y-1">
                  {CHECKLIST_ITEMS.slice(colIndex * 6, (colIndex + 1) * 6).map(item => (
                     <div key={item.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1.5 sm:p-0.5 rounded border sm:border-0 border-gray-100" onClick={() => toggleCheck(item.id)}>
                        <div className={`w-5 h-5 sm:w-4 sm:h-4 border border-black flex-shrink-0 flex items-center justify-center ${checklist[item.id] ? 'bg-black text-white' : 'bg-white'}`}>
                           {checklist[item.id] && '✓'}
                        </div>
                        <span className="text-sm sm:text-xs md:text-sm leading-tight select-none pt-0.5">{item.label}</span>
                     </div>
                  ))}
               </div>
             ))}
          </div>
      </div>

      {/* Observations */}
      <div className="border-b border-black">
          <div className="font-bold italic p-2 sm:p-1 sm:pl-2 border-b border-gray-300">Observaciones:</div>
          <textarea 
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={4}
            className="w-full p-2 text-sm outline-none resize-none bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
          />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-4 sm:p-8 pt-8 sm:pt-12 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1">
                <SignaturePad 
                   label="" 
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                />
             </div>
             <div className="font-bold text-sm">Jefe de Equipo</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1">
                <SignaturePad 
                   label="" 
                   value={signatures.companyRepresentative?.data} 
                   onChange={(val) => handleSignatureChange('companyRepresentative', val)}
                />
             </div>
             <div className="font-bold text-sm">Jefe de Campo</div>
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
               filename={`cambio_turno_${metadata.date}_${metadata.well || 'pozo'}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              operational, 
              checklist, 
              observations, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Reunion
           </Button>
        </div>

    </div>
  );
};
