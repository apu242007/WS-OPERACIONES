
import React, { useState } from 'react';
import { PullingChecklistReport, PullingChecklistMetadata, PullingChecklistRow, PullingChecklistStatus } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: PullingChecklistReport;
  onSave: (report: PullingChecklistReport) => void;
  onCancel: () => void;
}

// Column 1 Data
const LEFT_COLUMN = [
  {
    title: "1.- PLATAFORMA DE TRABAJO",
    items: [
      "Escalera de acceso",
      "Barandas de Seguridad",
      "Cable de retención de llave hidráulica",
      "Retención rígida de llave hidráulica"
    ]
  },
  {
    title: "2.- MASTIL DE EQUIPO",
    items: [
      "Escalera de acceso",
      "Limitador de carrera de aparejo",
      "Guia cable de coronas",
      "Barandas y resalte corona",
      "Cadena de peines del puente",
      "Iluminación e instalación electrica",
      "Puesta a tierra centralizada en b.p."
    ]
  },
  {
    title: "3.- MOTOR CUADRO DE MANIOBRAS",
    items: [
      "Arrestachispas caño escape motor",
      "Paros emergencia motor",
      "Protector tambor principal",
      "Instalación eléctrica y puesta a tierra en b.p."
    ]
  },
  {
    title: "4.- BOCA DE POZO",
    items: [
      "BOP para varillas de bombeo",
      "Cierre hidráulico BOP",
      "Cierre mecánico o manual BOP",
      "Vástago y volante accionamiento manual BOP",
      "Válvulas laterales y de maniobras",
      "Líneas y conexiones de alta presión",
      "*** Se exigirá la existencia del dispositivo obturador para pruebas de BOP"
    ]
  },
  {
    title: "5.- BOMBAS Y PILETAS",
    items: [
      "Arrestachispas en motor",
      "Paro de emergencias en motores de bombas",
      "Protecciones y guardacorreas en bombas",
      "Puesta a tierra de bombas y piletas"
    ]
  },
  {
    title: "6.- USINAS E INSTALACIÓN ELÉCTRICA",
    items: [
      "Arrestachispas de motor",
      "Pare de emergencia usina a distancia",
      "Tablero general y protección de comandos",
      "Cables conductores y distribución",
      "Reflectores y vidrios especiales",
      "Cajas de conexión y sellos",
      "Disyuntores diferenciales y protecciones térmicas",
      "Puesta a tierra centralizada en b.p."
    ]
  },
  {
    title: "7.- PREVENCIÓN DE INCENDIOS",
    items: [
      "Mínimo 1 extintor de 100 kg. P.Q.S.",
      "Mínimo 6 extintores de 10 kg P.Q.S.",
      "Mínimo 1 extintor de 05 kg CO2"
    ]
  },
  {
    title: "13.- PTA. MOTRIZ - CUADRO DE MANIOBRAS",
    items: [
      "Dispositivo guía cable tambor pistoneo",
      "Pernos, chavetas y regulación de frenos",
      "Freno de tambor principal",
      "Estado de malacate hidráulico"
    ]
  }
];

// Column 2 Data
const RIGHT_COLUMN = [
  {
    title: "8.- PROTECCIÓN PERSONAL",
    items: [
      "Cascos",
      "Botines de seguridad",
      "Guantes de cuero",
      "Guantes de P.V.C.",
      "Indumentaria general",
      "Protección ocular",
      "Protección auditiva",
      "Protección respiratoria",
      "Cinto de seguridad enganchador",
      "Cabos o colas de amarre",
      "Equipo deslizador",
      "Equipo salvacaidas",
      "Cinturon inercial"
    ]
  },
  {
    title: "9.- PRIMEROS AUXILIOS",
    items: [
      "Botiquín",
      "Camilla",
      "Férulas neumoplásticas",
      "Equipo lavaojos",
      "Comunicación",
      "Suero antiofídico (Decadrón inyectable)"
    ]
  },
  {
    title: "10.- MÁSTIL DE EQUIPO",
    items: [
      "Estado de la corona y protectores",
      "Piso de enganche",
      "Peines del piso de enganche",
      "Estado de los tensores y grampas",
      "Pernos pasantes y seguros",
      "Seguros de tramos",
      "Contravientos, grampas y pernos",
      "Indicadores de contravientos (chapas-valizas)",
      "Criques mecánicos e hidráulicos de nivel."
    ]
  },
  {
    title: "11.- APAREJO Y ACCESORIOS",
    items: [
      "Estado del aparejo",
      "Cable del aparejo",
      "Punto muerto cable del aparejo",
      "Indicadores de peso",
      "Economizador de pistoneo (hid. o mec.)",
      "Elevador de caños",
      "Elevador de varillas"
    ]
  },
  {
    title: "12.- USINA E INSTALACIÓN ELECTRICA",
    items: [
      "Estado general de la usina",
      "Distancia de la boca de pozo",
      "Aislación térmica de escape",
      "Luces transporte de usina",
      "Cadena de seguridad arrastre de transporte",
      "Toma corriente e interruptores",
      "Luces de Emergencia"
    ]
  },
  {
    title: "18.- BOCA DE POZO",
    items: [
      "Amarre de B.O.P.",
      "Acceso y limpieza de boca de pozo",
      "Estado de mangueras hidráulicas"
    ]
  }
];

