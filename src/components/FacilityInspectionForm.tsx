
import React, { useState } from 'react';
import { FacilityInspectionReport, FacilityInspectionMetadata, FacilityInspectionRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: FacilityInspectionReport;
  onSave: (report: FacilityInspectionReport) => void;
  onCancel: () => void;
}

const SECTIONS = [
  {
    title: "Condición Vestidor/Baño",
    items: [
      "Inodoros en buen estado",
      "Mingitorios en buen estado",
      "Lavatorios en buen estado",
      "Griferías en buen estado",
      "Iluminación adecuada",
      "Pérdidas de agua",
      "Duchas en buen estado",
      "pisos limpios ordenados y secos",
      "Calefacción",
      "Casilleros. Cantidad suficiente y en buen estado",
      "Puertas",
      "Ventanas",
      "Paredes limpias",
      "Agua caliente y fría",
      "Instalaciones eléctricas cubiertas y protegidas",
      "Otros (nombrar)"
    ]
  },
  {
    title: "Condición Cocina / Comedor",
    items: [
      "Cocina/anafe en buen estado",
      "pisos limpios ordenados y secos",
      "Pérdidas de agua",
      "Griferías en buen estado",
      "Tachos basura",
      "Muebles/Estanterías en buen estado",
      "Mesa en buen estado",
      "Sillas en buen estado",
      "Paredes limpias",
      "Ventanas",
      "Puertas",
      "Instalaciones eléctricas cubiertas y protegidas",
      "Iluminación adecuada",
      "Calefón en buen estado",
      "Calefacción",
      "Ausencia de fugas de gas",
      "Dispenser de Agua",
      "Agua caliente y fría",
      "Extintores señalizados, instalados y vigentes",
      "Botiquin equipado, limpio y ordenado",
      "Heladera en buen estado",
      "Mesada en buen estado",
      "Horno microondas",
      "Otros (nombrelos)"
    ]
  },
  {
    title: "Condición oficinas",
    items: [
      "Muebles en buen estado",
      "Escritorios / Sillas",
      "Piso limpio, ordenado y seco",
      "Paredes limpias",
      "Instalaciones eléctricas cubiertas y protegidas",
      "Iluminación adecuada",
      "Extintores señalizados, instalados y vigentes",
      "Botiquin equipado, limpio y ordenado",
      "Calefacción funcionando",
      "Artefactos Eléctricos",
      "Pasillos de circulación libres de obstáculos",
      "Otros (nombrelos)"
    ]
  },
  {
    title: "Estructura de Trailer Vivienda/Oficina",
    items: [
      "Estado de cubiertas y lanza de enganche",
      "Riendas de acero para anclaje",
      "Estabilizadores laterales",
      "Carteleria de Seguridad / Calidad / Medio Ambiente",
      "Estado de Sistema de Iluminación",
      "Sistema de Izaje con Camión Petrolero",
      "Detectores de Humo",
      "Luces de Emergencia",
      "Tablero electrico en condiciones"
    ]
  }
];

