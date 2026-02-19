
import React, { useState } from 'react';
import { FoamSystemReport, FoamSystemRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: FoamSystemReport;
  onSave: (report: FoamSystemReport) => void;
  onCancel: () => void;
}

const EmptyRow: FoamSystemRow = {
  id: '',
  equipment: '',
  date: new Date().toISOString().split('T')[0],
  well: '',
  pneumaticValve: '',
  fluidLevel: '',
  reliefValve: '',
  dischargeTime: '',
  observations: '',
  systemState: '',
  nextRevision: '',
  manometerStatus: '',
  calibrationDate: ''
};

export const FoamSystemForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [rows, setRows] = useState<FoamSystemRow[]>(initialData?.rows || [
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

  const handleRowChange = (id: string, field: keyof FoamSystemRow, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const renderSelect = (id: string, field: keyof FoamSystemRow, value: string, label: string) => (
    <select 
      aria-label={label}
      value={value} 
      onChange={(e) => handleRowChange(id, field, e.target.value)}
      className="w-full h-full bg-transparent outline-none p-1 text-center appearance-none"
    >
      <option value=""></option>
      <option value="B">B</option>
      <option value="R">R</option>
      <option value="M">M</option>
      <option value="N/C">N/C</option>
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
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">Registro de funcionamiento de sistema de espumigeno</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG004-A1-0</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 p-3 text-xs sm:text-sm border-b border-black print:bg-transparent">
        <span className="font-bold">Observaciones:</span> Se probará mensualmente apertura de válvula neumática (previo despresurización del tanque) y semestralmente se accionará el sistema en su totalidad, debiendo registrar el tiempo de descarga.
      </div>

      {/* Legend */}
      <div className="bg-white p-2 border-b border-black font-bold text-xs sm:text-sm flex flex-wrap gap-2 sm:gap-4 uppercase justify-center">
        <span>B: Bien</span>
        <span>R: Regular</span>
        <span>M: Mal</span>
        <span>N/C: No corresponde</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[900px]">
          <table className="w-full border-collapse border border-black text-xs sm:text-sm">
            <thead>
              <tr className="bg-white text-center font-bold text-gray-900 border-b border-black">
                <th className="border-r border-black p-2 w-24">Equipo</th>
                <th className="border-r border-black p-2 w-24">Fecha</th>
                <th className="border-r border-black p-2 w-24">Pozo</th>
                <th className="border-r border-black p-2 w-20 bg-gray-50 print:bg-transparent">Válvula neumática</th>
                <th className="border-r border-black p-2 w-20 bg-gray-50 print:bg-transparent">Nivel de fluido</th>
                <th className="border-r border-black p-2 w-20 bg-gray-50 print:bg-transparent">Válvula de alivio</th>
                <th className="border-r border-black p-2 w-24">Tiempo de descarga</th>
                <th className="border-r border-black p-2">Observaciones</th>
                <th className="border-r border-black p-2 w-24">Estado de sistema</th>
                <th className="border-r border-black p-2 w-24">Proxima revisión semestral</th>
                <th className="p-2 w-8 no-print"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 group border-b border-black">
                  <td className="border-r border-black p-0 h-10">
                    <input 
                      aria-label="Equipo"
                      className="w-full h-full p-1 outline-none bg-transparent text-center uppercase"
                      value={row.equipment}
                      onChange={(e) => handleRowChange(row.id, 'equipment', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      type="date"
                      aria-label="Fecha"
                      className="w-full h-full p-1 outline-none bg-transparent text-center text-xs"
                      value={row.date}
                      onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      aria-label="Pozo"
                      className="w-full h-full p-1 outline-none bg-transparent text-center uppercase"
                      value={row.well}
                      onChange={(e) => handleRowChange(row.id, 'well', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0 text-center font-bold bg-gray-50/50 print:bg-transparent">
                    {renderSelect(row.id, 'pneumaticValve', row.pneumaticValve, 'Válvula neumática')}
                  </td>
                  <td className="border-r border-black p-0 text-center font-bold bg-gray-50/50 print:bg-transparent">
                    {renderSelect(row.id, 'fluidLevel', row.fluidLevel, 'Nivel de fluido')}
                  </td>
                  <td className="border-r border-black p-0 text-center font-bold bg-gray-50/50 print:bg-transparent">
                    {renderSelect(row.id, 'reliefValve', row.reliefValve, 'Válvula de alivio')}
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      aria-label="Tiempo de descarga"
                      className="w-full h-full p-1 outline-none bg-transparent text-center"
                      value={row.dischargeTime}
                      onChange={(e) => handleRowChange(row.id, 'dischargeTime', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      aria-label="Observaciones"
                      className="w-full h-full p-1 outline-none bg-transparent"
                      value={row.observations}
                      onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                     <input 
                      aria-label="Estado de sistema"
                      className="w-full h-full p-1 outline-none bg-transparent text-center"
                      value={row.systemState}
                      onChange={(e) => handleRowChange(row.id, 'systemState', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                     <input 
                      type="date"
                      aria-label="Próxima revisión semestral"
                      className="w-full h-full p-1 outline-none bg-transparent text-center text-xs"
                      value={row.nextRevision}
                      onChange={(e) => handleRowChange(row.id, 'nextRevision', e.target.value)}
                    />
                  </td>
                  <td className="p-0 text-center no-print">
                     <button 
                        onClick={() => removeRow(row.id)}
                        className="text-red-500 hover:bg-red-50 w-full h-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 font-bold"
                     >
                       ×
                     </button>
                  </td>
                </tr>
              ))}
              <tr className="no-print">
                <td colSpan={13} className="p-2 text-center bg-gray-50 border-t border-gray-300 border-dashed">
                  <button onClick={addRow} className="text-brand-red font-medium text-xs uppercase hover:underline">
                      + Agregar Registro
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right mb-4">
        ← Deslizá para ver más columnas →
      </p>

      {/* Signature Area (Generic Responsable as usually required) */}
      <div className="p-8 mt-4 page-break flex justify-center">
         <div className="max-w-xs w-full text-center">
            <SignaturePad 
              label="Firma del Responsable"
              value={signature?.data}
              onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
            />
         </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end p-4 bg-gray-50 border-t no-print">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-last sm:order-first">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto">
             <ExportPdfButton 
               filename={`sistema_espumigeno_${rows[0]?.date}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ id: initialData?.id || crypto.randomUUID(), rows, signature })} className="w-full sm:w-auto">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
