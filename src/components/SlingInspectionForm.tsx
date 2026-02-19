
import React, { useState } from 'react';
import { SlingInspectionReport, SlingInspectionRow, SlingColor, SlingCondition } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { SlingInspectionPdf } from '../pdf/SlingInspectionPdf';

interface Props {
  initialData?: SlingInspectionReport;
  onSave: (report: SlingInspectionReport) => void;
  onCancel: () => void;
}

const EmptyRow: SlingInspectionRow = {
  id: '',
  quantity: '',
  serviceDate: '',
  inspectionDate: new Date().toISOString().split('T')[0],
  lotNumber: '',
  certNumber: '',
  length: '',
  diameter: '',
  type: '',
  workingLoad: '',
  color: '',
  condition: '',
  location: '',
  observations: ''
};

export const SlingInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [rows, setRows] = useState<SlingInspectionRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);
  
  const [inspectorName, setInspectorName] = useState(initialData?.inspectorName || '');
  const [signature, setSignature] = useState(initialData?.signature);

  const addRow = () => {
    setRows(prev => [...prev, { ...EmptyRow, id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleRowChange = (id: string, field: keyof SlingInspectionRow, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleConditionToggle = (id: string, value: SlingCondition) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        const newValue = row.condition === value ? '' : value;
        return { ...row, condition: newValue };
      }
      return row;
    }));
  };

  const COLORS: SlingColor[] = ['Blanco', 'Verde', 'Azul', 'Amarillo', 'Rojo'];

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-lg sm:text-xl uppercase leading-tight">Planilla de Inspección y Control de Eslingas</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG022-A1-0</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="w-full">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs min-w-[1200px]">
            <thead>
              <tr className="bg-gray-300 text-center font-bold text-black border-b border-black">
                <th className="border-r border-black p-1 w-10">N°</th>
                <th className="border-r border-black p-1 w-20">Cantidad</th>
                <th className="border-r border-black p-1 w-24">Puesta Serv.</th>
                <th className="border-r border-black p-1 w-24">Fecha Insp.</th>
                <th className="border-r border-black p-1 w-20">N° Lote</th>
                <th className="border-r border-black p-1 w-20">N° Cert.</th>
                <th className="border-r border-black p-1 w-16">Long (cm)</th>
                <th className="border-r border-black p-1 w-16">Diam (pulg)</th>
                <th className="border-r border-black p-1 w-24">Tipo</th>
                <th className="border-r border-black p-1 w-20">Carga (Kg)</th>
                <th className="border-r border-black p-1 w-24">Color</th>
                <th className="border-r border-black p-0 w-20">
                   <div className="h-full flex flex-col">
                      <div className="border-b border-black p-1 flex-1 flex items-center justify-center bg-gray-300">Estado</div>
                      <div className="flex h-6">
                          <div className="flex-1 border-r border-black flex items-center justify-center bg-gray-300">B</div>
                          <div className="flex-1 flex items-center justify-center bg-gray-300">FS</div>
                      </div>
                   </div>
                </th>
                <th className="border-r border-black p-1 w-40">Ubicación</th>
                <th className="border-r border-black p-1 w-40">Observaciones</th>
                <th className="p-1 w-8 no-print"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50 group border-b border-black h-10">
                  <td className="border-r border-black p-1 text-center font-bold">{index + 1}</td>
                  <td className="border-r border-black p-0"><input title="Cantidad" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.quantity} onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input type="date" title="Puesta en Servicio" className="w-full h-full p-1 text-center bg-transparent outline-none text-xs" value={row.serviceDate} onChange={(e) => handleRowChange(row.id, 'serviceDate', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input type="date" title="Fecha de Inspección" className="w-full h-full p-1 text-center bg-transparent outline-none text-xs" value={row.inspectionDate} onChange={(e) => handleRowChange(row.id, 'inspectionDate', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="N° Lote" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.lotNumber} onChange={(e) => handleRowChange(row.id, 'lotNumber', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="N° Certificado" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.certNumber} onChange={(e) => handleRowChange(row.id, 'certNumber', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="Longitud (cm)" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.length} onChange={(e) => handleRowChange(row.id, 'length', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="Diámetro (pulg)" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.diameter} onChange={(e) => handleRowChange(row.id, 'diameter', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="Tipo" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.type} onChange={(e) => handleRowChange(row.id, 'type', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="Carga de Trabajo (kg)" className="w-full h-full p-1 text-center bg-transparent outline-none" value={row.workingLoad} onChange={(e) => handleRowChange(row.id, 'workingLoad', e.target.value)} /></td>
                  <td className="border-r border-black p-0">
                     <select title="Color" className="w-full h-full p-1 bg-transparent outline-none text-center appearance-none cursor-pointer hover:bg-gray-100" value={row.color} onChange={(e) => handleRowChange(row.id, 'color', e.target.value)}>
                       <option value="">-</option>
                       {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </td>
                  <td className="border-r border-black p-0 h-10">
                      <div className="flex h-full w-full">
                         <button type="button" className={`flex-1 flex items-center justify-center border-r border-black transition-colors focus:outline-none h-full ${row.condition === 'B' ? 'bg-black text-white' : 'hover:bg-gray-200'}`} onClick={() => handleConditionToggle(row.id, 'B')}>{row.condition === 'B' && <span className="font-bold">X</span>}</button>
                         <button type="button" className={`flex-1 flex items-center justify-center transition-colors focus:outline-none h-full ${row.condition === 'FS' ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`} onClick={() => handleConditionToggle(row.id, 'FS')}>{row.condition === 'FS' && <span className="font-bold">X</span>}</button>
                      </div>
                  </td>
                  <td className="border-r border-black p-0"><input title="Ubicación" className="w-full h-full p-1 bg-transparent outline-none" value={row.location} onChange={(e) => handleRowChange(row.id, 'location', e.target.value)} /></td>
                  <td className="border-r border-black p-0"><input title="Observaciones" className="w-full h-full p-1 bg-transparent outline-none" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} /></td>
                  <td className="p-0 text-center no-print"><button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 font-bold opacity-0 group-hover:opacity-100">&times;</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
           {rows.map((row, index) => (
              <div key={row.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm relative">
                 <div className="absolute top-2 right-2 no-print">
                    <button onClick={() => removeRow(row.id)} className="text-red-500 font-bold px-2">✕</button>
                 </div>
                 <div className="font-bold text-sm mb-2 text-gray-700 uppercase border-b pb-1">Eslinga #{index + 1}</div>
                 
                 <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                       <label className="block font-semibold text-gray-500">Cantidad</label>
                       <input title="Cantidad" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.quantity} onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">Fecha Insp.</label>
                       <input type="date" title="Fecha de Inspección" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.inspectionDate} onChange={(e) => handleRowChange(row.id, 'inspectionDate', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">N° Certificado</label>
                       <input title="N° Certificado" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.certNumber} onChange={(e) => handleRowChange(row.id, 'certNumber', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">N° Lote</label>
                       <input title="N° Lote" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.lotNumber} onChange={(e) => handleRowChange(row.id, 'lotNumber', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">Longitud (cm)</label>
                       <input title="Longitud (cm)" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.length} onChange={(e) => handleRowChange(row.id, 'length', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">Diámetro (plg)</label>
                       <input title="Diámetro (pulg)" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.diameter} onChange={(e) => handleRowChange(row.id, 'diameter', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">Carga (kg)</label>
                       <input title="Carga de Trabajo (kg)" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.workingLoad} onChange={(e) => handleRowChange(row.id, 'workingLoad', e.target.value)} />
                    </div>
                    <div>
                       <label className="block font-semibold text-gray-500">Color</label>
                       <select title="Color" className="w-full border-b border-gray-400 bg-transparent py-1" value={row.color} onChange={(e) => handleRowChange(row.id, 'color', e.target.value)}>
                          <option value="">-</option>
                          {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="mt-3">
                    <label className="block font-semibold text-gray-500 text-xs mb-1">Estado</label>
                    <div className="flex gap-2">
                       <button 
                          className={`flex-1 py-1 rounded border text-xs font-bold ${row.condition === 'B' ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300'}`}
                          onClick={() => handleConditionToggle(row.id, 'B')}
                       >
                          BUENO
                       </button>
                       <button 
                          className={`flex-1 py-1 rounded border text-xs font-bold ${row.condition === 'FS' ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-600 border-gray-300'}`}
                          onClick={() => handleConditionToggle(row.id, 'FS')}
                       >
                          FUERA DE SERVICIO
                       </button>
                    </div>
                 </div>

                 <div className="mt-3">
                    <label className="block font-semibold text-gray-500 text-xs">Ubicación</label>
                    <input title="Ubicación" className="w-full border-b border-gray-400 bg-transparent py-1 text-sm" value={row.location} onChange={(e) => handleRowChange(row.id, 'location', e.target.value)} />
                 </div>
                 <div className="mt-2">
                    <label className="block font-semibold text-gray-500 text-xs">Observaciones</label>
                    <input title="Observaciones" className="w-full border-b border-gray-400 bg-transparent py-1 text-sm" value={row.observations} onChange={(e) => handleRowChange(row.id, 'observations', e.target.value)} />
                 </div>
              </div>
           ))}
        </div>

        <div className="p-4 no-print text-center lg:text-left">
            <button onClick={addRow} className="text-brand-red font-bold text-sm uppercase hover:underline border border-brand-red px-4 py-2 rounded-full bg-red-50">
              + Agregar Eslinga
            </button>
        </div>
      </div>

      {/* Footer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-black text-sm p-4 gap-6 page-break-inside-avoid">
         <div className="flex flex-col justify-end">
             <label className="font-bold text-xs mb-1">Nombre y Apellido del Inspector:</label>
             <input 
                className="w-full border-b border-black outline-none bg-transparent py-1" 
                title="Nombre y Apellido del Inspector"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                placeholder="Ingrese nombre..."
             />
         </div>
         <div className="flex flex-col items-center">
             <div className="w-full md:w-64 h-24 mb-2 border border-gray-300 rounded bg-white">
                <SignaturePad 
                   label="" 
                   value={signature?.data}
                   onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                   className="w-full h-full border-0"
                />
             </div>
             <span className="font-bold text-xs uppercase">Firma del Inspector</span>
         </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-last sm:order-first">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto">
             <ExportPdfButton 
               filename={`eslingas_${rows[0]?.inspectionDate}`}
               orientation="l"
               className="w-full"
               pdfComponent={<SlingInspectionPdf report={{ id: initialData?.id ?? '', rows, inspectorName, signature, date: rows[0]?.inspectionDate || new Date().toISOString() }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              rows, 
              inspectorName,
              signature,
              date: rows[0]?.inspectionDate || new Date().toISOString()
            })} className="w-full sm:w-auto">
             Guardar Planilla
           </Button>
        </div>

    </div>
  );
};
