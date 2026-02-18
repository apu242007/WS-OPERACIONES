
import React, { useState } from 'react';
import { ForkliftReport, ForkliftMetadata, ForkliftRow, ForkliftStatus } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: ForkliftReport;
  onSave: (report: ForkliftReport) => void;
  onCancel: () => void;
}

const LEFT_COLUMN = [
  {
    title: "SISTEMA HIDRAULICO",
    items: [
      "Cilindros Pata derecha",
      "Cilindros Pata izquierda",
      "Cilindros de brazo",
      "Nivel de Aceite Hidráulico",
      "Bomba Hidráulica",
      "Estado de filtro Hidráulico",
      "Estado de mangueras en Gral.",
      "Estado patas estabilizadoras/ comandos"
    ]
  },
  {
    title: "DESCRIPCION GENERAL",
    items: [
      "Cristales de puerta y ventanas",
      "Parabrisas y Luneta",
      "Limpiaparabrisas",
      "Parasol",
      "Cierre/ traba de ventanas",
      "Espejos retrovisores",
      "Puerta /Cerradura/ Manijas de apertura",
      "Estado del piso y cubre piso",
      "Escalera de acceso a cabina/ pasamanos",
      "Engrase de articulaciones",
      "Aceite de convertidor",
      "Palancas de accionamientos sistemas hidrau.",
      "Instrumental (indicadores)",
      "Estado Depósito combustible",
      "Autoadhesivos de Advertencia-Prohibición",
      "Extintor /Soporte para extintor",
      "Pisadera antideslizante",
      "Arresta llama",
      "Múltiple de escape / Silenciador",
      "Pintura",
      "Aspecto Gral."
    ]
  },
  {
    title: "TREN RODANTE",
    items: [
      "Neumáticos traseros y delanteros",
      "Diferencial/ traba diferencial",
      "Dirección hidráulica",
      "Tren de rodamiento",
      "Bloqueo manual",
      "Perno de soporte de izaje de uñas",
      "Estado de los pernos / coronas",
      "Bulones de ajustes",
      "Alemites",
      "Telescópico de uñas de izaje",
      "Frenos",
      "Presión de neumáticos"
    ]
  }
];

const RIGHT_COLUMN = [
  {
    title: "SISTEMA FUNCIONAL",
    items: [
      "Motor",
      "Palanca de Velocidades",
      "Palancas de Movimientos",
      "Tomas de aire de combustible",
      "Estado general de correas",
      "Estado filtro de aire"
    ]
  },
  {
    title: "LIQUIDOS MOTOR",
    items: [
      "Nivel de Aceite",
      "Presión de Aceite",
      "Nivel de Gas-Oíl/ Estado Depósito combustible",
      "Nivel de Agua"
    ]
  },
  {
    title: "SISTEMA ELÉCTRICO",
    items: [
      "Luces Externas (altas, bajas, posición, stop)",
      "Balizas Intermitentes",
      "Luces de tablero instrumentos y cabina",
      "Luces de giro",
      "Alternador",
      "Electros limpios",
      "Batería",
      "Instalación eléctrica en Gral.",
      "Pare de emergencia",
      "Corta corriente",
      "Alarma acústica de Movimiento",
      "Bocina",
      "Llave de Bloqueo de Equipo",
      "Llave Luz Testigo de Tablero",
      "Luces Adicionales (delimitadoras)/ Reflectores"
    ]
  },
  {
    title: "INTERIOR",
    items: [
      "Visibilidad de operaciones",
      "Calefacción /Aire acondicionado",
      "Butaca/ Apoya cabeza",
      "Cinturón de seguridad",
      "Estado General de Cabina"
    ]
  },
  {
    title: "ELEMENTOS / ACCESORIOS",
    items: [
      "Estado de Cuñas",
      "Estado Aguilón/ perno",
      "Estado de Pala cargadora",
      "Estado de Balde",
      "Seguro de pernos",
      "Guardabarros Laterales",
      "Contrapeso",
      "Caja de Herramientas",
      "Elementos de Amarre para izaje"
    ]
  }
];

