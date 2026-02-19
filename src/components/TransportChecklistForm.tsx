
import React, { useState } from 'react';
import { TransportChecklistReport, TransportChecklistMetadata, TransportChecklistRow, TransportChecklistStatus } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: TransportChecklistReport;
  onSave: (report: TransportChecklistReport) => void;
  onCancel: () => void;
}

// Definition of sections and items based on the image
const SECTIONS = [
  {
    title: "Verificar elementos de seguridad y herramientas.",
    items: [
      "Matafuegos cargados",
      "Botiquín de primeros auxilios",
      "Balizas",
      "Cinturón de seguridad",
      "Barra de remolque",
      "Gato para cambiar cubierta",
      "Cubierta de auxilio",
      "Triángulos reflectantes de estacionamiento.",
      "Cadenas (zonas de hielo)",
      "Pala"
    ]
  },
  {
    title: "Verificar sistema de transmisión",
    items: [
      "Cardan y crucetas.",
      "Caja de velocidades."
    ]
  },
  {
    title: "Verificar sistema eléctrico.",
    items: [
      "Baterías y su ajuste.",
      "Alternador. Revisar su correa.",
      "Revisar y calibrar luces altas y bajas.",
      "Luz de posición traseras y delanteras.",
      "Luz de freno.",
      "Luces de giro.",
      "Baliza rotativa.",
      "Luz de cabina.",
      "Luz de retroceso.",
      "Alarma sonora de retroceso."
    ]
  },
  {
    title: "Verificar Sistema de Frenos",
    items: [
      "Tanque de aire y circuito. Verificar correas.",
      "Funcionamiento válvula de regulación del sistema neumático",
      "Funcionamiento de freno.",
      "Funcionamiento de freno de estacionamiento.",
      "Pulmones."
    ]
  },
  {
    title: "Verificar estado de Cabina y sus elementos",
    items: [
      "Limpieza Vidrios",
      "Limpieza y posiciones Espejos retrovisores",
      "Posición Asiento y su cinturón de seguridad.",
      "Funcionamiento del limpia parabrisas.",
      "Funcionamiento de climatizador.",
      "Funcionamiento de indicadores en tablero.(Presión de aceite, Amperímetro, Temperatura del agua)",
      "Funcionamiento de desempañador.",
      "Funcionamiento de bocina.",
      "Recorrido pedal de embrague",
      "Pedales de freno y acelerado",
      "Freno de mano",
      "Limpieza del interior de cabina",
      "Ajuste de puertas y ventas",
      "Hermeticidad de cabina.",
      "Calcomanías de advertencia uso cinturón de seguridad",
      "Accionamiento de dirección.",
      "Pantalla contra sol.",
      "Luz de tablero."
    ]
  },
  {
    title: "Ruedas",
    items: [
      "Estado de cubiertas. (incluido auxilio)",
      "Presión de aire. (incluido auxilio)",
      "Reapretar ruedas."
    ]
  },
  {
    title: "Documentación",
    items: [
      "Autorización para circular.",
      "Vigencia de revisión técnica",
      "Vigencia carnet de conductor y categoría",
      "Vigencia de seguro.",
      "Curso de manejo defensivo del conductor.",
      "Patente al día."
    ]
  },
  {
    title: "Motor",
    items: [
      "Combustible. Volúmenes y tapas de tanques.",
      "Radiador y liquido refrigerante.",
      "Correas de ventilador.",
      "Circuito de lubricación y volúmenes.",
      "Filtros de aire, aceite y combustible.",
      "Sistema de escape.",
      "Accionamiento de embrague.",
      "Sistema de arranque.",
      "Sistema hidráulico."
    ]
  },
  {
    title: "Parte inferior del equipo",
    items: [
      "Existencia de elementos sueltos.",
      "Manifestaciones de fugas o perdidas de fluidos",
      "Ajuste de tuercas de apoyo de patas hidráulicas."
    ]
  },
  {
    title: "Parte exterior del Equipo",
    items: [
      "Elementos que obstruyan el radiador.",
      "Elementos sueltos o que puedan desprenderse durante maniobras o traslado.",
      "Chapa patente."
    ]
  },
  {
    title: "Suspensión y dirección",
    items: [
      "Caja y extremos de dirección.",
      "Amortiguadores.",
      "Elásticos."
    ]
  }
];

