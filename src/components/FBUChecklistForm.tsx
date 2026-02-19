
import React, { useState } from 'react';
import { FBUChecklistReport, FBUChecklistMetadata, FBUChecklistRow, FBUChecklistStatus, FBUObservation } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: FBUChecklistReport;
  onSave: (report: FBUChecklistReport) => void;
  onCancel: () => void;
}

// Sections updated with consecutive numbering
const LEFT_COLUMN = [
  {
    title: "1.- PLUG CATCHER",
    items: [
      "Valvulas y seguros",
      "Corrosion excesiva",
      "Bandeja ecologica",
      "Conexionado"
    ]
  },
  {
    title: "2.- CHOKE MANIFOLD",
    items: [
      "Valvulas y seguros",
      "Bandeja ecologica",
      "Corrosion excesiva",
      "Conexionado",
      "Lineas de venteo"
    ]
  },
  {
    title: "3.- SAND KNOCK OUT (DESARENADOR)",
    items: [
      "Escalera de acceso",
      "Pisadera",
      "Corrosion excesiva",
      "Valvulas y seguros",
      "Lineas de vida"
    ]
  },
  {
    title: "4.- BOMBA KAYAK",
    items: [
      "Arrestachispas en motor",
      "Paro de emergencias en motores de bombas",
      "Protecciones y guardacorreas en bombas",
      "Puesta a tierra",
      "Luces",
      "Estabilizadores",
      "Calzas",
      "Rueda de auxilio",
      "Neumaticos",
      "Enganche y cadena seguridad",
      "Tablero electrico"
    ]
  },
  {
    title: "5.- USINA/LABORATORIO",
    items: [
      "Arrestachispas de motor",
      "Pare de emergencia usina a distancia",
      "Tablero general y protección de comandos",
      "Cables conductores y distribución",
      "Luminarias",
      "Cajas de conexión y sellos",
      "Disyuntores diferenciales y protecciones térmicas",
      "Puesta a tierra",
      "Orden y Limpieza",
      "Carteleria de seguridad",
      "Luces de emergencia"
    ]
  },
  {
    title: "6.- TANQUE DE GAS OIL / AGUA",
    items: [
      "Perdidas",
      "Valvulas",
      "Bandejas ecologicas",
      "Conexionado electrico",
      "Puesta a tierra",
      "Orden y limpieza"
    ]
  },
  {
    title: "7.- TRAILERS",
    items: [
      "Estado general",
      "Instalaciones eléctricas",
      "Artefactos instalados",
      "Iluminación",
      "Sala de refrigerio/vestuario/oficina",
      "Luces de emergencia",
      "Puertas y ventanas",
      "Puesta a tierra",
      "Orden y limpieza"
    ]
  }
];

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
      "Arnes de Seguridad",
      "Colas de amarre",
      "Equipos Autonomos Rescate"
    ]
  },
  {
    title: "9.- PRIMEROS AUXILIOS",
    items: [
      "Botiquín",
      "Camilla",
      "Férulas neumoplásticas",
      "Equipos lavaojos",
      "Comunicación",
      "Cuello de Philadelphia"
    ]
  },
  {
    title: "10.- PREVENCION DE ACCIDENTES",
    items: [
      "Carteleria",
      "Ubicacion extintores y autonomos",
      "Puntos de reunion",
      "Roles de emergencia",
      "Orden y limpieza"
    ]
  },
  {
    title: "11.- PROTECCION CONTRA INCENDIO",
    items: [
      "Minimo 10 Extintores PQS",
      "Minimo 1 Extintor CO2",
      "Espumigenos en Piletas",
      "Detectores de humo"
    ]
  },
  {
    title: "12.- ILUMINACION AUTONOMA",
    items: [
      "Neumaticos",
      "Patas estabilizadoras",
      "Luminarias",
      "Enganche y cadenas",
      "Tablero electrico",
      "Puesta a tierra"
    ]
  },
  {
    title: "13.- CONTROL AMBIENTAL",
    items: [
      "Recipientes de residuos",
      "Mantas ecologicas",
      "Bandejas ecologicas"
    ]
  },
  {
    title: "14.- PILETAS",
    items: [
      "Luminarias",
      "Pernos y seguros",
      "Escalera de acceso",
      "Barandas",
      "Lineas del circuito",
      "Valvulas y conexiones",
      "Puesta a tierra",
      "Orden y limpieza"
    ]
  },
  {
    title: "15.- VARIOS",
    items: [
      "Libro de visitas",
      "Barrera de ingreso",
      "Ingreso a locacion",
      "Alarmas sonoras visibles",
      "Orden y limpieza",
      "Carteles de Ingreso a Locación",
      "Carteles Indicador de Camino"
    ]
  },
  {
    title: "16.- Cabina de control",
    items: [
      "Puesta a tierra",
      "Conexiones electricas",
      "Conexiones hidraulicas",
      "Luces de emergencia",
      "Bocina",
      "Luces",
      "Orden y limpieza",
      "Politicas y Roles"
    ]
  }
];

