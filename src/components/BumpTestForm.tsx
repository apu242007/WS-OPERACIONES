
import React, { useState } from 'react';
import { BumpTestReport, BumpTestRow } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';
import { BumpTestPdf } from '../pdf/BumpTestPdf';

interface Props {
  initialData?: BumpTestReport;
  onSave: (report: BumpTestReport) => void;
  onCancel: () => void;
}

const EmptyRow: BumpTestRow = {
  id: '',
  date: '',
  brandModel: '',
  serialNumber: '',
  result: null,
  responsible: ''
};

export const BumpTestForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [rows, setRows] = useState<BumpTestRow[]>(initialData?.rows || [
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() },
    { ...EmptyRow, id: crypto.randomUUID() }
  ]);

  const addRow = () => {
    setRows(prev => [...prev, { ...EmptyRow, id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleRowChange = (id: string, field: keyof BumpTestRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
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
          <h1 className="font-black text-lg sm:text-2xl uppercase leading-tight">REGISTRO BUMP TEST EQUIPO MULTIGAS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>IT-WWO-007-A2</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[700px]">
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-200 border-b border-black font-bold text-center">
                 <th className="border-r border-black p-2 w-32">FECHA</th>
                 <th className="border-r border-black p-2">MARCA Y MODELO</th>
                 <th className="border-r border-black p-2 w-48">N° DE SERIE</th>
                 <th className="border-r border-black p-2 w-24">APROBADO</th>
                 <th className="border-r border-black p-2 w-24">FALLIDO</th>
                 <th className="border-r border-black p-2 w-48">RESPONSABLE</th>
                 <th className="w-8 no-print"></th>
              </tr>
            </thead>
            <tbody>
               {rows.map((row) => (
                 <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-10">
                    <td className="border-r border-black p-0">
                       <input type="date" className="w-full h-full text-center outline-none bg-transparent p-1" value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full outline-none bg-transparent p-1 px-2" value={row.brandModel} onChange={(e) => handleRowChange(row.id, 'brandModel', e.target.value)} placeholder="Marca..." />
                    </td>
                    <td className="border-r border-black p-0">
                       <input className="w-full h-full text-center outline-none bg-transparent p-1" value={row.serialNumber} onChange={(e) => handleRowChange(row.id, 'serialNumber', e.target.value)} placeholder="S/N" />
                    </td>
                    
                    {/* Aprobado Checkbox */}
                    <td className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-green-50 transition-colors" onClick={() => handleRowChange(row.id, 'result', row.result === 'APROBADO' ? null : 'APROBADO')}>
                       <div className={`w-full h-full flex items-center justify-center font-bold ${row.result === 'APROBADO' ? 'text-green-700 bg-green-100' : 'text-transparent'}`}>X</div>
                    </td>
                    
                    {/* Fallido Checkbox */}
                    <td className="border-r border-black p-0 text-center align-middle cursor-pointer hover:bg-red-50 transition-colors" onClick={() => handleRowChange(row.id, 'result', row.result === 'FALLIDO' ? null : 'FALLIDO')}>
                       <div className={`w-full h-full flex items-center justify-center font-bold ${row.result === 'FALLIDO' ? 'text-red-700 bg-red-100' : 'text-transparent'}`}>X</div>
                    </td>

                    <td className="border-r border-black p-0">
                       <input className="w-full h-full outline-none bg-transparent p-1 px-2" value={row.responsible} onChange={(e) => handleRowChange(row.id, 'responsible', e.target.value)} placeholder="Nombre..." />
                    </td>
                    <td className="text-center no-print">
                       <button onClick={() => removeRow(row.id)} className="text-red-500 font-bold hover:bg-red-50 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </td>
                 </tr>
               ))}
               <tr className="no-print">
                  <td colSpan={7} className="p-2 text-center bg-gray-50 border border-black border-dashed">
                    <button onClick={addRow} className="text-brand-red font-bold text-xs uppercase hover:underline">
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
               filename={`bump_test_${rows[0]?.date || 'fecha'}`}
               orientation="p"
               className="w-full"
               pdfComponent={<BumpTestPdf report={{ id: initialData?.id || '', rows }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              rows 
            })} className="w-full sm:w-auto">
             Guardar Registro
           </Button>
        </div>

    </div>
  );
};
