
import React, { useState, useRef } from 'react';
import { ManagerialVisitReport, ManagerialVisitMetadata, ManagerialVisitItem } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ManagerialVisitReport;
  onSave: (report: ManagerialVisitReport) => void;
  onCancel: () => void;
}

const QUESTIONS = [
  "Planificación de la operación - Revision con el Cliente terminos y requisitos de la operación.",
  "Conocimiento de los procedimientos operativos, registros y checklist asociados.",
  "Revisión de cálculos teóricos relacionados al desempeño de la operación.",
  "Confección de los Analisis de Riesgos pertinentes a la Operación. Difusión y charla Operativa.",
  "Coordinación y manejo integral de la operación y contingencias en el pozo.",
  "Conocimiento de procedimientos de seguridad y medio ambiente de la Operadora.",
  "Móvil asignado. Estado y realización de Checklist de vehiculos.",
  "Uso adecuado de los EPP asociados a la tarea.",
  "Gestión de residuos peligrosos en locación (Acciones preventivas ante derrames, trapos y guantes con HC).",
  "Confeccion de la documentacion asociada y necesaria para la cerrar el proceso de provisión del servicio de herramientas."
];

export const ManagerialVisitForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ManagerialVisitMetadata>(initialData?.metadata || {
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    name: '',
    dni: '',
    position: '',
    workOrder: '',
    activityType: '',
    coordinator1: '',
    evaluatorPosition1: '',
    coordinator2: '',
    evaluatorPosition2: ''
  });

  const [items, setItems] = useState<ManagerialVisitItem[]>(() => {
    if (initialData?.items && initialData.items.length > 0) return initialData.items;
    return QUESTIONS.map(q => ({
      id: crypto.randomUUID(),
      question: q,
      score: null,
      observation: ''
    }));
  });

  const [conclusions, setConclusions] = useState(initialData?.conclusions || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [signatures, setSignatures] = useState(initialData?.signatures || {});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof ManagerialVisitItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSignatureChange = (role: 'auditor1' | 'auditor2' | 'supervisor', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    let sum = 0;
    let count = 0;
    items.forEach(item => {
        if (item.score && item.score > 0) {
            sum += item.score;
            count++;
        }
    });
    return ((sum / 50) * 100).toFixed(0);
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
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">VISITA GERENCIAL EN OPERACIONES</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POSGI010-A2-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-xs space-y-3 bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">Lugar:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent font-medium" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">Hora:</span>
               <input type="time" name="time" value={metadata.time} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">Apellido y Nombre:</span>
               <input name="name" value={metadata.name} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent font-medium" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">N°DNI:</span>
               <input name="dni" value={metadata.dni} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">Cargo:</span>
               <input name="position" value={metadata.position} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 text-gray-500 uppercase">Orden de Trabajo:</span>
               <input name="workOrder" value={metadata.workOrder} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         <div className="flex border-b border-black border-dashed pb-1 items-end">
            <span className="font-bold mr-2 text-gray-500 uppercase w-48 sm:w-auto">Tipo Actividad / Operación:</span>
            <input name="activityType" value={metadata.activityType} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-2 rounded border border-gray-200">
            <div className="space-y-2">
                <div className="flex border-b border-gray-300 pb-1 items-end">
                   <span className="font-bold mr-2 w-32 text-gray-500 uppercase">Evaluador 1:</span>
                   <input name="coordinator1" value={metadata.coordinator1} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
                <div className="flex border-b border-gray-300 pb-1 items-end">
                   <span className="font-bold mr-2 w-32 text-gray-500 uppercase">Cargo:</span>
                   <input name="evaluatorPosition1" value={metadata.evaluatorPosition1} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex border-b border-gray-300 pb-1 items-end">
                   <span className="font-bold mr-2 w-32 text-gray-500 uppercase">Evaluador 2:</span>
                   <input name="coordinator2" value={metadata.coordinator2} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
                <div className="flex border-b border-gray-300 pb-1 items-end">
                   <span className="font-bold mr-2 w-32 text-gray-500 uppercase">Cargo:</span>
                   <input name="evaluatorPosition2" value={metadata.evaluatorPosition2} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
            </div>
         </div>
      </div>

      {/* Objectives and Tasks */}
      <div className="flex flex-col sm:flex-row border-b border-black">
         <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-black p-3 bg-gray-50 print:bg-transparent">
            <span className="font-bold text-sm">OBJETIVO:</span>
            <p className="mt-1 text-gray-600">Evaluar los comportamiento, conocimientos y actitudes del personal ante la actividad seleccionada contemplando factores operativos y QHSE.</p>
         </div>
         <div className="w-full sm:w-2/3 p-3">
            <span className="font-bold text-sm block mb-1">TAREAS A EVALUAR:</span>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-1">
               <li>Conocimiento del programa del pozo y de la operación.</li>
               <li>Contacto con el representante del cliente en el pozo.</li>
               <li>Documentación soporte de la operación generada en la misma.</li>
               <li>Presencia personal, móvil y herramienta.</li>
               <li>Seguimiento QHSE.</li>
            </ul>
         </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="border-b border-black p-2 text-center font-bold bg-gray-100 print:bg-transparent text-[10px] sm:text-xs uppercase text-gray-600">
         <span>Criterio:</span>
         <span className="mx-2">1 Deficiente</span>|
         <span className="mx-2">2 Regular</span>|
         <span className="mx-2">3 Bueno</span>|
         <span className="mx-2">4 Muy Bueno</span>|
         <span className="mx-2">5 Excelente</span>
      </div>

      {/* Main Grid */}
      <div className="w-full">
         <div className="hidden sm:grid grid-cols-12 bg-gray-200 border-b border-black font-bold text-center text-xs h-8 items-center">
            <div className="col-span-8 p-2 border-r border-black text-left">ASPECTOS A EVALUAR DEL PARTICIPANTE</div>
            <div className="col-span-2 p-2 border-r border-black">CALIFICACIÓN</div>
            <div className="col-span-2 p-2">OBSERVACIONES</div>
         </div>

         {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-gray-300 hover:bg-gray-50 min-h-[48px] items-center">
               <div className="col-span-8 sm:border-r border-black p-3 sm:p-2 sm:pl-4 font-medium text-sm sm:text-xs w-full bg-gray-50 sm:bg-transparent">
                  {item.question}
               </div>
               
               <div className="col-span-2 w-full sm:w-auto p-2 sm:border-r border-black flex justify-center border-t sm:border-t-0 border-gray-100">
                   <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(score => (
                          <div 
                             key={score}
                             onClick={() => handleItemChange(item.id, 'score', score)}
                             className={`w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center border rounded-full cursor-pointer transition-colors text-xs font-bold ${item.score === score ? 'bg-black text-white border-black' : 'hover:bg-gray-200 border-gray-300 text-gray-500'}`}
                          >
                             {score}
                          </div>
                       ))}
                   </div>
               </div>

               <div className="col-span-2 w-full sm:w-auto p-0 border-t sm:border-t-0 border-gray-100">
                  <input 
                     className="w-full h-10 sm:h-full px-3 sm:px-2 outline-none bg-transparent placeholder-gray-400 sm:placeholder-transparent text-sm sm:text-xs"
                     value={item.observation}
                     onChange={(e) => handleItemChange(item.id, 'observation', e.target.value)}
                     placeholder="Observaciones..."
                  />
               </div>
            </div>
         ))}
         
         <div className="flex justify-between items-center bg-gray-100 p-4 border-b border-black print:bg-transparent">
             <span className="font-bold text-sm uppercase text-gray-600">Porcentaje Total:</span>
             <div className="text-2xl font-bold text-black border-b-2 border-black px-4">{calculateTotal()}%</div>
         </div>
      </div>

      {/* Conclusions */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2 uppercase text-xs text-gray-500">CONCLUSIONES Y RECOMENDACIONES:</div>
         <textarea 
            className="w-full h-32 p-3 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
            value={conclusions}
            onChange={(e) => setConclusions(e.target.value)}
            placeholder="Ingrese conclusiones..."
         />
      </div>

      {/* Photos */}
      <div className="p-4 border-b border-black page-break-inside-avoid">
         <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <div className="font-bold uppercase text-sm text-gray-700">REGISTRO FOTOGRÁFICO ADJUNTO</div>
            <div className="no-print">
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  multiple 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
               />
               <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                  <span>📷</span> Adjuntar Fotos
               </Button>
            </div>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
               <div key={index} className="border border-gray-300 p-2 relative break-inside-avoid bg-white rounded shadow-sm">
                  <div className="aspect-square w-full flex items-center justify-center bg-gray-100 overflow-hidden rounded">
                     <img src={img} alt={`Evidencia ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <button 
                     onClick={() => removeImage(index)}
                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold no-print hover:bg-red-700 shadow"
                     title="Eliminar foto"
                  >
                     ✕
                  </button>
               </div>
            ))}
            {images.length === 0 && (
               <div className="col-span-2 sm:col-span-4 text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded">
                  (Sin fotos adjuntas)
               </div>
            )}
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 page-break-inside-avoid bg-gray-50 border-t border-black">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center bg-white border border-gray-200 rounded">
                 <div className="w-full h-full flex gap-2 p-1">
                    <SignaturePad 
                       label="" 
                       value={signatures.auditor1?.data} 
                       onChange={(val) => handleSignatureChange('auditor1', val)}
                       className="h-full flex-1 border-0"
                    />
                    <div className="w-px bg-gray-300 my-2"></div>
                    <SignaturePad 
                       label="" 
                       value={signatures.auditor2?.data} 
                       onChange={(val) => handleSignatureChange('auditor2', val)}
                       className="h-full flex-1 border-0"
                    />
                 </div>
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firmas de Auditores</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center bg-white border border-gray-200 rounded">
                <SignaturePad 
                   label="" 
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                   className="h-full w-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma de Supervisor</div>
          </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-white">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`visita_gerencial_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              items, 
              conclusions,
              images,
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Evaluación
           </Button>
        </div>

    </div>
  );
};