export const FBUChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<FBUChecklistMetadata>(initialData?.metadata || {
    company: '',
    fbuNumber: '',
    field: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    teamLeader: '',
    inspectedBy: '',
    operation: '',
    clientInspector: ''
  });

  // Helper to generate unique ID based on section and item name to prevent collisions
  const getUniqueId = (sectionTitle: string, itemName: string) => `${sectionTitle}_${itemName}`;

  const [rows, setRows] = useState<FBUChecklistRow[]>(() => {
    const allRows: FBUChecklistRow[] = [];
    [...LEFT_COLUMN, ...RIGHT_COLUMN].forEach(section => {
      section.items.forEach(item => {
        const uniqueId = getUniqueId(section.title, item);
        
        // 1. Try to find existing row by unique ID (New format)
        let existing = initialData?.rows.find(r => r.id === uniqueId);
        
        // 2. Backward compatibility: Try to find by item name (Old format) if specific match not found
        // This ensures old saved data is loaded, though it might apply to the first match found.
        if (!existing && initialData?.rows) {
             const genericMatch = initialData.rows.find(r => r.id === item);
             if (genericMatch) {
                 // Clone it with the new unique ID so it separates from others upon next save
                 existing = { ...genericMatch, id: uniqueId }; 
             }
        }

        allRows.push(existing || { id: uniqueId, status: null });
      });
    });
    return allRows;
  });

  const [observations, setObservations] = useState<FBUObservation[]>(initialData?.observations || [
     { id: '1', observation: '', responsible: '', compliance: '', date: '' },
     { id: '2', observation: '', responsible: '', compliance: '', date: '' },
     { id: '3', observation: '', responsible: '', compliance: '', date: '' }
  ]);

  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, status: FBUChecklistStatus) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, status: row.status === status ? null : status } : row));
  };

  const handleObservationChange = (id: string, field: keyof FBUObservation, value: string) => {
    setObservations(prev => prev.map(obs => obs.id === id ? { ...obs, [field]: value } : obs));
  };

  const addObservation = () => {
    setObservations(prev => [...prev, { id: crypto.randomUUID(), observation: '', responsible: '', compliance: '', date: '' }]);
  };

  const removeObservation = (id: string) => {
    if(observations.length > 1) {
        setObservations(prev => prev.filter(obs => obs.id !== id));
    }
  }

  const handleSignatureChange = (role: 'teamLeader' | 'safetyTech' | 'companyRepresentative', dataUrl: string | undefined) => {
    setSignatures(prev => {
      const next = { ...prev };
      if (dataUrl) {
        next[role] = { data: dataUrl, timestamp: new Date().toISOString() };
      } else {
        delete next[role];
      }
      return next;
    });
  };

  const renderSection = (section: { title: string, items: string[] }, idx: number) => (
    <div key={idx} className="mb-4 break-inside-avoid">
       <div className="font-bold text-sm bg-gray-100 border border-gray-400 p-1 mb-1 print:bg-gray-200 uppercase">
          {section.title}
       </div>
       {/* Header inside section */}
       <div className="flex text-xs font-bold border-b border-black mb-1">
          <div className="flex-1"></div>
          <div className="w-8 text-center">BIEN</div>
          <div className="w-8 text-center">MAL</div>
          <div className="w-8 text-center">N/C</div>
       </div>
       {section.items.map(item => {
          const uniqueId = getUniqueId(section.title, item);
          const row = rows.find(r => r.id === uniqueId) || { id: uniqueId, status: null };
          
          return (
             <div key={uniqueId} className="flex border-b border-gray-200 text-xs items-center hover:bg-gray-50 min-h-[32px] sm:min-h-[24px]">
                <div className="flex-1 p-1 pr-2 leading-tight">{item}</div>
                
                {/* BIEN */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'BIEN' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(uniqueId, 'BIEN')}
                >
                   {row.status === 'BIEN' && 'X'}
                </div>
                {/* MAL */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'MAL' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(uniqueId, 'MAL')}
                >
                   {row.status === 'MAL' && 'X'}
                </div>
                {/* N/C */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'NC' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(uniqueId, 'NC')}
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
          <h1 className="font-black text-2xl uppercase leading-tight">Check List FBU</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWFB01-A1-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1">
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-28">Compañía:</span>
               <input name="company" value={metadata.company} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">N° FBU:</span>
               <input name="fbuNumber" value={metadata.fbuNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
               <span className="font-bold w-24 pl-2">Yacimiento:</span>
               <input name="field" value={metadata.field} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-28">Locación:</span>
               <input name="location" value={metadata.location} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">Fecha:</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-28">Jefe de Equipo:</span>
               <input name="teamLeader" value={metadata.teamLeader} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
             <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-32">Inspeccionado por:</span>
               <input name="inspectedBy" value={metadata.inspectedBy} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-28">Operación:</span>
               <input name="operation" value={metadata.operation} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-32">Inspector Cliente:</span>
               <input name="clientInspector" value={metadata.clientInspector} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
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

      {/* Observations Table */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
         <div className="font-bold text-xs mb-1">NOTA: El presente Check List debe realizarse cada vez que se realice una Operación de Flow Back</div>
         <div className="font-bold text-sm mb-2">Detallar todas las Observaciones detectadas en el Chek list del Equipo, adoptando medidas correctivas y preventivas.</div>
         
         {/* Desktop Table */}
         <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse border border-black text-xs">
                <thead>
                   <tr className="bg-gray-100 print:bg-gray-200 text-center font-bold">
                      <th className="border border-black p-1 w-1/2">OBSERVACIONES RELEVANTES</th>
                      <th className="border border-black p-1">RESPONSABLE DE ACCION</th>
                      <th className="border border-black p-1 w-24">CUMPLIMIENTO</th>
                      <th className="border border-black p-1 w-24">FECHA</th>
                      <th className="border border-black p-1 w-8 no-print"></th>
                   </tr>
                </thead>
                <tbody>
                   {observations.map((obs) => (
                      <tr key={obs.id}>
                         <td className="border border-black p-0 h-8">
                            <input className="w-full h-full p-1 outline-none bg-transparent" value={obs.observation} onChange={(e) => handleObservationChange(obs.id, 'observation', e.target.value)} />
                         </td>
                         <td className="border border-black p-0">
                            <input className="w-full h-full p-1 outline-none bg-transparent" value={obs.responsible} onChange={(e) => handleObservationChange(obs.id, 'responsible', e.target.value)} />
                         </td>
                         <td className="border border-black p-0">
                            <input className="w-full h-full p-1 outline-none bg-transparent text-center" value={obs.compliance} onChange={(e) => handleObservationChange(obs.id, 'compliance', e.target.value)} />
                         </td>
                         <td className="border border-black p-0">
                            <input type="date" className="w-full h-full p-1 outline-none bg-transparent text-center" value={obs.date} onChange={(e) => handleObservationChange(obs.id, 'date', e.target.value)} />
                         </td>
                         <td className="border border-black p-0 text-center no-print">
                            <button onClick={() => removeObservation(obs.id)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                         </td>
                      </tr>
                   ))}
                </tbody>
            </table>
         </div>

         {/* Mobile Stacked Observations */}
         <div className="sm:hidden space-y-4">
            {observations.map((obs, i) => (
               <div key={obs.id} className="border border-gray-300 rounded p-3 bg-gray-50 relative">
                  <div className="absolute top-2 right-2 no-print">
                     <button onClick={() => removeObservation(obs.id)} className="text-red-500 font-bold p-1">×</button>
                  </div>
                  <div className="mb-2">
                     <label className="block text-xs font-bold text-gray-500 mb-1">OBSERVACIÓN:</label>
                     <textarea 
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white" 
                        rows={2}
                        value={obs.observation} 
                        onChange={(e) => handleObservationChange(obs.id, 'observation', e.target.value)} 
                     />
                  </div>
                  <div className="mb-2">
                     <label className="block text-xs font-bold text-gray-500 mb-1">RESPONSABLE:</label>
                     <input 
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white" 
                        value={obs.responsible} 
                        onChange={(e) => handleObservationChange(obs.id, 'responsible', e.target.value)} 
                     />
                  </div>
                  <div className="flex gap-2">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">CUMPLIMIENTO:</label>
                        <input 
                           className="w-full border border-gray-300 rounded p-2 text-sm bg-white" 
                           value={obs.compliance} 
                           onChange={(e) => handleObservationChange(obs.id, 'compliance', e.target.value)} 
                        />
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">FECHA:</label>
                        <input 
                           type="date"
                           className="w-full border border-gray-300 rounded p-2 text-sm bg-white" 
                           value={obs.date} 
                           onChange={(e) => handleObservationChange(obs.id, 'date', e.target.value)} 
                        />
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <div className="mt-2 no-print text-center sm:text-left">
            <button onClick={addObservation} className="text-xs text-brand-red font-bold hover:underline py-2 px-4 border border-brand-red rounded">+ Agregar Observación</button>
         </div>
      </div>

      {/* Footer Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 page-break-inside-avoid">
         <div className="text-center">
             <div className="border-b border-black border-dashed mb-1">
                <SignaturePad 
                   label=""
                   value={signatures.teamLeader?.data}
                   onChange={(val) => handleSignatureChange('teamLeader', val)}
                />
             </div>
             <div className="text-xs font-bold mt-1">Jefe de Equipo</div>
         </div>
         <div className="text-center">
             <div className="border-b border-black border-dashed mb-1">
                <SignaturePad 
                   label=""
                   value={signatures.safetyTech?.data}
                   onChange={(val) => handleSignatureChange('safetyTech', val)}
                />
             </div>
             <div className="text-xs font-bold mt-1">Técnico en Seguriad</div>
         </div>
         <div className="text-center">
             <div className="border-b border-black border-dashed mb-1">
                <SignaturePad 
                   label=""
                   value={signatures.companyRepresentative?.data}
                   onChange={(val) => handleSignatureChange('companyRepresentative', val)}
                />
             </div>
             <div className="text-xs font-bold mt-1">Company Representative</div>
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
               filename={`checklist_fbu_${metadata.date}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              observations,
              signatures
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
