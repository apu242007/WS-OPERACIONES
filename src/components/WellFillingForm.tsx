
import React, { useState } from 'react';
import { WellFillingReport, WellFillingMetadata, WellFillingTechData, WellFillingRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: WellFillingReport;
  onSave: (report: WellFillingReport) => void;
  onCancel: () => void;
}

const EmptyRow: WellFillingRow = {
  id: '',
  shotNumber: '',
  tankVolume: '',
  calcVol: '',
  calcTotal: '',
  measVol: '',
  measTotal: '',
  barrelTrend: '',
  observations: ''
};

export const WellFillingForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<WellFillingMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    well: ''
  });

  const [techData, setTechData] = useState<WellFillingTechData>(initialData?.techData || {
    tubPerf: { diameter: '', displacementDry: '', displacementWet: '' },
    barra: { diameter: '', displacementDry: '', displacementWet: '' },
    tubing: { diameter: '', displacementDry: '', displacementWet: '' },
    portamecha: { diameter: '', innerDiameter: '', displacementDry: '', displacementWet: '' }
  });

  const [rows, setRows] = useState<WellFillingRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleTechDataChange = (section: keyof WellFillingTechData, field: string, value: string) => {
    setTechData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleRowChange = (id: string, field: keyof WellFillingRow, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const addRow = () => {
    setRows(prev => [...prev, { ...EmptyRow, id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSignatureChange = (role: 'rigManager' | 'shiftLeader' | 'machinist', dataUrl: string | undefined) => {
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
          <h1 className="font-black text-xl uppercase leading-tight">PLANILLA DE LLENADO DE POZO</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>ITWWO022-A1</div>
          <div className="text-xs font-normal mt-1">Revisión 00</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">EQUIPO:</span>
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
               <span className="font-bold mr-2">POZO:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold mr-2">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent text-center" />
            </div>
         </div>
      </div>

      {/* Technical Data Section - Scrollable */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[600px] p-4 space-y-3 bg-gray-50 print:bg-transparent">
           {/* Tub Perf */}
           <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center w-40">
                 <span className="font-bold mr-1">TUB.PERF. Ø Ext.:</span>
                 <input className="border-b border-black w-12 text-center outline-none bg-transparent" value={techData.tubPerf.diameter} onChange={(e) => handleTechDataChange('tubPerf', 'diameter', e.target.value)} />
              </div>
              <span className="font-bold text-gray-500">DESPLAZAMIENTO:</span>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">SECO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.tubPerf.displacementDry} onChange={(e) => handleTechDataChange('tubPerf', 'displacementDry', e.target.value)} />
              </div>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">MOJADO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.tubPerf.displacementWet} onChange={(e) => handleTechDataChange('tubPerf', 'displacementWet', e.target.value)} />
              </div>
           </div>

           {/* Barra */}
           <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center w-40">
                 <span className="font-bold mr-1">BARRA Ø Ext.:</span>
                 <input className="border-b border-black w-12 text-center outline-none bg-transparent" value={techData.barra.diameter} onChange={(e) => handleTechDataChange('barra', 'diameter', e.target.value)} />
              </div>
              <span className="font-bold text-gray-500">DESPLAZAMIENTO:</span>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">SECO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.barra.displacementDry} onChange={(e) => handleTechDataChange('barra', 'displacementDry', e.target.value)} />
              </div>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">MOJADO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.barra.displacementWet} onChange={(e) => handleTechDataChange('barra', 'displacementWet', e.target.value)} />
              </div>
           </div>

           {/* Tubing */}
           <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center w-40">
                 <span className="font-bold mr-1">TUBING Ø:</span>
                 <input className="border-b border-black w-12 text-center outline-none bg-transparent" value={techData.tubing.diameter} onChange={(e) => handleTechDataChange('tubing', 'diameter', e.target.value)} />
              </div>
              <span className="font-bold text-gray-500">DESPLAZAMIENTO:</span>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">SECO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.tubing.displacementDry} onChange={(e) => handleTechDataChange('tubing', 'displacementDry', e.target.value)} />
              </div>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">MOJADO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.tubing.displacementWet} onChange={(e) => handleTechDataChange('tubing', 'displacementWet', e.target.value)} />
              </div>
           </div>

           {/* Portamecha */}
           <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center">
                 <span className="font-bold mr-1">PORTAMECHA Ø.Ext.:</span>
                 <input className="border-b border-black w-12 text-center outline-none bg-transparent" value={techData.portamecha.diameter} onChange={(e) => handleTechDataChange('portamecha', 'diameter', e.target.value)} />
              </div>
              <div className="flex items-center">
                 <span className="font-bold mr-1">D.I.:</span>
                 <input className="border-b border-black w-12 text-center outline-none bg-transparent" value={techData.portamecha.innerDiameter} onChange={(e) => handleTechDataChange('portamecha', 'innerDiameter', e.target.value)} />
              </div>
              <span className="font-bold text-gray-500">DESPLAZAMIENTO:</span>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">SECO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.portamecha.displacementDry} onChange={(e) => handleTechDataChange('portamecha', 'displacementDry', e.target.value)} />
              </div>
              <div className="flex items-center">
                 <span className="mr-1 font-bold">MOJADO:</span>
                 <input className="border-b border-black w-16 text-center outline-none bg-transparent" value={techData.portamecha.displacementWet} onChange={(e) => handleTechDataChange('portamecha', 'displacementWet', e.target.value)} />
              </div>
           </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1000px]">
          <table className="w-full border-collapse border border-black text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-200 border-b border-black font-bold text-center">
                 <th rowSpan={2} className="border-r border-black p-2 w-16">TIRO Nº</th>
                 <th rowSpan={2} className="border-r border-black p-2 w-32">VOLUMEN DE<br/>TANQUE DE<br/>MANIOBRA</th>
                 <th colSpan={2} className="border-r border-black p-1 border-b">CALCULADO</th>
                 <th colSpan={2} className="border-r border-black p-1 border-b">MEDIDO</th>
                 <th rowSpan={2} className="border-r border-black p-2 w-24">TENDENCIA<br/>BARRILES</th>
                 <th rowSpan={2} className="p-2">Observaciones</th>
                 <th rowSpan={2} className="w-8 no-print"></th>
              </tr>
              <tr className="bg-gray-200 border-b border-black font-bold text-center">
                 <th className="border-r border-black p-1 w-24">VOLUMEN (Lts)</th>
                 <th className="border-r border-black p-1 w-24">TOTAL</th>
                 <th className="border-r border-black p-1 w-24">VOLUMEN (Lts)</th>
                 <th className="border-r border-black p-1 w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody>
               {rows.map((row) => (
                  <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-10 group">
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.shotNumber} onChange={(e) => handleRowChange(row.id, 'shotNumber', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.tankVolume} onChange={(e) => handleRowChange(row.id, 'tankVolume', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.calcVol} onChange={(e) => handleRowChange(row.id, 'calcVol', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.calcTotal} onChange={(e) => handleRowChange(row.id, 'calcTotal', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.measVol} onChange={(e) => handleRowChange(row.id, 'measVol', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.measTotal} onChange={(e) => handleRowChange(row.id, 'measTotal', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.barrelTrend} onChange={(e) => handleRowChange(row.id, 'barrelTrend', e.target.value)} />
                     </td>
                     <td className="border-r border-black p-0">
                        <input className="w-full h-full outline-none bg-transparent p-1 px-2" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} />
                     </td>
                     <td className="text-center no-print">
                        <button onClick={() => removeRow(row.id)} className="text-red-500 font-bold hover:bg-red-50 w-full h-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100">×</button>
                     </td>
                  </tr>
               ))}
               <tr className="no-print">
                  <td colSpan={9} className="p-1 bg-gray-50 text-center border-t border-black">
                     <button onClick={addRow} className="text-brand-red font-bold text-xs uppercase hover:underline">+ Agregar Fila</button>
                  </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver columnas →</p>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Jefe de Equipo</div>
             <div className="text-[10px] text-gray-500">Firma y Aclaración</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.shiftLeader?.data} 
                   onChange={(val) => handleSignatureChange('shiftLeader', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Encargado de Turno</div>
             <div className="text-[10px] text-gray-500">Firma y Aclaración</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.machinist?.data} 
                   onChange={(val) => handleSignatureChange('machinist', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase">Maquinista</div>
             <div className="text-[10px] text-gray-500">Firma y Aclaración</div>
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
               filename={`llenado_pozo_${metadata.date}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              techData,
              rows,
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Planilla
           </Button>
        </div>

    </div>
  );
};