export const FacilityInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<FacilityInspectionMetadata>(initialData?.metadata || {
    base: '',
    date: new Date().toISOString().split('T')[0]
  });

  const getInitialRow = (category: string, item: string): FacilityInspectionRow => {
    // Try to find existing row
    const existing = initialData?.rows.find(r => r.item === item && r.category === category);
    if (existing) return existing;
    
    // Backward compatibility or fallback
    const byId = initialData?.rows.find(r => r.id === item);
    if (byId) return { ...byId, category, item };

    return { 
      id: crypto.randomUUID(), 
      category, 
      item, 
      status: null, 
      observations: '' 
    };
  };

  const [rows, setRows] = useState<FacilityInspectionRow[]>(() => {
    const allRows: FacilityInspectionRow[] = [];
    SECTIONS.forEach(section => {
      section.items.forEach(item => {
        allRows.push(getInitialRow(section.title, item));
      });
    });
    return allRows;
  });

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof FacilityInspectionRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (role: 'controller' | 'sectorChief', dataUrl: string | undefined) => {
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
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-lg sm:text-xl uppercase leading-tight">INSPECCIÓN DE MANTENIMIENTO DE INSTALACIONES</h1>
        </div>
        <div className="col-span-3 p-2 flex flex-col justify-center items-center text-xs font-bold pl-4">
          <div>POSGI001-A10-1</div>
          <div>HOJA 1 DE 1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1">
                <label className="font-bold w-16 uppercase">BASE:</label>
                <input 
                  name="base"
                  value={metadata.base}
                  onChange={handleMetadataChange}
                  className="flex-1 border-b border-black border-dotted outline-none bg-transparent py-1"
                />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1">
                <label className="font-bold w-16 uppercase">FECHA:</label>
                <input 
                  type="date"
                  name="date"
                  value={metadata.date}
                  onChange={handleMetadataChange}
                  className="flex-1 border-b border-black border-dotted outline-none bg-transparent py-1"
                />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="w-full">
         {SECTIONS.map((section, idx) => (
            <div key={idx} className="break-inside-avoid">
               {/* Section Header */}
               <div className="hidden sm:grid grid-cols-12 border-b border-black bg-gray-300 font-bold text-sm text-center print:bg-gray-300">
                  <div className="col-span-5 p-2 border-r border-black text-left pl-2">{section.title}</div>
                  <div className="col-span-1 p-2 border-r border-black">SI</div>
                  <div className="col-span-1 p-2 border-r border-black">NO</div>
                  <div className="col-span-1 p-2 border-r border-black">N/A</div>
                  <div className="col-span-4 p-2">Observaciones</div>
               </div>
               
               {/* Mobile Section Header */}
               <div className="sm:hidden bg-gray-200 p-2 font-bold text-sm border-b border-black uppercase text-center">
                  {section.title}
               </div>
               
               {/* Items */}
               {section.items.map(item => {
                 const row = rows.find(r => r.category === section.title && r.item === item);
                 if (!row) return null;
                 
                 return (
                   <div key={item} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-sm sm:text-xs items-center hover:bg-gray-50 group">
                      <div className="col-span-5 sm:border-r border-black p-2 pl-4 sm:pl-2 w-full font-medium sm:font-normal bg-gray-50 sm:bg-transparent">
                         {item}
                      </div>
                      
                      {/* Mobile Actions */}
                      <div className="flex w-full sm:contents border-t sm:border-t-0 border-gray-200">
                          {/* SI */}
                          <div 
                            className="flex-1 sm:col-span-1 sm:border-r border-black p-2 flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors"
                            onClick={() => handleRowChange(row.id, 'status', row.status === 'SI' ? null : 'SI')}
                          >
                             <div className="flex items-center gap-2 sm:block">
                                <span className="sm:hidden text-xs font-bold text-gray-500">SI</span>
                                <div className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center border rounded ${row.status === 'SI' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                                   {row.status === 'SI' && <span className="sm:inline hidden">X</span>}
                                   {row.status === 'SI' && <span className="sm:hidden inline">✓</span>}
                                </div>
                             </div>
                          </div>

                          {/* NO */}
                          <div 
                            className="flex-1 sm:col-span-1 sm:border-r border-black p-2 flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                            onClick={() => handleRowChange(row.id, 'status', row.status === 'NO' ? null : 'NO')}
                          >
                             <div className="flex items-center gap-2 sm:block">
                                <span className="sm:hidden text-xs font-bold text-gray-500">NO</span>
                                <div className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center border rounded ${row.status === 'NO' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                                   {row.status === 'NO' && <span className="sm:inline hidden">X</span>}
                                   {row.status === 'NO' && <span className="sm:hidden inline">✕</span>}
                                </div>
                             </div>
                          </div>

                          {/* NA */}
                          <div 
                            className="flex-1 sm:col-span-1 sm:border-r border-black p-2 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleRowChange(row.id, 'status', row.status === 'NA' ? null : 'NA')}
                          >
                             <div className="flex items-center gap-2 sm:block">
                                <span className="sm:hidden text-xs font-bold text-gray-500">N/A</span>
                                <div className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center border rounded ${row.status === 'NA' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                                   {row.status === 'NA' && <span className="sm:inline hidden">X</span>}
                                   {row.status === 'NA' && <span className="sm:hidden inline">-</span>}
                                </div>
                             </div>
                          </div>
                      </div>

                      {/* Observations */}
                      <div className="col-span-4 p-0 w-full border-t sm:border-t-0 border-gray-200">
                         <input 
                           className="w-full h-full p-2 sm:p-1 sm:pl-2 outline-none bg-transparent placeholder-gray-400 sm:placeholder-transparent"
                           value={row.observations}
                           onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)}
                           placeholder="Observaciones..."
                         />
                      </div>
                   </div>
                 );
               })}
            </div>
         ))}
      </div>

      {/* Footer Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 border-t border-black page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 border-b sm:border-b-0 border-gray-200 pb-4 sm:pb-0">
             <div className="flex-1">
                <div className="h-20 border-b border-black border-dotted mb-1 flex items-end justify-center">
                    <SignaturePad 
                       label=""
                       value={signatures.controller?.data}
                       onChange={(val) => handleSignatureChange('controller', val)}
                       className="w-full h-full border-0"
                    />
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                    <span>CONTROLÓ</span>
                    <span>FIRMA</span>
                </div>
             </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
             <div className="flex-1">
                <div className="h-20 border-b border-black border-dotted mb-1 flex items-end justify-center">
                    <SignaturePad 
                       label=""
                       value={signatures.sectorChief?.data}
                       onChange={(val) => handleSignatureChange('sectorChief', val)}
                       className="w-full h-full border-0"
                    />
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                    <span>JEFE DE SECTOR</span>
                    <span>FIRMA</span>
                </div>
             </div>
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
               filename={`insp_instalaciones_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Inspección
           </Button>
        </div>

    </div>
  );
};