export const PullingChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<PullingChecklistMetadata>(initialData?.metadata || {
    company: '',
    equipmentNumber: '',
    field: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    equipmentResponsible: '',
    inspectedBy: '',
    operation: ''
  });

  const getInitialRow = (itemId: string): PullingChecklistRow => {
    return initialData?.rows.find(r => r.id === itemId) || { id: itemId, status: null };
  };

  const [rows, setRows] = useState<PullingChecklistRow[]>(() => {
    const allRows: PullingChecklistRow[] = [];
    [...LEFT_COLUMN, ...RIGHT_COLUMN].forEach(section => {
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

  const handleRowChange = (id: string, status: PullingChecklistStatus) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, status: row.status === status ? null : status } : row));
  };

  const getRowData = (id: string) => rows.find(r => r.id === id) || { id, status: null };

  const renderSection = (section: { title: string, items: string[] }, idx: number) => (
    <div key={idx} className="mb-4 break-inside-avoid">
       <div className="font-bold text-sm bg-gray-100 border border-gray-400 p-1 mb-1 print:bg-gray-200">
          {section.title}
       </div>
       {/* Header for BIEN/MAL/NC inside section */}
       <div className="flex text-xs font-bold border-b border-black mb-1">
          <div className="flex-1"></div>
          <div className="w-8 text-center">BIEN</div>
          <div className="w-8 text-center">MAL</div>
          <div className="w-8 text-center">N/C</div>
       </div>
       {section.items.map(item => {
          const row = getRowData(item);
          return (
             <div key={item} className="flex border-b border-gray-200 text-xs items-center hover:bg-gray-50 min-h-[32px] sm:min-h-[24px]">
                <div className="flex-1 p-1 pr-2 leading-tight">{item}</div>
                
                {/* BIEN */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'BIEN' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(item, 'BIEN')}
                >
                   {row.status === 'BIEN' && 'X'}
                </div>
                {/* MAL */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'MAL' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(item, 'MAL')}
                >
                   {row.status === 'MAL' && 'X'}
                </div>
                {/* NC */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'NC' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(item, 'NC')}
                >
                   {row.status === 'NC' && 'X'}
                </div>
             </div>
          );
       })}
    </div>
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
          <h1 className="font-black text-xl uppercase leading-tight">CHECK LIST EQUIPO DE PULLING</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWPU001-A1-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">COMPAÑÍA:</span>
               <input name="company" value={metadata.company} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">Nº EQUIPO:</span>
               <select name="equipmentNumber" value={metadata.equipmentNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent">
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
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">YACIMIENTO:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">LOCACIÓN:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">FECHA:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="hidden md:block"></div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-36">RESP. DEL EQUIPO:</span>
               <input name="equipmentResponsible" value={metadata.equipmentResponsible} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
             <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">INSPECC POR:</span>
               <input name="inspectedBy" value={metadata.inspectedBy} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="hidden md:block"></div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5 col-span-1 sm:col-span-2">
               <span className="font-bold w-24">OPERACIÓN:</span>
               <input name="operation" value={metadata.operation} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Main Checklist Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
         {/* Left Column */}
         <div className="space-y-2">
             {LEFT_COLUMN.map((section, idx) => renderSection(section, idx))}
         </div>
         
         {/* Right Column */}
         <div className="space-y-2">
             {RIGHT_COLUMN.map((section, idx) => renderSection(section, idx))}
         </div>
      </div>

      {/* Footer Signature */}
      <div className="p-8 page-break-inside-avoid flex justify-center">
         <div className="text-center w-64">
             <div className="border-b border-black border-dashed mb-1">
                <SignaturePad 
                   label=""
                   value={signature?.data}
                   onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                />
             </div>
             <div className="text-xs mt-1">Firma del Inspector / Supervisor</div>
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
               filename={`check_pulling_${metadata.date}`}
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
