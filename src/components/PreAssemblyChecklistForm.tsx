
import { uploadFile } from '../lib/uploadFile';
import React, { useState, useRef } from 'react';
import { PreAssemblyChecklistReport, PreAssemblyChecklistMetadata, PreAssemblyChecklistItem } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: PreAssemblyChecklistReport;
  onSave: (report: PreAssemblyChecklistReport) => void;
  onCancel: () => void;
}

const QUESTIONS = [
  "¿Las condiciones climáticas son favorables? (Viento max 40km/h)",
  "¿El terreno está nivelado y compactado?",
  "¿Se realizó la charla de seguridad (ATS) específica para la tarea?",
  "¿Todo el personal cuenta con los EPP adecuados?",
  "¿Se verificó el estado de los vientos de carga?",
  "¿Se verificó el estado de los pernos y seguros?",
  "¿El sistema hidráulico de la torre está operativo y sin fugas?",
  "¿Se cuenta con la iluminación adecuada (si aplica)?",
  "¿El área de maniobra está despejada y señalizada?",
  "¿El indicador de peso (Martin Decker) funciona correctamente?"
];

export const PreAssemblyChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<PreAssemblyChecklistMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    well: '',
    equipment: ''
  });

  const [items, setItems] = useState<PreAssemblyChecklistItem[]>(() => {
    if (initialData?.items && initialData.items.length > 0) return initialData.items;
    return QUESTIONS.map((q, i) => ({
      id: i + 1,
      question: q,
      status: null,
      observation: ''
    }));
  });

  const [signatures, setSignatures] = useState(initialData?.signatures || {});
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: number, field: keyof PreAssemblyChecklistItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSignatureChange = (role: 'rigManager' | 'shiftLeader', dataUrl: string | undefined) => {
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
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">CHECK LIST PRE-MONTAJE</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WWO-003-A2-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-16">FECHA:</span>
               <input type="date" name="date" aria-label="Fecha" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-16">POZO:</span>
               <input name="well" aria-label="Pozo" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-16">EQUIPO:</span>
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
         </div>
      </div>

      {/* Table - Mobile Stacked / Desktop Table */}
      <div className="w-full border-b border-black">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-200 border-b border-black font-bold text-center text-sm items-center h-10">
           <div className="col-span-1 p-2 border-r border-black">#</div>
           <div className="col-span-5 p-2 border-r border-black text-left pl-4">DESCRIPCION</div>
           <div className="col-span-1 p-2 border-r border-black">SI</div>
           <div className="col-span-1 p-2 border-r border-black">NO</div>
           <div className="col-span-4 p-2">OBSERVACIONES</div>
        </div>

        {/* Rows */}
        {items.map((item) => (
           <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-gray-300 hover:bg-gray-50 min-h-[40px] items-center">
              <div className="hidden sm:flex col-span-1 h-full items-center justify-center font-bold border-r border-black">{item.id}</div>
              <div className="sm:col-span-5 p-3 sm:p-2 sm:pl-4 border-r border-black font-medium text-sm sm:text-xs w-full bg-gray-50 sm:bg-transparent">
                 {item.question}
              </div>
              
              {/* SI / NO */}
              <div className="flex w-full sm:contents border-t sm:border-t-0 border-gray-200">
                  <div
                    className={`flex-1 sm:col-span-1 border-r border-black p-2 flex items-center justify-center cursor-pointer transition-colors min-h-[40px] ${item.status === 'SI' ? 'bg-green-600 text-white font-bold' : 'hover:bg-green-50'}`}
                    onClick={() => handleItemChange(item.id, 'status', item.status === 'SI' ? null : 'SI')}
                  >
                     <span className="sm:hidden text-xs font-bold mr-1 text-gray-400">SI</span>
                     {item.status === 'SI' ? '✓' : <span className="hidden sm:block text-gray-300">·</span>}
                  </div>
                  <div
                    className={`flex-1 sm:col-span-1 sm:border-r border-black p-2 flex items-center justify-center cursor-pointer transition-colors min-h-[40px] ${item.status === 'NO' ? 'bg-red-600 text-white font-bold' : 'hover:bg-red-50'}`}
                    onClick={() => handleItemChange(item.id, 'status', item.status === 'NO' ? null : 'NO')}
                  >
                     <span className="sm:hidden text-xs font-bold mr-1 text-gray-400">NO</span>
                     {item.status === 'NO' ? '✕' : <span className="hidden sm:block text-gray-300">·</span>}
                  </div>
              </div>

              <div className="w-full sm:col-span-4 p-0 border-t sm:border-t-0 border-gray-200">
                 <input 
                    className="w-full h-10 sm:h-full px-3 sm:px-2 outline-none bg-transparent placeholder-gray-400 sm:placeholder-transparent text-sm sm:text-xs"
                    value={item.observation}
                    onChange={(e) => handleItemChange(item.id, 'observation', e.target.value)}
                    placeholder="Observaciones..."
                 />
              </div>
           </div>
        ))}
      </div>

      {/* Photos */}
      <div className="p-4 border-b border-black page-break-inside-avoid">
         <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <div className="font-bold uppercase text-sm text-gray-700">EVIDENCIA FOTOGRÁFICA</div>
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
               <div className="col-span-2 sm:col-span-4 text-center text-gray-400 py-6 border-2 border-dashed border-gray-300 rounded text-xs">
                  (Sin fotos adjuntas)
               </div>
            )}
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Jefe de Equipo</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.shiftLeader?.data} 
                   onChange={(val) => handleSignatureChange('shiftLeader', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Encargado de Turno</div>
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
               filename={`checklist_pre_montaje_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              items, 
              signatures,
              images 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
