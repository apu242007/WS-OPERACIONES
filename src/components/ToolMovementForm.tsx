
import React, { useState } from 'react';
import { ToolMovementReport, ToolMovementMetadata, ToolMovementRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { ToolMovementPdf } from '../pdf/ToolMovementPdf';

interface Props {
  initialData?: ToolMovementReport;
  onSave: (report: ToolMovementReport) => void;
  onCancel: () => void;
}

const EmptyRow: ToolMovementRow = {
  id: '',
  tubingLength: '',
  steelVol: '',
  pumpVol: '',
  tankLevel: '',
  returnVol: '',
  observations: ''
};

export const ToolMovementForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ToolMovementMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    well: '',
    termFluid: ''
  });

  const [rows, setRows] = useState<ToolMovementRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

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

  const handleRowChange = (id: string, field: keyof ToolMovementRow, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (role: 'elaborator' | 'approver', dataUrl: string | undefined) => {
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

  // Helper calculation functions
  const calculateAdmitted = (row: ToolMovementRow): string => {
    const a = parseFloat(row.steelVol);
    const b = parseFloat(row.pumpVol);
    if (!isNaN(a) && !isNaN(b)) {
      return (b + a).toFixed(2);
    }
    return '';
  };

  const calculateProduced = (row: ToolMovementRow): string => {
    const a = parseFloat(row.steelVol);
    const c = parseFloat(row.returnVol);
    if (!isNaN(a) && !isNaN(c)) {
      return (c - a).toFixed(2);
    }
    return '';
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl uppercase leading-tight">PLANILLA DE CONTROL DE LLENADO</h1>
          <h2 className="font-bold text-base sm:text-lg uppercase leading-tight">MANIOBRA DE MOVIMIENTO DE HERRAMIENTAS</h2>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWWO003-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex border-b border-gray-400 border-dashed pb-1 mb-2 items-end">
               <span className="font-bold w-24 text-gray-500 uppercase">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} title="Fecha" className="flex-1 outline-none bg-transparent" />
            </div>
            
            <div className="flex border-b border-gray-400 border-dashed pb-1 mb-2 items-end">
               <span className="font-bold w-24 text-gray-500 uppercase">Equipo:</span>
               <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} title="Equipo" className="flex-1 outline-none bg-transparent">
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
            <div className="flex gap-4">
                <div className="flex-1 flex border-b border-gray-400 border-dashed pb-1 mb-2 items-end">
                   <span className="font-bold w-16 text-gray-500 uppercase">Pozo:</span>
                   <input name="well" value={metadata.well} onChange={handleMetadataChange} title="Pozo" className="flex-1 outline-none bg-transparent" />
                </div>
                <div className="flex-1 flex border-b border-gray-400 border-dashed pb-1 mb-2 items-end">
                   <span className="font-bold w-24 text-gray-500 uppercase">Fluido Term:</span>
                   <input name="termFluid" value={metadata.termFluid} onChange={handleMetadataChange} title="Fluido Terminator" className="flex-1 outline-none bg-transparent" />
                </div>
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border border-black text-xs md:text-sm min-w-[1000px]">
          <thead>
            <tr className="bg-white border-b border-black font-bold text-center">
                <th className="border-r border-black p-2 w-28 sticky left-0 bg-white z-10">Long. Tubing<br/>Lts/10 tiros</th>
                <th className="border-r border-black p-2 w-28">Vol. Acero<br/>Lts/10 tiros<br/>(A)</th>
                <th className="border-r border-black p-2 w-28">Vol Bombeo<br/>Lts.<br/>(B)</th>
                <th className="border-r border-black p-2 w-28">Nivel Pileta<br/>cm<br/>(Niv. Inicial)</th>
                <th className="border-r border-black p-2 w-28">Vol Retorno<br/>Lts.<br/>(C)</th>
                <th className="border-r border-black p-2 w-28 bg-gray-50 print:bg-gray-100">Vol Admitido<br/>Lts.<br/>(B + A)</th>
                <th className="border-r border-black p-2 w-28 bg-gray-50 print:bg-gray-100">Vol Producido<br/>Lts.<br/>(C - A)</th>
                <th className="border-r border-black p-2">Observaciones<br/>Generales</th>
                <th className="w-8 no-print"></th>
            </tr>
          </thead>
          <tbody>
             {rows.map((row) => (
               <tr key={row.id} className="hover:bg-gray-50 group border-b border-black h-10">
                  <td className="border-r border-black p-0 sticky left-0 bg-white z-10 group-hover:bg-gray-50">
                     <input type="number" title="Long. Tubing (Lts/10 tiros)" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.tubingLength} onChange={(e) => handleRowChange(row.id, 'tubingLength', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input type="number" title="Vol. Acero (A)" className="w-full h-full p-1 text-center bg-transparent outline-none font-medium" value={row.steelVol} onChange={(e) => handleRowChange(row.id, 'steelVol', e.target.value)} placeholder="A" />
                  </td>
                  <td className="border-r border-black p-0">
                     <input type="number" title="Vol Bombeo (B)" className="w-full h-full p-1 text-center bg-transparent outline-none font-medium" value={row.pumpVol} onChange={(e) => handleRowChange(row.id, 'pumpVol', e.target.value)} placeholder="B" />
                  </td>
                  <td className="border-r border-black p-0">
                     <input type="number" title="Nivel Pileta (cm)" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.tankLevel} onChange={(e) => handleRowChange(row.id, 'tankLevel', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input type="number" title="Vol Retorno (C)" className="w-full h-full p-1 text-center bg-transparent outline-none font-medium" value={row.returnVol} onChange={(e) => handleRowChange(row.id, 'returnVol', e.target.value)} placeholder="C" />
                  </td>
                  
                  {/* Calculated Columns */}
                  <td className="border-r border-black p-0 bg-gray-50 print:bg-transparent">
                     <input title="Fluido Admitido" className="w-full h-full p-1 text-center bg-transparent outline-none font-bold text-gray-700" value={calculateAdmitted(row)} readOnly tabIndex={-1} />
                  </td>
                  <td className="border-r border-black p-0 bg-gray-50 print:bg-transparent">
                     <input title="Fluido Producido" className="w-full h-full p-1 text-center bg-transparent outline-none font-bold text-gray-700" value={calculateProduced(row)} readOnly tabIndex={-1} />
                  </td>

                  <td className="border-r border-black p-0">
                     <input title="Observaciones" className="w-full h-full p-1 bg-transparent outline-none pl-2" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} />
                  </td>
                  <td className="p-0 text-center no-print">
                     <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 font-bold opacity-0 group-hover:opacity-100">&times;</button>
                  </td>
               </tr>
             ))}
             <tr className="no-print">
                <td colSpan={9} className="p-2 text-center bg-gray-50 border border-black border-dashed">
                  <button onClick={addRow} className="text-brand-red font-medium text-xs uppercase hover:underline">
                    + Agregar Fila
                  </button>
                </td>
             </tr>
          </tbody>
        </table>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver más columnas →</p>

      {/* Footer Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 pt-12 page-break-inside-avoid">
          <div className="text-center">
             <div className="flex flex-col items-center border-b border-black border-dashed mb-1 pb-1 h-20 justify-end">
                <div className="flex-1 w-full flex items-end justify-center">
                    <SignaturePad 
                       label="" 
                       value={signatures.elaborator?.data} 
                       onChange={(val) => handleSignatureChange('elaborator', val)}
                       className="w-full h-full border-0"
                    />
                </div>
             </div>
             <div className="font-bold text-xs uppercase">Elabora</div>
          </div>
          <div className="text-center">
             <div className="flex flex-col items-center border-b border-black border-dashed mb-1 pb-1 h-20 justify-end">
                <div className="flex-1 w-full flex items-end justify-center">
                    <SignaturePad 
                       label="" 
                       value={signatures.approver?.data} 
                       onChange={(val) => handleSignatureChange('approver', val)}
                       className="w-full h-full border-0"
                    />
                </div>
             </div>
             <div className="font-bold text-xs uppercase">Aprueba</div>
          </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50 sm:justify-end">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`mov_herramientas_${metadata.date}`}
               orientation="l"
               className="w-full"
               pdfComponent={<ToolMovementPdf report={{ id: initialData?.id ?? '', metadata, rows, signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Planilla
           </Button>
        </div>

    </div>
  );
};
