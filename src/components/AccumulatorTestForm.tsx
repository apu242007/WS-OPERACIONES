
import React, { useState } from 'react';
import { AccumulatorTestReport, AccumulatorTestMetadata, AccumulatorPumpRow, AccumulatorBottleRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { AccumulatorTestPdf } from '../pdf/AccumulatorTestPdf';

interface Props {
  initialData?: AccumulatorTestReport;
  onSave: (report: AccumulatorTestReport) => void;
  onCancel: () => void;
}

const INITIAL_PUMPS: AccumulatorPumpRow[] = [
  { id: 'pump-1', type: 'Primaria (Eléctrica)', startPressure: '', stopPressure: '', chargeTime: '' },
  { id: 'pump-2', type: 'Secundaria (Neumática)', startPressure: '', stopPressure: '', chargeTime: '' }
];

const INITIAL_BOTTLES: AccumulatorBottleRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: `bottle-${i + 1}`,
  bottleNumber: i + 1,
  pressure: ''
}));

export const AccumulatorTestForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<AccumulatorTestMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    client: '',
    field: '',
    well: '',
    rigNumber: '',
    mechanicName: '',
    shiftLeaderName: ''
  });

  const [pumps, setPumps] = useState<AccumulatorPumpRow[]>(initialData?.pumps || INITIAL_PUMPS);
  const [bottles, setBottles] = useState<AccumulatorBottleRow[]>(initialData?.bottles || INITIAL_BOTTLES);
  const [reliefValvePressure, setReliefValvePressure] = useState(initialData?.reliefValvePressure || '');
  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState<'pumps' | 'bottles'>('pumps');

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handlePumpChange = (id: string, field: keyof AccumulatorPumpRow, value: string) => {
    setPumps(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleBottleChange = (id: string, value: string) => {
    setBottles(prev => prev.map(b => b.id === id ? { ...b, pressure: value } : b));
  };

  const handleSignatureChange = (role: 'mechanic' | 'shiftLeader', dataUrl: string | undefined) => {
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
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">Prueba de Funcionamiento de Acumulador</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WWO-007-A1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-3">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="font-bold w-48 text-xs uppercase">Nombre Mecánico:</span>
               <input name="mechanicName" title="Nombre Mecánico" value={metadata.mechanicName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Firma:</span>
               <span className="text-xs text-gray-400 italic">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Equipo TKR N°:</span>
               <select name="rigNumber" title="Equipo TKR N°" value={metadata.rigNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent">
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
               <span className="font-bold w-48 text-xs uppercase">Nombre Encargado:</span>
               <input name="shiftLeaderName" title="Nombre Encargado" value={metadata.shiftLeaderName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Firma:</span>
               <span className="text-xs text-gray-400 italic">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Fecha:</span>
               <input type="date" name="date" title="Fecha" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>

         {/* Row 3 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Cliente:</span>
               <input name="client" title="Cliente" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Yacimiento:</span>
               <input name="field" title="Yacimiento" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs uppercase">Pozo:</span>
               <input name="well" title="Pozo" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Tabs for Mobile */}
      <div className="sm:hidden flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pumps')}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
            activeTab === 'pumps' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500'
          }`}
        >
          SISTEMA DE BOMBAS
        </button>
        <button
          onClick={() => setActiveTab('bottles')}
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
            activeTab === 'bottles' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500'
          }`}
        >
          BOTELLONES
        </button>
      </div>

      {/* Pumps System */}
      <div className={`p-4 border-b border-black ${activeTab === 'pumps' ? 'block' : 'hidden sm:block'}`}>
         <div className="font-bold underline mb-2 text-sm uppercase">Sistema de Bombas</div>
         <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-xs sm:text-sm text-center">
               <thead>
                  <tr className="bg-white">
                     <th className="border border-black p-2"></th>
                     <th className="border border-black p-2 w-24">Presión de<br/>Encendido<br/>(PSI)</th>
                     <th className="border border-black p-2 w-24">Presión de Corte<br/>(PSI)</th>
                     <th className="border border-black p-2 w-24">Tiempo de Carga<br/>(min.)</th>
                  </tr>
               </thead>
               <tbody>
                  {pumps.map(pump => (
                     <tr key={pump.id}>
                        <td className="border border-black p-2 text-left font-medium">{pump.type}</td>
                        <td className="border border-black p-0"><input title="Presión Encendido" className="w-full h-full text-center outline-none p-2 bg-transparent" value={pump.startPressure} onChange={(e) => handlePumpChange(pump.id, 'startPressure', e.target.value)} /></td>
                        <td className="border border-black p-0"><input title="Presión Corte" className="w-full h-full text-center outline-none p-2 bg-transparent" value={pump.stopPressure} onChange={(e) => handlePumpChange(pump.id, 'stopPressure', e.target.value)} /></td>
                        <td className="border border-black p-0"><input title="Tiempo Carga" className="w-full h-full text-center outline-none p-2 bg-transparent" value={pump.chargeTime} onChange={(e) => handlePumpChange(pump.id, 'chargeTime', e.target.value)} /></td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="mt-4 text-[10px] space-y-1 text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
            <p>• La presión máxima de corte no debe superar las 3000 PSI.</p>
            <p>• La bomba primaria eléctrica debe comenzar la carga luego de perder un 10% de su carga.</p>
            <p>• La bomba secundaria debe comenzar la carga luego de una perdida del 15%.</p>
            <p className="mt-1 font-bold">Tiempos máximos de carga:</p>
            <ul className="list-disc list-inside pl-2">
               <li>Primaria eléctrica: máx 15 min.</li>
               <li>Secundaria neumática: máx 30 min.</li>
            </ul>
         </div>
      </div>

      {/* Bottles System */}
      <div className={`p-4 border-b border-black ${activeTab === 'bottles' ? 'block' : 'hidden sm:block'}`}>
         <div className="font-bold underline mb-2 text-sm uppercase">Sistema de Botellones</div>
         <div className="overflow-x-auto">
             <table className="w-full border-collapse border border-black text-xs sm:text-sm text-center">
                <tbody>
                   {/* Header Row 1 */}
                   <tr>
                      <td rowSpan={2} className="border border-black p-2 font-medium bg-gray-50 print:bg-transparent min-w-[120px]">Presion (PSI)</td>
                      {bottles.slice(0, 5).map(b => (
                         <td key={b.id} className="border border-black p-1 font-bold bg-gray-100 print:bg-transparent min-w-[60px]">N° {b.bottleNumber}</td>
                      ))}
                   </tr>
                   {/* Input Row 1 */}
                   <tr>
                      {bottles.slice(0, 5).map(b => (
                         <td key={b.id} className="border border-black p-0 h-10">
                            <input title="Presión Botellón" className="w-full h-full text-center outline-none p-1 bg-transparent" value={b.pressure} onChange={(e) => handleBottleChange(b.id, e.target.value)} />
                         </td>
                      ))}
                   </tr>
                   
                   {/* Header Row 2 */}
                   <tr>
                      <td rowSpan={2} className="border border-black p-2 font-medium bg-gray-50 print:bg-transparent"></td>
                      {bottles.slice(5, 10).map(b => (
                         <td key={b.id} className="border border-black p-1 font-bold bg-gray-100 print:bg-transparent min-w-[60px]">N° {b.bottleNumber}</td>
                      ))}
                   </tr>
                   {/* Input Row 2 */}
                   <tr>
                      {bottles.slice(5, 10).map(b => (
                         <td key={b.id} className="border border-black p-0 h-10">
                            <input title="Presión Botellón" className="w-full h-full text-center outline-none p-1 bg-transparent" value={b.pressure} onChange={(e) => handleBottleChange(b.id, e.target.value)} />
                         </td>
                      ))}
                   </tr>
                </tbody>
             </table>
         </div>
      </div>

      {/* Relief Valve */}
      <div className="p-4 border-b border-black flex flex-col sm:flex-row sm:items-end gap-2 text-sm bg-yellow-50/50">
         <span className="font-bold">Presión de Regulación de valvula de Alivio (PSI):</span>
         <input 
            title="Presión Válvula Alivio"
            className="border-b border-black outline-none w-full sm:w-32 text-center bg-transparent font-bold"
            value={reliefValvePressure}
            onChange={(e) => setReliefValvePressure(e.target.value)}
         />
      </div>

      {/* Observations */}
      <div className="p-4 border-b border-black">
         <div className="font-bold underline mb-1 text-sm uppercase">Observaciones Generales:</div>
         <textarea 
            title="Observaciones Generales"
            className="w-full h-32 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
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
                   value={signatures.mechanic?.data} 
                   onChange={(val) => handleSignatureChange('mechanic', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Mecánico</div>
             <div className="text-xs text-gray-500">{metadata.mechanicName || '(Nombre)'}</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.shiftLeader?.data} 
                   onChange={(val) => handleSignatureChange('shiftLeader', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Encargado de Turno</div>
             <div className="text-xs text-gray-500">{metadata.shiftLeaderName || '(Nombre)'}</div>
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
               filename={`prueba_acumulador_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<AccumulatorTestPdf report={{ id: initialData?.id ?? '', metadata, pumps, bottles, reliefValvePressure, observations, signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              pumps,
              bottles,
              reliefValvePressure,
              observations,
              signatures 
            })} className="w-full sm:w-auto">
             Guardar Prueba
           </Button>
        </div>

    </div>
  );
};
