
import React, { useState } from 'react';
import { VehicleInspectionReport, VehicleInspectionMetadata, VehicleInspectionRow, VehicleInspectionStatus } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: VehicleInspectionReport;
  onSave: (report: VehicleInspectionReport) => void;
  onCancel: () => void;
}

const ITEMS = [
  "Faros delanteros y traseros.",
  "Luces de posición",
  "Luces de giro",
  "Luces de Stop",
  "Luz indicación marcha atrás",
  "Luces Balizas",
  "Bocina/alarma de retroceso",
  "Tacógrafo (existencia y funcionamiento)",
  "Limpiaparabrisas – Estado de escobillas. Agua en contenedor.",
  "Desempañador - Calefacción",
  "Funcionamiento A.A.",
  "Funcionamiento de Freno – Freno de Mano.",
  "Chapa patente visible",
  "Estado de puerta y asientos",
  "Espejos retrovisores.",
  "Cinturones de seguridad",
  "Estado de parabrisas",
  "Estado de vidrios laterales y trasero.",
  "Apoya Cabezas",
  "Estado general de habitáculo",
  "Gato hidráulico y Herramientas.",
  "Estado de cubiertas.",
  "Presencia y chequeo de CHECK POINT",
  "Documento de control de torque.",
  "Estado Ruedas de auxilio",
  "Cadenas p/ cubiertas",
  "Extintores (pick-up 1kg y 5kg)",
  "Barra de remolque (grilletes de sujeción)",
  "Botiquín",
  "Balizas",
  "Arrestallama",
  "Estado de Barra antivuelco",
  "Bandas retroflexivas – Circulo de velocidad Max..",
  "Estado de piso de madera.",
  "Sistema de izaje - IND",
  "Estado general del móvil (Marcar daños observados)",
  "Limpieza del móvil."
];

