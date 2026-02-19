
import React, { useState, useRef } from 'react';
import { uploadFile } from '../lib/uploadFile';
import { DailyInspectionCatIReport, DailyInspectionCatIMetadata, DailyInspectionCatIRow, DailyInspectionCatIAdditionalRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { DailyInspectionCatIPdf } from '../pdf/DailyInspectionCatIPdf';

interface Props {
  initialData?: DailyInspectionCatIReport;
  onSave: (report: DailyInspectionCatIReport) => void;
  onCancel: () => void;
}

const MAIN_ITEMS = [
  // 1.0 Base de la Torre
  { id: '1.0', item: '1.0', desc: 'Base de la Torre (Caballete):', isHeader: true },
  { id: '1.1', item: '1.1', desc: 'Largueros Principales:', isHeader: true },
  { id: '1.1.1', item: '1.1.1', desc: 'Rectitud de Perfiles' },
  { id: '1.1.2', item: '1.1.2', desc: 'Agujero de pernos' },
  { id: '1.1.3', item: '1.1.3', desc: 'Soldaduras' },
  { id: '1.1.4', item: '1.1.4', desc: 'Pernos' },
  { id: '1.1.5', item: '1.1.5', desc: 'Seguros / Alfileres' },
  { id: '1.2', item: '1.2', desc: 'Diagonales y Refuerzos:', isHeader: true },
  { id: '1.2.1', item: '1.2.1', desc: 'Rectitud de Perfiles' },
  { id: '1.2.2', item: '1.2.2', desc: 'Soldaduras' },
  { id: '1.3', item: '1.3', desc: 'Tensores Principales:', isHeader: true },
  { id: '1.3.1', item: '1.3.1', desc: 'Estado de Gusanos / Tuercas' },
  { id: '1.3.2', item: '1.3.2', desc: 'Soldaduras' },
  { id: '1.3.3', item: '1.3.3', desc: 'Estado de Ojales' },
  { id: '1.3.4', item: '1.3.4', desc: 'Pernos y Seguros' },
  { id: '1.4', item: '1.4', desc: 'Gusanos de Patas de Apoyo:', isHeader: true },
  { id: '1.4.1', item: '1.4.1', desc: 'Estado de Gusanos / Tuercas' },
  { id: '1.4.2', item: '1.4.2', desc: 'Soldaduras' },
  
  // 2.0 Subestructura
  { id: '2.0', item: '2.0', desc: 'Subestructura:', isHeader: true },
  { id: '2.1', item: '2.1', desc: 'Placas Piso Antideslizante' },
  { id: '2.2', item: '2.2', desc: 'Pasamanos y rodapiés' },
  { id: '2.3', item: '2.3', desc: 'Soldaduras' },
  { id: '2.4', item: '2.4', desc: 'Conexiones de pasamanos' },
  { id: '2.5', item: '2.5', desc: 'Refuerzo del piso' },

  // 3.0 Nivelación
  { id: '3.0', item: '3.0', desc: 'Nivelación de Equipo', isHeader: true },
  { id: '3.1', item: '3.1', desc: 'Nivelación Equipo / Subestructura' },
  { id: '3.2', item: '3.2', desc: 'Aparejo centrado en BdP sin peso' },
  { id: '3.3', item: '3.3', desc: 'Tensión de Cables de Vientos' },

  // 4.0 (Header implied by content)
  { id: '4.0', item: '4.0', desc: 'Sistemas Mecánicos / Frenos', isHeader: true },
  { id: '4.1', item: '4.1', desc: 'Pernos y Seguros' },
  { id: '4.2', item: '4.2', desc: 'Func. Frenos Tambor Ppal / Altura Palanca' },
];

const ADDITIONAL_ITEMS = [
  "Compruebe la presión del sistema de aire (mínimo 90 psi - máximo 130 psi)",
  "Compruebe el nivel del depósito de aceite hidráulico.",
  "Compruebe que todos los pernos tengan pasadores de seguridad (alfileres o chavetas) instalados en la posición correcta",
  "Verifique que todos los controles manuales, seguros, llaves y consignaciones estén en buenas condiciones de funcionamiento",
  "Compruebe visualmente si hay fugas de aceite",
  "Compruebe si hay tornillos y/o tuercas sueltas y vuelva a apretar",
  "Revise líneas en busca de fugas, desgaste o daños, y repare o reemplace según sea necesario.",
  "Controlar regulador de presión de cilindro/tubo de Nitrógeno de espumigenos: verificar que manómetro del regulador en baja presión marque 120 psi, y el manometro del regulador de alta presión marque no menos de 600 psi."
];

export const DailyInspectionCatIForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<DailyInspectionCatIMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    well: '',
    equipment: ''
  });

  const [rows, setRows] = useState<DailyInspectionCatIRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    // Initialize standard rows based on MAIN_ITEMS
    return MAIN_ITEMS.filter(i => !i.isHeader).map(i => ({
      id: crypto.randomUUID(),
      itemNumber: i.item,
      description: i.desc,
      status: null,
      comments: '',
      category: 'I'
    }));
  });

  const [additionalRows, setAdditionalRows] = useState<DailyInspectionCatIAdditionalRow[]>(() => {
    if (initialData?.additionalRows && initialData.additionalRows.length > 0) return initialData.additionalRows;
    return ADDITIONAL_ITEMS.map(desc => ({
      id: crypto.randomUUID(),
      description: desc,
      checked: false,
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

  const handleRowChange = (id: string, field: keyof DailyInspectionCatIRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleAdditionalRowChange = (id: string, field: keyof DailyInspectionCatIAdditionalRow, value: any) => {
    setAdditionalRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (role: 'je_et' | 'sup_mto', dataUrl: string | undefined) => {
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
        console.error('Error subiendo imagen:', error);
        alert('Error al subir la imagen. Intentá de nuevo.');
      } finally {
        setUploadingImages(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getRowByItemNumber = (num: string) => rows.find(r => r.itemNumber === num);

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">FORMULARIO DE INSPECCIÓN VISUAL DIARIA EN CAMPO – Cat. I</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WSG-030-A1-2</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 border-b border-black bg-gray-50 text-[10px] text-justify print:bg-transparent">
         <p className="mb-2">
            <strong>PROPÓSITO y ALCANCE DE LA INSPECCIÓN:</strong> este formulario de inspección es una guía para realizar y reportar inspecciones de campo de una manera completa y uniforme. El formulario está destinado a ser utilizado por el personal operativo (o un representante designado).
         </p>
         <p className="mb-2">
            <strong>MARCADO DE DAÑOS:</strong> en el momento de la inspección, los ítems dañados deben estar marcados de manera clara y visible para que se pueda realizar e informe correspondiente y luego proceder a realizar las reparaciones necesarias. Cuando se realizan reparaciones, se debe dejar registro para la trazabilidad de las mismas. Las marcas visibles deben eliminarse aplicando pintura sobre ellas. También es necesario que el inspector escriba "Ninguno", cuando no se reporte nada, ya que esta es su indicación de que el artículo ha pasado la inspección.
         </p>
         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-bold justify-center mt-2 text-center">
            <span>- OK: En condiciones</span>
            <span>- NA: No aplica</span>
            <span>- X: Reemplazo/Reparación</span>
         </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
            <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="font-bold text-gray-500 uppercase text-xs">Fecha</span>
                <input 
                    type="date"
                    name="date"
                    aria-label="Fecha"
                    value={metadata.date} 
                    onChange={handleMetadataChange}
                    className="border-b border-black outline-none bg-transparent w-full sm:w-40 text-center"
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="font-bold text-gray-500 uppercase text-xs">Pozo</span>
                <input 
                    name="well"
                    aria-label="Pozo"
                    value={metadata.well} 
                    onChange={handleMetadataChange}
                    className="border-b border-black outline-none bg-transparent w-full sm:w-40 text-center uppercase"
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-1">
                <span className="font-bold text-gray-500 uppercase text-xs">Equipo</span>
                <select name="equipment" aria-label="Equipo" value={metadata.equipment} onChange={handleMetadataChange} className="border-b border-black outline-none bg-transparent w-full sm:w-40 text-center uppercase">
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

      {/* Main Table */}
      <div className="w-full">
         <div className="hidden sm:grid grid-cols-12 border-b border-black bg-gray-200 font-bold text-center h-8 items-center text-[10px]">
            <div className="col-span-1 border-r border-black h-full flex items-center justify-center">ARTICULO</div>
            <div className="col-span-4 border-r border-black h-full flex items-center justify-center">DESCRIPCIÓN</div>
            <div className="col-span-1 border-r border-black h-full flex items-center justify-center">CAT.</div>
            <div className="col-span-2 border-r border-black h-full flex items-center justify-center">INSPECCIÓN</div>
            <div className="col-span-4 h-full flex items-center justify-center">COMENTARIOS DE LA INSPECCIÓN</div>
         </div>

         {MAIN_ITEMS.map((item, idx) => {
            if (item.isHeader) {
               return (
                  <div key={idx} className="sm:grid grid-cols-12 border-b border-black bg-gray-100 font-bold text-[10px] sm:h-6 items-center print:bg-gray-200 p-2 sm:p-0">
                     <div className="col-span-12 sm:col-span-1 sm:border-r border-black sm:text-center inline mr-2 sm:mr-0">{item.item}</div>
                     <div className="col-span-12 sm:col-span-11 sm:pl-2 inline">{item.desc}</div>
                  </div>
               );
            }

            const row = getRowByItemNumber(item.item);
            if (!row) return null;

            return (
               <div key={row.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-[10px] hover:bg-gray-50 min-h-[30px] sm:items-center">
                  <div className="sm:col-span-1 sm:border-r border-black text-center font-bold h-full flex items-center justify-center bg-gray-50 sm:bg-transparent p-1 sm:p-0">
                     {row.itemNumber}
                  </div>
                  <div className="sm:col-span-4 sm:border-r border-black sm:pl-2 h-full flex items-center p-2 sm:p-0 font-medium">
                     {row.description}
                  </div>
                  <div className="hidden sm:flex col-span-1 border-r border-black text-center h-full items-center justify-center font-bold">I</div>
                  
                  {/* Status Buttons */}
                  <div className="sm:col-span-2 sm:border-r border-black flex h-full border-t border-b sm:border-y-0 border-gray-200">
                     <button 
                        className={`flex-1 flex items-center justify-center border-r border-gray-300 py-2 sm:py-0 hover:bg-green-100 transition-colors ${row.status === 'OK' ? 'bg-green-600 text-white font-bold' : ''}`}
                        onClick={() => handleRowChange(row.id, 'status', 'OK')}
                     >OK</button>
                     <button 
                        className={`flex-1 flex items-center justify-center border-r border-gray-300 py-2 sm:py-0 hover:bg-gray-200 transition-colors ${row.status === 'NA' ? 'bg-gray-600 text-white font-bold' : ''}`}
                        onClick={() => handleRowChange(row.id, 'status', 'NA')}
                     >NA</button>
                     <button 
                        className={`flex-1 flex items-center justify-center py-2 sm:py-0 hover:bg-red-100 transition-colors ${row.status === 'X' ? 'bg-red-600 text-white font-bold' : ''}`}
                        onClick={() => handleRowChange(row.id, 'status', 'X')}
                     >X</button>
                  </div>

                  <div className="sm:col-span-4 h-full p-1 sm:p-0">
                     <input 
                        title="Comentarios de la inspección"
                        className="w-full h-full px-2 py-1 sm:py-0 outline-none bg-transparent border border-gray-200 sm:border-none rounded sm:rounded-none"
                        value={row.comments}
                        onChange={(e) => handleRowChange(row.id, 'comments', e.target.value)}
                        placeholder="Ninguno..."
                     />
                  </div>
               </div>
            );
         })}
      </div>

      {/* Additional Inspections */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
         <div className="font-bold text-center mb-2 underline">Inspecciones Diarias Adicionales:</div>
         <div className="text-xs text-center italic mb-2">Tildar con un “√” si es correcto, caso contrario informar.</div>
         
         <div className="border border-black">
            <div className="hidden sm:grid grid-cols-12 border-b border-black bg-gray-200 font-bold text-center text-[10px]">
               <div className="col-span-6 border-r border-black p-1">Descripción</div>
               <div className="col-span-1 border-r border-black p-1">Inspección</div>
               <div className="col-span-5 p-1">Observación</div>
            </div>
            {additionalRows.map(row => (
               <div key={row.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-[10px] items-center min-h-[30px] hover:bg-gray-50 last:border-b-0">
                  <div className="sm:col-span-6 sm:border-r border-black p-2 sm:p-1 sm:pl-2 w-full font-medium sm:font-normal">{row.description}</div>
                  
                  <div className="flex w-full sm:contents">
                      <div 
                         className="flex-1 sm:col-span-1 sm:border-r border-black p-2 sm:p-0 h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 bg-gray-50 sm:bg-transparent border-t sm:border-t-0 border-gray-200"
                         onClick={() => handleAdditionalRowChange(row.id, 'checked', !row.checked)}
                      >
                         <span className="sm:hidden font-bold mr-2">Check:</span>
                         <div className={`w-5 h-5 border border-black flex items-center justify-center ${row.checked ? 'bg-black text-white' : 'bg-white'}`}>
                            {row.checked && '√'}
                         </div>
                      </div>
                      <div className="flex-[3] sm:col-span-5 h-full p-1 sm:p-0 border-t sm:border-t-0 border-gray-200">
                         <input 
                            title="Observación"
                            className="w-full h-full px-2 outline-none bg-transparent border sm:border-0 rounded sm:rounded-none"
                            value={row.observation}
                            onChange={(e) => handleAdditionalRowChange(row.id, 'observation', e.target.value)}
                            placeholder="Observación..."
                         />
                      </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Photos */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
         <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-1">
            <div className="font-bold uppercase text-sm">REGISTRO FOTOGRÁFICO (Daños / Reparaciones)</div>
            <div className="no-print">
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  multiple 
                  accept="image/*" 
                  className="hidden"
                  aria-label="Agregar fotos de daños o reparaciones"
               />
               <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  📷 Adjuntar Fotos
               </Button>
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
               <div key={index} className="border border-gray-300 p-2 relative break-inside-avoid bg-white">
                  <div className="aspect-video w-full flex items-center justify-center bg-gray-100 overflow-hidden">
                     <img src={img} alt={`Evidencia ${index + 1}`} className="max-w-full max-h-full object-contain" />
                  </div>
                  <button 
                     onClick={() => removeImage(index)}
                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold no-print hover:bg-red-700"
                     title="Eliminar foto"
                  >
                     ✕
                  </button>
               </div>
            ))}
            {images.length === 0 && (
               <div className="col-span-2 text-center text-gray-400 py-4 italic border-2 border-dashed border-gray-300 rounded">
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
                   value={signatures.je_et?.data} 
                   onChange={(val) => handleSignatureChange('je_et', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma y Aclaración</div>
             <div className="text-xs text-gray-500">J.E. / E.T</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.sup_mto?.data} 
                   onChange={(val) => handleSignatureChange('sup_mto', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma y Aclaración</div>
             <div className="text-xs text-gray-500">Sup. Mantenimiento</div>
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
               filename={`insp_visual_diaria_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<DailyInspectionCatIPdf report={{ id: initialData?.id ?? '', metadata, rows, additionalRows, signatures, images }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows,
              additionalRows,
              signatures,
              images
            })} className="w-full sm:w-auto">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
