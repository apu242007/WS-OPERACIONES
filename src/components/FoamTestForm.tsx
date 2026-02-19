
import { uploadFile } from '../lib/uploadFile';
import React, { useState, useRef } from 'react';
import { FoamTestReport, FoamTestMetadata } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { FoamTestPdf } from '../pdf/FoamTestPdf';

interface Props {
  initialData?: FoamTestReport;
  onSave: (report: FoamTestReport) => void;
  onCancel: () => void;
}

export const FoamTestForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<FoamTestMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    equipment: '',
    well: '',
    hseSupervisor: '',
    fieldSupervisor: '',
    rigManager: '',
    shiftLeader: ''
  });

  const [activity, setActivity] = useState(initialData?.activity || '');
  const [specsAndPerformance, setSpecsAndPerformance] = useState(initialData?.specsAndPerformance || '');
  const [conclusions, setConclusions] = useState(initialData?.conclusions || '');
  const [photoAnnex, setPhotoAnnex] = useState(initialData?.photoAnnex || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [signatures, setSignatures] = useState(initialData?.signatures || {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureChange = (role: 'hseSupervisor' | 'rigManager', dataUrl: string | undefined) => {
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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadingImages(true);
      try {
        const urls = await Promise.all(files.map((file) => uploadFile(file)));
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

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">INFORME DE PRUEBA DE SISTEMA DE ESPUMIGENO</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>ITSGI011-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
                   <span className="font-bold w-16 text-xs">FECHA:</span>
                   <input type="date" name="date" aria-label="Fecha" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
                   <span className="font-bold w-16 text-xs">HORA:</span>
                   <input type="time" name="time" aria-label="Hora" value={metadata.time} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
                   <span className="font-bold w-20 text-xs">EQUIPO:</span>
                   <select name="equipment" aria-label="Equipo" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent">
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
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
                   <span className="font-bold w-16 text-xs">POZO:</span>
                   <input name="well" aria-label="Pozo" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-40 text-xs">SUPERVISOR HS&E:</span>
               <input name="hseSupervisor" aria-label="Supervisor HSE" value={metadata.hseSupervisor} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-44 text-xs">SUPERVISOR DE CAMPO:</span>
               <input name="fieldSupervisor" aria-label="Supervisor de Campo" value={metadata.fieldSupervisor} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-40 text-xs">JEFE DE EQUIPO:</span>
               <input name="rigManager" aria-label="Jefe de Equipo" value={metadata.rigManager} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-44 text-xs">ENCARGADO DE TURNO:</span>
               <input name="shiftLeader" aria-label="Encargado de Turno" value={metadata.shiftLeader} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

         </div>
      </div>

      <div className="bg-gray-100 p-2 text-center font-bold border-b border-black text-lg">INFORME DE ACTIVIDAD</div>

      {/* Section 1 */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2">1. ACTIVIDAD DESARROLLADA</div>
         <textarea 
            aria-label="Actividad desarrollada"
            className="w-full h-32 p-2 resize-none outline-none border border-gray-300 bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6 text-sm"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
         />
      </div>

      {/* Section 2 */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2">2. ESPECIFICACIONES TÉCNICAS DEL EQUIPAMIENTO y RENDIMIENTO</div>
         <textarea 
            aria-label="Especificaciones técnicas y rendimiento"
            className="w-full h-32 p-2 resize-none outline-none border border-gray-300 bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6 text-sm"
            value={specsAndPerformance}
            onChange={(e) => setSpecsAndPerformance(e.target.value)}
         />
      </div>

      {/* Section 3 */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2">3. CONCLUSIÓN y OBSERVACIONES</div>
         <textarea 
            aria-label="Conclusión y observaciones"
            className="w-full h-32 p-2 resize-none outline-none border border-gray-300 bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6 text-sm"
            value={conclusions}
            onChange={(e) => setConclusions(e.target.value)}
         />
      </div>

      {/* Section 4 - Text Description */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2">4. DESCRIPCIÓN DE ANEXO FOTOGRÁFICO</div>
         <textarea 
            aria-label="Descripción de anexo fotográfico"
            className="w-full h-24 p-2 resize-none outline-none border border-gray-300 bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6 text-sm"
            value={photoAnnex}
            onChange={(e) => setPhotoAnnex(e.target.value)}
            placeholder="Ingrese descripción de las fotografías adjuntas o referencias..."
         />
      </div>

      {/* Section 5 - Photo Gallery */}
      <div className="p-4 border-b border-black">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <div className="font-bold">5. REGISTRO FOTOGRÁFICO</div>
            <div className="no-print">
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  multiple 
                  accept="image/*"
                  aria-label="Adjuntar fotos"
                  className="hidden" 
               />
               <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                  📷 Adjuntar Fotos
               </Button>
            </div>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
               <div key={index} className="border border-gray-300 p-2 relative break-inside-avoid">
                  <div className="aspect-square w-full flex items-center justify-center bg-gray-100 overflow-hidden rounded">
                     <img src={img} alt={`Evidencia ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <button 
                     onClick={() => removeImage(index)}
                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold no-print hover:bg-red-700 shadow-md"
                     title="Eliminar foto"
                  >
                     ✕
                  </button>
               </div>
            ))}
            {images.length === 0 && (
               <div className="col-span-2 sm:col-span-4 text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded">
                  Sin registro fotográfico adjunto.
               </div>
            )}
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-8 pt-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black border-dotted mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.hseSupervisor?.data} 
                   onChange={(val) => handleSignatureChange('hseSupervisor', val)}
                />
             </div>
             <div className="font-bold text-sm">SUPERVISOR HS&E</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black border-dotted mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                />
             </div>
             <div className="font-bold text-sm">JEFE DE EQUIPO</div>
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
               filename={`prueba_espumigeno_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<FoamTestPdf report={{ id: initialData?.id ?? '', metadata, activity, specsAndPerformance, conclusions, photoAnnex, images, signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              activity,
              specsAndPerformance,
              conclusions,
              photoAnnex,
              images,
              signatures 
            })} className="w-full sm:w-auto">
             Guardar Informe
           </Button>
        </div>

    </div>
  );
};
