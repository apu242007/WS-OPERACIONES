
import React, { useState } from 'react';
import { WelcomeSignData } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: WelcomeSignData;
  onSave: (data: WelcomeSignData) => void;
  onCancel: () => void;
}

const EPP_LIST = [
  { icon: '⛑️', label: 'Casco' },
  { icon: '👓', label: 'Anteojos' },
  { icon: '🥾', label: 'Botines' },
  { icon: '👕', label: 'Mameluco FR' },
  { icon: '🧤', label: 'Guantes' },
  { icon: '🎧', label: 'Auditiva' },
  { icon: '🦺', label: 'Chaleco' },
];

export const WelcomeSignForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [data, setData] = useState<WelcomeSignData>(initialData || {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    company: '',
    location: '',
    well: '',
    rigNumber: '',
    additionalText: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center w-full font-sans">
      
      {/* Editor Controls (Screen Only) */}
      <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 no-print">
         <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🎨</span> Generador de Cartelería: Bienvenidos
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Empresa</label>
                  <input name="company" value={data.company} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ej: TACKER SOLUTIONS" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Equipo N°</label>
                  <select name="rigNumber" value={data.rigNumber} onChange={handleChange} className="w-full p-2 border rounded">
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
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fecha (Control)</label>
                  <input type="date" name="date" value={data.date} onChange={handleChange} className="w-full p-2 border rounded" />
               </div>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Yacimiento / Locación</label>
                  <input name="location" value={data.location} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ej: LOMA CAMPANA" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Pozo</label>
                  <input name="well" value={data.well} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ej: YPF.Nq.LCa-123" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Texto Adicional (Opcional)</label>
                  <input name="additionalText" value={data.additionalText} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ej: PROHIBIDO INGRESAR SIN AUTORIZACIÓN" />
               </div>
            </div>
         </div>
      </div>

      {/* Preview Container with Scroll */}
      <div className="w-full p-4 bg-gray-50 border-t border-gray-200">
         <h3 className="text-sm font-semibold text-gray-700 mb-3 no-print">Vista Previa del Cartel</h3>
         
         {/* Mobile Scroll Indicator */}
         <div className="sm:hidden no-print bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3 flex items-center gap-2">
            <span className="text-yellow-600 text-lg">👈👉</span>
            <span className="text-xs text-yellow-700 font-medium">Deslizá horizontalmente para ver el cartel completo</span>
         </div>

         <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0 px-4 sm:px-0">
             <div className="min-w-[800px] transform origin-top-left">
                {/* The Sign Content - Reused inside container */}
                <div id="print-area" className="bg-white border-[10px] border-double border-black p-8 w-[297mm] h-[210mm] flex flex-col justify-between shadow-2xl relative overflow-hidden mx-auto">
                   {/* Top Bar */}
                   <div className="flex justify-between items-start border-b-4 border-black pb-2">
                      <div className="text-4xl font-black uppercase tracking-tighter text-gray-800">
                         {data.company || 'EMPRESA'}
                      </div>
                      <div className="flex flex-col items-end">
                         <div className="text-3xl font-bold text-brand-red">OPERACIONES</div>
                         <div className="text-sm font-bold text-gray-500">SEGURIDAD INDUSTRIAL</div>
                      </div>
                   </div>

                   {/* Main Content */}
                   <div className="flex-1 flex flex-col items-center justify-center py-4">
                       
                       {/* Giant BIENVENIDOS */}
                       <div className="text-[7rem] leading-none font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-green-600 to-red-600 drop-shadow-sm select-none" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                          BIENVENIDOS
                       </div>

                       <div className="w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent my-6 opacity-20"></div>

                       {/* Dynamic Data */}
                       <div className="text-center w-full space-y-4">
                          {data.rigNumber && (
                             <div className="flex items-center justify-center gap-4">
                                <span className="text-3xl font-medium text-gray-500 uppercase">Equipo:</span>
                                <span className="text-6xl font-black uppercase text-black">{data.rigNumber}</span>
                             </div>
                          )}
                          
                          {data.well && (
                             <div className="flex items-center justify-center gap-4 bg-gray-100 p-2 rounded-lg border border-gray-300 print:border-none print:bg-gray-100">
                                <span className="text-3xl font-medium text-gray-500 uppercase">Pozo:</span>
                                <span className="text-5xl font-bold uppercase text-blue-900">{data.well}</span>
                             </div>
                          )}

                          {data.location && (
                             <div className="text-3xl font-bold uppercase text-gray-600 mt-2 tracking-wide">
                                {data.location}
                             </div>
                          )}
                       </div>

                       {data.additionalText && (
                          <div className="mt-8 text-2xl font-bold text-white bg-red-600 px-8 py-2 rounded-full shadow-lg print:shadow-none">
                             {data.additionalText}
                          </div>
                       )}
                   </div>

                   {/* Footer - Safety Icons */}
                   <div className="border-t-4 border-black pt-2 flex justify-between items-center">
                       <div className="flex gap-3 justify-start flex-1 flex-wrap">
                          {EPP_LIST.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                               <div className="w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center text-2xl mb-1 bg-blue-50 shadow-sm print:shadow-none">
                                  {item.icon}
                               </div>
                               <span className="text-[9px] font-black uppercase text-center leading-tight max-w-[60px]">{item.label}</span>
                            </div>
                          ))}
                       </div>
                       
                       <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-2xl font-black text-brand-red uppercase leading-none mb-1">USO OBLIGATORIO DE E.P.P.</div>
                          <div className="text-sm font-bold text-gray-500 uppercase leading-none">Prohibido el ingreso a toda persona</div>
                          <div className="text-sm font-bold text-gray-500 uppercase leading-none">ajena a la operación</div>
                       </div>
                   </div>
                </div>
             </div>
         </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-4xl mt-6 flex flex-col sm:flex-row justify-end gap-4 px-4 no-print">
         <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">Cancelar</Button>
         <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">🖨️ Imprimir Cartel</Button>
         <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`cartel_bienvenida_${data.date}`}
               orientation="l"
               label="Exportar PDF"
               className="w-full"
             />
         </div>
         <Button variant="primary" onClick={() => onSave(data)} className="w-full sm:w-auto order-first sm:order-last">Guardar</Button>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: white;
            }
            #print-area {
              margin: 0;
              width: 100vw;
              height: 100vh;
              border: none;
              transform: none;
              box-shadow: none;
            }
          }
        `}
      </style>
    </div>
  );
};
