
import React, { useState } from 'react';
import { INDControlReport, INDControlMetadata, INDControlRow } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';
import { INDControlPdf } from '../pdf/INDControlPdf';

interface Props {
  initialData?: INDControlReport;
  onSave: (report: INDControlReport) => void;
  onCancel: () => void;
}

// Static definition of items from the image
const IND_ITEMS = [
  { n: 1, element: 'LINEAS', desc: '2"1502', months: 12 },
  { n: 2, element: 'RISER', desc: '3 1/16 15K', months: 24 },
  { n: 3, element: 'CARRETEL', desc: '3 1/16 15K A 2 9/16 10K', months: 24 },
  { n: 4, element: 'CARRETEL', desc: '3 1/16 15K A 2 1/16 10K', months: 24 },
  { n: 5, element: 'CARRETEL', desc: '3 1/16 15K A 3 1/16 10K', months: 24 },
  { n: 6, element: 'CARRETEL', desc: '3 1/16 15K A 2 9/16 5K', months: 24 },
  { n: 7, element: 'CARRETEL', desc: '3 1/16 15K A 3 1/16  10K', months: 24 },
  { n: 8, element: 'CARRETEL', desc: '3 1/16 15K', months: 24 },
  { n: 9, element: 'CARRETEL SWIVER', desc: '3 1/16 15K', months: 24 },
  { n: 10, element: 'TAPON', desc: '3"1502', months: 12 },
  { n: 11, element: 'TAPON', desc: '2"1502', months: 12 },
  { n: 12, element: 'CUBO 45º', desc: '3 1/16 15K', months: 24 },
  { n: 13, element: 'CUBO 90º', desc: '3 1/16 15K', months: 24 },
  { n: 14, element: 'CAJA PORTA ORIFICIO', desc: '2 1/16 15K', months: 24 },
  { n: 15, element: 'BRIDA', desc: '2 9/16 10 A 2"1502', months: 24 },
  { n: 16, element: 'BRIDA', desc: '2 1/16 15K A 3"1502', months: 24 },
  { n: 17, element: 'BRIDA', desc: '3 1/16 15K A 3"1502', months: 24 },
  { n: 18, element: 'BRIDA', desc: '2 1/16 5K A 2"1502', months: 24 },
  { n: 19, element: 'BRIDA', desc: '4 1/16 15K A 3"1502', months: 24 },
  { n: 20, element: 'BRIDA', desc: '2 1/16 10K A 2"1502', months: 24 },
  { n: 21, element: 'NIPLE', desc: '3"1502 A 2"1502', months: 12 },
  { n: 22, element: 'NIPLE', desc: '3"1502 A 2"1502', months: 12 },
  { n: 23, element: 'NIPLE', desc: '3"1502 A 4"', months: 12 },
  { n: 24, element: '"TEE"', desc: '2"1502', months: 12 },
  { n: 25, element: 'CODO C/PLOMO', desc: '2"1502', months: 12 },
  { n: 26, element: 'CODO RIGIDO', desc: '2"1502', months: 12 },
  { n: 27, element: 'NIPLE', desc: '2"1502 A 2 7/8 EUE', months: 12 },
  { n: 28, element: 'LINEAS', desc: '3"1502', months: 12 },
  { n: 29, element: 'NIPLE CONECCION', desc: '2"1502 M-H', months: 12 },
  { n: 30, element: 'NIPLE CONECCION', desc: '3"1502M/2"1502H', months: 12 },
  { n: 31, element: 'TAPON', desc: '2"1502', months: 12 },
  { n: 32, element: 'CODO', desc: '2"1502 M-H', months: 12 },
  { n: 33, element: 'DESARENADOR', desc: '15000 PSI', months: 24 },
  { n: 34, element: 'PLUG CATCHER', desc: '150000 PSI', months: 24 },
  { n: 35, element: 'CHOKE MANIFOLD', desc: '15000 PSI', months: 24 },
  { n: 36, element: 'SUB-ESTRUCTURA', desc: 'TACKER', months: 24 },
  { n: 37, element: 'TANQUE ESPUMIGENO', desc: '', months: 36 },
  { n: 38, element: 'TANQUE GAS OIL', desc: '', months: 36 },
  { n: 39, element: 'TANQUE DE AIRE', desc: '', months: 36 },
  { n: 40, element: 'VALVULAS DE SEGURIDAD', desc: 'CALIBRAR', months: 24 },
  { n: 41, element: 'GOLPEADOR', desc: 'PILETA', months: 24 }
];

