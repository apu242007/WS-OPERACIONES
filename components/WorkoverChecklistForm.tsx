
import React, { useState } from 'react';
import { WorkoverChecklistReport, WorkoverChecklistMetadata, WorkoverChecklistRow, WorkoverChecklistStatus, WorkoverObservation } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: WorkoverChecklistReport;
  onSave: (report: WorkoverChecklistReport) => void;
  onCancel: () => void;
}

// Definition of columns and sections
const LEFT_COLUMN = [
  {
    title: "GENERAL",
    items: [
      "a. Distancia de la Línea de Potencia",
      "b. Señales de Peligro desplegadas",
      "c. Conjunto de Primeros Auxilios",
      "d. Señalización de los Contravientos",
      "e. Zona para descenso de la torre despejada",
      "f. Vehículo fuera de la zona de Contravientos",
      "g. Limpieza general",
      "h. Cañería sobre caballetes",
      "i. Riesgo de fuego controlados"
    ]
  },
  {
    title: "CONTRAVIENTOS",
    items: [
      "I. Contravientos desde la corona",
      "a. Número de contravientos",
      "b. Condiciones de los contravientos",
      "c. Diámetro de los contravientos",
      "d. Tres grampas como mínimo",
      "e. Anclajes a tierra",
      "II. Contravientos del Piso de Enganche",
      "a. Estirado y cruzado para el piso",
      "b. Tres grampas mínimo",
      "III. Contravientos internos para tensión"
    ]
  },
  {
    title: "FUNDACIÓN",
    items: [
      "A. Suplemento para apoyo adecuado provisto"
    ]
  },
  {
    title: "HERRAMIENTAS DE MANO",
    items: [
      "a. Condición",
      "b. Limpieza",
      "c. Almacenamiento"
    ]
  },
  {
    title: "MASTIL - TORRE",
    items: [
      "a. Especificaciones del fabricante placa de operación",
      "b. Daños y corrosión excesiva",
      "c. Escalera",
      "d. Pasillo de piso de enganche",
      "e. Canasta de Varillas",
      "f. Corona",
      "g. Mecanismo de izaje del equipo",
      "h. Inspección visual de pasadores",
      "i. Brazos estabilizadores",
      "j. Protectores de poleas de la corona",
      "k. Cables de seguridad de los dientes del peine",
      "L. Fisuras o fallas de metal en puntos de articulación",
      "m. Pasadores de seguro de la torre en su lugar",
      "n. Los puntos de articulación tiene seguros",
      "o. Sistema hidráulico de la torre",
      "p. Sistema de iluminación",
      "q. Purgado de aire del sistema hidráulico cilindro izador"
    ]
  }
];

const RIGHT_COLUMN = [
  {
    title: "VEHÍCULOS",
    items: [
      "a. Vidrios, espejos",
      "b. Neumáticos, luces y realce",
      "c. Mantenimiento de cabina",
      "d. Casilla de personal",
      "1. Mantenimiento y Limpieza",
      "2. Condiciones de la estufa",
      "3. Instalación eléctrica, luces",
      "4. Enganche y cadena de seguridad",
      "5. Aseguramiento para Izaje con petrolero",
      "e. Vestuario, Baños, Cocina, Oficina"
    ]
  },
  {
    title: "CAMIÓN DE TRANSPORTE",
    items: [
      "a. Barandas en elevaciones y escalones aseguradas correctamente",
      "b. Luces delanteras y traseras",
      "c. Ruedas acuñadas",
      "d. Condición de llantas y neumáticos",
      "e. Tanque de combustible rotulado",
      "f. Pérdida de combustible",
      "g. No debe haber materiales sueltos e inflamables en la cabina",
      "h. Vidrios y espejo",
      "i. Limpiaparabrisas",
      "j. Equipamiento de emergencia",
      "k. Gatos hidráulicos de elevación asegurados por mecanismos de contratuercas"
    ]
  },
  {
    title: "CONDICIÓN DE TRABAJO",
    items: [
      "a. Protectores",
      "b. Líneas de tubing y stand pipe",
      "c. Cable de pistoneo",
      "d. Suficientes vueltas de cable de tambor cuando el aparejo se encuentra abajo",
      "e. Anclaje de línea muerta y retenedor",
      "f. Sistema de Frenado",
      "g. Superficie de fricción del carretel de maniobra",
      "h. Separador de línea de carretel abrazadera",
      "i. Cable de maniobra",
      "j. Frenos / Pare de Emergencia",
      "k. Traba de caja tractora para camino",
      "l. Manipulación del guinche. Señalización"
    ]
  },
  {
    title: "ESTACIÓN DE OPERACIÓN / PLATAFORMA DE TRABAJO / PISO",
    items: [
      "a. Todos los controles rotulados",
      "b. Piso de trabajo",
      "c. Escalones y barandas"
    ]
  }
];