export const VehicleInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<VehicleInspectionMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    vehicle: '',
    mileage: '',
    greenCard: '',
    plate: '',
    lastServiceKms: '',
    soExpiration: '',
    internalNumber: '',
    vtvExpiration: '',
    routeExpiration: ''
  });

  const getInitialRow = (itemName: string): VehicleInspectionRow => {
    // If we have saved data, try to find the row by item name
    if (initialData?.rows) {
        // We look for a row where 'item' matches itemName. 
        // Backward compatibility: check if 'id' matches itemName (from old structure where id was used as item name)
        const found = initialData.rows.find(r => r.item === itemName || r.id === itemName);
        if (found) {
            return {
                id: found.id || crypto.randomUUID(),
                item: itemName,
                status: found.status || null, // Ensure status exists
                observations: found.observations || ''
            };
        }
    }
    return { 
      id: crypto.randomUUID(), 
      item: itemName,
      status: null, 
      observations: '' 
    };
  };

  const [rows, setRows] = useState<VehicleInspectionRow[]>(() => {
    return ITEMS.map(item => getInitialRow(item));
  });

  const [signature, setSignature] = useState(initialData?.signature);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof VehicleInspectionRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleStatusChange = (id: string, status: VehicleInspectionStatus) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        // Toggle if clicking same status
        const newStatus = row.status === status ? null : status;
        return { ...row, status: newStatus };
      }
      return row;
    }));
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
          <h1 className="font-black text-xl md:text-2xl uppercase leading-tight">CHECK LIST VEHÍCULOS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POSGI001-A1-2</div>
          <div className="flex items-center gap-1 mt-1 font-normal w-full justify-center">
             <span>FECHA:</span>
             <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="border-b border-black outline-none bg-transparent text-xs w-24 text-center"/>
          </div>
        </div>
      </div>

      {/* Metadata Form */}
      <div className="p-4 border-b border-black text-sm space-y-2 bg-gray-50 print:bg-transparent">
         {/* Row 1 */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20">VEHÍCULO:</span>
               <input name="vehicle" value={metadata.vehicle} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-28">KILOMETRAJE:</span>
               <input name="mileage" value={metadata.mileage} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
               <span className="ml-1">kms</span>
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-24">Tarjeta verde:</span>
               <input name="greenCard" value={metadata.greenCard} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         {/* Row 2 */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20">PATENTE:</span>
               <input name="plate" value={metadata.plate} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-28">Último Servicio:</span>
               <input name="lastServiceKms" value={metadata.lastServiceKms} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
               <span className="ml-1">kms</span>
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20">S. O. Vto.:</span>
               <input name="soExpiration" value={metadata.soExpiration} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         {/* Row 3 */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20">INTERNO:</span>
               <input name="internalNumber" value={metadata.internalNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20">VTV Vto.:</span>
               <input name="vtvExpiration" value={metadata.vtvExpiration} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20">RUTA Vto.:</span>
               <input name="routeExpiration" value={metadata.routeExpiration} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Checklist Table */}
      <div className="w-full">
        {/* Table Header */}
        <div className="hidden sm:flex bg-gray-200 text-center font-bold border-b border-black text-xs">
           <div className="flex-1 p-2 text-left pl-4 border-r border-black">ITEM</div>
           <div className="w-12 p-2 border-r border-black">BIEN</div>
           <div className="w-12 p-2 border-r border-black">MAL</div>
           <div className="w-12 p-2 border-r border-black">N/C</div>
           <div className="w-1/3 p-2">OBSERVACIONES</div>
        </div>

        {rows.map((row) => (
           <div key={row.id} className="flex flex-col sm:flex-row border-b border-black hover:bg-gray-50 min-h-[40px] sm:min-h-[32px] text-xs">
              <div className="flex-1 p-2 sm:p-1 sm:pl-2 font-medium break-words sm:border-r border-black flex items-center bg-gray-50 sm:bg-transparent">
                 {row.item}
              </div>
              
              {/* Mobile Inputs Layout */}
              <div className="flex sm:contents border-t sm:border-t-0 border-gray-200">
                  <div 
                     className={`flex-1 sm:w-12 p-2 sm:p-0 text-center border-r border-black cursor-pointer hover:bg-gray-100 flex items-center justify-center ${row.status === 'BIEN' ? 'bg-black text-white font-bold' : ''}`} 
                     onClick={() => handleStatusChange(row.id, 'BIEN')}
                  >
                     <span className="sm:hidden mr-2 text-gray-500 font-bold text-[10px]">BIEN</span>
                     {row.status === 'BIEN' && 'X'}
                  </div>
                  <div 
                     className={`flex-1 sm:w-12 p-2 sm:p-0 text-center border-r border-black cursor-pointer hover:bg-gray-100 flex items-center justify-center ${row.status === 'MAL' ? 'bg-black text-white font-bold' : ''}`} 
                     onClick={() => handleStatusChange(row.id, 'MAL')}
                  >
                     <span className="sm:hidden mr-2 text-gray-500 font-bold text-[10px]">MAL</span>
                     {row.status === 'MAL' && 'X'}
                  </div>
                  <div 
                     className={`flex-1 sm:w-12 p-2 sm:p-0 text-center sm:border-r border-black cursor-pointer hover:bg-gray-100 flex items-center justify-center ${row.status === 'N/C' ? 'bg-black text-white font-bold' : ''}`} 
                     onClick={() => handleStatusChange(row.id, 'N/C')}
                  >
                     <span className="sm:hidden mr-2 text-gray-500 font-bold text-[10px]">N/C</span>
                     {row.status === 'N/C' && 'X'}
                  </div>
              </div>
              
              <div className="w-full sm:w-1/3 p-0 border-t sm:border-t-0 border-gray-200">
                 <input 
                    className="w-full h-full min-h-[32px] p-2 sm:p-1 sm:pl-2 outline-none bg-transparent placeholder-gray-400"
                    value={row.observations}
                    onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)}
                    placeholder="Observaciones..."
                 />
              </div>
           </div>
        ))}
      </div>

      {/* Signature */}
      <div className="p-8 mt-4 page-break-inside-avoid flex justify-center border-t border-gray-200">
         <div className="text-center w-64">
             <div className="border-b border-black border-dashed mb-1">
                <SignaturePad 
                   label=""
                   value={signature?.data}
                   onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                />
             </div>
             <div className="text-xs font-bold mt-1">Firma Conductor / Responsable</div>
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
               filename={`insp_vehiculo_${metadata.date}_${metadata.plate || 'patente'}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              signature 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
