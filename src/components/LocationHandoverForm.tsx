
import React, { useState, useRef } from 'react';
import { LocationHandoverReport, LocationHandoverMetadata, LayoutElement } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { WellLayoutEditor } from './ui/WellLayoutEditor';

interface Props {
  initialData?: LocationHandoverReport;
  onSave: (report: LocationHandoverReport) => void;
  onCancel: () => void;
}

export const LocationHandoverForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<LocationHandoverMetadata>(initialData?.metadata || {
    type: 'RECIBO',
    date: new Date().toISOString().split('T')[0],
    well: '',
    equipment: '',
    companyRepresentative: '',
    rigManager: '',
    serviceResponsible: ''
  });

  const [schemeImage, setSchemeImage] = useState<string | null>(initialData?.schemeImage || null);
  const [layoutElements, setLayoutElements] = useState<LayoutElement[]>(initialData?.layoutElements || [
    { id: 'equipo_default', type: 'equipo', x: 50, y: 50, label: 'Equipo' },
  ]);
  const [observations, setObservations] = useState(initialData?.observations || '');
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [signatures, setSignatures] = useState(initialData?.signatures || {});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: 'RECIBO' | 'ENTREGA') => {
    setMetadata(prev => ({ ...prev, type }));
  };

  const handleSignatureChange = (role: 'rigManager' | 'companyRepresentative', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  // Generic Image Uploader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'photos') => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
             setPhotos(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
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
          <h1 className="font-black text-xl uppercase leading-tight">RECIBO Y ENTREGA DE LOCACION</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>PO-WSG-001-A2-0</div>
          <div className="text-xs font-normal mt-1">Revisión 00</div>
        </div>
      </div>

      {/* Operation Type Toggle */}
      <div className="flex border-b border-black no-print">
         <button 
           onClick={() => handleTypeChange('RECIBO')}
           className={`flex-1 p-3 font-bold text-center transition-colors ${metadata.type === 'RECIBO' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
         >
           RECIBO DE LOCACIÓN
         </button>
         <button 
           onClick={() => handleTypeChange('ENTREGA')}
           className={`flex-1 p-3 font-bold text-center transition-colors ${metadata.type === 'ENTREGA' ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
         >
           ENTREGA DE LOCACIÓN
         </button>
      </div>

      {/* Print-only Title (Active Type) */}
      <div className="hidden print:block text-center p-2 bg-gray-100 border-b border-black font-black text-lg">
          {metadata.type === 'RECIBO' ? 'RECIBO DE LOCACIÓN' : 'ENTREGA DE LOCACIÓN'}
      </div>

      {/* Metadata Form */}
      <div className="p-6 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold w-32 uppercase text-gray-600">Fecha:</span>
               <input type="date" name="date" aria-label="Fecha" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold w-32 uppercase text-gray-600">Pozo:</span>
               <input name="well" aria-label="Pozo" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold w-32 uppercase text-gray-600">Equipo:</span>
               <select name="equipment" aria-label="Equipo" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase">
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
               <span className="font-bold w-48 uppercase text-gray-600">Company Representative/Sup.:</span>
               <input name="companyRepresentative" aria-label="Company Representative" value={metadata.companyRepresentative} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold w-32 uppercase text-gray-600">Jefe de Equipo:</span>
               <input name="rigManager" aria-label="Jefe de Equipo" value={metadata.rigManager} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-1 items-end">
               <span className="font-bold w-48 uppercase text-gray-600">Resp. Serv. Al Pozo:</span>
               <input name="serviceResponsible" aria-label="Responsable Servicio Al Pozo" value={metadata.serviceResponsible} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Interactive Layout Editor */}
      <div className="p-4 sm:p-6 border-b border-black">
        <h3 className="font-bold text-sm uppercase mb-4">Esquema Locación para equipos convencionales</h3>
        <WellLayoutEditor
          value={layoutElements}
          onChange={setLayoutElements}
          readOnly={false}
        />
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-1 uppercase text-sm">Observaciones:</div>
         <textarea 
            className="w-full h-32 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] bg-[size:100%_24px] leading-6"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ingrese observaciones generales sobre el estado de la locación..."
         />
      </div>

      {/* Photo Evidence */}
      <div className="p-4 border-b border-black page-break-inside-avoid">
         <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <div className="font-bold uppercase text-sm">REGISTRO FOTOGRÁFICO ADICIONAL</div>
            <div className="no-print">
               <input 
                  type="file"
                  aria-label="Agregar fotos"
                  ref={fileInputRef} 
                  onChange={(e) => handleImageUpload(e, 'photos')} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
               />
               <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                  <span>📷</span> Agregar Fotos
               </Button>
            </div>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((img, index) => (
               <div key={index} className="border border-gray-300 p-2 relative break-inside-avoid bg-white rounded shadow-sm group">
                  <div className="aspect-square w-full flex items-center justify-center bg-gray-100 overflow-hidden rounded">
                     <img src={img} alt={`Evidencia ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <button 
                     onClick={() => removePhoto(index)}
                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold no-print hover:bg-red-700 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                     title="Eliminar foto"
                  >
                     ✕
                  </button>
               </div>
            ))}
            {photos.length === 0 && (
               <div className="col-span-2 sm:col-span-4 text-center text-gray-400 py-6 border-2 border-dashed border-gray-300 rounded text-xs">
                  (Sin fotos adicionales)
               </div>
            )}
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-8 page-break-inside-avoid bg-white">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                   className="h-full w-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Jefe de Equipo / Encargado de Turno</div>
             <div className="text-[10px] text-gray-500">Firma y Aclaración</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.companyRepresentative?.data} 
                   onChange={(val) => handleSignatureChange('companyRepresentative', val)}
                   className="h-full w-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Company Representative / Supervisor Instalación</div>
             <div className="text-[10px] text-gray-500">Firma y Aclaración</div>
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
               filename={`recibo_entrega_${metadata.type}_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              schemeImage,
              layoutElements,
              observations,
              photos,
              signatures
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