export const TransportChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<TransportChecklistMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    equipment: '',
    well: ''
  });

  // Helper to find a row for a given item, or create default
  const getInitialRow = (itemId: string): TransportChecklistRow => {
    return initialData?.rows.find(r => r.id === itemId) || { id: itemId, status: null, observations: '' };
  };

  // Flatten structure to initialize state
  const [rows, setRows] = useState<TransportChecklistRow[]>(() => {
    const allRows: TransportChecklistRow[] = [];
    SECTIONS.forEach(section => {
      section.items.forEach(item => {
        allRows.push(getInitialRow(item));
      });
    });
    return allRows;
  });

  const [signature, setSignature] = useState(initialData?.signature);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof TransportChecklistRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const getRowData = (id: string) => rows.find(r => r.id === id) || { id, status: null, observations: '' };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg md:text-xl uppercase leading-tight">CHECK LIST DE EQUIPO</h1>
          <h2 className="font-bold text-base md:text-xl uppercase leading-tight">AUTOTRANSPORTABLE</h2>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWWO001-A1-2</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex border-b border-gray-300 pb-1 items-end">
                <span className="font-bold w-16 italic">Fecha:</span>
                <input 
                  type="date"
                  name="date"
                  value={metadata.date}
                  onChange={handleMetadataChange}
                  className="flex-1 outline-none bg-transparent"
                />
            </div>
            <div className="flex border-b border-gray-300 pb-1 items-end">
                <span className="font-bold w-16 italic">Equipo:</span>
                <select name="equipment" value={metadata.equipment} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent">
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
            <div className="flex border-b border-gray-300 pb-1 items-end">
                <span className="font-bold w-16 italic">Pozo:</span>
                <input 
                  name="well"
                  value={metadata.well}
                  onChange={handleMetadataChange}
                  className="flex-1 outline-none bg-transparent"
                />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="w-full">
         {/* Table Header */}
         <div className="hidden sm:grid grid-cols-12 border-b-2 border-black bg-white font-bold text-sm text-center">
            <div className="col-span-6 border-r border-black p-2">DESCRIPCIÓN</div>
            <div className="col-span-1 border-r border-black p-2">BIEN</div>
            <div className="col-span-1 border-r border-black p-2">MAL</div>
            <div className="col-span-4 p-2">OBSERVACIONES</div>
         </div>

         {/* Sections & Rows */}
         {SECTIONS.map((section, idx) => (
            <React.Fragment key={idx}>
               {/* Section Header Row */}
               <div className="sm:grid sm:grid-cols-12 border-b border-black text-sm font-bold bg-gray-100 print:bg-gray-200">
                  <div className="col-span-6 border-r border-black p-2 sm:p-1 sm:pl-2 uppercase sm:normal-case">{section.title}</div>
                  <div className="hidden sm:block col-span-1 border-r border-black"></div>
                  <div className="hidden sm:block col-span-1 border-r border-black"></div>
                  <div className="hidden sm:block col-span-4"></div>
               </div>
               
               {/* Items */}
               {section.items.map(item => {
                 const row = getRowData(item);
                 return (
                   <div key={item} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-sm hover:bg-gray-50 group">
                      <div className="col-span-6 sm:border-r border-black p-2 sm:p-1 sm:pl-4 flex items-center font-medium sm:font-normal bg-gray-50 sm:bg-transparent">
                         {item}
                      </div>
                      
                      {/* Mobile Row for Checks */}
                      <div className="flex sm:contents border-t sm:border-t-0 border-gray-200">
                          {/* BIEN Checkbox */}
                          <div 
                            className="flex-1 sm:col-span-1 border-r border-black p-2 sm:p-0 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleRowChange(item, 'status', row.status === 'BIEN' ? null : 'BIEN')}
                          >
                             <div className="flex items-center gap-2 sm:block">
                                <span className="sm:hidden text-xs font-bold text-gray-500">BIEN</span>
                                <div className={`w-6 h-6 flex items-center justify-center border rounded sm:border-0 ${row.status === 'BIEN' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                                   {row.status === 'BIEN' && 'X'}
                                </div>
                             </div>
                          </div>

                          {/* MAL Checkbox */}
                          <div 
                            className="flex-1 sm:col-span-1 sm:border-r border-black p-2 sm:p-0 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleRowChange(item, 'status', row.status === 'MAL' ? null : 'MAL')}
                          >
                             <div className="flex items-center gap-2 sm:block">
                                <span className="sm:hidden text-xs font-bold text-gray-500">MAL</span>
                                <div className={`w-6 h-6 flex items-center justify-center border rounded sm:border-0 ${row.status === 'MAL' ? 'bg-black text-white sm:text-black sm:bg-transparent font-bold' : ''}`}>
                                   {row.status === 'MAL' && 'X'}
                                </div>
                             </div>
                          </div>
                      </div>

                      {/* Observations */}
                      <div className="col-span-4 p-0 border-t sm:border-t-0 border-gray-200">
                         <input 
                           className="w-full h-full min-h-[32px] p-2 sm:p-1 sm:pl-2 outline-none bg-transparent placeholder-gray-400"
                           value={row.observations}
                           onChange={(e) => handleRowChange(item, 'observations', e.target.value)}
                           placeholder="Observaciones..."
                         />
                      </div>
                   </div>
                 );
               })}
            </React.Fragment>
         ))}
      </div>

      {/* Footer */}
      <div className="p-8 mt-4 page-break flex justify-center">
         <div className="text-center w-64">
             <div className="border-b border-black border-dashed mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label=""
                   className="h-full w-full border-0"
                   value={signature?.data}
                   onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                />
             </div>
             <div className="flex justify-between text-xs mt-1">
                 <span>Elabora:</span>
                 <span>Firma y Aclaración</span>
             </div>
         </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`checklist_transporte_${metadata.date}_${metadata.equipment || 'eq'}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              signature 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
