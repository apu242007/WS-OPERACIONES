
import React, { useState } from 'react';
import { DailyReport, TimeEntry } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: DailyReport;
  onSave: (report: DailyReport) => void;
  onCancel: () => void;
}

const EmptyEntry: TimeEntry = {
  id: '',
  from: '',
  to: '',
  hours: '',
  timeClass: '',
  tariff: '',
  detail: ''
};

export const DailyOperationsForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    client: '',
    field: '',
    province: '',
    rigNumber: '',
    well: '',
    reportNumber: '',
    objective: '',
    companyInfo: ''
  });

  const [entries, setEntries] = useState<TimeEntry[]>(initialData?.entries || [
    { ...EmptyEntry, id: crypto.randomUUID() }
  ]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (id: string, field: keyof TimeEntry, value: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        // Auto calculate hours if from/to changes
        if ((field === 'from' || field === 'to') && updated.from && updated.to) {
          updated.hours = calculateHours(updated.from, updated.to);
        }
        return updated;
      }
      return entry;
    }));
  };

  const calculateHours = (start: string, end: string): string => {
    try {
      const [h1, m1] = start.split(':').map(Number);
      const [h2, m2] = end.split(':').map(Number);
      let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (diff < 0) diff += 24 * 60; // Handle overnight
      return (diff / 60).toFixed(2);
    } catch {
      return '';
    }
  };

  const addRow = () => {
    setEntries(prev => [...prev, { ...EmptyEntry, id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl sm:text-2xl uppercase leading-tight">Parte Diario de Operaciones</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG001-A3-1</div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-0 print:mt-0">
        
        {/* Company Info Header */}
        <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 border-b border-black text-sm">
          <div className="col-span-8 p-2 border-b sm:border-b-0 sm:border-r border-black flex flex-col sm:flex-row sm:items-center bg-gray-50 print:bg-transparent">
            <span className="font-bold mr-2 text-xs uppercase mb-1 sm:mb-0">Empresa:</span>
            <input 
              name="companyInfo" 
              value={metadata.companyInfo || ''} 
              onChange={handleMetadataChange} 
              className="flex-1 bg-transparent outline-none placeholder-gray-400 font-medium w-full"
              placeholder="Nombre de la empresa, dirección y teléfono..."
            />
          </div>
          <div className="col-span-4 p-2 flex flex-col sm:flex-row sm:items-center">
             <label className="font-bold mr-2 whitespace-nowrap text-xs uppercase mb-1 sm:mb-0">Fecha:</label>
             <input 
              type="date" 
              name="date" 
              value={metadata.date} 
              onChange={handleMetadataChange}
              className="w-full bg-transparent border-b border-gray-400 focus:border-black outline-none text-center"
            />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 border-b border-black text-sm">
           {/* Row 1 */}
           <div className="col-span-6 flex flex-col sm:flex-row border-b border-gray-300">
              <div className="w-full sm:w-24 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-gray-300 flex items-center print:bg-transparent">Cliente:</div>
              <input 
                name="client"
                value={metadata.client}
                onChange={handleMetadataChange}
                className="flex-1 p-2 outline-none uppercase w-full"
              />
           </div>
           <div className="col-span-3 flex flex-col sm:flex-row border-b border-gray-300 sm:border-l border-gray-300">
              <div className="w-full sm:w-20 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-gray-300 flex items-center print:bg-transparent">Pozo:</div>
              <input 
                name="well"
                value={metadata.well}
                onChange={handleMetadataChange}
                className="flex-1 p-2 outline-none uppercase w-full"
              />
           </div>
           <div className="col-span-3 flex flex-col sm:flex-row border-b border-gray-300 sm:border-l border-gray-300">
              <div className="w-full sm:w-24 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-gray-300 flex items-center print:bg-transparent">Parte N°:</div>
              <input 
                name="reportNumber"
                value={metadata.reportNumber}
                onChange={handleMetadataChange}
                className="flex-1 p-2 outline-none w-full"
              />
           </div>

           {/* Row 2 */}
           <div className="col-span-6 flex flex-col sm:flex-row border-b sm:border-b-0 border-gray-300">
              <div className="w-full sm:w-24 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-gray-300 flex items-center print:bg-transparent">Yacimiento:</div>
              <input 
                name="field"
                value={metadata.field}
                onChange={handleMetadataChange}
                className="flex-1 p-2 outline-none uppercase w-full"
              />
           </div>
           <div className="col-span-6 flex flex-col sm:flex-row">
              <div className="w-full sm:w-24 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-gray-300 sm:border-l border-gray-300 flex items-center print:bg-transparent">Equipo N°:</div>
              <input 
                name="rigNumber"
                value={metadata.rigNumber}
                onChange={handleMetadataChange}
                className="flex-1 p-2 outline-none w-full"
              />
           </div>
           
             {/* Row 3 */}
           <div className="col-span-12 flex flex-col sm:flex-row border-t border-gray-300">
             <div className="w-full sm:w-24 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-gray-300 flex items-center print:bg-transparent">Provincia:</div>
             <input 
               name="province"
               value={metadata.province}
               onChange={handleMetadataChange}
               className="flex-1 p-2 outline-none uppercase w-full"
             />
           </div>
        </div>

        {/* Objective */}
        <div className="border-b border-black text-sm">
          <div className="bg-gray-100 p-2 font-bold text-xs uppercase border-b border-gray-300 flex justify-between items-center print:bg-transparent">
            <span>Objetivo de la Intervención:</span>
          </div>
          <textarea 
            name="objective"
            value={metadata.objective}
            onChange={handleMetadataChange}
            rows={2}
            className="w-full p-2 outline-none resize-none bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
          />
        </div>

        {/* Data Grid - Scrollable on mobile */}
        <div className="overflow-x-auto w-full border-b border-black">
          <table className="w-full border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="bg-gray-200 text-black text-center font-bold uppercase text-xs border-b border-black">
                <th className="border-r border-black p-2 w-24">Desde</th>
                <th className="border-r border-black p-2 w-24">Hasta</th>
                <th className="border-r border-black p-2 w-20">c.Horas</th>
                <th className="border-r border-black p-2 w-32">Clase de Tiempo</th>
                <th className="border-r border-black p-2 w-24">Tarifa</th>
                <th className="border-r border-black p-2">Detalle de Operaciones</th>
                <th className="p-2 w-10 no-print"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 group border-b border-gray-300">
                  <td className="border-r border-black p-0">
                    <input 
                      type="time" 
                      className="w-full h-full p-2 text-center outline-none bg-transparent"
                      value={entry.from}
                      onChange={(e) => handleEntryChange(entry.id, 'from', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      type="time" 
                      className="w-full h-full p-2 text-center outline-none bg-transparent"
                      value={entry.to}
                      onChange={(e) => handleEntryChange(entry.id, 'to', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      className="w-full h-full p-2 text-center outline-none bg-transparent font-medium"
                      value={entry.hours}
                      readOnly
                      placeholder="-"
                    />
                  </td>
                   <td className="border-r border-black p-0">
                    <input 
                      className="w-full h-full p-2 text-center outline-none bg-transparent"
                      value={entry.timeClass}
                      onChange={(e) => handleEntryChange(entry.id, 'timeClass', e.target.value)}
                    />
                  </td>
                   <td className="border-r border-black p-0">
                    <input 
                      className="w-full h-full p-2 text-center outline-none bg-transparent"
                      value={entry.tariff}
                      onChange={(e) => handleEntryChange(entry.id, 'tariff', e.target.value)}
                    />
                  </td>
                  <td className="border-r border-black p-0">
                    <input 
                      className="w-full h-full p-2 outline-none bg-transparent"
                      value={entry.detail}
                      onChange={(e) => handleEntryChange(entry.id, 'detail', e.target.value)}
                    />
                  </td>
                  <td className="p-0 text-center no-print">
                    <button 
                      onClick={() => removeRow(entry.id)}
                      className="text-gray-400 hover:text-red-500 p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity font-bold"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="no-print">
                <td colSpan={7} className="p-2 text-center bg-gray-50 border-t border-gray-300 border-dashed">
                  <button onClick={addRow} className="text-brand-red font-medium text-xs uppercase hover:underline">
                    + Agregar Fila
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end mt-6 p-4 bg-gray-50 border-t no-print">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`parte_diario_${metadata.date}_${metadata.well || 'pozo'}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ id: initialData?.id || crypto.randomUUID(), metadata, entries })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Operación
           </Button>
        </div>

      </div>
    </div>
  );
};
