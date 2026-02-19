
import React, { useState } from 'react';
import { MaintenanceReport, MaintenanceMetadata, MaintenanceItem } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { MaintenanceReportPdf } from '../pdf/MaintenanceReportPdf';

interface Props {
  initialData?: MaintenanceReport;
  onSave: (report: MaintenanceReport) => void;
  onCancel: () => void;
}

const EmptyItem: MaintenanceItem = {
  id: '',
  anomalyDescription: '',
  maintenancePerformed: '',
  affectsOperation: null,
  priority: null,
  date: new Date().toISOString().split('T')[0],
  startTime: '',
  endTime: ''
};

export const MaintenanceReportForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<MaintenanceMetadata>(initialData?.metadata || {
    reportNumber: '',
    supervisorName: '',
    mechanicName: '',
    equipmentNumber: '',
    date: new Date().toISOString().split('T')[0],
    client: '',
    field: '',
    well: ''
  });

  const [items, setItems] = useState<MaintenanceItem[]>(initialData?.items || [
    { ...EmptyItem, id: crypto.randomUUID() },
    { ...EmptyItem, id: crypto.randomUUID() }
  ]);

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof MaintenanceItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { ...EmptyItem, id: crypto.randomUUID() }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSignatureChange = (role: 'supervisor' | 'mechanic', dataUrl: string | undefined) => {
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

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl sm:text-2xl uppercase leading-tight">SOLICITUD DE MANTENIMIENTO</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG001-A4-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-32 sm:w-40">SOLICITUD N°:</span>
               <input name="reportNumber" title="Solicitud N°" value={metadata.reportNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20 sm:w-40">FECHA:</span>
               <input type="date" name="date" title="Fecha" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-40">NOMBRE SUPERVISOR:</span>
               <input name="supervisorName" title="Nombre Supervisor" value={metadata.supervisorName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-40">NOMBRE MECANICO:</span>
               <input name="mechanicName" title="Nombre Mecánico" value={metadata.mechanicName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20 sm:w-24">EQUIPO:</span>
               <select name="equipmentNumber" title="Equipo" value={metadata.equipmentNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent">
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
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20 sm:w-24">CLIENTE:</span>
               <input name="client" title="Cliente" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-16 sm:w-24">YAC.:</span>
               <input name="field" title="Yacimiento" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-16">POZO:</span>
               <input name="well" title="Pozo" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Main Items */}
      <div className="p-4 space-y-6">
         {items.map((item, index) => (
            <div key={item.id} className="border-2 border-black p-4 relative break-inside-avoid shadow-sm bg-white">
                <button 
                   onClick={() => removeItem(item.id)}
                   className="absolute top-2 right-2 text-red-500 font-bold hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-full no-print border border-red-200"
                   title="Eliminar Item"
                >
                   &times;
                </button>
                <div className="font-bold text-lg mb-2 underline">ÍTEM {index + 1}</div>
                
                <div className="mb-4">
                   <div className="font-bold mb-1">DESCRIPCIÓN DE LA ANOMALIA:</div>
                   <textarea 
                      title="Descripción de la anomalía"
                      className="w-full h-24 p-2 border border-gray-300 rounded resize-none outline-none bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
                      value={item.anomalyDescription}
                      onChange={(e) => handleItemChange(item.id, 'anomalyDescription', e.target.value)}
                   />
                </div>

                <div className="mb-4">
                   <div className="font-bold mb-1">MANTENIMIENTO REALIZADO:</div>
                   <textarea 
                      title="Mantenimiento realizado"
                      className="w-full h-24 p-2 border border-gray-300 rounded resize-none outline-none bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
                      value={item.maintenancePerformed}
                      onChange={(e) => handleItemChange(item.id, 'maintenancePerformed', e.target.value)}
                   />
                </div>

                {/* Footer Controls */}
                <div className="border-t border-black p-2 text-sm bg-gray-50 print:bg-transparent">
                   <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                      {/* Operation Impact */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                         <span className="font-bold">El problema afectó la operación:</span>
                         <div className="flex gap-4">
                            <div 
                                className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-gray-200"
                                onClick={() => handleItemChange(item.id, 'affectsOperation', item.affectsOperation === 'SI' ? null : 'SI')}
                            >
                                <div className={`w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center ${item.affectsOperation === 'SI' ? 'bg-black' : 'bg-white'}`}>
                                    {item.affectsOperation === 'SI' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                </div>
                                <span>Si</span>
                            </div>
                            <div 
                                className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-gray-200"
                                onClick={() => handleItemChange(item.id, 'affectsOperation', item.affectsOperation === 'NO' ? null : 'NO')}
                            >
                                <div className={`w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center ${item.affectsOperation === 'NO' ? 'bg-black' : 'bg-white'}`}>
                                    {item.affectsOperation === 'NO' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                </div>
                                <span>No</span>
                            </div>
                         </div>
                      </div>

                      {/* Priority */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                         <span className="font-bold">Prioridad:</span>
                         <div className="flex gap-3 flex-wrap">
                             {['Baja', 'Media', 'Alta'].map((p) => (
                                <div 
                                    key={p}
                                    className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-gray-200"
                                    onClick={() => handleItemChange(item.id, 'priority', item.priority === p ? null : p)}
                                >
                                    <div className={`w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center ${item.priority === p ? 'bg-black' : 'bg-white'}`}>
                                        {item.priority === p && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span>{p}</span>
                                </div>
                             ))}
                         </div>
                      </div>
                   </div>

                   {/* Dates */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-2 border-t border-gray-200">
                      <div className="flex flex-col gap-1">
                         <span className="font-bold text-xs">Fecha Realización:</span>
                         <input type="date" title="Fecha realización" value={item.date} onChange={(e) => handleItemChange(item.id, 'date', e.target.value)} className="border border-gray-300 rounded p-1 outline-none bg-transparent" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="font-bold text-xs">Hora Inicio:</span>
                         <input type="time" title="Hora inicio" value={item.startTime} onChange={(e) => handleItemChange(item.id, 'startTime', e.target.value)} className="border border-gray-300 rounded p-1 outline-none bg-transparent" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="font-bold text-xs">Hora Finalización:</span>
                         <input type="time" title="Hora finalización" value={item.endTime} onChange={(e) => handleItemChange(item.id, 'endTime', e.target.value)} className="border border-gray-300 rounded p-1 outline-none bg-transparent" />
                      </div>
                   </div>
                </div>
            </div>
         ))}
         
         <div className="no-print text-center pt-4">
            <button onClick={addItem} className="text-brand-red font-bold uppercase hover:underline p-2 border border-brand-red rounded-md hover:bg-red-50 text-sm">
                + Agregar otro Ítem
            </button>
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1">
                <SignaturePad 
                   label="" 
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Supervisor</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1">
                <SignaturePad 
                   label="" 
                   value={signatures.mechanic?.data} 
                   onChange={(val) => handleSignatureChange('mechanic', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Mecánico</div>
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
               filename={`mantenimiento_${metadata.date}_${metadata.equipmentNumber || 'eq'}`}
               orientation="p"
               className="w-full"
               pdfComponent={<MaintenanceReportPdf report={{ id: initialData?.id ?? '', metadata, items, signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              items, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Solicitud
           </Button>
        </div>

    </div>
  );
};
