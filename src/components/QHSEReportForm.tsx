
import React, { useState } from 'react';
import { QHSEReport, QHSEMetadata, QHSERow, QHSEFooter } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { QHSEReportPdf } from '../pdf/QHSEReportPdf';

interface Props {
  initialData?: QHSEReport;
  onSave: (report: QHSEReport) => void;
  onCancel: () => void;
}

const ITEMS_DATA = [
  { id: 1, item: 1, description: "Tarjetas de Observaciones CMASySO realizadas", meta: "10" },
  { id: 2, item: 2, description: "Participar y/o Liderar reuniones Previa a la Tarea (ATS) realizados en Equipo", meta: "5" },
  { id: 3, item: 3, description: "Participar en Investigación de Accidentes indicando AP/AC y Causa Raíz", meta: "SC" },
  { id: 4, item: 4, description: "Revisionar, e implementar ATS vigentes en la Operación", meta: "5" },
  { id: 5, item: 5, description: "Seguimiento y Cumplimiento de Acciones sugeridas en Simulacros", meta: "2" },
  { id: 6, item: 6, description: "Simulacro de Incendio en distintos escenarios", meta: "1" },
  { id: 7, item: 7, description: "Simulacro de Surgencia activación de equipamiento", meta: "1" },
  { id: 8, item: 8, description: "Simulacro de Derrame Ambiental en distintos escenarios", meta: "1" },
  { id: 9, item: 9, description: "Simulacro de Evacuación de Accidentado en distintos escenarios", meta: "1" },
  { id: 10, item: 10, description: "Simulacro de Sulfhidrico uso de EAPP y toma de decisiones", meta: "1" },
  { id: 11, item: 11, description: "Participación en Operaciones simultáneas de DTM en Equipos", meta: "3" },
  { id: 12, item: 12, description: "Control y Verificación de Permisos de Trabajo y Consignación de equipos", meta: "2" },
  { id: 13, item: 13, description: "Verificar Inspecciones del equipamiento de Emergencias y Seguridad", meta: "2" },
  { id: 14, item: 14, description: "Inspecciones de Seguridad al Equipo e Instalaciones", meta: "2" },
  { id: 15, item: 15, description: "Lectura / difusión de Procedimientos propios SGI y del Cliente", meta: "6" },
  { id: 16, item: 16, description: "Charlas de Seguridad al personal en Tecnicas Operativas Seguras", meta: "2" },
  { id: 17, item: 17, description: "Participar y Controlar Inspección de Manifold; Acumulador y BOP. (Pruebas)", meta: "2" },
  { id: 18, item: 18, description: "Verificar y controlar Certificados de IND del Equipamiento", meta: "2" },
  { id: 19, item: 19, description: "Verificar y controlar funcionamiento de Corte y Carrera de Aparejo", meta: "2" },
  { id: 20, item: 20, description: "Verificar y controlar Corrida y Corte de Cable de Aparejo", meta: "2" },
  { id: 21, item: 21, description: "Verificar y controlar estado Gral. Bombas de ahogue y Usina", meta: "2" },
  { id: 22, item: 22, description: "Otras tareas", meta: "" },
];

