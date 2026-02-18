
import React, { useState } from 'react';
import { StilsonControlReport, StilsonControlMetadata, StilsonControlRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: StilsonControlReport;
  onSave: (report: StilsonControlReport) => void;
  onCancel: () => void;
}

const EmptyRow: StilsonControlRow = {
  id: '',
  date: '',
  timeFrom: '',
  responsible: '',
  activity: '',
  talon: '',
  gavilan: '',
  gripPoint: '',
  nuts: '',
  timeTo: '',
  observations: ''
};

export const StilsonControlForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<StilsonControlMetadata>(initialData?.metadata || {
    equipment: '',
    month: '',
    location: ''
  });

  const [rows, setRows] = useState<StilsonControlRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof StilsonControlRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (id: string, dataUrl: string | undefined) => {
    setRows(prev => prev.map(row => 
      row.id === id 
        ? { ...row, signature: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined } 
        : row
    ));
  };

  const addRow = () => {
    setRows(prev => [...prev, { ...EmptyRow, id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderConditionSelect = (id: string, field: keyof StilsonControlRow, value: string) => (
    <select
      className="w-full h-full bg-transparent outline-none text-center text-xs appearance-none p-1 cursor-pointer hover:bg-gray-100"
      value={value}
      onChange={(e) => handleRowChange(id, field, e.target.value)}
    >
      <option value=""></option>
      <option value="Bueno">Bueno</option>
      <option value="Malo">Malo</option>
    </select>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-lg sm:text-xl uppercase leading-tight">PLANILLA DE CONTROL PARA USO / ESTADO DE LLAVES STILSON</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-SGI-001-A1-2</div>
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="p-4 border-b-2 border-black bg-white">
         <div className="border border-blue-700 p-2 text-sm rounded bg-blue-50">
            <p><span className="font-bold underline">Bueno:</span> No se evidencia desgaste y/o rotura que perjudique el correcto funcionamiento de la herramienta.</p>
            <p><span className="font-bold underline">Malo:</span> Se evidencia desgaste y/o rotura que perjudica al funcionamiento correcto de la herramienta.</p>
            <div className="mt-2 font-bold text-center border-t border-blue-200 pt-1 text-xs uppercase text-blue-800">
               Condicion: completar con Bueno / Malo
            </div>
         </div>
      </div>

      {/* Metadata Context */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
                <span className="font-bold text-xs uppercase text-gray-500">Equipo</span>
                <input 
                  name="equipment" 
                  value={metadata.equipment} 
                  onChange={handleMetadataChange} 
                  className="border border-gray-300 rounded p-1.5 outline-none bg-white w-full"
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="font-bold text-xs uppercase text-gray-500">Mes/Año</span>
                <input 
                  name="month" 
                  value={metadata.month} 
                  onChange={handleMetadataChange} 
                  className="border border-gray-300 rounded p-1.5 outline-none bg-white w-full"
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="font-bold text-xs uppercase text-gray-500">Locación</span>
                <input 
                  name="location" 
                  value={metadata.location} 
                  onChange={handleMetadataChange} 
                  className="border border-gray-300 rounded p-1.5 outline-none bg-white w-full"
                />
            </div>
         </div>
      </div>

      {/* Main Table - Scrollable */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1000px]">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-200 border-b border-black text-center font-bold">
                 <th className="border-r border-black p-2 w-24">FECHA</th>
                 <th className="border-r border-black p-2 w-20">DESDE<br/>(hora)</th>
                 <th className="border-r border-black p-2 w-32">RESPONSABLE</th>
                 <th className="border-r border-black p-2">ACTIVIDAD</th>
                 <th className="border-r border-black p-2 w-20">TALON</th>
                 <th className="border-r border-black p-2 w-20">GAVILAN</th>
                 <th className="border-r border-black p-2 w-20">PUNTO DE<br/>AGARRE</th>
                 <th className="border-r border-black p-2 w-20">TUERCAS</th>
                 <th className="border-r border-black p-2 w-20">HASTA<br/>(hora)</th>
                 <th className="border-r border-black p-2 w-32">FIRMA</th>
                 <th className="border-r border-black p-2 w-40">OBSERVACIONES</th>
                 <th className="w-8 no-print"></th>
              </tr>
            </thead>
            <tbody>
               {rows.map((row) => (
                 <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-12">
                    <td className="border-r border-black p-0">
                       <input type="date" className="w-full h-full p-1 text-center outline-none bg-transparent" value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input type="time" className="w-full h-full p-1 text-center outline-none bg-transparent" value={row.timeFrom} onChange={(e) => handleRowChange(row.id, 'timeFrom', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 outline-none bg-transparent" value={row.responsible} onChange={(e) => handleRowChange(row.id, 'responsible', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 outline-none bg-transparent" value={row.activity} onChange={(e) => handleRowChange(row.id, 'activity', e.target.value)} />
                    </td>
                    
                    {/* Conditions */}
                    <td className="border-r border-black p-0">{renderConditionSelect(row.id, 'talon', row.talon)}</td>
                    <td className="border-r border-black p-0">{renderConditionSelect(row.id, 'gavilan', row.gavilan)}</td>
                    <td className="border-r border-black p-0">{renderConditionSelect(row.id, 'gripPoint', row.gripPoint)}</td>
                    <td className="border-r border-black p-0">{renderConditionSelect(row.id, 'nuts', row.nuts)}</td>

                    <td className="border-r border-black p-0">
                       <input type="time" className="w-full h-full p-1 text-center outline-none bg-transparent" value={row.timeTo} onChange={(e) => handleRowChange(row.id, 'timeTo', e.target.value)} />
                    </td>
                    
                    <td className="border-r border-black p-0 align-middle">
                       <div className="w-full h-full flex items-center justify-center p-1">
                          <SignaturePad 
                             label=""
                             className="h-10 w-full border-0"
                             value={row.signature?.data}
                             onChange={(val) => handleSignatureChange(row.id, val)}
                          />
                       </div>
                    </td>

                    <td className="border-r border-black p-0">
                       <input className="w-full h-full p-1 outline-none bg-transparent" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} />
                    </td>
                    
                    <td className="p-0 text-center no-print">
                       <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 font-bold opacity-0 group-hover:opacity-100">&times;</button>
                    </td>
                 </tr>
               ))}
               <tr className="no-print">
                  <td colSpan={12} className="p-2 text-center bg-gray-50 border border-black border-dashed">
                    <button onClick={addRow} className="text-brand-red font-medium text-xs uppercase hover:underline">
                      + Agregar Fila
                    </button>
                  </td>
               </tr>
            </tbody>
          </table>
        </div>
        <p className="sm:hidden text-xs text-gray-400 mt-2 px-4 text-right">← Deslizá para ver más columnas →</p>
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
               filename={`control_stilson_${metadata.month || 'mes'}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows
            })} className="w-full sm:w-auto">
             Guardar Planilla
           </Button>
        </div>

    </div>
  );
};
