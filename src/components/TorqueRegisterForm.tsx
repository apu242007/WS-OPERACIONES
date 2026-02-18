
import React, { useState } from 'react';
import { TorqueReport, TorqueMetadata, TorqueRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: TorqueReport;
  onSave: (report: TorqueReport) => void;
  onCancel: () => void;
}

const EmptyRow: TorqueRow = {
  id: '',
  selection: null,
  location: '',
  lubrication: null,
  recommendedTorque: '',
  appliedTorque: '',
  observations: ''
};

export const TorqueRegisterForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<TorqueMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    responsible1: '',
    equipment: '',
    responsible2: '',
    client: '',
    field: '',
    well: ''
  });

  const [rows, setRows] = useState<TorqueRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
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

  const handleRowChange = (id: string, field: keyof TorqueRow, value: any) => {
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

  const handleSignatureChange = (role: 'responsible1' | 'responsible2', dataUrl: string | undefined) => {
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
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">REGISTRO DE TORQUE</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WFB-002-A1</div>
          <div className="text-xs font-normal mt-1">Revisión 00</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent space-y-2">
         {/* Row 1 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20 text-xs uppercase">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-48 text-xs uppercase">NOMBRE Y APELLIDO:</span>
               <input name="responsible1" value={metadata.responsible1} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-24 text-xs uppercase">EQUIPO:</span>
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
         </div>
         {/* Row 2 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 hidden md:block"></div> {/* Spacer */}
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-48 text-xs uppercase">NOMBRE Y APELLIDO:</span>
               <input name="responsible2" value={metadata.responsible2} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex-1 hidden md:block"></div> {/* Spacer */}
         </div>
         {/* Row 3 */}
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-20 text-xs uppercase">CLIENTE:</span>
               <input name="client" value={metadata.client} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-24 text-xs uppercase">YACIMIENTO:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
            <div className="flex-1 flex border-b border-black border-dashed pb-1 items-end">
               <span className="font-bold w-16 text-xs uppercase">POZO:</span>
               <input name="well" value={metadata.well} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent uppercase" />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[900px]">
          <table className="w-full border-collapse border border-black text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-200 border-b border-black font-bold text-center">
                 <th colSpan={3} className="border-r border-black p-2 border-b">ELEMENTO</th>
                 <th rowSpan={2} className="border-r border-black p-2 w-48">UBICACION</th>
                 <th colSpan={2} className="border-r border-black p-2 border-b">LUBRICADO</th>
                 <th rowSpan={2} className="border-r border-black p-2 w-24">TORQUE<br/>RECOMENDADO</th>
                 <th rowSpan={2} className="border-r border-black p-2 w-24">TORQUE<br/>APLICADO</th>
                 <th rowSpan={2} className="border-r border-black p-2">OBSERVACIONES</th>
                 <th rowSpan={2} className="w-8 no-print"></th>
              </tr>
              <tr className="bg-gray-200 border-b border-black font-bold text-center text-[10px]">
                 <th className="border-r border-black p-1 w-20">ESPARRAGO</th>
                 <th className="border-r border-black p-1 w-20">BULON</th>
                 <th className="border-r border-black p-1 w-20">GRAMPA</th>
                 <th className="border-r border-black p-1 w-12">SI</th>
                 <th className="border-r border-black p-1 w-12">NO</th>
              </tr>
            </thead>
            <tbody>
               {rows.map((row) => (
                 <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-10">
                    {/* Selection Checkboxes */}
                    <td 
                      className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-gray-200"
                      onClick={() => handleRowChange(row.id, 'selection', row.selection === 'ESPARRAGO' ? null : 'ESPARRAGO')}
                    >
                       <div className={`w-full h-full flex items-center justify-center ${row.selection === 'ESPARRAGO' ? 'font-bold bg-black text-white' : 'text-transparent'}`}>X</div>
                    </td>
                    <td 
                      className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-gray-200"
                      onClick={() => handleRowChange(row.id, 'selection', row.selection === 'BULON' ? null : 'BULON')}
                    >
                       <div className={`w-full h-full flex items-center justify-center ${row.selection === 'BULON' ? 'font-bold bg-black text-white' : 'text-transparent'}`}>X</div>
                    </td>
                    <td 
                      className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-gray-200"
                      onClick={() => handleRowChange(row.id, 'selection', row.selection === 'GRAMPA' ? null : 'GRAMPA')}
                    >
                       <div className={`w-full h-full flex items-center justify-center ${row.selection === 'GRAMPA' ? 'font-bold bg-black text-white' : 'text-transparent'}`}>X</div>
                    </td>

                    {/* Location */}
                    <td className="border-r border-black p-0">
                       <input 
                          className="w-full h-full p-1 outline-none bg-transparent"
                          value={row.location}
                          onChange={(e) => handleRowChange(row.id, 'location', e.target.value)}
                       />
                    </td>

                    {/* Lubrication Checkboxes */}
                    <td 
                      className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-green-50"
                      onClick={() => handleRowChange(row.id, 'lubrication', row.lubrication === 'SI' ? null : 'SI')}
                    >
                       <div className={`w-full h-full flex items-center justify-center ${row.lubrication === 'SI' ? 'font-bold bg-green-600 text-white' : 'text-transparent'}`}>X</div>
                    </td>
                    <td 
                      className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-red-50"
                      onClick={() => handleRowChange(row.id, 'lubrication', row.lubrication === 'NO' ? null : 'NO')}
                    >
                       <div className={`w-full h-full flex items-center justify-center ${row.lubrication === 'NO' ? 'font-bold bg-red-600 text-white' : 'text-transparent'}`}>X</div>
                    </td>

                    {/* Values */}
                    <td className="border-r border-black p-0">
                       <input 
                          className="w-full h-full p-1 text-center outline-none bg-transparent"
                          value={row.recommendedTorque}
                          onChange={(e) => handleRowChange(row.id, 'recommendedTorque', e.target.value)}
                       />
                    </td>
                    <td className="border-r border-black p-0">
                       <input 
                          className="w-full h-full p-1 text-center outline-none bg-transparent"
                          value={row.appliedTorque}
                          onChange={(e) => handleRowChange(row.id, 'appliedTorque', e.target.value)}
                       />
                    </td>
                    <td className="border-r border-black p-0">
                       <input 
                          className="w-full h-full p-1 outline-none bg-transparent"
                          value={row.observations}
                          onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)}
                       />
                    </td>
                    <td className="text-center no-print">
                       <button onClick={() => removeRow(row.id)} className="text-red-500 font-bold hover:bg-red-50 w-full h-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100">×</button>
                    </td>
                 </tr>
               ))}
               <tr className="no-print">
                  <td colSpan={10} className="p-2 text-center bg-gray-50 border border-black border-dashed">
                    <button onClick={addRow} className="text-brand-red font-bold text-xs uppercase hover:underline">
                      + Agregar Fila
                    </button>
                  </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver columnas →</p>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.responsible1?.data} 
                   onChange={(val) => handleSignatureChange('responsible1', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Responsable</div>
             <div className="text-xs text-gray-500">{metadata.responsible1 || '(Nombre)'}</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.responsible2?.data} 
                   onChange={(val) => handleSignatureChange('responsible2', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-xs uppercase">Firma Responsable</div>
             <div className="text-xs text-gray-500">{metadata.responsible2 || '(Nombre)'}</div>
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
               filename={`registro_torque_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              signatures 
            })} className="w-full sm:w-auto">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