const LOWER_LEFT_COLUMN = [
  {
    title: "HERRAMIENTAS Y EQUIPAMIENTO / CONDICIONES DE LA LLAVE DE POTENCIA",
    items: [
      "a. Cierre de seguridad.",
      "b. Llave contra.",
      "c. Línea retenida. Brazo fijo.",
      "d. Cobertura de la válvula de control",
      "e. Abrazaderas y conexiones.",
      "f. Posicionador de la pinza."
    ]
  },
  {
    title: "CONDICIONES DEL CONJUNTO DE APAREJO",
    items: [
      "a. Aparejo y Gancho",
      "b. Protector de rondanas./ Seguro.",
      "c. Amelas. Eslabones.",
      "d. Elevadores.",
      "e. Perno de gancho.",
      "f. Elevadores de transferencia."
    ]
  },
  {
    title: "SISTEMA DE CIRCULACION/LODO",
    items: [
      "a. Caño de elevación de lodo firme y asegurado",
      "b. Manguera de inyección asegurada al cuello de cisne y la cabeza de inyección cadenas de seguridad",
      "c. Accesorios de alta presión en el sistema de alta presión."
    ]
  },
  {
    title: "ANEXO",
    items: [
      "1.a. Limitador carrera de Aparejo",
      "1.b. Motores: Arrestallamas / Pare rapido.",
      "1.c. Puesta a tierra. Gral.",
      "2.a. Usina / Llave de Corte Gral / Piso Aislado / Instalacion Electrica / Luz de emergencia",
      "3.a. Comando BOP a distancia"
    ]
  }
];

const LOWER_RIGHT_COLUMN = [
  {
    title: "", // Continuation of SISTEMA DE CIRCULACION/LODO
    items: [
      "d. Válvula de seguridad para alivio de presión.",
      "e. Líneas de descarga de válvulas de seguridad ancladas.",
      "f. Protecciones de la bomba",
      "g. Pasillos y escaleras de la pileta.",
      "h. Area de mezcla de lodo."
    ]
  },
  {
    title: "EQUIPAMIENTO PARA CONTROL DEL POZO",
    items: [
      "a. BOP instalada, probada y en funcionamiento.",
      "b. Entrenamiento sobre su uso."
    ]
  },
  {
    title: "EQUIPAMIENTO DE SEGURIDAD",
    items: [
      "a. Arnés de Seguridad, enganches en el piso de enganche, canasta de varillas y plataforma de trabajo.",
      "b. Sistema de ascenso en la escalera de la torre (T3 - T5)",
      "c. Equipo para escape de emergencia de la torre.",
      "d. Extintores de fuego portátiles sobre ruedas",
      "e. Equipamiento de protección personal."
    ]
  },
  {
    title: "", // Continuation of ANEXO
    items: [
      "4.a Casilla : Inst. Sanitarias",
      "4.b Agua Potable",
      "4.c. Recipiente Residuos",
      "4.d. Laboratorio",
      "4.e. Instrumentos",
      "4.f. Sistema de Comunicacion",
      "4.g. Cartelera Objetivos.",
      "5.a. Equipo Espuma c/Incendio",
      "5.b. Caballetes / Planchada c/b",
      "5.c. Cartel de Presentacion"
    ]
  }
];

