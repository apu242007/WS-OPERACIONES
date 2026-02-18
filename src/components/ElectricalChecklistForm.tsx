
import React, { useState } from 'react';
import { ElectricalChecklistReport, ElectricalChecklistMetadata, ElectricalChecklistRow, NetworkAnalyzerData } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ElectricalChecklistReport;
  onSave: (report: ElectricalChecklistReport) => void;
  onCancel: () => void;
}

// Data Structure Definition
const COL_1_SECTIONS = [
  { title: "Equipo:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Luces de Emergencia", "Instalación Eléctrica Ex 220V", "Acometida", "Baterias//Arranque", "Instalación Eléctrica 12/24V", "Bocina", "Estado general de tablero Ex", "Estufa maquinista Ex", "Electro valvula refrigeración"] },
  { title: "Venturtech:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Luces de Emergencia", "Instalación Eléctrica Ex 220V", "Acometida", "Baterias//Arranque", "Instalación Eléctrica 12/24V"] },
  { title: "Acumuladores:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Luces de Emergencia", "Instalación Eléctrica Ex 220V", "Acometida", "Estado de Motor de Bomba", "Presostato"] },
  { title: "Motobomba:", items: ["PAT", "Luminarias//Reflectores", "Luces de Emergencia", "Instalación Eléctrica Ex 220V", "Acometida", "Baterias//Arranque", "Consola de maq. 12-24V"] },
  { title: "Pileta 1:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Luces de Emergencia", "Estado de Tablero Ex y Pulsador de Removedores", "Instalación Eléctrica Ex 220V", "Zaranda"] }
];

const COL_2_SECTIONS = [
  { title: "Pileta 2:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Luces de Emergencia", "Instalación Eléctrica Ex 220V", "Acometida", "Estado de tablero Ex y Pulsador de Removedores", "Motor Ex de 50 HP Kayak"] },
  { title: "Pileta 3:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Luces de Emergencia", "Instalación Eléctrica Ex 220V", "Acometida"] },
  { title: "Casilla de JE:", items: ["PAT", "Luminarias//Reflectores", "Luces de emergencia", "Instalación eléctrica 220V", "Artefactos eléctricos", "Acometida"] },
  { title: "Casilla de ET:", items: ["PAT", "Luminarias", "Luces de emergencia", "Instalación eléctrica 220V", "Artefactos eléctricos", "Acometida"] },
  { title: "Casilla de Personal:", items: ["PAT", "Luminarias", "Luces de emergencia", "Instalación eléctrica 220V", "Artefactos eléctricos", "Acometida"] },
  { title: "Casilla de Company Representative:", items: ["PAT", "Luminarias", "Luces de emergencia", "Instalación eléctrica 220V", "Artefactos eléctricos", "Acometida"] }
];

const COL_3_SECTIONS = [
  { title: "Patin Cisterna:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Instalación Eléctrica Ex 220V", "Acometida", "Controlar bomba de Gas Oil", "Controlar presostato", "Controlar Bomba de Agua"] },
  { title: "Hidrolavadora:", items: ["PAT", "Estado de Tablero y pulsador", "Instalación eléctrica 220V"] },
  { title: "Labortorio - Taller Depocito Sala de Tableros - Usinas", items: ["Acometida", "PAT", "Luminarias//Reflectores", "Luces de emergencia", "Instalacion eléctricas 220V", "Instalación eléctrica 12/24V", "Baterias//Arranque// Alternador", "Tableros", "Acometida", "Alternador Trifásico", "Compresor Atlascopco"] },
  { title: "Bandeja Hidráulica:", items: ["PAT", "Estado de Tablero y comando.", "Instalación eléctrica 220V"] },
  { title: "Trip-Tank:", items: ["PAT", "Luminarias Ex // Reflectores Ex", "Instalación Eléctrica Ex 220V", "Acometida", "Controlar Bomba", "Controlar Motor Ex"] }
];

