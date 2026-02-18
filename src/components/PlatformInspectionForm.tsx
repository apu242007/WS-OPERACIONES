
import React, { useState } from 'react';
import { PlatformInspectionReport, PlatformInspectionMetadata, PlatformInspectionRow, PlatformStatus } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: PlatformInspectionReport;
  onSave: (report: PlatformInspectionReport) => void;
  onCancel: () => void;
}

const SECTIONS = [
  {
    title: "INSPECCION BASICA (A nivel)",
    items: [
      "Manual del fabricante",
      "Plataforma/Barandas (dobladuras, desgaste, rotura, trabas)",
      "Neumaticos (desgastados, aire)",
      "Extintor (carga, fecha vto.)",
      "Bocina / Baliza",
      "Fuido Hidraulico",
      "Mangueras"
    ]
  },
  {
    title: "COMBUSTION INTERNA",
    items: [
      "Tanque propano (perdidas)",
      "Tapa de tanque de gas (operativa)",
      "Condicion de aceite de motor (Chequeo con unidad apagada)",
      "Radiador (chequeo en frio)",
      "Condicion de fluido hidraulico (chequeo con plataforma a nivel)",
      "Mangueras y correas",
      "Bateria (conexiones, nivel de celdas)"
    ]
  },
  {
    title: "INSPECCION EN PLATAFORMA",
    items: [
      "Alimentacion Electrica (Cables y conexiones)",
      "Frenos",
      "Direccion (funcionamiento leve)",
      "Perdida de fluido (debajo de plataforma)",
      "Controles Hidraulicos (funcionamiento normal)",
      "Funciones hidraulicas (Elevacion/descenso)",
      "Controles direccionales (Desplazamientos laterales)"
    ]
  }
];

export const PlatformInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<PlatformInspectionMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    brand: '',
    internalNumber: '',
    serialNumber: '',
    operator: '',
    loadCapacity: '',
    licenseNumber: '',
    type: '',
    expiration: '',
    location: '',
    certifyingEntity: ''
  });

  const [rows, setRows] = useState<PlatformInspectionRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    
    const allRows: PlatformInspectionRow[] = [];
    SECTIONS.forEach(section => {
      section.items.forEach(item => {
        allRows.push({
          id: crypto.randomUUID(),
          category: section.title,
          item: item,
          status: ''
        });
      });
    });
    return allRows;
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id: string, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, status: value as PlatformStatus } : row));
  };

  const handleSignatureChange = (role: 'operator' | 'sectorResponsible', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  const renderSection = (section: { title: string, items: string[] }) => (
    <div key={section.title} className="mb-4 break-inside-avoid">
      <div className="bg-gray-100 border border-black p-2 font-bold text-xs flex justify-between rounded-t-lg sm:rounded-none">
        <span>{section.title}</span>
        <span className="w-16 text-center">REF</span>
      </div>
      {section.items.map(item => {
        const row = rows.find(r => r.category === section.title && r.item === item);
        if (!row) return null;
        return (
          <div key={row.id} className="flex flex-col sm:flex-row border-b border-gray-300 text-xs hover:bg-gray-50 sm:items-center min-h-[32px]">
            <div className="flex-1 p-2 sm:p-1 sm:pl-2 font-medium bg-gray-50 sm:bg-transparent" title={item}>{item}</div>
            
            {/* Status Select */}
            <div className="w-full sm:w-16 sm:border-l border-gray-300 p-1 sm:p-0">
              <select 
                className="w-full h-full bg-transparent outline-none text-center font-bold text-xs appearance-none cursor-pointer border sm:border-0 rounded sm:rounded-none py-1 sm:py-0"
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
              >
                <option value="">-</option>
                <option value="N">N</option>
                <option value="Co">Co</option>
                <option value="F">F</option>
                <option value="V">V</option>
                <option value="R">R</option>
                <option value="L">L</option>
                <option value="NC">NC</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-lg sm:text-2xl uppercase leading-tight">INSPECCIÓN PARA PLATAFORMA DE TRABAJO EN ALTURA</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>ITWSG023-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-3">
         {/* Row 1 */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">FECHA INSPECCIÓN</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">MARCA</span>
               <input name="brand" value={metadata.brand} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">INTERNO Nº</span>
               <input name="internalNumber" value={metadata.internalNumber} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
         </div>

         {/* Row 2 */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">NUMERO SERIE</span>
               <input name="serialNumber" value={metadata.serialNumber} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">OPERADOR</span>
               <input name="operator" value={metadata.operator} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
         </div>

         {/* Row 3 */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">CAPACIDAD CARGA</span>
               <input name="loadCapacity" value={metadata.loadCapacity} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">LICENCIA Nº</span>
               <input name="licenseNumber" value={metadata.licenseNumber} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="w-full sm:w-24 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">TIPO</span>
               <input name="type" value={metadata.type} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="w-full sm:w-24 flex flex-col gap-1">
               <span className="font-bold text-xs uppercase text-gray-500">VTO.</span>
               <input name="expiration" value={metadata.expiration} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
         </div>

         {/* Row 4 */}
         <div className="flex flex-col gap-1">
            <span className="font-bold text-xs uppercase text-gray-500">LUGAR DE OPERACION</span>
            <input name="location" value={metadata.location} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
         </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-b border-black text-[10px] text-center bg-gray-100 font-medium uppercase text-gray-600">
         TERMINOLOGÍA: Normal (N) - Corregir (Co) - Faltante (F) - Verificar (V) - Reparar (R) - Limpiar (L) - No Corresponde (NC)
      </div>

      {/* Main Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
         <div className="space-y-6">
            {renderSection(SECTIONS[0])}
            {renderSection(SECTIONS[1])}
         </div>
         <div className="space-y-6">
            {renderSection(SECTIONS[2])}
            
            {/* Certifying Entity Field */}
            <div className="border border-gray-300 rounded p-3 bg-gray-50">
               <div className="font-bold text-xs mb-1 text-gray-500 uppercase">Ente Certificador del Equipo:</div>
               <input 
                  name="certifyingEntity"
                  value={metadata.certifyingEntity} 
                  onChange={handleMetadataChange} 
                  className="w-full border-b border-gray-400 outline-none bg-transparent py-1"
               />
            </div>
         </div>
      </div>

      {/* Observations */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
         <div className="font-bold text-xs mb-1 uppercase text-gray-500">Observaciones:</div>
         <textarea 
            className="w-full h-32 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.operator?.data} 
                   onChange={(val) => handleSignatureChange('operator', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">OPERADOR MANLIFT</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.sectorResponsible?.data} 
                   onChange={(val) => handleSignatureChange('sectorResponsible', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">RESPONSABLE DE SECTOR</div>
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
               filename={`insp_plataforma_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              observations,
              signatures
            })} className="w-full sm:w-auto">
             Guardar Inspección
           </Button>
        </div>

    </div>
  );
};
