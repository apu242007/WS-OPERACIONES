
import React, { useState, useEffect } from 'react';
import { StilsonInspectionReport, StilsonInspectionMetadata, StilsonItem, StilsonStatus } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { StilsonInspectionPdf } from '../pdf/StilsonInspectionPdf';

interface Props {
  initialData?: StilsonInspectionReport;
  onSave: (report: StilsonInspectionReport) => void;
  onCancel: () => void;
}

const ITEMS_LIST = [
  "QUIJADA MOVIL",
  "RESORTES INTERNOS",
  "TUERCA DE FIJACIÓN",
  "MANGO LATERAL",
  "QUIJADA FIJA",
  "ESTADO DEL CUERPO DE LA LLAVE",
  "ALMACENAMIENTO DE LA LLAVE"
];

const WEEKS = ['w1', 'w2', 'w3', 'w4'] as const;

export const StilsonInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  // Metadata State
  const [metadata, setMetadata] = useState<StilsonInspectionMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    brand: '',
    serial: '',
    inches: '',
    outOfService: null
  });

  // Items State (Merge initial data with default structure)
  const [items, setItems] = useState<StilsonItem[]>(() => {
    const defaults = ITEMS_LIST.map(desc => ({
      id: desc,
      description: desc,
      w1: null as StilsonStatus,
      w2: null as StilsonStatus,
      w3: null as StilsonStatus,
      w4: null as StilsonStatus
    }));

    if (initialData?.items && initialData.items.length > 0) {
      // Merge saved data with defaults to ensure all rows exist
      return defaults.map(def => {
        const saved = initialData.items.find(i => i.description === def.description || i.id === def.id);
        return saved ? { ...def, ...saved, id: def.id } : def;
      });
    }
    return defaults;
  });

  // Weeks Data State (Inspectors & Signatures)
  const [weeksData, setWeeksData] = useState(initialData?.weeks || {
    w1: { inspectorName: '' },
    w2: { inspectorName: '' },
    w3: { inspectorName: '' },
    w4: { inspectorName: '' }
  });

  const [observations, setObservations] = useState(initialData?.observations || '');

  // --- Handlers ---

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (itemId: string, week: 'w1'|'w2'|'w3'|'w4', status: StilsonStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        // Toggle behavior: click same status to clear
        const newValue = item[week] === status ? null : status;
        return { ...item, [week]: newValue };
      }
      return item;
    }));
  };

  const handleInspectorChange = (week: keyof typeof weeksData, value: string) => {
    setWeeksData(prev => ({
      ...prev,
      [week]: { ...prev[week], inspectorName: value }
    }));
  };

  const handleSignatureChange = (week: keyof typeof weeksData, dataUrl: string | undefined) => {
    setWeeksData(prev => ({
      ...prev,
      [week]: { ...prev[week], signature: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined }
    }));
  };

  // Helper component for cells to avoid inline arrow functions in render
  const StatusCell = ({ itemId, week, currentStatus, type }: { itemId: string, week: 'w1'|'w2'|'w3'|'w4', currentStatus: StilsonStatus, type: StilsonStatus }) => (
    <div 
      className={`border-r border-black h-full min-h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${currentStatus === type ? 'bg-black text-white font-bold' : ''}`}
      onClick={() => handleStatusChange(itemId, week, type)}
    >
      {currentStatus === type && 'X'}
    </div>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-xl uppercase leading-tight">INSPECCION DE LLAVE STILSON</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-SGI-001-A2-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} title="Fecha" className="border border-gray-300 rounded p-1 outline-none text-xs text-center" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase">Marca:</span>
               <input name="brand" value={metadata.brand} onChange={handleMetadataChange} title="Marca" className="border border-gray-300 rounded p-1 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase">ID/ Serial:</span>
               <input name="serial" value={metadata.serial} onChange={handleMetadataChange} title="ID/Serial" className="border border-gray-300 rounded p-1 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-xs uppercase">Pulgadas:</span>
               <input name="inches" value={metadata.inches} onChange={handleMetadataChange} title="Pulgadas" className="border border-gray-300 rounded p-1 outline-none" />
            </div>
         </div>
      </div>

      {/* Main Table - Scrollable Container */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse border-b border-black text-xs">
            <thead>
              <tr className="bg-white border-b border-black text-center font-bold text-[10px] md:text-xs">
                 <th rowSpan={2} className="border-r border-black p-2 w-48 bg-gray-100 print:bg-transparent sticky left-0 z-10">DESCRIPCIÓN</th>
                 {WEEKS.map((week, idx) => (
                   <th key={week} colSpan={3} className="border-r border-black p-1 border-b bg-gray-50 print:bg-transparent">SEMANA #{idx + 1}</th>
                 ))}
              </tr>
              <tr className="bg-white border-b border-black text-center font-bold text-[10px]">
                 {WEEKS.map(week => (
                   <React.Fragment key={week}>
                     <th className="border-r border-black w-10">C</th>
                     <th className="border-r border-black w-10">NC</th>
                     <th className="border-r border-black w-10">NA</th>
                   </React.Fragment>
                 ))}
              </tr>
            </thead>
            <tbody>
               {items.map((item) => (
                 <tr key={item.id} className="border-b border-black h-8 hover:bg-gray-50">
                    <td className="border-r border-black p-1 pl-2 font-medium bg-gray-50 print:bg-transparent sticky left-0 z-10">{item.description}</td>
                    
                    {WEEKS.map(week => (
                      <React.Fragment key={week}>
                        <td className="p-0 border-r border-black"><StatusCell itemId={item.id} week={week} currentStatus={item[week]} type="C" /></td>
                        <td className="p-0 border-r border-black"><StatusCell itemId={item.id} week={week} currentStatus={item[week]} type="NC" /></td>
                        <td className="p-0 border-r border-black"><StatusCell itemId={item.id} week={week} currentStatus={item[week]} type="NA" /></td>
                      </React.Fragment>
                    ))}
                 </tr>
               ))}
               
               {/* Legend Row */}
               <tr className="border-b border-black">
                  <td colSpan={13} className="p-2 text-center text-xs font-bold bg-white">
                     C= CONFORME &nbsp;&nbsp;&nbsp;&nbsp; NC= NO CONFORME &nbsp;&nbsp;&nbsp;&nbsp; NA= NO APLICA
                  </td>
               </tr>

               {/* Inspector Name Row */}
               <tr className="border-b border-black h-12">
                  <td className="border-r border-black p-1 text-[10px] font-bold bg-gray-50 print:bg-transparent align-middle leading-tight sticky left-0 z-10">
                     NOMBRE Y APELLIDO DEL PERSONAL QUE INSPECCIONA
                  </td>
                  {WEEKS.map(week => (
                     <td key={week} colSpan={3} className="border-r border-black p-0 align-middle">
                        <input 
                          title="Nombre y Apellido del Inspector"
                          className="w-full h-full p-1 text-center outline-none bg-transparent text-xs" 
                          value={weeksData[week].inspectorName || ''}
                          onChange={(e) => handleInspectorChange(week, e.target.value)}
                          placeholder="..."
                        />
                     </td>
                  ))}
               </tr>

               {/* Signature Row */}
               <tr className="border-b border-black h-20">
                  <td className="border-r border-black p-1 text-[10px] font-bold bg-gray-50 print:bg-transparent align-middle sticky left-0 z-10">
                     FIRMA
                  </td>
                  {WEEKS.map(week => (
                     <td key={week} colSpan={3} className="border-r border-black p-1 align-middle">
                        <SignaturePad 
                           label=""
                           value={weeksData[week].signature?.data}
                           onChange={(val) => handleSignatureChange(week, val)}
                           className="h-16 w-full border-0"
                        />
                     </td>
                  ))}
               </tr>
            </tbody>
          </table>
        </div>
        <p className="sm:hidden text-xs text-gray-400 mt-2 px-4 text-right">← Deslizá para ver semanas →</p>
      </div>

      {/* Disclaimer */}
      <div className="p-2 text-[10px] font-bold text-center border-b border-black bg-gray-100 print:bg-transparent">
         LA FIRMA DE ESTE REGISTRO EVIDENCIA QUE HE VERIFICADO LA LISTA Y CERTIFICO QUE ES SEGURA LA HERRAMIENTA INSPECCIONADA
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row border-b border-black min-h-[120px]">
         <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-black">
            <div className="font-bold mb-2 text-xs uppercase">OBSERVACIONES:</div>
            <textarea 
               title="Observaciones"
               className="w-full h-24 p-2 outline-none resize-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6 [background-size:100%_24px]"
               value={observations}
               onChange={(e) => setObservations(e.target.value)}
            />
         </div>
         <div className="w-full sm:w-64 p-4 flex flex-col justify-center items-center bg-gray-50 print:bg-transparent">
            <span className="mb-4 uppercase font-bold text-xs text-center border-b border-black w-full pb-1">Fuera de Servicio</span>
            <div className="flex gap-6">
               <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
                  <span className="font-bold text-sm">SI</span> 
                  <input 
                     type="checkbox" 
                     className="w-5 h-5 accent-red-600"
                     checked={metadata.outOfService === true} 
                     onChange={() => setMetadata(prev => ({ ...prev, outOfService: true }))} 
                  />
               </label>
               <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
                  <span className="font-bold text-sm">NO</span> 
                  <input 
                     type="checkbox" 
                     className="w-5 h-5 accent-green-600"
                     checked={metadata.outOfService === false} 
                     onChange={() => setMetadata(prev => ({ ...prev, outOfService: false }))} 
                  />
               </label>
            </div>
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
               filename={`insp_stilson_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<StilsonInspectionPdf report={{ id: initialData?.id ?? '', metadata, items, weeks: weeksData, observations }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              items, 
              weeks: weeksData,
              observations 
            })} className="w-full sm:w-auto">
             Guardar Inspección
           </Button>
        </div>

    </div>
  );
};