export const ElectricalChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ElectricalChecklistMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    electricianName: '',
    supervisorName: '',
    equipmentNumber: '',
    client: '',
    field: '',
    well: ''
  });

  const [analyzer, setAnalyzer] = useState<NetworkAnalyzerData>(initialData?.analyzer || {
    v_r: '', i_r: '',
    v_s: '', i_s: '',
    v_t: '', i_t: '',
    freq: ''
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  // Initializing rows flattened
  const [rows, setRows] = useState<ElectricalChecklistRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    const allRows: ElectricalChecklistRow[] = [];
    [...COL_1_SECTIONS, ...COL_2_SECTIONS, ...COL_3_SECTIONS].forEach(section => {
      section.items.forEach(item => {
        allRows.push({
          id: crypto.randomUUID(),
          category: section.title,
          item: item,
          status: null
        });
      });
    });
    return allRows;
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyzerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnalyzer(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (category: string, item: string, status: 'BIEN' | 'REG' | 'MAL') => {
    setRows(prev => prev.map(r => {
      if (r.category === category && r.item === item) {
        // Toggle if same status clicked
        return { ...r, status: r.status === status ? null : status };
      }
      return r;
    }));
  };

  const handleSignatureChange = (role: 'electrician' | 'supervisor', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  const getRow = (category: string, item: string) => rows.find(r => r.category === category && r.item === item) || { status: null };

  const renderChecklistSection = (section: { title: string, items: string[] }) => (
    <div key={section.title} className="mb-2 break-inside-avoid">
      <div className="font-bold bg-gray-200 border border-black px-1 text-xs">{section.title}</div>
      {section.items.map(item => {
        const row = getRow(section.title, item);
        return (
          <div key={item} className="flex border-b border-gray-300 text-[10px] items-center min-h-[32px] sm:min-h-[24px] hover:bg-gray-50">
            <div className="flex-1 px-1 leading-tight">{item}</div>
            <div className={`w-8 sm:w-6 border-l border-gray-300 h-full flex items-center justify-center cursor-pointer ${row.status === 'BIEN' ? 'bg-black text-white font-bold' : ''}`} onClick={() => handleRowChange(section.title, item, 'BIEN')}>
              {row.status === 'BIEN' && 'X'}
            </div>
            <div className={`w-8 sm:w-6 border-l border-gray-300 h-full flex items-center justify-center cursor-pointer ${row.status === 'REG' ? 'bg-black text-white font-bold' : ''}`} onClick={() => handleRowChange(section.title, item, 'REG')}>
              {row.status === 'REG' && 'X'}
            </div>
            <div className={`w-8 sm:w-6 border-l border-gray-300 h-full flex items-center justify-center cursor-pointer ${row.status === 'MAL' ? 'bg-black text-white font-bold' : ''}`} onClick={() => handleRowChange(section.title, item, 'MAL')}>
              {row.status === 'MAL' && 'X'}
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
          <h1 className="font-bold text-lg md:text-xl uppercase leading-tight">Check-List Eléctrico Areas Clasificadas y Campamento</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-xs text-gray-600">
          <div>Código ITWSM002-A1-3</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-xs space-y-2 bg-gray-50 print:bg-transparent">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-1 border-b border-black border-dashed pb-1">
               <span className="whitespace-nowrap font-bold w-40">Nombre y Apellido Eléctrico:</span>
               <input name="electricianName" value={metadata.electricianName} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            {/* Signature placeholder visually */}
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold text-xs">Firma:</span>
               <span className="text-gray-400 italic text-[10px]">(Ver al pie)</span>
            </div>
            <div className="w-full sm:w-48 flex items-end gap-2 border-b border-black border-dashed pb-1">
               <span className="font-bold mr-1">Equipo TKR N°:</span>
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
               <span className="text-gray-400 italic text-[10px]">(Ver al pie)</span>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-xs">
         
         {/* Column 1 */}
         <div className="border-r border-black p-2">
            {/* Header Col 1 */}
            <div className="mb-2 text-[9px] text-center italic border border-black p-1 bg-gray-100">
               Marcar con una X el estado, en caso de estado REG/MAL observar al final
            </div>
            <div className="flex font-bold text-[10px] mb-1 border-b border-black">
               <div className="flex-1">ESTADO</div>
               <div className="w-8 sm:w-6 text-center">BIEN</div>
               <div className="w-8 sm:w-6 text-center">REG</div>
               <div className="w-8 sm:w-6 text-center">MAL</div>
            </div>
            {COL_1_SECTIONS.map(s => renderChecklistSection(s))}
         </div>

         {/* Column 2 */}
         <div className="border-r border-black p-2">
            {/* Header Col 2 */}
            <div className="mb-2 text-[9px] text-center italic border border-black p-1 bg-gray-100">
               Marcar con una X el estado, en caso de estado REG/MAL observar al final
            </div>
            <div className="flex font-bold text-[10px] mb-1 border-b border-black">
               <div className="flex-1">ESTADO</div>
               <div className="w-8 sm:w-6 text-center">BIEN</div>
               <div className="w-8 sm:w-6 text-center">REG</div>
               <div className="w-8 sm:w-6 text-center">MAL</div>
            </div>
            {COL_2_SECTIONS.map(s => renderChecklistSection(s))}
         </div>

         {/* Column 3 */}
         <div className="p-2">
            {/* Header Col 3 */}
            <div className="mb-2 text-[9px] text-center italic border border-black p-1 bg-gray-100">
               Marcar con una X el estado, en caso de estado REG/MAL observar al final
            </div>
            <div className="flex font-bold text-[10px] mb-1 border-b border-black">
               <div className="flex-1">ESTADO</div>
               <div className="w-8 sm:w-6 text-center">BIEN</div>
               <div className="w-8 sm:w-6 text-center">REG</div>
               <div className="w-8 sm:w-6 text-center">MAL</div>
            </div>
            {COL_3_SECTIONS.map(s => renderChecklistSection(s))}

            {/* Network Analyzer Table */}
            <div className="mt-4 border border-black">
               <div className="bg-gray-200 font-bold p-1 text-center border-b border-black">Analizador de Red:</div>
               <table className="w-full text-center text-xs">
                  <thead>
                     <tr className="border-b border-black font-bold bg-gray-100">
                        <td className="border-r border-black p-1">Parametro</td>
                        <td className="border-r border-black p-1">V (Volt)</td>
                        <td className="p-1">I (Amp)</td>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b border-black">
                        <td className="border-r border-black font-bold p-1">R</td>
                        <td className="border-r border-black p-0"><input name="v_r" value={analyzer.v_r} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                        <td className="p-0"><input name="i_r" value={analyzer.i_r} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                     </tr>
                     <tr className="border-b border-black">
                        <td className="border-r border-black font-bold p-1">S</td>
                        <td className="border-r border-black p-0"><input name="v_s" value={analyzer.v_s} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                        <td className="p-0"><input name="i_s" value={analyzer.i_s} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                     </tr>
                     <tr className="border-b border-black">
                        <td className="border-r border-black font-bold p-1">T</td>
                        <td className="border-r border-black p-0"><input name="v_t" value={analyzer.v_t} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                        <td className="p-0"><input name="i_t" value={analyzer.i_t} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                     </tr>
                     <tr>
                        <td className="border-r border-black font-bold p-1">F (Hz)</td>
                        <td colSpan={2} className="p-0"><input name="freq" value={analyzer.freq} onChange={handleAnalyzerChange} className="w-full text-center outline-none bg-transparent" /></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Observations */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
         <div className="font-bold text-xs mb-1">Observaciones:</div>
         <textarea 
            className="w-full h-24 p-2 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-8 pt-2 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.electrician?.data} 
                   onChange={(val) => handleSignatureChange('electrician', val)}
                   className="border-0 h-full"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Personal Eléctrico</div>
             <div className="text-[10px]">Confeccionar esta planilla por personal eléctrico</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                   className="border-0 h-full"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Jefe de Equipo/Jefe de Campo</div>
             <div className="text-[10px]">N = Estado Normal del Equipo</div>
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
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
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
              observations, 
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
