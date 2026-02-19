
import { uploadFile } from '../lib/uploadFile';
import React, { useState, useRef } from 'react';
import { ForkliftLiftingPlanReport, LiftingPlanCheckItem } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ForkliftLiftingPlanReport;
  onSave: (report: ForkliftLiftingPlanReport) => void;
  onCancel: () => void;
}

const CHECKLIST_QUESTIONS = [
  "¿El operador posee carnet habilitante, vigente y acorde al equipo?",
  "¿El equipo posee la VTV vigente?",
  "¿El equipo posee el seguro obligatorio vigente?",
  "¿Se realizó el check list de pre-uso del equipo y se encuentra en condiciones?",
  "¿Se inspeccionaron los elementos de izaje y están en condiciones?",
  "¿Se conoce el peso de la carga a izar?",
  "¿La capacidad de carga del equipo es adecuada para el peso de la carga?",
  "¿El terreno es estable y nivelado para la operación?",
  "¿Se señalizó y delimitó el área de maniobra?",
  "¿Se verificó la ausencia de líneas eléctricas o interferencias aéreas?",
  "¿Se cuenta con señalero/rigger calificado (si es necesario)?",
  "¿Las condiciones climáticas son adecuadas (viento, visibilidad)?",
];

export const ForkliftLiftingPlanForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [general, setGeneral] = useState(initialData?.general || {
    date: new Date().toISOString().split('T')[0],
    location: '',
    workOrder: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const [equipment, setEquipment] = useState(initialData?.equipment || {
    type: '',
    brand: '',
    model: '',
    internalNumber: '',
    capacity: '',
    accessory: null // PLUMIN, PALA, UÑAS
  });

  const [personnel, setPersonnel] = useState(initialData?.personnel || {
    supervisor: '',
    operator: '',
    rigger: ''
  });

  const [checklist, setChecklist] = useState<LiftingPlanCheckItem[]>(() => {
    if (initialData?.checklist && initialData.checklist.length > 0) return initialData.checklist;
    return CHECKLIST_QUESTIONS.map((q, i) => ({
      id: i + 1,
      question: q,
      status: null
    }));
  });

  const [sketch, setSketch] = useState(initialData?.sketch || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChecklistChange = (id: number, status: 'SI' | 'NO' | 'NA') => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: item.status === status ? null : status } : item));
  };

  const handleSignatureChange = (role: 'supervisor' | 'executor', dataUrl: string | undefined) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        setSketch(url);
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert("Error al subir la imagen. Intenta de nuevo.");
      }
    }
  };


  const renderSection = (title: string, content: React.ReactNode, id: string) => (
    <details className="border border-gray-200 rounded-lg overflow-hidden mb-3 break-inside-avoid bg-white" open>
      <summary className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer font-bold text-sm text-gray-800 hover:bg-gray-100 list-none select-none border-b border-gray-200">
        <span className="uppercase">{title}</span>
        <svg className="h-4 w-4 text-gray-500 transition-transform ui-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </summary>
      <div className="p-4 text-xs">
        {content}
      </div>
    </details>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">PLAN DE IZAJE (CRÍTICO / NO CRÍTICO)</h1>
          <h2 className="font-bold text-base sm:text-lg uppercase leading-tight text-gray-600">MONTACARGAS / MANITOU</h2>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWWO001-A23-0</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
      
        {/* General Information */}
        {renderSection("1. Información General", (
           <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-24">Fecha:</span>
                    <input type="date" value={general.date} onChange={e => setGeneral({...general, date: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-24">Locación:</span>
                    <input value={general.location} onChange={e => setGeneral({...general, location: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-24">Orden Trabajo:</span>
                    <input value={general.workOrder} onChange={e => setGeneral({...general, workOrder: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
                 <div className="flex gap-4">
                    <div className="flex border-b border-gray-400 border-dashed items-end flex-1">
                       <span className="font-bold w-16">Inicio:</span>
                       <input type="time" value={general.startTime} onChange={e => setGeneral({...general, startTime: e.target.value})} className="flex-1 outline-none bg-transparent" />
                    </div>
                    <div className="flex border-b border-gray-400 border-dashed items-end flex-1">
                       <span className="font-bold w-16">Fin:</span>
                       <input type="time" value={general.endTime} onChange={e => setGeneral({...general, endTime: e.target.value})} className="flex-1 outline-none bg-transparent" />
                    </div>
                 </div>
              </div>
              <div className="flex border-b border-gray-400 border-dashed items-end">
                 <span className="font-bold w-32">Desc. Maniobra:</span>
                 <input value={general.description} onChange={e => setGeneral({...general, description: e.target.value})} className="flex-1 outline-none bg-transparent" />
              </div>
           </div>
        ), 'general')}

        {/* Equipment */}
        {renderSection("2. Datos del Equipo", (
           <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-20">Tipo:</span>
                    <input value={equipment.type} onChange={e => setEquipment({...equipment, type: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-20">Marca:</span>
                    <input value={equipment.brand} onChange={e => setEquipment({...equipment, brand: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-20">Modelo:</span>
                    <input value={equipment.model} onChange={e => setEquipment({...equipment, model: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-24">Interno N°:</span>
                    <input value={equipment.internalNumber} onChange={e => setEquipment({...equipment, internalNumber: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
                 <div className="flex border-b border-gray-400 border-dashed items-end">
                    <span className="font-bold w-32">Capacidad Max:</span>
                    <input value={equipment.capacity} onChange={e => setEquipment({...equipment, capacity: e.target.value})} className="flex-1 outline-none bg-transparent" />
                 </div>
                 
                 {/* Accessories */}
                 <div className="sm:col-span-2 border border-gray-300 p-2 rounded bg-gray-50/50">
                    <div className="font-bold mb-2">Accesorio de trabajo:</div>
                    <div className="flex flex-wrap gap-4 items-center">
                       <div className="flex items-center gap-1 cursor-pointer" onClick={() => setEquipment({...equipment, accessory: equipment.accessory === 'PLUMIN' ? null : 'PLUMIN'})}>
                          <div className={`w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center ${equipment.accessory === 'PLUMIN' ? 'bg-black' : 'bg-white'}`}>
                             {equipment.accessory === 'PLUMIN' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span>Plumín con Gancho</span>
                       </div>
                       <div className="flex items-center gap-1 cursor-pointer" onClick={() => setEquipment({...equipment, accessory: equipment.accessory === 'PALA' ? null : 'PALA'})}>
                          <div className={`w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center ${equipment.accessory === 'PALA' ? 'bg-black' : 'bg-white'}`}>
                             {equipment.accessory === 'PALA' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span>Pala Cargadora</span>
                       </div>
                       <div className="flex items-center gap-1 cursor-pointer" onClick={() => setEquipment({...equipment, accessory: equipment.accessory === 'UÑAS' ? null : 'UÑAS'})}>
                          <div className={`w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center ${equipment.accessory === 'UÑAS' ? 'bg-black' : 'bg-white'}`}>
                             {equipment.accessory === 'UÑAS' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span>Uñas</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        ), 'equipment')}

        {/* Personnel */}
        {renderSection("3. Personal Involucrado", (
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex border-b border-gray-400 border-dashed items-end">
                 <span className="font-bold w-24">Supervisor:</span>
                 <input value={personnel.supervisor} onChange={e => setPersonnel({...personnel, supervisor: e.target.value})} className="flex-1 outline-none bg-transparent" />
              </div>
              <div className="flex border-b border-gray-400 border-dashed items-end">
                 <span className="font-bold w-24">Operador:</span>
                 <input value={personnel.operator} onChange={e => setPersonnel({...personnel, operator: e.target.value})} className="flex-1 outline-none bg-transparent" />
              </div>
              <div className="flex border-b border-gray-400 border-dashed items-end">
                 <span className="font-bold w-24">Señalero:</span>
                 <input value={personnel.rigger} onChange={e => setPersonnel({...personnel, rigger: e.target.value})} className="flex-1 outline-none bg-transparent" />
              </div>
           </div>
        ), 'personnel')}

        {/* Checklist */}
        {renderSection("4. Checklist Pre-Maniobra", (
           <div className="border border-gray-300 rounded">
              <div className="flex font-bold border-b border-gray-300 bg-gray-100 p-2 text-xs">
                 <div className="flex-1">Pregunta</div>
                 <div className="w-10 text-center">SI</div>
                 <div className="w-10 text-center">NO</div>
                 <div className="w-10 text-center">NA</div>
              </div>
              {checklist.map(item => (
                 <div key={item.id} className="flex border-b border-gray-200 last:border-b-0 hover:bg-gray-50 items-center min-h-[40px] sm:min-h-[30px]">
                    <div className="flex-1 p-2 leading-tight">{item.question}</div>
                    <div className={`w-10 border-l border-gray-200 min-h-[36px] flex items-center justify-center cursor-pointer ${item.status === 'SI' ? 'bg-black text-white font-bold' : 'hover:bg-gray-100'}`} onClick={() => handleChecklistChange(item.id, 'SI')}>
                      {item.status === 'SI' && 'X'}
                    </div>
                    <div className={`w-10 border-l border-gray-200 min-h-[36px] flex items-center justify-center cursor-pointer ${item.status === 'NO' ? 'bg-black text-white font-bold' : 'hover:bg-gray-100'}`} onClick={() => handleChecklistChange(item.id, 'NO')}>
                      {item.status === 'NO' && 'X'}
                    </div>
                    <div className={`w-10 border-l border-gray-200 min-h-[36px] flex items-center justify-center cursor-pointer ${item.status === 'NA' ? 'bg-black text-white font-bold' : 'hover:bg-gray-100'}`} onClick={() => handleChecklistChange(item.id, 'NA')}>
                      {item.status === 'NA' && 'X'}
                    </div>
                 </div>
              ))}
           </div>
        ), 'checklist')}

      </div>

      {/* Sketch */}
      <div className="p-4 border-t border-black page-break-inside-avoid bg-white">
         <div className="flex justify-between items-center mb-2">
            <div className="font-bold underline text-sm uppercase">5. Croquis / Esquema de Izaje</div>
            <div className="no-print">
               <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
               <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>Adjuntar Esquema</Button>
            </div>
         </div>
         <div className="border border-gray-300 h-48 flex items-center justify-center bg-gray-50 overflow-hidden rounded">
            {sketch ? (
               <img src={sketch} alt="Esquema" className="max-w-full max-h-full object-contain" />
            ) : (
               <span className="text-gray-400 italic">Espacio para croquis o imagen adjunta</span>
            )}
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-8 page-break-inside-avoid bg-white border-t border-black">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                   className="h-full w-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma Supervisor</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.executor?.data} 
                   onChange={(val) => handleSignatureChange('executor', val)}
                   className="h-full w-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma Ejecutor / Operador</div>
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
               filename={`plan_izaje_${general.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              general,
              equipment,
              personnel,
              checklist,
              sketch,
              signatures
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Plan
           </Button>
        </div>

    </div>
  );
};