export const ForkliftInspectionForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<ForkliftMetadata>(initialData?.metadata || {
    forklift: '',
    hourMeter: '',
    internalNumber: '',
    serialNumber: '',
    operator: '',
    date: new Date().toISOString().split('T')[0],
    licenseNumber: '',
    type: '',
    licenseExpiration: '',
    enablement: '',
    enablementExpiration: ''
  });

  const [rows, setRows] = useState<ForkliftRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    
    const allRows: ForkliftRow[] = [];
    [...LEFT_COLUMN, ...RIGHT_COLUMN].forEach(section => {
      section.items.forEach(item => {
        allRows.push({
          id: crypto.randomUUID(),
          category: section.title,
          item: item,
          status: ''
        });
      });
    });
    return allRows;
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id: string, value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, status: value as ForkliftStatus } : row));
  };

  const handleSignatureChange = (role: 'operator' | 'sectorResponsible' | 'rigManager', dataUrl: string | undefined) => {
    setSignatures(prev => ({
      ...prev,
      [role]: dataUrl ? { data: dataUrl, timestamp: new Date().toISOString() } : undefined
    }));
  };

  const renderSection = (section: { title: string, items: string[] }) => (
    <div key={section.title} className="mb-4 break-inside-avoid">
      <div className="bg-gray-100 border border-black p-2 font-bold text-xs flex justify-between rounded-t-lg sm:rounded-none">
        <span>{section.title}</span>
        <span className="w-16 text-center">REF</span>
      </div>
      {section.items.map(item => {
        const row = rows.find(r => r.category === section.title && r.item === item);
        if (!row) return null;
        return (
          <div key={row.id} className="flex flex-col sm:flex-row border-b border-gray-300 text-xs hover:bg-gray-50 sm:items-center min-h-[32px]">
            <div className="flex-1 p-2 sm:p-1 sm:pl-2 truncate font-medium bg-gray-50 sm:bg-transparent" title={item}>{item}</div>
            <div className="w-full sm:w-16 sm:border-l border-gray-300 p-1 sm:p-0">
              <select 
                className="w-full h-full bg-transparent outline-none text-center font-bold text-xs appearance-none cursor-pointer border sm:border-0 rounded sm:rounded-none py-1 sm:py-0"
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
              >
                <option value="">-</option>
                <option value="N">N</option>
                <option value="Co">Co</option>
                <option value="F">F</option>
                <option value="V">V</option>
                <option value="R">R</option>
                <option value="L">L</option>
                <option value="NC">NC</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-bold text-lg sm:text-2xl uppercase leading-tight">INSPECCIÓN DE MONTACARGAS</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POSGI001-A12-0</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-xs space-y-3 bg-gray-50 print:bg-transparent">
         {/* Row 1 */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">MONTACARGA</span>
               <input name="forklift" value={metadata.forklift} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">HOROMETRO</span>
               <input name="hourMeter" value={metadata.hourMeter} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">INTERNO Nº</span>
               <input name="internalNumber" value={metadata.internalNumber} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
         </div>

         {/* Row 2 */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">NUMERO SERIE</span>
               <input name="serialNumber" value={metadata.serialNumber} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">OPERADOR</span>
               <input name="operator" value={metadata.operator} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
         </div>

         {/* Row 3 */}
         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">FECHA INSPECCION</span>
               <input type="date" name="date" value={metadata.date} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">LICENCIA Nº</span>
               <input name="licenseNumber" value={metadata.licenseNumber} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">TIPO</span>
               <input name="type" value={metadata.type} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">VTO.</span>
               <input name="licenseExpiration" value={metadata.licenseExpiration} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
         </div>

         {/* Row 4 */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">HABILITACIÓN MONTACARGA</span>
               <input name="enablement" value={metadata.enablement} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white uppercase" />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-bold text-gray-500 uppercase">VTO</span>
               <input name="enablementExpiration" value={metadata.enablementExpiration} onChange={handleMetadataChange} className="border border-gray-300 rounded p-1.5 outline-none bg-white" />
            </div>
         </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-b border-black text-[10px] text-center bg-gray-100 font-medium text-gray-600 uppercase">
         TERMINOLOGÍA: Normal (N) - Corregir (Co) - Faltante (F) - Verificar (V) - Reparar (R) - Limpiar (L) - No Corresponde (NC)
      </div>

      {/* Main Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
         <div>
            {LEFT_COLUMN.map(section => renderSection(section))}
         </div>
         <div>
            {RIGHT_COLUMN.map(section => renderSection(section))}
         </div>
      </div>

      {/* Observations */}
      <div className="p-4 border-t border-black page-break-inside-avoid">
         <div className="font-bold text-xs mb-1 uppercase text-gray-500">OBSERVACIONES:</div>
         <textarea 
            className="w-full h-24 p-2 resize-none outline-none border border-gray-300 text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] leading-6"
            style={{ backgroundSize: '100% 24px' }}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.operator?.data} 
                   onChange={(val) => handleSignatureChange('operator', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-[10px] uppercase">OPERADOR DE MONTACARGAS</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.sectorResponsible?.data} 
                   onChange={(val) => handleSignatureChange('sectorResponsible', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-[10px] uppercase">RESPONSABLE DE SECTOR</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   value={signatures.rigManager?.data} 
                   onChange={(val) => handleSignatureChange('rigManager', val)}
                   className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-[10px] uppercase">JEFE DE EQUIPO</div>
          </div>
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
               filename={`insp_montacarga_${metadata.date}`}
               orientation="p"
               className="w-full"
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              observations,
              signatures
            })} className="w-full sm:w-auto">
             Guardar Inspección
           </Button>
        </div>

    </div>
  );
};