export const QHSEReportForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<QHSEMetadata>(initialData?.metadata || {
    reportDate: new Date().toISOString().split('T')[0],
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    name: ''
  });

  // Initialize rows merging default items with any saved data
  const [rows, setRows] = useState<QHSERow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    return ITEMS_DATA.map(item => ({
      ...item,
      realized: '',
      detail1: '',
      detail2: '',
      detail3: ''
    }));
  });

  const [footerStats, setFooterStats] = useState<QHSEFooter>(initialData?.footerStats || {
    eqTck1: '', eqTck2: '', eqTck3: '', eqTck4: '', baseOperativa: ''
  });

  const [observations, setObservations] = useState(initialData?.observations || '');
  const [pendingTasks, setPendingTasks] = useState(initialData?.pendingTasks || '');
  const [nextMonthCommitment, setNextMonthCommitment] = useState(initialData?.nextMonthCommitment || '');
  const [signature, setSignature] = useState(initialData?.signature);

  const handleMetadataChange = (field: keyof QHSEMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (id: number, field: keyof QHSERow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleFooterChange = (field: keyof QHSEFooter, value: string) => {
    setFooterStats(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-lg sm:text-xl uppercase leading-tight">Informe de Pro Actividades Mensuales QHSE</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG001-A2-0</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-b border-black text-[10px] p-2 space-y-1 bg-gray-50 print:bg-transparent text-gray-600 italic">
        <div>1- Para ser completado por JEFE DE CAMPO</div>
        <div>2- Enviar al Gerencia Well Service y Seguridadentre los días 01 y 5 de cada Mes.</div>
      </div>

      {/* Header Fields */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-sm">
         <div className="col-span-2 border-b sm:border-b-0 sm:border-r border-black font-bold p-2 bg-gray-50 print:bg-transparent flex items-center uppercase text-xs">Fecha de Informe</div>
         <div className="col-span-2 border-b sm:border-b-0 sm:border-r border-black p-0">
             <input 
               type="date" 
               title="Fecha de Informe"
               className="w-full h-full p-2 text-center outline-none bg-transparent"
               value={metadata.reportDate}
               onChange={(e) => handleMetadataChange('reportDate', e.target.value)}
             />
         </div>
         <div className="col-span-3 border-b sm:border-b-0 sm:border-r border-black font-bold p-2 bg-gray-50 print:bg-transparent flex items-center justify-center uppercase text-xs">Mes que corresponde</div>
         <div className="col-span-5 p-0">
             <input 
               title="Mes que corresponde"
               className="w-full h-full p-2 text-center outline-none bg-transparent capitalize"
               placeholder="Ej: Octubre 2023"
               value={metadata.month}
               onChange={(e) => handleMetadataChange('month', e.target.value)}
             />
         </div>
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black text-sm">
         <div className="col-span-2 border-b sm:border-b-0 sm:border-r border-black font-bold p-2 bg-gray-50 print:bg-transparent flex items-center uppercase text-xs">Nombre y Apellido</div>
         <div className="col-span-10 p-0">
             <input 
               title="Nombre y Apellido"
               className="w-full h-full p-2 pl-4 outline-none bg-transparent uppercase font-medium"
               value={metadata.name}
               onChange={(e) => handleMetadataChange('name', e.target.value)}
             />
         </div>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full border-collapse border border-black text-xs">
           <thead>
             <tr className="bg-gray-300 text-center font-bold">
               <th className="border border-black p-1 w-8">#</th>
               <th className="border border-black p-1">Tipo de Actividad realizada HS&E</th>
               <th className="border border-black p-1 w-12">META</th>
               <th className="border border-black p-1 w-24">Cantidad</th>
               <th className="border border-black p-1" colSpan={3}>Detallar donde se desarrollaron las Actividades de Prevención</th>
             </tr>
           </thead>
           <tbody>
             {rows.map((row) => (
               <tr key={row.id} className="hover:bg-gray-50 group border-b border-black h-8">
                 <td className="border-r border-black text-center p-1 font-bold">{row.item}</td>
                 <td className="border-r border-black px-2 py-1 whitespace-normal">{row.description}</td>
                 <td className="border-r border-black text-center p-1 font-bold text-red-600 bg-gray-50 print:bg-transparent">{row.meta}</td>
                 
                 <td className="border-r border-black p-0">
                   <input 
                     title="Cantidad realizada"
                     className="w-full h-full text-center bg-transparent outline-none p-1 font-bold"
                     value={row.realized}
                     onChange={(e) => handleRowChange(row.id, 'realized', e.target.value)}
                   />
                 </td>
                 
                 {/* 3 Detail Columns as per image grid */}
                 <td className="border-r border-black p-0 w-32">
                    <input 
                     title="Detalle 1"
                     className="w-full h-full bg-transparent outline-none p-1 text-center text-[10px]"
                     value={row.detail1}
                     onChange={(e) => handleRowChange(row.id, 'detail1', e.target.value)}
                   />
                 </td>
                 <td className="border-r border-black p-0 w-32">
                    <input 
                     title="Detalle 2"
                     className="w-full h-full bg-transparent outline-none p-1 text-center text-[10px]"
                     value={row.detail2}
                     onChange={(e) => handleRowChange(row.id, 'detail2', e.target.value)}
                   />
                 </td>
                 <td className="p-0 w-32">
                    <input 
                     title="Detalle 3"
                     className="w-full h-full bg-transparent outline-none p-1 text-center text-[10px]"
                     value={row.detail3}
                     onChange={(e) => handleRowChange(row.id, 'detail3', e.target.value)}
                   />
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden p-4 space-y-4">
         {rows.map(row => (
           <div key={row.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-start mb-2 border-b pb-2 border-gray-200">
                 <div className="flex gap-2">
                    <span className="font-bold text-gray-500">#{row.item}</span>
                    <span className="font-medium text-sm text-gray-800">{row.description}</span>
                 </div>
                 <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                    Meta: {row.meta}
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 items-center mb-3">
                 <label className="text-xs font-bold text-gray-500 uppercase">Cantidad Realizada:</label>
                 <input 
                   type="number"
                   title="Cantidad realizada"
                   className="border border-gray-300 rounded p-1.5 text-center font-bold"
                   value={row.realized}
                   onChange={(e) => handleRowChange(row.id, 'realized', e.target.value)}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase block">Detalles / Ubicación:</label>
                 <input className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white" placeholder="Detalle 1" value={row.detail1} onChange={(e) => handleRowChange(row.id, 'detail1', e.target.value)} />
                 <input className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white" placeholder="Detalle 2" value={row.detail2} onChange={(e) => handleRowChange(row.id, 'detail2', e.target.value)} />
                 <input className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white" placeholder="Detalle 3" value={row.detail3} onChange={(e) => handleRowChange(row.id, 'detail3', e.target.value)} />
              </div>
           </div>
         ))}
      </div>

      {/* Footer Stats - Responsive Grid */}
      <div className="border-t-2 border-black bg-gray-100 p-2 sm:p-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-0 sm:divide-x divide-black text-center text-xs">
              <div className="p-2 flex flex-col justify-center bg-red-50 text-red-800 font-bold border border-red-200 sm:border-0 rounded sm:rounded-none">
                 <span className="mb-1">EQ Tck 1</span>
                 <input className="w-full bg-transparent border-b border-red-400 text-center font-bold text-lg outline-none" title="EQ Tck 1" value={footerStats.eqTck1} onChange={e => handleFooterChange('eqTck1', e.target.value)} />
              </div>
              <div className="p-2 flex flex-col justify-center bg-red-50 text-red-800 font-bold border border-red-200 sm:border-0 rounded sm:rounded-none">
                 <span className="mb-1">EQ Tck 2</span>
                 <input className="w-full bg-transparent border-b border-red-400 text-center font-bold text-lg outline-none" title="EQ Tck 2" value={footerStats.eqTck2} onChange={e => handleFooterChange('eqTck2', e.target.value)} />
              </div>
              <div className="p-2 flex flex-col justify-center bg-red-50 text-red-800 font-bold border border-red-200 sm:border-0 rounded sm:rounded-none">
                 <span className="mb-1">EQ Tck 3</span>
                 <input className="w-full bg-transparent border-b border-red-400 text-center font-bold text-lg outline-none" title="EQ Tck 3" value={footerStats.eqTck3} onChange={e => handleFooterChange('eqTck3', e.target.value)} />
              </div>
              <div className="p-2 flex flex-col justify-center bg-red-50 text-red-800 font-bold border border-red-200 sm:border-0 rounded sm:rounded-none">
                 <span className="mb-1">EQ Tck 4</span>
                 <input className="w-full bg-transparent border-b border-red-400 text-center font-bold text-lg outline-none" title="EQ Tck 4" value={footerStats.eqTck4} onChange={e => handleFooterChange('eqTck4', e.target.value)} />
              </div>
              <div className="p-2 col-span-2 sm:col-span-1 flex flex-col justify-center bg-red-50 text-red-800 font-bold border border-red-200 sm:border-0 rounded sm:rounded-none">
                 <span className="mb-1">Base Operativa</span>
                 <input className="w-full bg-transparent border-b border-red-400 text-center font-bold text-lg outline-none" title="Base Operativa" value={footerStats.baseOperativa} onChange={e => handleFooterChange('baseOperativa', e.target.value)} />
              </div>
          </div>
      </div>

      {/* References */}
      <div className="text-[10px] p-2 leading-tight text-gray-500 border-b border-gray-300 italic">
        <p>SC - Si corresponde. | 2- A todo el personal del Equipo | 4 a 10- Detallar y enviar el Informe con las observaciones detectadas.</p>
        <p>12- Dejar evidencias sobre la implementación. | 13-14- Enviar el Informe y dejar evidencias de los hallazgos observados.</p>
      </div>

      {/* Additional Text Areas */}
      <div className="p-4 border-b border-gray-300">
        <div className="font-bold text-sm mb-2 text-gray-700 uppercase">Observaciones en el trasncurso del Mes:</div>
        <textarea 
          title="Observaciones en el transcurso del mes"
          rows={4}
          className="w-full p-3 text-sm border border-gray-300 rounded-md outline-none resize-none focus:ring-1 focus:ring-brand-red bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Ingrese observaciones..."
        />
      </div>

      <div className="p-4 border-b border-gray-300">
        <div className="font-bold text-sm mb-2 text-gray-700 uppercase">Tareas Pendientes a realizar:</div>
        <textarea 
          title="Tareas pendientes a realizar"
          rows={4}
          className="w-full p-3 text-sm border border-gray-300 rounded-md outline-none resize-none focus:ring-1 focus:ring-brand-red bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
          value={pendingTasks}
          onChange={(e) => setPendingTasks(e.target.value)}
          placeholder="Ingrese tareas pendientes..."
        />
      </div>

      <div className="p-4 border-b border-black">
        <div className="font-bold text-sm mb-2 text-gray-700 uppercase">Compromiso para el proximo Mes:</div>
        <textarea 
          title="Compromiso para el próximo mes"
          rows={4}
          className="w-full p-3 text-sm border border-gray-300 rounded-md outline-none resize-none focus:ring-1 focus:ring-brand-red bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
          value={nextMonthCommitment}
          onChange={(e) => setNextMonthCommitment(e.target.value)}
          placeholder="Ingrese compromisos..."
        />
      </div>

      {/* Signature */}
      <div className="p-8 pb-12 mt-4 page-break flex justify-center">
         <div className="w-full max-w-xs text-center">
             <div className="border-b border-black mb-1 h-24 flex items-end justify-center">
                <SignaturePad 
                  label=""
                  value={signature?.data}
                  onChange={(val) => setSignature(val ? { data: val, timestamp: new Date().toISOString() } : undefined)}
                  className="w-full h-full border-0"
                />
             </div>
             <div className="font-bold text-sm uppercase">Firma y Aclaración</div>
             <div className="text-xs text-gray-500 mt-1">{metadata.name}</div>
         </div>
      </div>

       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50 sm:justify-end">
           <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
             Cancelar
           </Button>
           <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
             🖨️ Imprimir
           </Button>
           <div className="w-full sm:w-auto order-1 sm:order-3">
             <ExportPdfButton 
               filename={`qhse_${metadata.month}`}
               orientation="p"
               className="w-full"
               pdfComponent={<QHSEReportPdf report={{ id: initialData?.id ?? '', metadata, rows, footerStats, observations, pendingTasks, nextMonthCommitment, signature }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata,
              rows,
              footerStats,
              observations,
              pendingTasks,
              nextMonthCommitment,
              signature
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Informe
           </Button>
        </div>

    </div>
  );
};
