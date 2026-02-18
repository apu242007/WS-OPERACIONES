
import React, { useState } from 'react';
import { ThicknessReport, ThicknessMetadata, ThicknessRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ThicknessReport;
  onSave: (report: ThicknessReport) => void;
  onCancel: () => void;
}

const MIN_THICKNESS = 5.6;

const DEFAULT_ROWS: ThicknessRow[] = [
  { id: 'row-b', pointLabel: 'Pto. B', measure0: '', measure90: '', measure180: '', measure270: '', isApt: null },
  { id: 'row-c', pointLabel: 'Pto. C', measure0: '', measure90: '', measure180: '', measure270: '', isApt: null },
  { id: 'row-d', pointLabel: 'Pto. D', measure0: '', measure90: '', measure180: '', measure270: '', isApt: null },
];

export const ThicknessMeasurementForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ThicknessMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    location: '',
    specificLocation: '',
    identification: '',
    responsible: '',
    instrumentCode: ''
  });

  const [rows, setRows] = useState<ThicknessRow[]>(initialData?.rows && initialData.rows.length > 0 ? initialData.rows : DEFAULT_ROWS.map(r => ({ ...r, id: crypto.randomUUID() })));
  
  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const calculateApt = (row: ThicknessRow): boolean | null => {
    const values = [row.measure0, row.measure90, row.measure180, row.measure270];
    const numericValues = values.map(v => v === '' ? null : parseFloat(v));
    
    // If no values entered, return null
    if (numericValues.every(v => v === null)) return null;

    // If any value is present and below min, fail
    const hasFailure = numericValues.some(v => v !== null && !isNaN(v) && v < MIN_THICKNESS);
    if (hasFailure) return false;

    // Only pass if all filled (optional logic, but typically safer) or just checking existing values
    return true;
  };

  const handleRowChange = (id: string, field: keyof ThicknessRow, value: string) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        updatedRow.isApt = calculateApt(updatedRow);
        return updatedRow;
      }
      return row;
    }));
  };

  const handleSignatureChange = (role: 'responsible' | 'rigManager' | 'companyRepresentative', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
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
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">PLANILLA DE MEDICION DE ESPESORES EN LINEAS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm">
          <div>IT-WFB-004-A1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-16 text-xs uppercase">EQUIPO:</span>
               <input name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-24 text-xs uppercase">LOCACIÓN:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-16 text-xs uppercase">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-20 text-xs uppercase">Ubicación:</span>
               <input name="specificLocation" value={metadata.specificLocation} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" placeholder="Ej: Pileta, Bomba..." />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-24 text-xs uppercase">Identificación:</span>
               <input name="identification" value={metadata.identification} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" placeholder="Ej: Linea #1" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-24 text-xs uppercase">Resp. Medición:</span>
               <input name="responsible" value={metadata.responsible} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
         </div>
      </div>

      {/* Diagram & Instructions */}
      <div className="flex flex-col md:flex-row border-b border-black">
         {/* Diagram */}
         <div className="flex-1 border-b md:border-b-0 md:border-r border-black p-6 flex flex-col items-center justify-center bg-white">
            <svg viewBox="0 0 500 150" className="w-full max-w-md h-auto select-none">
                <defs>
                    <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="2" height="4" transform="translate(0,0)" fill="#aaa" opacity="0.3"></rect>
                    </pattern>
                </defs>
                
                {/* Main Pipe Body */}
                <rect x="50" y="40" width="400" height="70" fill="url(#hatch)" stroke="black" strokeWidth="2" />
                
                {/* Left Flange (Female/Union) */}
                <path d="M50 20 L50 130 L30 130 L30 20 Z" fill="#ddd" stroke="black" strokeWidth="2" />
                <path d="M30 30 L10 30 L10 120 L30 120" fill="none" stroke="black" strokeWidth="2" />
                
                {/* Right Thread (Male) */}
                <path d="M450 45 L470 45 L470 105 L450 105" fill="#ddd" stroke="black" strokeWidth="2" />
                <line x1="455" y1="45" x2="455" y2="105" stroke="black" strokeWidth="1" />
                <line x1="460" y1="45" x2="460" y2="105" stroke="black" strokeWidth="1" />
                <line x1="465" y1="45" x2="465" y2="105" stroke="black" strokeWidth="1" />

                {/* Dimensions Lines */}
                {/* Bottom Dimension Line */}
                <line x1="50" y1="135" x2="50" y2="145" stroke="blue" strokeWidth="1" />
                <line x1="470" y1="135" x2="470" y2="145" stroke="blue" strokeWidth="1" />
                <line x1="50" y1="140" x2="470" y2="140" stroke="blue" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                <text x="260" y="135" fill="blue" fontSize="12" textAnchor="middle">=</text>

                {/* Point B Dimension */}
                <line x1="50" y1="90" x2="120" y2="90" stroke="blue" strokeWidth="1" strokeDasharray="4 2" /> 
                <line x1="120" y1="75" x2="120" y2="125" stroke="blue" strokeWidth="1" />
                <text x="85" y="120" fill="blue" fontSize="10" textAnchor="middle">70</text>
                
                {/* Point D Dimension */}
                <line x1="370" y1="75" x2="370" y2="125" stroke="blue" strokeWidth="1" />
                <line x1="370" y1="120" x2="470" y2="120" stroke="blue" strokeWidth="1" />
                <text x="420" y="115" fill="blue" fontSize="10" textAnchor="middle">100</text>

                {/* Points Labels */}
                <text x="120" y="65" fill="blue" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>
                <text x="260" y="65" fill="blue" fontSize="14" fontWeight="bold" textAnchor="middle">C</text>
                <text x="370" y="65" fill="blue" fontSize="14" fontWeight="bold" textAnchor="middle">D</text>

                {/* Center Line */}
                <line x1="40" y1="75" x2="480" y2="75" stroke="blue" strokeDasharray="10 5" strokeWidth="1" opacity="0.5" />
            </svg>
         </div>

         {/* Instructions & Instrument */}
         <div className="flex-1 p-4 flex flex-col justify-between">
             <div className="space-y-4">
                <div className="font-bold underline text-sm">Método de Medición según Procedimiento Código PO-WFB-02</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                   <li>Inspeccionar visualmente el estado de las Roscas, Tuercas y Sello.</li>
                   <li>Limpiar la Línea en la zona donde se va a tomar el espesor.</li>
                </ul>
             </div>
             
             <div className="mt-8 border border-black p-2 bg-gray-50">
                <div className="text-xs font-bold uppercase mb-1">Código del Instrumento de Medición:</div>
                <input 
                   name="instrumentCode" 
                   value={metadata.instrumentCode} 
                   onChange={handleMetadataChange} 
                   className="w-full bg-white border-b border-black outline-none p-1 font-mono"
                />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full border-b border-black">
         <div className="min-w-[700px]">
            <table className="w-full border-collapse border border-black text-sm">
               <thead>
                  <tr className="bg-gray-200 border-b border-black text-center font-bold">
                     <th className="border-r border-black p-2 w-32 sticky left-0 bg-gray-200 z-10">PUNTO</th>
                     <th className="border-r border-black p-2">Ref 0º</th>
                     <th className="border-r border-black p-2">Ref 90º</th>
                     <th className="border-r border-black p-2">Ref 180º</th>
                     <th className="border-r border-black p-2">Ref 270º</th>
                     <th className="p-2 w-32">APTO<br/><span className="text-xs font-normal">(SÍ / NO)</span></th>
                  </tr>
               </thead>
               <tbody>
                  {rows.map(row => (
                     <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-12">
                        <td className="border-r border-black p-2 text-center font-bold bg-gray-100 print:bg-transparent sticky left-0 z-10">
                           {row.pointLabel}
                        </td>
                        <td className="border-r border-black p-0">
                           <input 
                              type="number" 
                              step="0.1"
                              className="w-full h-full text-center outline-none bg-transparent" 
                              value={row.measure0} 
                              onChange={(e) => handleRowChange(row.id, 'measure0', e.target.value)}
                              placeholder="mm"
                           />
                        </td>
                        <td className="border-r border-black p-0">
                           <input 
                              type="number" 
                              step="0.1"
                              className="w-full h-full text-center outline-none bg-transparent" 
                              value={row.measure90} 
                              onChange={(e) => handleRowChange(row.id, 'measure90', e.target.value)}
                              placeholder="mm"
                           />
                        </td>
                        <td className="border-r border-black p-0">
                           <input 
                              type="number" 
                              step="0.1"
                              className="w-full h-full text-center outline-none bg-transparent" 
                              value={row.measure180} 
                              onChange={(e) => handleRowChange(row.id, 'measure180', e.target.value)}
                              placeholder="mm"
                           />
                        </td>
                        <td className="border-r border-black p-0">
                           <input 
                              type="number" 
                              step="0.1"
                              className="w-full h-full text-center outline-none bg-transparent" 
                              value={row.measure270} 
                              onChange={(e) => handleRowChange(row.id, 'measure270', e.target.value)}
                              placeholder="mm"
                           />
                        </td>
                        <td className={`p-0 text-center font-bold flex items-center justify-center h-12
                           ${row.isApt === true ? 'bg-green-100 text-green-800' : ''} 
                           ${row.isApt === false ? 'bg-red-100 text-red-800' : ''}`}>
                           {row.isApt === true && 'SÍ'}
                           {row.isApt === false && 'NO'}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver medidas →</p>

      {/* Observations */}
      <div className="p-4 border-b border-black bg-white">
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
               <div className="font-bold mb-1 text-xs uppercase">OBSERVACIONES:</div>
               <textarea 
                  className="w-full p-2 border border-gray-300 rounded h-24 resize-none outline-none text-sm"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
               />
            </div>
            <div className="sm:w-64 text-xs border border-red-500 bg-red-50 p-2 rounded flex flex-col justify-center">
               <p className="font-bold text-red-700 mb-2">NOTA IMPORTANTE:</p>
               <p>El espesor mínimo admisible será de <span className="font-bold">5,6 mm</span>.</p>
               <p className="mt-1">Se realiza medición sobre 4 directrices (cada 90º), en sentido de las agujas del reloj, tomando como punto inicial 0º.</p>
            </div>
         </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.responsible?.data} 
                   onChange={(val) => handleSignatureChange('responsible', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">RESPONSABLE MEDICION</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">JEFE DE EQUIPO</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.companyRepresentative?.data} 
                   onChange={(val) => handleSignatureChange('companyRepresentative', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">COMPANY REPRESENTATIVE</div>
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
               filename={`espesores_${metadata.date}`}
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
             Guardar Reporte
           </Button>
        </div>

    </div>
  );
};
