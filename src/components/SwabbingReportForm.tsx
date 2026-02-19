
import React, { useState } from 'react';
import { SwabbingReport, SwabbingMetadata, SwabbingRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: SwabbingReport;
  onSave: (report: SwabbingReport) => void;
  onCancel: () => void;
}

const EmptyRow: SwabbingRow = {
  id: '',
  timeFrom: '',
  timeTo: '',
  depth: '',
  fluidLevel: '',
  extractedLiters: '',
  accumulatedM3: '',
  waterCut: '',
  emulsion: '',
  sandMud: '',
  totalImpurities: '',
  chlorides: '',
  strokesPerHour: '',
  observations: ''
};

export const SwabbingReportForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<SwabbingMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    well: '',
    company: ''
  });

  const [rows, setRows] = useState<SwabbingRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);

  const [signature, setSignature] = useState(initialData?.signature);

  const addRow = () => {
    setRows(prev => [...prev, { ...EmptyRow, id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof SwabbingRow, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl uppercase leading-tight">PLANILLA DE ENSAYO</h1>
          <h2 className="font-bold text-lg uppercase leading-tight">INFORME DE PISTONEO</h2>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWWO006-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            <div className="flex flex-col gap-1">
                <span className="font-bold uppercase text-xs text-gray-500">Fecha</span>
                <input 
                    type="date"
                    name="date"
                    value={metadata.date}
                    onChange={handleMetadataChange}
                    className="border border-gray-300 rounded p-1.5 outline-none bg-white"
                />
            </div>
             <div className="flex flex-col gap-1">
                <span className="font-bold uppercase text-xs text-gray-500">Pozo</span>
                <input 
                    name="well"
                    value={metadata.well}
                    onChange={handleMetadataChange}
                    className="border border-gray-300 rounded p-1.5 outline-none bg-white"
                />
            </div>
             <div className="flex flex-col gap-1">
                <span className="font-bold uppercase text-xs text-gray-500">Compañía</span>
                <input 
                    name="company"
                    value={metadata.company}
                    onChange={handleMetadataChange}
                    className="border border-gray-300 rounded p-1.5 outline-none bg-white"
                />
            </div>
        </div>
        
        <div className="flex flex-col gap-1 sm:w-1/3">
            <span className="font-bold uppercase text-xs text-gray-500">Equipo</span>
            <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white">
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

      {/* Main Table */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[1200px]">
          <table className="w-full border-collapse border border-black text-xs md:text-sm">
            <thead>
              <tr className="bg-white border-b border-black font-bold text-center">
                  {/* Header Row 1 */}
                  <th colSpan={2} className="border-r border-black border-b p-1">Tiempo</th>
                  <th rowSpan={2} className="border-r border-black p-1 w-24 align-bottom"><div>Profundidad</div><div>de</div><div>Mts.</div></th>
                  <th rowSpan={2} className="border-r border-black p-1 w-24 align-bottom"><div>Nivel de</div><div>Fluido</div><div>Mts.</div></th>
                  <th colSpan={2} className="border-r border-black border-b p-1">Volumen Pistoneado</th>
                  <th colSpan={2} className="border-r border-black border-b p-1">Agua</th>
                  <th rowSpan={2} className="border-r border-black p-1 w-20 align-bottom"><div>Arena y</div><div>Barro</div><div>%</div></th>
                  <th rowSpan={2} className="border-r border-black p-1 w-20 align-bottom"><div>Impurezas</div><div>Totales</div><div>%</div></th>
                  <th rowSpan={2} className="border-r border-black p-1 w-16 align-bottom"><div>Cl</div><div>g/l</div></th>
                  <th rowSpan={2} className="border-r border-black p-1 w-16 align-bottom"><div>Carreras</div><div>p/hora</div></th>
                  <th rowSpan={2} className="p-1 align-middle">Observaciones</th>
                  <th rowSpan={2} className="w-8 no-print"></th>
              </tr>
              <tr className="bg-white border-b border-black font-bold text-center">
                  {/* Header Row 2 */}
                  <th className="border-r border-black p-1 w-16 align-bottom">de Hs.</th>
                  <th className="border-r border-black p-1 w-16 align-bottom">a Hs.</th>
                  
                  <th className="border-r border-black p-1 w-20 align-bottom">Extr. Lts.</th>
                  <th className="border-r border-black p-1 w-20 align-bottom">Acum M3</th>
                  
                  <th className="border-r border-black p-1 w-12 align-bottom">%</th>
                  <th className="border-r border-black p-1 w-12 align-bottom">Emuls</th>
              </tr>
            </thead>
            <tbody>
               {rows.map((row, index) => (
                 <tr key={row.id} className="hover:bg-gray-50 group border-b border-black h-8">
                    <td className="border-r border-black p-0">
                       <input type="time" className="w-full h-full p-1 text-center bg-transparent outline-none text-xs" value={row.timeFrom} onChange={(e) => handleRowChange(row.id, 'timeFrom', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input type="time" className="w-full h-full p-1 text-center bg-transparent outline-none text-xs" value={row.timeTo} onChange={(e) => handleRowChange(row.id, 'timeTo', e.target.value)} />
                    </td>
                    
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.depth} onChange={(e) => handleRowChange(row.id, 'depth', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.fluidLevel} onChange={(e) => handleRowChange(row.id, 'fluidLevel', e.target.value)} />
                    </td>
                    
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.extractedLiters} onChange={(e) => handleRowChange(row.id, 'extractedLiters', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.accumulatedM3} onChange={(e) => handleRowChange(row.id, 'accumulatedM3', e.target.value)} />
                    </td>
                    
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.waterCut} onChange={(e) => handleRowChange(row.id, 'waterCut', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.emulsion} onChange={(e) => handleRowChange(row.id, 'emulsion', e.target.value)} />
                    </td>
                    
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.sandMud} onChange={(e) => handleRowChange(row.id, 'sandMud', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.totalImpurities} onChange={(e) => handleRowChange(row.id, 'totalImpurities', e.target.value)} />
                    </td>
                    
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.chlorides} onChange={(e) => handleRowChange(row.id, 'chlorides', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.strokesPerHour} onChange={(e) => handleRowChange(row.id, 'strokesPerHour', e.target.value)} />
                    </td>
                    
                    <td className="p-0 border-r border-black">
                       <input className="w-full h-full p-1 bg-transparent outline-none" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} />
                    </td>
                    <td className="p-0 text-center no-print">
                       <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 font-bold opacity-100 sm:opacity-0 sm:group-hover:opacity-100">&times;</button>
                    </td>
                 </tr>
               ))}
               <tr className="no-print">
                  <td colSpan={14} className="p-2 text-center bg-gray-50 border border-black border-dashed">
                    <button onClick={addRow} className="text-brand-red font-medium text-xs uppercase hover:underline">
                      + Agregar Fila
                    </button>
                  </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver más columnas →</p>

      {/* Signature Area */}
      <div className="p-8 mt-4 page-break flex justify-center">
         <div className="text-center w-64">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                  label=""
                  value={signature?.data}
                  onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                  className="h-full w-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Responsable</div>
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
               filename={`pistoneo_${metadata.date}_${metadata.well || 'pozo'}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata,
              rows,
              signature
            })} className="w-full sm:w-auto">
             Guardar Informe
           </Button>
        </div>

    </div>
  );
};
