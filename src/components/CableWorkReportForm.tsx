
import React, { useState } from 'react';
import { CableWorkReport, CableWorkMetadata, CableWorkRow } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: CableWorkReport;
  onSave: (report: CableWorkReport) => void;
  onCancel: () => void;
}

const EmptyRow: CableWorkRow = {
  id: '',
  date: '',
  runNumber: '',
  runDepth: '',
  operation: '',
  mudDensity: '',
  effectiveWeight: '',
  collarDiameter: '',
  collarWeight: '',
  excessWeight: '',
  collarLength: '',
  factorC: '',
  factorM: '',
  tonKmOperation: '',
  tonKmAccumLastRun: '',
  runLength: '',
  tonKmAccumLastCut: '',
  cutLength: '',
  remainingCableLength: ''
};

export const CableWorkReportForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<CableWorkMetadata>(initialData?.metadata || {
    company: '',
    well: '',
    equipment: '',
    frameType: '',
    drumDiameter: '',
    drumType: '',
    pulleyDiameter: '',
    blockWeight: '',
    bsMeasureWeight: '',
    cableBrand: '',
    cableMeasureLength: '',
    construction: '',
    grade: '',
    reelNumber: '',
    serviceStartDate: '',
    retirementDate: '',
    linesNumber: '',
    change: '',
    stringChangeDepth: ''
  });

  const [rows, setRows] = useState<CableWorkRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof CableWorkRow, value: string) => {
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

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl uppercase leading-tight">REGISTRO DE TRABAJO DEL CABLE</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWWO011-A1-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-xs space-y-3 bg-gray-50/50 print:bg-transparent">
         {/* Group 1: General Info */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-end gap-1 border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold text-gray-500 uppercase whitespace-nowrap">Compañía:</span>
               <input name="company" value={metadata.company} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent min-w-[50px]" />
            </div>
            <div className="flex items-end gap-1 border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold text-gray-500 uppercase whitespace-nowrap">Pozo:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent min-w-[50px]" />
            </div>
            <div className="flex items-end gap-1 border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold text-gray-500 uppercase whitespace-nowrap">Equipo:</span>
               <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent min-w-[50px]">
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
            <div className="flex items-end gap-1 border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold text-gray-500 uppercase whitespace-nowrap">Marca/Tipo Cuadro:</span>
               <input name="frameType" value={metadata.frameType} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent min-w-[50px]" />
            </div>
         </div>

         {/* Group 2: Specs */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Diam. Tambor</span>
               <input name="drumDiameter" value={metadata.drumDiameter} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Liso o Acanot.</span>
               <input name="drumType" value={metadata.drumType} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Diam. Poleas</span>
               <input name="pulleyDiameter" value={metadata.pulleyDiameter} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Peso Aparejo</span>
               <input name="blockWeight" value={metadata.blockWeight} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Medida y peso de B/S</span>
               <input name="bsMeasureWeight" value={metadata.bsMeasureWeight} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
         </div>

         {/* Group 3: Cable Info */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Marca Cable</span>
               <input name="cableBrand" value={metadata.cableBrand} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Medidas/Long</span>
               <input name="cableMeasureLength" value={metadata.cableMeasureLength} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Construcción</span>
               <input name="construction" value={metadata.construction} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Grado</span>
               <input name="grade" value={metadata.grade} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Bobina Nº</span>
               <input name="reelNumber" value={metadata.reelNumber} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
         </div>

         {/* Group 4: Dates & Other */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Puesta Servicio</span>
               <input type="date" name="serviceStartDate" value={metadata.serviceStartDate} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Retiro</span>
               <input type="date" name="retirementDate" value={metadata.retirementDate} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Nº Líneas</span>
               <input name="linesNumber" value={metadata.linesNumber} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Cambio</span>
               <input name="change" value={metadata.change} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase text-[10px]">Prof. Cambio Sarta</span>
               <input name="stringChangeDepth" value={metadata.stringChangeDepth} onChange={handleMetadataChange} className="border-b border-gray-300 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Main Table - Optimized */}
      <div className="overflow-x-auto w-full hidden sm:block">
        <table className="w-full border-collapse border border-black text-[10px] min-w-[1400px]">
          <thead>
            {/* Row 1: Numbers */}
            <tr className="bg-white border-b border-black text-center font-normal text-[8px]">
                <td className="border-r border-black">1</td>
                <td className="border-r border-black">2</td>
                <td className="border-r border-black">3</td>
                <td className="border-r border-black">4</td>
                <td className="border-r border-black">5</td>
                <td className="border-r border-black">6</td>
                <td className="border-r border-black">7</td>
                <td className="border-r border-black">8</td>
                <td className="border-r border-black">9</td>
                <td className="border-r border-black">10</td>
                <td className="border-r border-black">11</td>
                <td className="border-r border-black">12</td>
                <td className="border-r border-black">13</td>
                <td className="border-r border-black">14</td>
                <td className="border-r border-black">15</td>
                <td className="border-r border-black">16</td>
                <td className="border-r border-black">17</td>
                <td className="border-r border-black">18</td>
                <td className="no-print"></td>
            </tr>
            {/* Row 2: Titles */}
            <tr className="bg-white border-b border-black text-center font-bold">
                <th rowSpan={2} className="border-r border-black p-0.5 w-16">Fecha</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">N°<br/>Carrera</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Prof. De<br/>Carrera</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-32">Operación<br/>Realizado<br/>Comentarios</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Dens.<br/>Lodo<br/>gr/cm3</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Peso<br/>Efect.<br/>Sondeo</th>
                
                {/* PROTAMECHAS Group */}
                <th colSpan={4} className="border-r border-black p-0.5 border-b">PROTAMECHAS</th>
                
                <th rowSpan={2} className="border-r border-black p-0.5 w-10">Factor<br/>C</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Factor<br/>M +<br/>1/2C</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Ton. Km<br/>en la<br/>Operación</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Ton. Km<br/>Acumul.<br/>Ult<br/>Corrida</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Long.<br/>Corrid<br/>a Mts.</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Ton. Km<br/>Acumul.<br/>Ult. Corte</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Long.<br/>Corte<br/>Mts.</th>
                <th rowSpan={2} className="border-r border-black p-0.5 w-12">Long. Cable<br/>Remanente</th>
                <th rowSpan={2} className="no-print w-6"></th>
            </tr>
            {/* Row 3: Subtitles for PROTAMECHAS */}
            <tr className="bg-white border-b border-black text-center font-bold">
                <th className="border-r border-black p-0.5 w-10">Diam.<br/>Ext</th>
                <th className="border-r border-black p-0.5 w-10">Peso<br/>Efect.</th>
                <th className="border-r border-black p-0.5 w-10">Exceso<br/>de<br/>peso</th>
                <th className="border-r border-black p-0.5 w-10">Long.</th>
            </tr>
          </thead>
          <tbody>
             {rows.map((row) => (
               <tr key={row.id} className="hover:bg-gray-50 group border-b border-black h-6 text-center">
                  <td className="border-r border-black p-0">
                     <input type="date" className="w-full h-full p-0 bg-transparent outline-none text-[9px]" value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.runNumber} onChange={(e) => handleRowChange(row.id, 'runNumber', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.runDepth} onChange={(e) => handleRowChange(row.id, 'runDepth', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0.5 bg-transparent outline-none text-left" value={row.operation} onChange={(e) => handleRowChange(row.id, 'operation', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.mudDensity} onChange={(e) => handleRowChange(row.id, 'mudDensity', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.effectiveWeight} onChange={(e) => handleRowChange(row.id, 'effectiveWeight', e.target.value)} />
                  </td>
                  
                  {/* Protamechas inputs */}
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.collarDiameter} onChange={(e) => handleRowChange(row.id, 'collarDiameter', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.collarWeight} onChange={(e) => handleRowChange(row.id, 'collarWeight', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.excessWeight} onChange={(e) => handleRowChange(row.id, 'excessWeight', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.collarLength} onChange={(e) => handleRowChange(row.id, 'collarLength', e.target.value)} />
                  </td>

                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.factorC} onChange={(e) => handleRowChange(row.id, 'factorC', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.factorM} onChange={(e) => handleRowChange(row.id, 'factorM', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.tonKmOperation} onChange={(e) => handleRowChange(row.id, 'tonKmOperation', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.tonKmAccumLastRun} onChange={(e) => handleRowChange(row.id, 'tonKmAccumLastRun', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.runLength} onChange={(e) => handleRowChange(row.id, 'runLength', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.tonKmAccumLastCut} onChange={(e) => handleRowChange(row.id, 'tonKmAccumLastCut', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.cutLength} onChange={(e) => handleRowChange(row.id, 'cutLength', e.target.value)} />
                  </td>
                  <td className="border-r border-black p-0">
                     <input className="w-full h-full p-0 text-center bg-transparent outline-none" value={row.remainingCableLength} onChange={(e) => handleRowChange(row.id, 'remainingCableLength', e.target.value)} />
                  </td>
                  <td className="p-0 text-center no-print">
                     <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 font-bold opacity-0 group-hover:opacity-100">&times;</button>
                  </td>
               </tr>
             ))}
             <tr className="no-print">
                <td colSpan={19} className="p-1 text-center bg-gray-50 border border-black border-dashed">
                  <button onClick={addRow} className="text-brand-red font-medium text-xs uppercase hover:underline">
                    + Agregar Fila
                  </button>
                </td>
             </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden p-4 space-y-4">
         {rows.map((row, index) => (
           <div key={row.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm relative">
              <button 
                onClick={() => removeRow(row.id)}
                className="absolute top-2 right-2 text-red-500 font-bold p-1 no-print"
              >
                ✕
              </button>
              <div className="font-bold text-sm mb-2 text-gray-800 border-b border-gray-200 pb-1">
                 CARRERA N° {row.runNumber || (index + 1)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Fecha</label>
                    <input type="date" value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} className="w-full border-b border-gray-400 bg-transparent text-sm py-1" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Operación</label>
                    <input value={row.operation} onChange={(e) => handleRowChange(row.id, 'operation', e.target.value)} className="w-full border-b border-gray-400 bg-transparent text-sm py-1" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Profundidad</label>
                    <input value={row.runDepth} onChange={(e) => handleRowChange(row.id, 'runDepth', e.target.value)} className="w-full border-b border-gray-400 bg-transparent text-sm py-1" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Ton.Km Oper.</label>
                    <input value={row.tonKmOperation} onChange={(e) => handleRowChange(row.id, 'tonKmOperation', e.target.value)} className="w-full border-b border-gray-400 bg-transparent text-sm py-1" />
                 </div>
              </div>

              <div className="bg-white p-2 rounded border border-gray-200">
                 <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">Cable Remanente</div>
                 <input 
                   value={row.remainingCableLength}
                   onChange={(e) => handleRowChange(row.id, 'remainingCableLength', e.target.value)}
                   className="w-full font-bold text-lg text-brand-red outline-none bg-transparent"
                   placeholder="0.00"
                 />
              </div>
           </div>
         ))}
         <div className="no-print">
            <button onClick={addRow} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold uppercase text-xs hover:border-brand-red hover:text-brand-red transition-colors">
               + Agregar Carrera
            </button>
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
               filename={`trab_cable_${rows[0]?.date || 'fecha'}_${metadata.well || 'pozo'}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