export const INDControlForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<INDControlMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: ''
  });

  const [rows, setRows] = useState<INDControlRow[]>(() => {
    // Merge static items with any existing data or create new rows
    return IND_ITEMS.map(item => {
      const existing = initialData?.rows.find(r => r.itemNumber === item.n);
      return existing || {
        id: crypto.randomUUID(),
        itemNumber: item.n,
        element: item.element,
        description: item.desc,
        validityMonths: item.months,
        identificationNumber: '',
        tag: '',
        inspectionDate: '',
        serviceDate: ''
      };
    });
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof INDControlRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  // Calculation Logic
  const getExpirationDate = (serviceDate: string, months: number): Date | null => {
    if (!serviceDate) return null;
    const date = new Date(serviceDate);
    // Logic: Date + (Months * 30 or simply adding months)
    // Using JS Date to add months correctly handling year turnover
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const getAlertStatus = (expirationDate: Date | null) => {
    if (!expirationDate) return { text: '', colorClass: '' };
    
    const now = new Date();
    // Reset hours to compare purely by date
    now.setHours(0,0,0,0);
    const exp = new Date(expirationDate);
    exp.setHours(0,0,0,0);

    const diffTime = exp.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "INSPECCION VENCIDA", colorClass: "bg-red-500 text-white font-bold" };
    } else if (diffDays <= 15) {
      return { text: "CUIDADO: Vencimiento Cercano", colorClass: "bg-yellow-400 text-black font-bold" };
    } else {
      return { text: "", colorClass: "" };
    }
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
          <h1 className="font-bold text-lg sm:text-xl uppercase leading-tight">Planillas de control de IND</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>Código IT-WFB-003-A1</div>
          <div className="font-normal mt-1">REVISION 00</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black bg-gray-50 print:bg-transparent">
         <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
                <span className="font-bold text-sm uppercase">Equipo:</span>
                <select name="equipment" title="Equipo" value={metadata.equipment} onChange={handleMetadataChange} className="border-b border-black outline-none bg-transparent w-full sm:w-48 uppercase">
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
            <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
                <span className="font-bold text-sm uppercase">Fecha:</span>
                <input 
                    type="date"
                    name="date" 
                    value={metadata.date} 
                    onChange={handleMetadataChange}
                    title="Fecha"
                    className="border-b border-black outline-none bg-transparent w-full sm:w-32"
                />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full border-b border-black">
        <div className="min-w-[1200px]">
          <table className="w-full border-collapse border border-black text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-200 text-center font-bold border-b border-black h-12">
                 <th className="border-r border-black p-1 w-8 sticky left-0 bg-gray-200 z-10">N°</th>
                 <th className="border-r border-black p-1 w-32 sticky left-8 bg-gray-200 z-10">ELEMENTOS</th>
                 <th className="border-r border-black p-1 w-48">DESCRIPCIÓN</th>
                 <th className="border-r border-black p-1 w-32">NÚMERO DE<br/>IDENTIFICACION</th>
                 <th className="border-r border-black p-1 w-24">TAG<br/>CUÑO</th>
                 <th className="border-r border-black p-1 w-16">VIGENCIA<br/>(MESES)</th>
                 <th className="border-r border-black p-1 w-24">FECHA<br/>INSPECCION</th>
                 <th className="border-r border-black p-1 w-24 bg-yellow-50 print:bg-transparent">FECHA PUESTA<br/>EN SERVICIO</th>
                 <th className="border-r border-black p-1 w-24">VENCIMIENTO</th>
                 <th className="p-1">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
               {rows.map((row) => {
                 const expDate = getExpirationDate(row.serviceDate, row.validityMonths);
                 const alert = getAlertStatus(expDate);
                 
                 return (
                   <tr key={row.id} className="border-b border-black hover:bg-gray-50 h-10">
                      <td className="border-r border-black p-1 text-center font-medium bg-gray-50 print:bg-transparent sticky left-0 z-10">{row.itemNumber}</td>
                      <td className="border-r border-black p-1 font-bold sticky left-8 bg-white z-10 border-r-2">{row.element}</td>
                      <td className="border-r border-black p-1 text-xs">{row.description}</td>
                      
                      <td className="border-r border-black p-0">
                         <input 
                            title="Número de Identificación"
                            className="w-full h-full p-1 text-center outline-none bg-transparent"
                            value={row.identificationNumber}
                            onChange={(e) => handleRowChange(row.id, 'identificationNumber', e.target.value)}
                         />
                      </td>
                      <td className="border-r border-black p-0">
                         <input 
                            title="TAG Cuño"
                            className="w-full h-full p-1 text-center outline-none bg-transparent"
                            value={row.tag}
                            onChange={(e) => handleRowChange(row.id, 'tag', e.target.value)}
                         />
                      </td>
                      <td className="border-r border-black p-1 text-center bg-gray-50 print:bg-transparent">{row.validityMonths}</td>
                      <td className="border-r border-black p-0">
                         <input 
                            type="date"
                            title="Fecha de Inspección"
                            className="w-full h-full p-1 text-center outline-none bg-transparent text-[10px]"
                            value={row.inspectionDate}
                            onChange={(e) => handleRowChange(row.id, 'inspectionDate', e.target.value)}
                         />
                      </td>
                      <td className="border-r border-black p-0 bg-yellow-50/50 print:bg-transparent">
                         <input 
                            type="date"
                            title="Fecha de Puesta en Servicio"
                            className="w-full h-full p-1 text-center outline-none bg-transparent font-medium text-[10px]"
                            value={row.serviceDate}
                            onChange={(e) => handleRowChange(row.id, 'serviceDate', e.target.value)}
                         />
                      </td>
                      
                      {/* Calculated Columns */}
                      <td className="border-r border-black p-1 text-center bg-gray-100 print:bg-transparent text-[10px]">
                         {expDate ? expDate.toLocaleDateString('es-AR') : ''}
                      </td>
                      <td className={`p-1 text-center text-[10px] ${alert.colorClass}`}>
                         {alert.text}
                      </td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="sm:hidden text-xs text-gray-400 mt-1 px-4 text-right">← Deslizá para ver más columnas →</p>

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
               filename={`planilla_ind_${metadata.date}`}
               orientation="l"
               pdfComponent={<INDControlPdf report={{ id: initialData?.id ?? '', metadata, rows }} />}
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
