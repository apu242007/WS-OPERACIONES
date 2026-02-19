
import React, { useState, useEffect } from 'react';
import { WasteSignData, WasteType } from '../types';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: WasteSignData;
  onSave: (data: WasteSignData) => void;
  onCancel: () => void;
}

const DEFAULTS: Record<WasteType, { title: string, items: string[], colorClass: string, textClass: string }> = {
  'AMARILLO': {
    title: 'PLÁSTICOS',
    colorClass: 'bg-yellow-400 border-yellow-400',
    textClass: 'text-yellow-400',
    items: [
      "Envases en General",
      "Bidones, envases pet",
      "Bolsas de polietileno",
      "Envases de alimentos",
      "Cascos, anteojos de seguridad",
      "Sogas plásticas",
      "Botellas limpias",
      "Plásticos libre de hidrocarburos"
    ]
  },
  'AZUL': {
    title: 'METÁLICOS',
    colorClass: 'bg-blue-600 border-blue-600',
    textClass: 'text-blue-600',
    items: [
      "Trozos de caños",
      "Cables de acero",
      "Alambres",
      "Virutas de metales",
      "Electrodos",
      "Recortes de chapa",
      "Latas en gral.",
      "Zunchos",
      "Repuestos vehículos",
      "Válvulas",
      "Cadenas transmisión",
      "Bulones",
      "Transmisores",
      "Manómetros",
      "Sensores"
    ]
  },
  'ROJO': {
    title: 'CONDICIONADOS / PELIGROSOS',
    colorClass: 'bg-red-600 border-red-600',
    textClass: 'text-red-600',
    items: [
      "Envases c/ resto HC",
      "Restos de muestras",
      "Pinceles",
      "Troz. caños pvc/erfv",
      "Pz industr Automotriz",
      "Guantes cuero y pvc c/ resto de HC",
      "Revest. de cañerias",
      "Botines c/resto de HC",
      "Máscaras / filtros",
      "Delantales de cuero, trapos c/resto de HC",
      "Gomas, Correas en gral.",
      "Mangeras en gral.",
      "Cámaras cubiertas",
      "Pilas, baterías",
      "Cartucho Tinta/Toner"
    ]
  },
  'VERDE': {
    title: 'BIODEGRADABLES / DOMÉSTICOS',
    colorClass: 'bg-green-600 border-green-600',
    textClass: 'text-green-600',
    items: [
      "Restos alimentos",
      "Papel",
      "Cartón",
      "Maderas",
      "Bolsas de papel",
      "Trapos sin H.C.",
      "Envases grales.",
      "Bidones",
      "Envases pet",
      "Bolsas de polietileno",
      "Envases alimentos",
      "Anteojos seguridad",
      "Sogas plásticas",
      "Botellas limpias",
      "Otros vidrios"
    ]
  }
};

export const WasteClassificationSignForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [data, setData] = useState<WasteSignData>(initialData || {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    company: '',
    location: '',
    type: 'AMARILLO',
    customItems: undefined
  });

  const [itemsText, setItemsText] = useState('');

  // Initial load of items text
  useEffect(() => {
    const list = data.customItems || DEFAULTS[data.type].items;
    setItemsText(list.join('\n'));
  }, [data.type, data.customItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
       // Reset custom items when changing type to load defaults
       setData(prev => ({ ...prev, [name]: value as WasteType, customItems: undefined }));
    } else {
       setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItemsText(e.target.value);
    const newItems = e.target.value.split('\n').filter(line => line.trim() !== '');
    setData(prev => ({ ...prev, customItems: newItems }));
  };

  const config = DEFAULTS[data.type];

  return (
    <div className="flex flex-col items-center w-full font-sans">
      
      {/* Editor Controls (Screen Only) */}
      <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 no-print">
         <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>♻️</span> Generador de Cartelería: Clasificación de Residuos
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Color / Tipo</label>
                  <select name="type" aria-label="Color / Tipo" value={data.type} onChange={handleChange} className="w-full p-2 border rounded font-bold">
                     <option value="AMARILLO">Amarillo (Plásticos)</option>
                     <option value="AZUL">Azul (Metálicos)</option>
                     <option value="ROJO">Rojo (Peligrosos)</option>
                     <option value="VERDE">Verde (Biodegradables)</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Empresa</label>
                  <input name="company" value={data.company} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ej: TACKER SOLUTIONS" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ubicación</label>
                  <input name="location" value={data.location} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ej: LOMA CAMPANA" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="block text-xs font-bold uppercase text-gray-500">Items (Editable)</label>
               <textarea 
                  value={itemsText} 
                  onChange={handleItemsChange} 
                  className="w-full h-40 p-2 border rounded text-sm font-mono" 
                  placeholder="Lista de items..."
               />
               <p className="text-xs text-gray-400">Edite las líneas para personalizar el cartel.</p>
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
             <div className="min-w-[600px] transform origin-top-left">
                {/* The Sign (Print Area) */}
                <div id="print-area" className={`bg-white border-[8px] ${config.colorClass} p-8 w-[210mm] h-[297mm] flex flex-col shadow-2xl relative overflow-hidden mx-auto`}>
                   
                   {/* Top Bar */}
                   <div className="flex justify-between items-start border-b-4 border-gray-800 pb-4 mb-6">
                      <div className="text-3xl font-black uppercase tracking-tighter text-gray-800">
                         {data.company || 'EMPRESA'}
                      </div>
                      <div className="text-right">
                         <div className="text-lg font-bold text-gray-500">CLASIFICACIÓN DE RESIDUOS</div>
                         <div className="text-xs font-bold text-gray-400">{data.location}</div>
                      </div>
                   </div>

                   {/* Main Header */}
                   <div className={`${config.colorClass} text-white text-center py-6 mb-8`}>
                       <h1 className="text-6xl font-black uppercase tracking-wider drop-shadow-md">{config.title}</h1>
                   </div>

                   {/* Items List */}
                   <div className="flex-1 px-8">
                       <ul className="space-y-3">
                          {itemsText.split('\n').filter(line => line.trim() !== '').map((item, idx) => (
                             <li key={idx} className="flex items-start text-3xl font-bold text-gray-800 border-b border-gray-200 pb-1">
                                <span className={`mr-4 ${config.textClass}`}>•</span>
                                <span className="uppercase leading-tight">{item}</span>
                             </li>
                          ))}
                       </ul>
                   </div>

                   {/* Footer */}
                   <div className="mt-auto pt-4 border-t-4 border-gray-800 flex justify-between items-end">
                       <div className="text-xs font-bold text-gray-400">
                          POSGI003-A2-0
                       </div>
                       <div className={`text-4xl font-black ${config.textClass} opacity-20`}>
                          {data.type}
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
               elementId="print-area"
               filename={`cartel_residuos_${data.type}`}
               orientation="p"
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
              size: portrait;
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
              border: 16px solid;
              transform: none;
              box-shadow: none;
            }
            .bg-yellow-400 { border-color: #facc15 !important; }
            .bg-blue-600 { border-color: #2563eb !important; }
            .bg-red-600 { border-color: #dc2626 !important; }
            .bg-green-600 { border-color: #16a34a !important; }
          }
        `}
      </style>
    </div>
  );
};
