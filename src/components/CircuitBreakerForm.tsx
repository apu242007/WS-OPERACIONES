
import React, { useState } from 'react';
import { CircuitBreakerReport, CircuitBreakerMetadata, CircuitBreakerRow, NetworkAnalyzerData } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: CircuitBreakerReport;
  onSave: (report: CircuitBreakerReport) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "SALA DE TABLEROS",
  "EQUIPO",
  "PILETAS",
  "TRAILER COMPANY MAN",
  "TRAILER JE",
  "TRAILER ET",
  "CENTRIFUGAS"
];

const EmptyRow = (category: string): CircuitBreakerRow => ({
  id: crypto.randomUUID(),
  category,
  description: '',
  voltage: '',
  amperage: '',
  sensitivityNominal: '',
  sensitivityMeasured: '',
  responseTime: '',
  observations: ''
});

export const CircuitBreakerForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<CircuitBreakerMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    electricianName: '',
    supervisorName: '',
    equipmentNumber: '',
    client: '',
    field: '',
    well: '',
    instrumentBrand: '',
    instrumentModel: '',
    instrumentSerial: ''
  });

  const [rows, setRows] = useState<CircuitBreakerRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    // Create initial rows: 3 per category
    const initialRows: CircuitBreakerRow[] = [];
    CATEGORIES.forEach(cat => {
      initialRows.push(EmptyRow(cat));
      initialRows.push(EmptyRow(cat));
      initialRows.push(EmptyRow(cat));
    });
    return initialRows;
  });

  const [analyzer, setAnalyzer] = useState<NetworkAnalyzerData>(initialData?.analyzer || {
    v_r: '', i_r: '',
    v_s: '', i_s: '',
    v_t: '', i_t: '',
    freq: ''
  });

  const [generalObservations, setGeneralObservations] = useState(initialData?.generalObservations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof CircuitBreakerRow, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const addRow = (category: string) => {
    const index = rows.findIndex(r => r.category === category);
    const lastIndex = rows.map(r => r.category).lastIndexOf(category);
    // Insert after the last item of this category
    const newRow = EmptyRow(category);
    const newRows = [...rows];
    newRows.splice(lastIndex + 1, 0, newRow);
    setRows(newRows);
  };

  const removeRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSignatureChange = (role: 'electrician' | 'supervisor', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  const handleAnalyzerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnalyzer(prev => ({ ...prev, [name]: value }));
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
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">Registro de Prueba de Disyuntores</h1>
        </div>
        <div className="col-span-3 p-2 flex flex-col justify-center items-center text-xs font-bold pl-4">
          <div>Código IT-WSM-003-A1</div>
          <div>REVISIÓN 04</div>
        </div>
      </div>

      {/* Metadata Form */}
      <div className="p-4 border-b border-black text-sm space-y-3 bg-gray-50 print:bg-transparent">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="whitespace-nowrap font-bold w-48 text-xs">Nombre y Apellido Eléctrico:</span>
               <input name="electricianName" value={metadata.electricianName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            {/* Signature placeholder visually */}
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Firma:</span>
               <span className="text-gray-400 italic text-xs">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Equipo TKR N°:</span>
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
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="whitespace-nowrap font-bold w-48 text-xs">Nombre y Apellido Supervisor:</span>
               <input name="supervisorName" value={metadata.supervisorName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Firma:</span>
               <span className="text-gray-400 italic text-xs">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         {/* Row 3 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Cliente:</span>
               <input name="client" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Yacimiento:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Pozo:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Instrument Data */}
      <div className="p-4 border-b border-black text-sm">
         <div className="font-bold mb-2 uppercase text-xs">DATOS DE INSTRUMENTO DE MEDICIÓN</div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">MARCA:</span>
               <input name="instrumentBrand" value={metadata.instrumentBrand} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">MODELO:</span>
               <input name="instrumentModel" value={metadata.instrumentModel} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">N° SERIE:</span>
               <input name="instrumentSerial" value={metadata.instrumentSerial} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[1000px]">
           <table className="w-full border-collapse border border-black text-xs md:text-sm">
             <thead>
               <tr className="bg-white border-b border-black text-center font-bold">
                  <th rowSpan={2} className="border-r border-black p-1 sticky left-0 bg-white z-10 w-48">DESCRIPCION DISYUNTOS</th>
                  <th colSpan={5} className="border-r border-black p-1 border-b">RESULTADOS DE PRUEBA</th>
                  <th rowSpan={2} className="p-1 w-48">OBSERVACIONES / CONCLUSIONES</th>
                  <th rowSpan={2} className="w-8 no-print"></th>
               </tr>
               <tr className="bg-white border-b border-black text-center font-bold text-[10px] md:text-xs">
                  <th className="border-r border-black p-1 w-20">VOLTAJE (V)<br/>220/380 V</th>
                  <th className="border-r border-black p-1 w-20">AMPER (A)<br/>160/40/25 A</th>
                  <th className="border-r border-black p-1 w-20">MILIAMPERIOS (mA)<br/>300/30 mA</th>
                  <th className="border-r border-black p-1 w-20">MILIAMPERIOS (mA)<br/>(Medido)</th>
                  <th className="border-r border-black p-1 w-20">TIEMPO DE RESPUESTA<br/>(ms)</th>
               </tr>
             </thead>
             <tbody>
                {CATEGORIES.map(category => {
                  const categoryRows = rows.filter(r => r.category === category);
                  return (
                    <React.Fragment key={category}>
                      {/* Category Header Row - acts as section divider */}
                      <tr className="bg-gray-100 border-b border-black">
                         <td colSpan={8} className="p-1 font-bold pl-2 text-xs uppercase sticky left-0 z-10 bg-gray-100">{category}</td>
                      </tr>
                      
                      {categoryRows.map((row, idx) => (
                        <tr key={row.id} className="border-b border-black h-8 hover:bg-gray-50 group">
                          {/* Description Input */}
                          <td className="border-r border-black p-0 sticky left-0 bg-white z-10">
                             <input className="w-full h-full p-1 pl-2 outline-none bg-transparent" value={row.description} onChange={(e) => handleRowChange(row.id, 'description', e.target.value)} placeholder="Descripción..." />
                          </td>
                          <td className="border-r border-black p-0">
                             <input className="w-full h-full p-1 outline-none bg-transparent text-center" value={row.voltage} onChange={(e) => handleRowChange(row.id, 'voltage', e.target.value)} />
                          </td>
                          <td className="border-r border-black p-0">
                             <input className="w-full h-full p-1 outline-none bg-transparent text-center" value={row.amperage} onChange={(e) => handleRowChange(row.id, 'amperage', e.target.value)} />
                          </td>
                          <td className="border-r border-black p-0">
                             <input className="w-full h-full p-1 outline-none bg-transparent text-center" value={row.sensitivityNominal} onChange={(e) => handleRowChange(row.id, 'sensitivityNominal', e.target.value)} />
                          </td>
                          <td className="border-r border-black p-0">
                             <input className="w-full h-full p-1 outline-none bg-transparent text-center" value={row.sensitivityMeasured} onChange={(e) => handleRowChange(row.id, 'sensitivityMeasured', e.target.value)} />
                          </td>
                          <td className="border-r border-black p-0">
                             <input className="w-full h-full p-1 outline-none bg-transparent text-center" value={row.responseTime} onChange={(e) => handleRowChange(row.id, 'responseTime', e.target.value)} />
                          </td>
                          <td className="p-0 border-r border-black">
                             <input className="w-full h-full p-1 outline-none bg-transparent" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} />
                          </td>
                          <td className="text-center no-print">
                             <button onClick={() => removeRow(row.id)} className="text-red-500 font-bold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-50 w-full h-full">×</button>
                          </td>
                        </tr>
                      ))}
                      <tr className="no-print">
                         <td colSpan={8} className="p-1 bg-white border-b border-black">
                            <button onClick={() => addRow(category)} className="text-xs text-brand-red font-bold hover:underline pl-2">+ Agregar fila</button>
                         </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
             </tbody>
           </table>
        </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver más columnas →</p>

      {/* Network Analyzer Section */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2 uppercase text-xs">Analizador de Red</div>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-2 border border-gray-300 rounded bg-gray-50">
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500">R - Volt</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.v_r} onChange={(e) => setAnalyzer({...analyzer, v_r: e.target.value})} />
             </div>
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500">R - Amp</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.i_r} onChange={(e) => setAnalyzer({...analyzer, i_r: e.target.value})} />
             </div>
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500">S - Volt</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.v_s} onChange={(e) => setAnalyzer({...analyzer, v_s: e.target.value})} />
             </div>
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500">S - Amp</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.i_s} onChange={(e) => setAnalyzer({...analyzer, i_s: e.target.value})} />
             </div>
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500">T - Volt</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.v_t} onChange={(e) => setAnalyzer({...analyzer, v_t: e.target.value})} />
             </div>
             <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-500">T - Amp</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.i_t} onChange={(e) => setAnalyzer({...analyzer, i_t: e.target.value})} />
             </div>
             <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                 <label className="text-[10px] font-bold text-gray-500">Frecuencia (Hz)</label>
                 <input className="border border-gray-300 rounded p-1 text-sm text-center bg-white" value={analyzer.freq} onChange={(e) => setAnalyzer({...analyzer, freq: e.target.value})} />
             </div>
         </div>
      </div>

      {/* General Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-1 text-xs">Observaciones Generales:</div>
         <textarea 
            className="w-full p-2 border border-gray-300 rounded resize-none h-24 outline-none text-sm"
            value={generalObservations}
            onChange={(e) => setGeneralObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.electrician?.data} 
                   onChange={(val) => handleSignatureChange('electrician', val)}
                   className="border-0 h-full w-full"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Personal Eléctrico</div>
             <div className="text-[10px] text-gray-500">Confeccionar esta planilla por personal eléctrico</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                   className="border-0 h-full w-full"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Jefe de Equipo/Jefe de Campo</div>
             <div className="text-[10px] text-gray-500">N = Estado Normal del Equipo</div>
          </div>
      </div>
      
      <div className="text-[10px] text-center p-2 border-t border-gray-300 text-gray-500">
         NOTA: El documento Original debe ser archivado en Oficina de Mantenimiento y la Copia en Carpeta de Equipo destinada a Mantenimiento
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
               filename={`checklist_electrico_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              analyzer,
              generalObservations,
              signatures 
            })} className="w-full sm:w-auto">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
