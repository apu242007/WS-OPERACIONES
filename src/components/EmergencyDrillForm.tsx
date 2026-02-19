
import { uploadFileToDrive } from '../lib/uploadToDrive';
import React, { useState, useRef } from 'react';
import { EmergencyDrillReport, EmergencyDrillMetadata, EmergencyDrillData } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: EmergencyDrillReport;
  onSave: (report: EmergencyDrillReport) => void;
  onCancel: () => void;
}

const OBJECTIVES = [
  "Evaluar Plan de Respuesta ante Emergencia",
  "Evaluar funcionamiento de roles",
  "Evaluar funcionamiento de comunicaciones",
  "Evaluar uso de equipo de emergencias",
  "Entrenamiento de personal"
];

const ASPECTS_TO_REVIEW = [
  "Aviso de la emergencia",
  "Actuación de la brigada de emergencias",
  "Concurrencia al punto de reunión",
  "Recuento del personal",
  "Comunicaciones"
];

const RESOURCES = [
  "Alarma Sonora",
  "Alarma Visual",
  "Extintores",
  "Equipo de respiración",
  "Camilla / Botiquín",
  "Vehículo de emergencia",
  "Teléfono / Radio",
  "Otros"
];

export const EmergencyDrillForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<EmergencyDrillMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    performedBy: '',
    location: '',
    type: '',
    businessUnit: '',
    participants: '',
    observers: '',
    startTime: '',
    endTime: '',
    site: ''
  });

  const [data, setData] = useState<EmergencyDrillData>(initialData?.data || {
    objectives: [],
    aspectsToReview: [],
    scenarioDescription: '',
    resourcesUsed: [],
    resourceAdequacy: null,
    locationSuitability: null,
    soundAlarm: null,
    visualAlarm: null,
    meetingPoints: null,
    personnelDirectedCorrectly: null,
    phoneCommunication: null,
    alarmTime: '',
    communicationTime: '',
    meetingTime: '',
    actionStartTime: '',
    responseTimeStatus: null,
    drillDevelopmentStatus: null,
    observations: '',
    finalResult: null,
    improvements: ''
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [signature, setSignature] = useState(initialData?.signature);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleDataChange = (field: keyof EmergencyDrillData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field: 'objectives' | 'aspectsToReview' | 'resourcesUsed', item: string) => {
    setData(prev => {
      const list = prev[field] as string[];
      if (list.includes(item)) {
        return { ...prev, [field]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...list, item] };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadingImages(true);
      try {
        const urls = await Promise.all(files.map((file) => uploadFileToDrive(file)));
        setImages(prev => [...prev, ...urls]);
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert("Error al subir la imagen. Intenta de nuevo.");
      } finally {
        setUploadingImages(false);
      }
    }
  };


  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const StatusSelector = ({ value, onChange }: { value: 'Bien' | 'Regular' | 'Mal' | null, onChange: (val: 'Bien' | 'Regular' | 'Mal' | null) => void }) => (
    <div className="flex gap-1">
      {(['Bien', 'Regular', 'Mal'] as const).map(option => (
        <button
          key={option}
          onClick={() => onChange(value === option ? null : option)}
          className={`px-2 py-1 text-xs border rounded transition-colors ${value === option 
            ? (option === 'Bien' ? 'bg-green-600 text-white' : option === 'Regular' ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white')
            : 'bg-white border-gray-300 hover:bg-gray-50'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="grid grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-r-2 border-black">
          <h1 className="font-black text-xl uppercase leading-tight">REGISTRO DE SIMULACRO DE EMERGENCIA</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POSGI008-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-32">Fecha Realización:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-32">Realizado por:</span>
               <input name="performedBy" value={metadata.performedBy} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-32">Equipo:</span>
               <select name="equipment" value={metadata.equipment || ''} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent border-b border-gray-400 border-dashed">
                  <option value="">- Seleccionar -</option>
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
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-32">Lugar:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-32">Tipo de Simulacro:</span>
               <input name="type" value={metadata.type} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" placeholder="Ej: Incendio, Evacuación..." />
            </div>
         </div>
         
         <div className="mt-4 border border-black p-2 bg-white">
            <div className="font-bold mb-2">UNIDAD DE NEGOCIO:</div>
            <div className="flex flex-wrap gap-4">
               {['MASE', 'Workover', 'Pulling', 'Base Operativa', 'Base Herramientas', 'Fábrica'].map(unit => (
                  <label key={unit} className="flex items-center gap-1 cursor-pointer">
                     <input 
                        type="radio" 
                        name="businessUnit" 
                        value={unit} 
                        checked={metadata.businessUnit === unit} 
                        onChange={handleMetadataChange}
                     />
                     <span>{unit}</span>
                  </label>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Participantes:</span>
               <input name="participants" value={metadata.participants} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Observadores:</span>
               <input name="observers" value={metadata.observers} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Objectives & Aspects */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
         <div className="p-4 border-r border-black">
            <div className="font-bold underline mb-2">OBJETIVO DEL SIMULACRO</div>
            <div className="space-y-1">
               {OBJECTIVES.map(obj => (
                  <label key={obj} className="flex items-start gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={data.objectives.includes(obj)} 
                        onChange={() => toggleSelection('objectives', obj)} 
                     />
                     <span>{obj}</span>
                  </label>
               ))}
            </div>
         </div>
         <div className="p-4">
            <div className="font-bold underline mb-2">ASPECTOS A REVISAR</div>
            <div className="space-y-1">
               {ASPECTS_TO_REVIEW.map(asp => (
                  <label key={asp} className="flex items-start gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={data.aspectsToReview.includes(asp)} 
                        onChange={() => toggleSelection('aspectsToReview', asp)} 
                     />
                     <span>{asp}</span>
                  </label>
               ))}
            </div>
         </div>
      </div>

      {/* Scenario & Resources */}
      <div className="p-4 border-b border-black">
         <div className="mb-4">
            <div className="font-bold underline mb-2">DESCRIPCION DEL ESCENARIO PLANTEADO</div>
            <textarea 
               className="w-full h-20 p-2 border border-gray-300 rounded resize-none outline-none"
               value={data.scenarioDescription}
               onChange={(e) => handleDataChange('scenarioDescription', e.target.value)}
            />
         </div>
         <div>
            <div className="font-bold underline mb-2">RECURSOS UTILIZADOS</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {RESOURCES.map(res => (
                  <label key={res} className="flex items-center gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={data.resourcesUsed.includes(res)} 
                        onChange={() => toggleSelection('resourcesUsed', res)} 
                     />
                     <span>{res}</span>
                  </label>
               ))}
            </div>
         </div>
      </div>

      {/* Evaluation */}
      <div className="p-4 border-b border-black">
         <div className="font-bold underline mb-4 text-center">EVALUACION DEL SIMULACRO</div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Adecuación de los recursos</span>
                  <StatusSelector value={data.resourceAdequacy} onChange={(val) => handleDataChange('resourceAdequacy', val)} />
               </div>
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Ubicación del simulacro</span>
                  <StatusSelector value={data.locationSuitability} onChange={(val) => handleDataChange('locationSuitability', val)} />
               </div>
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Alarma Sonora (funcionamiento)</span>
                  <StatusSelector value={data.soundAlarm} onChange={(val) => handleDataChange('soundAlarm', val)} />
               </div>
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Alarma Visual (funcionamiento)</span>
                  <StatusSelector value={data.visualAlarm} onChange={(val) => handleDataChange('visualAlarm', val)} />
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Puntos de reunión (estado)</span>
                  <StatusSelector value={data.meetingPoints} onChange={(val) => handleDataChange('meetingPoints', val)} />
               </div>
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Todo el personal se dirigió correctamente</span>
                  <div className="flex gap-2">
                     <button onClick={() => handleDataChange('personnelDirectedCorrectly', true)} className={`px-3 py-1 border rounded text-xs ${data.personnelDirectedCorrectly === true ? 'bg-black text-white' : 'bg-white'}`}>Sí</button>
                     <button onClick={() => handleDataChange('personnelDirectedCorrectly', false)} className={`px-3 py-1 border rounded text-xs ${data.personnelDirectedCorrectly === false ? 'bg-black text-white' : 'bg-white'}`}>No</button>
                  </div>
               </div>
               <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span>Comunicación telefónica / radial</span>
                  <StatusSelector value={data.phoneCommunication} onChange={(val) => handleDataChange('phoneCommunication', val)} />
               </div>
            </div>
         </div>
      </div>

      {/* Timings */}
      <div className="p-4 border-b border-black bg-gray-50 print:bg-transparent">
         <div className="font-bold underline mb-4 text-center">TIEMPOS DE RESPUESTA</div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
               <div className="font-bold text-xs mb-1">Hora inicio simulacro:</div>
               <input type="time" value={metadata.startTime} onChange={handleMetadataChange} name="startTime" className="border border-gray-400 p-1 rounded w-full text-center" />
            </div>
            <div>
               <div className="font-bold text-xs mb-1">Tiempo de aviso alarma:</div>
               <input value={data.alarmTime} onChange={(e) => handleDataChange('alarmTime', e.target.value)} className="border border-gray-400 p-1 rounded w-full text-center" placeholder="min:seg" />
            </div>
            <div>
               <div className="font-bold text-xs mb-1">Tiempo comunicación:</div>
               <input value={data.communicationTime} onChange={(e) => handleDataChange('communicationTime', e.target.value)} className="border border-gray-400 p-1 rounded w-full text-center" placeholder="min:seg" />
            </div>
            <div>
               <div className="font-bold text-xs mb-1">Tiempo llegada pto reunión:</div>
               <input value={data.meetingTime} onChange={(e) => handleDataChange('meetingTime', e.target.value)} className="border border-gray-400 p-1 rounded w-full text-center" placeholder="min:seg" />
            </div>
            <div>
               <div className="font-bold text-xs mb-1">Hora inicio acciones:</div>
               <input value={data.actionStartTime} onChange={(e) => handleDataChange('actionStartTime', e.target.value)} className="border border-gray-400 p-1 rounded w-full text-center" placeholder="HH:MM" />
            </div>
            <div>
               <div className="font-bold text-xs mb-1">Hora finalización:</div>
               <input type="time" value={metadata.endTime} onChange={handleMetadataChange} name="endTime" className="border border-gray-400 p-1 rounded w-full text-center" />
            </div>
         </div>
         
         <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="flex justify-between items-center border-b border-gray-300 pb-1">
               <span className="font-bold">Tiempo de Respuesta</span>
               <StatusSelector value={data.responseTimeStatus} onChange={(val) => handleDataChange('responseTimeStatus', val)} />
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-1">
               <span className="font-bold">Desarrollo del Simulacro</span>
               <StatusSelector value={data.drillDevelopmentStatus} onChange={(val) => handleDataChange('drillDevelopmentStatus', val)} />
            </div>
         </div>
      </div>

      {/* Observations & Photos */}
      <div className="p-4 border-b border-black">
         <div className="mb-4">
            <div className="font-bold mb-1">OBSERVACIONES:</div>
            <textarea 
               className="w-full h-20 p-2 resize-none outline-none border border-gray-300 text-xs"
               value={data.observations}
               onChange={(e) => handleDataChange('observations', e.target.value)}
            />
         </div>
         
         <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
               <div className="font-bold">EVIDENCIA FOTOGRÁFICA</div>
               <div className="no-print">
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" />
                  <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>Adjuntar Fotos</Button>
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                     <img src={img} alt={`Evidencia ${idx}`} className="max-w-full max-h-full object-contain" />
                     <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold no-print">&times;</button>
                  </div>
               ))}
            </div>
         </div>

         <div>
            <div className="font-bold mb-1">MEJORAS IMPLEMENTADAS / PROPUESTAS:</div>
            <textarea 
               className="w-full h-16 p-2 resize-none outline-none border border-gray-300 text-xs"
               value={data.improvements}
               onChange={(e) => handleDataChange('improvements', e.target.value)}
            />
         </div>
      </div>

      {/* Final Result */}
      <div className="p-4 border-b border-black flex items-center justify-between bg-gray-100 print:bg-transparent">
         <span className="font-bold text-lg uppercase">RESULTADO FINAL DEL SIMULACRO</span>
         <StatusSelector value={data.finalResult} onChange={(val) => handleDataChange('finalResult', val)} />
      </div>

      {/* Site & Signature */}
      <div className="p-8 page-break-inside-avoid">
         <div className="mb-8">
            <div className="flex items-end gap-2">
               <span className="font-bold">SITIO:</span>
               <input name="site" value={metadata.site} onChange={handleMetadataChange} className="flex-1 border-b border-black outline-none bg-transparent" />
            </div>
         </div>
         
         <div className="flex justify-center">
            <div className="text-center w-64">
                <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                   <SignaturePad 
                      label=""
                      className="h-full border-0 w-full"
                      value={signature?.data}
                      onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                   />
                </div>
                <div className="font-bold text-xs uppercase">Firma Responsable</div>
            </div>
         </div>
      </div>

       {/* Actions */}
       <div className="flex justify-end gap-4 p-6 border-t border-gray-200 no-print bg-gray-50">
           <Button variant="secondary" onClick={onCancel}>
             Cancelar
           </Button>
           <ExportPdfButton 
             filename={`simulacro_${metadata.date}`}
             orientation="p"
           />
           <Button variant="secondary" onClick={() => window.print()}>
             🖨️ Imprimir
           </Button>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              data,
              images,
              signature 
            })}>
             Guardar Simulacro
           </Button>
        </div>

    </div>
  );
};
