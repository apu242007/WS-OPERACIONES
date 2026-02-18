
import React, { useState } from 'react';
import { OilChangeReport, OilChangeMetadata, OilChangeSection } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: OilChangeReport;
  onSave: (report: OilChangeReport) => void;
  onCancel: () => void;
}

const DEFAULT_SECTIONS = [
  {
    title: 'EQUIPO',
    items: ['Motor', 'Caja de Cambio', 'Caja Angular', 'Drop Box', 'Transmisión', 'Diferencial Trasero', 'Diferencial Delantero', 'Malacate', 'Malacate Hidráulico', 'Tanque Hidráulico', 'Filtro Aire', 'Filtro Gas Oil', 'Filtro Aceite', 'Filtro Hidráulico']
  },
  {
    title: 'USINAS',
    items: ['Motor 1', 'Generador 1', 'Motor 2', 'Generador 2', 'Filtro Aire', 'Filtro Gas Oil', 'Filtro Aceite']
  },
  {
    title: 'BOMBA',
    items: ['Motor', 'Caja', 'Power End', 'Filtro Aire', 'Filtro Gas Oil', 'Filtro Aceite']
  }
];

export const OilChangeForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<OilChangeMetadata>(initialData?.metadata || {
    mechanic1: '',
    mechanic2: '',
    equipment: '',
    date: new Date().toISOString().split('T')[0],
    client: '',
    field: '',
    well: ''
  });

  const [sections, setSections] = useState<OilChangeSection[]>(() => {
    if (initialData?.sections && initialData.sections.length > 0) return initialData.sections;
    return DEFAULT_SECTIONS.map(s => ({
      id: crypto.randomUUID(),
      title: s.title,
      items: s.items.map(item => ({
        id: crypto.randomUUID(),
        item,
        status: null,
        partsOrLiters: ''
      })),
      observations: '',
      hourMeter: '',
      maintenanceHours: ''
    }));
  });

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (sectionId: string, rowId: string, field: 'status' | 'partsOrLiters', value: any) => {
    setSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map(item => item.id === rowId ? { ...item, [field]: value } : item)
        };
      }
      return sec;
    }));
  };

  const handleSectionFieldChange = (sectionId: string, field: 'observations' | 'hourMeter' | 'maintenanceHours', value: string) => {
    setSections(prev => prev.map(sec => sec.id === sectionId ? { ...sec, [field]: value } : sec));
  };

  const handleSignatureChange = (role: 'mechanic' | 'supervisor', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  // Helper to render a section
  const renderSection = (section: OilChangeSection) => (
     <div className="border border-black bg-white rounded-lg overflow-hidden h-full flex flex-col">
        <div className="bg-gray-100 font-bold border-b border-black p-2 text-center uppercase text-sm">
           {section.title}
        </div>
        
        {/* Meters */}
        <div className="p-3 border-b border-black bg-gray-50 flex gap-4 text-xs">
           <div className="flex-1 flex flex-col">
              <span className="font-bold mb-1 text-gray-500">Horómetro:</span>
              <input 
                 className="border border-gray-300 p-1.5 rounded bg-white text-center font-medium" 
                 value={section.hourMeter}
                 onChange={(e) => handleSectionFieldChange(section.id, 'hourMeter', e.target.value)}
              />
           </div>
           <div className="flex-1 flex flex-col">
              <span className="font-bold mb-1 text-gray-500">Hs. Prox. Mant:</span>
              <input 
                 className="border border-gray-300 p-1.5 rounded bg-white text-center font-medium"
                 value={section.maintenanceHours}
                 onChange={(e) => handleSectionFieldChange(section.id, 'maintenanceHours', e.target.value)}
              />
           </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border-b border-black text-xs flex-1">
           <thead>
              <tr className="bg-gray-200 border-b border-black font-bold text-center text-[10px] sm:text-xs">
                 <th className="p-2 border-r border-black text-left pl-2">Ítem</th>
                 <th className="p-2 border-r border-black w-8 sm:w-10">SI</th>
                 <th className="p-2 border-r border-black w-8 sm:w-10">NO</th>
                 <th className="p-2 w-16 sm:w-20">Cant/Lts</th>
              </tr>
           </thead>
           <tbody>
              {section.items.map(row => (
                 <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 h-8">
                    <td className="p-1 pl-2 border-r border-black font-medium">{row.item}</td>
                    <td 
                        className="p-0 border-r border-black text-center cursor-pointer hover:bg-gray-200" 
                        onClick={() => handleRowChange(section.id, row.id, 'status', row.status === 'SI' ? null : 'SI')}
                    >
                       <div className={`w-full h-full flex items-center justify-center font-bold ${row.status === 'SI' ? 'text-black' : 'text-transparent'}`}>X</div>
                    </td>
                    <td 
                        className="p-0 border-r border-black text-center cursor-pointer hover:bg-gray-200" 
                        onClick={() => handleRowChange(section.id, row.id, 'status', row.status === 'NO' ? null : 'NO')}
                    >
                       <div className={`w-full h-full flex items-center justify-center font-bold ${row.status === 'NO' ? 'text-black' : 'text-transparent'}`}>X</div>
                    </td>
                    <td className="p-0">
                       <input 
                          className="w-full h-full text-center outline-none bg-transparent"
                          value={row.partsOrLiters}
                          onChange={(e) => handleRowChange(section.id, row.id, 'partsOrLiters', e.target.value)}
                       />
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>

        {/* Observations */}
        <div className="p-2 flex flex-col mt-auto bg-gray-50 border-t border-gray-300">
           <span className="font-bold text-xs mb-1 text-gray-500">Observaciones:</span>
           <textarea 
              className="w-full p-2 resize-none outline-none border border-gray-300 text-xs rounded bg-white"
              rows={4}
              value={section.observations}
              onChange={(e) => handleSectionFieldChange(section.id, 'observations', e.target.value)}
           />
        </div>
     </div>
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
          <h1 className="font-black text-xl uppercase leading-tight">CAMBIO DE ACEITE Y FILTROS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WSM-004-A1</div>
          <div className="text-xs font-normal mt-1">Revisión 00</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-3">
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-20 sm:w-auto">Mecánico 1:</span>
               <input name="mechanic1" value={metadata.mechanic1} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2 w-20 sm:w-auto">Mecánico 2:</span>
               <input name="mechanic2" value={metadata.mechanic2} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="sm:w-40 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Equipo:</span>
               <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase">
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
               <span className="font-bold mr-2">Cliente:</span>
               <input name="client" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Yacimiento:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">Pozo:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
         </div>
      </div>

      {/* Sections Grid - Mobile Accordion, Desktop Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Mobile: Use accordion details for each section */}
         <div className="md:hidden space-y-4">
            {sections.map(section => (
                <details key={section.id} className="group border border-gray-300 rounded-lg overflow-hidden" open>
                    <summary className="flex items-center justify-between p-3 bg-gray-100 font-bold cursor-pointer list-none select-none">
                        <span>{section.title}</span>
                        <svg className="w-5 h-5 transition-transform group-open:rotate-180 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="p-0">
                       {renderSection(section)}
                    </div>
                </details>
            ))}
         </div>

         {/* Desktop: Grid layout */}
         <div className="hidden md:contents">
             {sections.map(section => (
                 <div key={section.id}>
                    {renderSection(section)}
                 </div>
             ))}
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-8 border-t border-black page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.mechanic?.data} 
                   onChange={(val) => handleSignatureChange('mechanic', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma Mecánico</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma Supervisor</div>
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
               filename={`cambio_aceite_${metadata.date}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              sections, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
