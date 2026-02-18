
import React, { useState } from 'react';
import { MechanicalChecklistReport, MechanicalChecklistMetadata, MechanicalChecklistStoppedItem, MechanicalChecklistRunningItem } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: MechanicalChecklistReport;
  onSave: (report: MechanicalChecklistReport) => void;
  onCancel: () => void;
}

const STOPPED_ITEMS_STRUCTURE = [
  { section: 'Equipo:', items: ["Aceite Motor", "Agua Motor", "Aceite Caja Allison", "Aceite Caja Angular", "Aceite Drop Box", "Aceite Carter de Cadenas", "Aceite Tanque Hidraulico", "Cardanes"] },
  { section: 'Motobomba:', items: ["Aceite Motor", "Agua Motor", "Aceite Caja Allison", "Aceite Carter de Cadenas", "Aceite carter Bomba Triple", "Agua Refrigeración", "Cardanes"] },
  { section: 'Usina 1:', items: ["Aceite Motor", "Agua Motor"] },
  { section: 'Usina 2:', items: ["Aceite Motor", "Agua Motor"] },
  { section: 'Venturtech:', items: ["Aceite Motor", "Agua Motor", "Aceite Tanque Hidraulico"] },
  { section: 'Compresor AtlasCopco:', items: ["Aceite Motor"] },
  { section: 'Acumuladores:', items: ["Aceite Acumulador"] },
  { section: 'Hidrolavadora:', items: ["Nivel de Aceite"] },
  { section: 'Accesorios:', items: ["NIvel Aceite C. Rotativa", "Nivel Aceite C. Inyeccion", "Aceite Llave Caños", "Aceite Llave Varillas"] },
];

const RUNNING_ITEMS_STRUCTURE = [
  { section: 'Equipo:', items: ["Temperatura Motor", "Presion de Aceite Motor", "Temperatura Caja Allison", "Presion Caja Allison", "Temp. Aceite Hidraulico", "Filtro de Aire", "Radiador (verificar limpieza)", "Presion de Cto. Hidraulico"] },
  { section: 'Motobomba:', items: ["Temperatura Agua Motor", "Presion de Aceite Motor", "Temperatura Caja Allison", "Presion Caja Allison", "Temp. Aceite Bomba Triple", "Pres. Lubric. Bomba Triple", "Presión Power End", "Estado de Filtro de Aire", "Radiador (verificar limpieza)"] },
  { section: 'Usina 1:', items: ["Radiador (verificar limpieza)", "Estado General"] },
  { section: 'Usina 2:', items: ["Radiador (verificar limpieza)", "Estado General"] },
  { section: 'Venturtech:', items: ["Radiador (verificar limpieza)", "Estado Filtro Aire", "Estado General"] },
  { section: 'Compresor AtlasCopco:', items: ["Radiador (verificar limpieza)", "Purga Condensado", "Estado de Filtro de Aire", "Estado de Correa"] },
  { section: 'Acumulador:', items: ["Presion de Botellones", "Presion Linea valv. Total/Parcial", "Presion Linea valvula Anular"] },
  { section: 'Equipo (Transporte)', items: ["Cubiertas", "Ajuste de Tuercas", "Frenos (Registro, Perdidas)", "Sistema de Direccion Hidraulica", "Bloqueo y Desbloqueo"] },
];