export const WorkoverChecklistForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<WorkoverChecklistMetadata>(initialData?.metadata || {
    company: '',
    location: '',
    supervisor: '',
    operation: '',
    equipmentNumber: '',
    date: new Date().toISOString().split('T')[0],
    field: '',
    inspectedBy: ''
  });

  const getInitialRow = (itemId: string): WorkoverChecklistRow => {
    return initialData?.rows.find(r => r.id === itemId) || { id: itemId, status: null };
  };

  const [rows, setRows] = useState<WorkoverChecklistRow[]>(() => {
    const allRows: WorkoverChecklistRow[] = [];
    const allSections = [...LEFT_COLUMN, ...RIGHT_COLUMN, ...LOWER_LEFT_COLUMN, ...LOWER_RIGHT_COLUMN];
    allSections.forEach(section => {
      section.items.forEach(item => {
        allRows.push(getInitialRow(item));
      });
    });
    return allRows;
  });

  const [observations, setObservations] = useState<WorkoverObservation[]>(initialData?.observations || [
     { id: '1', observation: '', responsible: '', compliance: '', date: '' },
     { id: '2', observation: '', responsible: '', compliance: '', date: '' },
     { id: '3', observation: '', responsible: '', compliance: '', date: '' }
  ]);

  const [signature, setSignature] = useState(initialData?.signature);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, status: WorkoverChecklistStatus) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, status: row.status === status ? null : status } : row));
  };

  const handleObservationChange = (id: string, field: keyof WorkoverObservation, value: string) => {
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

  const getRowData = (id: string) => rows.find(r => r.id === id) || { id, status: null };

  const renderSection = (section: { title: string, items: string[] }, idx: number) => (
    <div key={idx} className="mb-2 break-inside-avoid">
       {section.title && (
          <div className="font-bold text-sm bg-gray-100 border border-gray-400 p-1 mb-1 print:bg-gray-200">
             {section.title}
          </div>
       )}
       {/* Header for checklist inside section */}
       <div className="flex font-bold text-xs border-b border-black mb-1">
          <div className="flex-1"></div>
          <div className="w-8 text-center">SI</div>
          <div className="w-8 text-center">NO</div>
          <div className="w-8 text-center">NA</div>
       </div>
       {section.items.map(item => {
          const row = getRowData(item);
          return (
             <div key={item} className="flex border-b border-gray-200 text-xs items-center hover:bg-gray-50 min-h-[32px] sm:min-h-[24px]">
                <div className="flex-1 p-1 pr-2 leading-tight">{item}</div>
                
                {/* SI */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'SI' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(item, 'SI')}
                >
                   {row.status === 'SI' && 'X'}
                </div>
                {/* NO */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'NO' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(item, 'NO')}
                >
                   {row.status === 'NO' && 'X'}
                </div>
                {/* NA */}
                <div 
                   className={`w-8 h-full min-h-[32px] sm:min-h-[24px] border-l border-gray-300 flex items-center justify-center cursor-pointer ${row.status === 'NA' ? 'bg-black text-white font-bold' : ''}`}
                   onClick={() => handleRowChange(item, 'NA')}
                >
                   {row.status === 'NA' && 'X'}
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
          <h1 className="font-black text-xl uppercase leading-tight">CHECK LIST EQUIPO DE</h1>
          <h2 className="font-black text-xl uppercase leading-tight">WORKOVER</h2>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWWO001-A2-1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">COMPAÑÍA:</span>
               <input name="company" value={metadata.company} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">Nº EQUIPO:</span>
               <input name="equipmentNumber" value={metadata.equipmentNumber} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
               <span className="font-bold w-24 pl-2">YACIMIENTO:</span>
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

            <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-24">SUPERVISOR:</span>
               <input name="supervisor" value={metadata.supervisor} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
             <div className="flex border-b border-gray-400 border-dashed pb-0.5">
               <span className="font-bold w-32">INSPECC POR:</span>
               <input name="inspectedBy" value={metadata.inspectedBy} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex border-b border-gray-400 border-dashed pb-0.5 md:col-span-2">
               <span className="font-bold w-24">OPERACIÓN:</span>
               <input name="operation" value={metadata.operation} onChange={handleMetadataChange} className="flex-1 outline-none bg-transparent" />
            </div>
         </div>
      </div>

      {/* Main Checklist Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
         {/* Left Column */}
         <div className="space-y-4">
             {LEFT_COLUMN.map((section, idx) => renderSection(section, idx))}
         </div>
         
         {/* Right Column */}
         <div className="space-y-4">
             {RIGHT_COLUMN.map((section, idx) => renderSection(section, idx))}
         </div>
      </div>

      {/* Lower Sections Grid (Also 2 columns) */}
      <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
          {/* Lower Left */}
         <div className="space-y-4">
             {LOWER_LEFT_COLUMN.map((section, idx) => renderSection(section, idx + 100))}
         </div>
         {/* Lower Right */}
         <div className="space-y-4">
             {LOWER_RIGHT_COLUMN.map((section, idx) => renderSection(section, idx + 200))}
         </div>
      </div>

      {/* Observations Table */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
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
                            <button onClick={() => removeObservation(obs.id)} className="text-red-500 font-bold hover:bg-red-50 w-full h-full">×</button>
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
               filename={`checklist_workover_${metadata.date}_${metadata.equipmentNumber || 'eq'}`}
               orientation="l"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata,
              rows,
              observations,
              signature
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