export const MechanicalChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<MechanicalChecklistMetadata>(initialData?.metadata || {
    mechanicName: '',
    supervisorName: '',
    equipmentNumber: '',
    date: new Date().toISOString().split('T')[0],
    client: '',
    field: '',
    well: ''
  });

  const [stoppedItems, setStoppedItems] = useState<MechanicalChecklistStoppedItem[]>(() => {
    if (initialData?.stoppedItems && initialData.stoppedItems.length > 0) return initialData.stoppedItems;
    const items: MechanicalChecklistStoppedItem[] = [];
    STOPPED_ITEMS_STRUCTURE.forEach(sec => {
        sec.items.forEach(item => {
            items.push({ id: crypto.randomUUID(), section: sec.section, name: item, level: '', litersAdded: '', hours: '' });
        });
    });
    return items;
  });

  const [runningItems, setRunningItems] = useState<MechanicalChecklistRunningItem[]>(() => {
    if (initialData?.runningItems && initialData.runningItems.length > 0) return initialData.runningItems;
    const items: MechanicalChecklistRunningItem[] = [];
    RUNNING_ITEMS_STRUCTURE.forEach(sec => {
        sec.items.forEach(item => {
            items.push({ id: crypto.randomUUID(), section: sec.section, name: item, value: '', state: null });
        });
    });
    return items;
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleStoppedItemChange = (id: string, field: keyof MechanicalChecklistStoppedItem, value: any) => {
    setStoppedItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRunningItemChange = (id: string, field: keyof MechanicalChecklistRunningItem, value: any) => {
    setRunningItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSignatureChange = (role: 'mechanic' | 'supervisor', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
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
          <h1 className="font-black text-2xl uppercase leading-tight">Check-List Mecánico</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>Código IT-WSM-001-A1</div>
          <div className="text-xs font-normal mt-1">REVISIÓN 02</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-2">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-48">Nombre y Apellido Mecánico:</span>
               <input name="mechanicName" value={metadata.mechanicName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="w-full sm:w-48 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Firma:</span>
               <span className="text-xs text-gray-400 italic">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Equipo TKR N°:</span>
               <select name="equipmentNumber" value={metadata.equipmentNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent">
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

         {/* Row 2 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-48">Nombre y Apellido Supervisor:</span>
               <input name="supervisorName" value={metadata.supervisorName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="w-full sm:w-48 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Firma:</span>
               <span className="text-xs text-gray-400 italic">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         {/* Row 3 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Cliente:</span>
               <input name="client" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Yacimiento:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Pozo:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 text-xs">
         
         {/* Left Column: Motor Detenido */}
         <div className="border-r border-black">
            <div className="bg-gray-100 font-bold border-b border-black p-2 text-center uppercase">Medir con motor detenido</div>
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-12 border-b border-black font-bold text-center">
               <div className="col-span-6 p-1 border-r border-black"></div>
               <div className="col-span-2 p-1 border-r border-black">Nivel</div>
               <div className="col-span-2 p-1 border-r border-black">Lts Agreg.</div>
               <div className="col-span-2 p-1">Horas</div>
            </div>
            
            {STOPPED_ITEMS_STRUCTURE.map((sec, sIdx) => {
               const items = stoppedItems.filter(i => i.section === sec.section);
               return (
                  <React.Fragment key={sIdx}>
                     <div className="font-bold bg-gray-50 border-b border-black p-2 pl-2 text-sm">{sec.section}</div>
                     {items.map(item => (
                        <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-gray-300 hover:bg-gray-50 pb-2 sm:pb-0">
                           <div className="sm:col-span-6 p-2 sm:p-1 sm:pl-4 sm:border-r border-black font-medium sm:font-normal">{item.name}</div>
                           
                           {/* Mobile Inputs Layout */}
                           <div className="flex sm:contents px-2 sm:px-0 gap-2">
                               <div className="flex-1 sm:col-span-2 sm:border-r border-black h-full">
                                  <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">NIVEL</label>
                                  <input className="w-full h-full text-center bg-transparent border rounded sm:border-none p-1 sm:p-0 outline-none" value={item.level} onChange={(e) => handleStoppedItemChange(item.id, 'level', e.target.value)} />
                               </div>
                               <div className="flex-1 sm:col-span-2 sm:border-r border-black h-full">
                                  <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">LTS AGREG.</label>
                                  <input className="w-full h-full text-center bg-transparent border rounded sm:border-none p-1 sm:p-0 outline-none" value={item.litersAdded} onChange={(e) => handleStoppedItemChange(item.id, 'litersAdded', e.target.value)} />
                               </div>
                               <div className="flex-1 sm:col-span-2 h-full">
                                  <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">HORAS</label>
                                  <input className="w-full h-full text-center bg-transparent border rounded sm:border-none p-1 sm:p-0 outline-none" value={item.hours} onChange={(e) => handleStoppedItemChange(item.id, 'hours', e.target.value)} />
                               </div>
                           </div>
                        </div>
                     ))}
                  </React.Fragment>
               );
            })}
         </div>

         {/* Right Column: Motor en Marcha */}
         <div>
            <div className="bg-gray-100 font-bold border-b border-black p-2 text-center uppercase">Medir con motor en marcha</div>
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-12 border-b border-black font-bold text-center">
               <div className="col-span-6 p-1 border-r border-black"></div>
               <div className="col-span-3 p-1 border-r border-black">°C/PSI</div>
               <div className="col-span-3 p-1">Estado</div>
            </div>

            {RUNNING_ITEMS_STRUCTURE.map((sec, sIdx) => {
               const items = runningItems.filter(i => i.section === sec.section);
               return (
                  <React.Fragment key={sIdx}>
                     <div className="font-bold bg-gray-50 border-b border-black p-2 pl-2 text-sm">{sec.section}</div>
                     {items.map(item => (
                        <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-gray-300 hover:bg-gray-50 pb-2 sm:pb-0">
                           <div className="sm:col-span-6 p-2 sm:p-1 sm:pl-4 sm:border-r border-black font-medium sm:font-normal">{item.name}</div>
                           
                           {/* Mobile Inputs Layout */}
                           <div className="flex sm:contents px-2 sm:px-0 gap-2">
                               <div className="flex-1 sm:col-span-3 sm:border-r border-black h-full">
                                  <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">°C/PSI</label>
                                  <input className="w-full h-full text-center bg-transparent border rounded sm:border-none p-1 sm:p-0 outline-none" value={item.value} onChange={(e) => handleRunningItemChange(item.id, 'value', e.target.value)} />
                               </div>
                               <div className="flex-1 sm:col-span-3 h-full">
                                  <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">ESTADO</label>
                                  <select 
                                     className="w-full h-full text-center bg-transparent border rounded sm:border-none p-1 sm:p-0 outline-none appearance-none cursor-pointer text-xs"
                                     value={item.state || ''}
                                     onChange={(e) => handleRunningItemChange(item.id, 'state', e.target.value)}
                                  >
                                     <option value="">-</option>
                                     <option value="OK">OK</option>
                                     <option value="Bajo">Bajo</option>
                                     <option value="Alto">Alto</option>
                                  </select>
                               </div>
                           </div>
                        </div>
                     ))}
                  </React.Fragment>
               );
            })}
         </div>
      </div>

      <div className="p-2 bg-yellow-50 text-[10px] border-b border-black text-center font-bold">
         NOTA: En estado se debera completar, OK (bien), Bajo, Alto.
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold underline mb-1">Observaciones:</div>
         <textarea 
            className="w-full h-24 p-2 resize-none outline-none border-none text-xs bg-[linear-gradient(transparent,transparent_19px,#ccc_20px)] leading-5"
            style={{ backgroundSize: '100% 20px', lineHeight: '20px' }}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.mechanic?.data} 
                   onChange={(val) => handleSignatureChange('mechanic', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Personal Mecánico</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Jefe de Equipo/Jefe de Campo</div>
          </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] p-2 border-t border-gray-300 text-gray-500 text-center sm:text-left gap-1">
         <span>Confeccionar esta planilla diariamente por personal mecánico</span>
         <span>N = Estado Normal del Equipo</span>
         <span>NOTA: El documento Original debe ser archivado en Oficina de Mantenimiento y la Copia en Carpeta de Equipo destinada a Mantenimiento</span>
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
               filename={`checklist_mecanico_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              stoppedItems,
              runningItems,
              observations,
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
