
import React, { useState } from 'react';
import { OutsourcedReport, OutsourcedMetadata, ChecklistRowData } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { OutsourcedOperationsPdf } from '../pdf/OutsourcedOperationsPdf';

interface Props {
  initialData?: OutsourcedReport;
  onSave: (report: OutsourcedReport) => void;
  onCancel: () => void;
}

const SECTIONS = [
  {
    title: "PLANIFICACION DE LA TAREA",
    items: [
      { 
        id: 'p1', 
        text: "Instructivos de Trabajo / Procedimientos", 
        subtext: "Objetivo: Comprensión y entendimiento de responsabilidades, funciones y comunicación. Acciones ante contingencias." 
      },
      { 
        id: 'p2', 
        text: "Analisis y Evaluación de Riesgos: ATS N°", 
        subtext: "Objetivo: Comprensión de los riesgos durante la operación y accionar medidas preventivas, de contingencia, rol de emergencia, cambios de condiciones de trabajo y detención de las tareas ante situaciones inseguras." 
      }
    ]
  },
  {
    title: "INFRAESTRUCTURA",
    items: [
      { 
        id: 'i1', 
        text: "Verificación de instrumentos y equipos de trabajo // Aplicación de Checklist / Certificaciones", 
        subtext: "Objetivo: Asegurase contar con equipamiento en condiciones operativas y preveer, contingencias en caso de anomalías o fallas que pongan el riesgo de exposición al personal y/o la operación." 
      },
      { id: 'i2', text: "Acondicionamiento de área de trabajo" },
      { id: 'i3', text: "1, Señalizaciones" },
      { id: 'i4', text: "2, Determinación de espacio adecuado (Revision de matriz de riesgos, medidas y contingencias)" },
      { id: 'i5', text: "3, Revision de plan de emergecia (Roles, responsables)" },
      { 
        id: 'i6', 
        text: "Objetivo: Asegurar conformidad del area a realizar la operación.", 
        isTextOnly: true 
      }
    ]
  },
  {
    title: "REVISIÓN DE REQUERIMIENTOS DEL PROCESO",
    items: [
      { id: 'r1', text: "1, ¿Están definidos los roles y responsabilidades de la operación?" },
      { id: 'r2', text: "2, ¿Comprensión del paso a paso de la operación por parte de los involucrados?" },
      { id: 'r3', text: "3, ¿Comprensión de la politica de planificación y control operacional?" },
      { id: 'r4', text: "3, ¿Comprensión de la politica de detención de tareas?" }
    ]
  }
];

export const OutsourcedOperationsForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<OutsourcedMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    sector: '',
    well: '',
    subContractor: '',
    jobDescription: '',
    objective: ''
  });

  // Inicializar firmas
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  // Inicializar filas vacías o cargar existentes
  const initializeRows = (): ChecklistRowData[] => {
    if (initialData?.rows) return initialData.rows;
    const rows: ChecklistRowData[] = [];
    SECTIONS.forEach(section => {
      section.items.forEach(item => {
        if (!item.isTextOnly) {
          rows.push({ id: item.id, value: null, observation: '' });
        }
      });
    });
    return rows;
  };

  const [rows, setRows] = useState<ChecklistRowData[]>(initializeRows());

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id: string, field: keyof ChecklistRowData, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSignatureChange = (role: 'subContractor' | 'responsible', dataUrl: string | undefined) => {
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

  const getRow = (id: string) => rows.find(r => r.id === id) || { value: null, observation: '' };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full">
      
      {/* Standardized Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
             <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black">
          <h1 className="font-black text-lg md:text-xl uppercase leading-tight">Registro de Planificación y Control de las Operaciones Tercerizadas</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>POWSG001-A6-0</div>
        </div>
      </div>

      {/* Metadata Fields */}
      <div className="border-b border-black text-sm">
        <div className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black">
          <div className="col-span-8 flex flex-col sm:flex-row border-b sm:border-b-0 sm:border-r border-black">
            <div className="w-full sm:w-40 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-black flex items-center print:bg-transparent">Sector / Equipo:</div>
            <input name="sector" title="Sector / Equipo" value={metadata.sector} onChange={handleMetadataChange} className="flex-1 p-2 outline-none uppercase w-full" />
          </div>
          <div className="col-span-4 flex flex-col sm:flex-row">
            <div className="w-full sm:w-20 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-black flex items-center print:bg-transparent">Fecha:</div>
            <input type="date" name="date" title="Fecha" value={metadata.date} onChange={handleMetadataChange} className="flex-1 p-2 outline-none text-center w-full" />
          </div>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black">
          <div className="col-span-6 flex flex-col sm:flex-row border-b sm:border-b-0 sm:border-r border-black">
            <div className="w-full sm:w-20 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-black flex items-center print:bg-transparent">Pozo:</div>
            <input name="well" title="Pozo" value={metadata.well} onChange={handleMetadataChange} className="flex-1 p-2 outline-none uppercase w-full" />
          </div>
          <div className="col-span-6 flex flex-col sm:flex-row">
            <div className="w-full sm:w-32 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-black flex items-center print:bg-transparent">Sub-Contratista:</div>
            <input name="subContractor" title="Sub-Contratista" value={metadata.subContractor} onChange={handleMetadataChange} className="flex-1 p-2 outline-none uppercase w-full" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row border-b border-black">
            <div className="w-full sm:w-40 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-black flex items-center print:bg-transparent">Descripción Trabajo:</div>
            <input name="jobDescription" title="Descripción del Trabajo" value={metadata.jobDescription} onChange={handleMetadataChange} className="flex-1 p-2 outline-none w-full" />
        </div>
         <div className="flex flex-col sm:flex-row border-b border-black">
            <div className="w-full sm:w-40 p-2 bg-gray-50 font-bold text-xs uppercase sm:border-r border-black flex items-center print:bg-transparent">Objetivo:</div>
            <textarea name="objective" title="Objetivo" rows={2} value={metadata.objective} onChange={handleMetadataChange} className="flex-1 p-2 outline-none resize-none w-full" />
        </div>
      </div>

      {/* Checklist Table */}
      <div className="w-full">
        <div className="hidden sm:grid grid-cols-12 bg-white text-sm font-semibold border-b border-black">
          <div className="col-span-8 p-2 border-r border-black text-center uppercase">Actividades de Gestión Operacional</div>
          <div className="col-span-1 p-2 border-r border-black text-center">Si</div>
          <div className="col-span-1 p-2 border-r border-black text-center">No</div>
          <div className="col-span-2 p-2 text-center uppercase">Observaciones</div>
        </div>

        {SECTIONS.map((section, sIdx) => (
          <React.Fragment key={sIdx}>
            {/* Section Header */}
            <div className="bg-gray-200 border-b border-black p-2 font-bold text-sm uppercase print:bg-gray-300 sticky top-0 sm:static z-10">
              {section.title}
            </div>
            {/* Section Items */}
            {section.items.map((item) => {
               const rowData = getRow(item.id);
               
               if (item.isTextOnly) {
                 return (
                   <div key={item.id} className="border-b border-black p-2 text-sm italic text-gray-600 bg-gray-50 print:bg-transparent">
                     {item.text}
                   </div>
                 );
               }

               return (
                <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-black text-sm group hover:bg-gray-50">
                  <div className="col-span-8 p-2 sm:border-r border-black">
                    <div className="font-medium">{item.text}</div>
                    {item.subtext && (
                      <div className="text-xs text-gray-500 italic mt-1 border-t border-dashed border-gray-200 pt-1">
                        {item.subtext}
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Controls */}
                  <div className="flex sm:contents border-t sm:border-t-0 border-gray-100">
                      {/* SI Checkbox */}
                      <div 
                        className="flex-1 sm:col-span-1 border-r border-black flex items-center justify-center p-2 sm:p-1 cursor-pointer hover:bg-gray-100" 
                        onClick={() => handleRowChange(item.id, 'value', rowData.value === 'si' ? null : 'si')}
                      >
                        <div className="flex items-center gap-2 sm:block">
                            <span className="sm:hidden text-xs font-bold text-gray-500">SI</span>
                            <div className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${rowData.value === 'si' ? 'bg-black text-white font-bold' : 'border-gray-400'}`}>
                              {rowData.value === 'si' && '✓'}
                            </div>
                        </div>
                      </div>

                      {/* NO Checkbox */}
                      <div 
                        className="flex-1 sm:col-span-1 sm:border-r border-black flex items-center justify-center p-2 sm:p-1 cursor-pointer hover:bg-gray-100" 
                        onClick={() => handleRowChange(item.id, 'value', rowData.value === 'no' ? null : 'no')}
                      >
                        <div className="flex items-center gap-2 sm:block">
                            <span className="sm:hidden text-xs font-bold text-gray-500">NO</span>
                            <div className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${rowData.value === 'no' ? 'bg-black text-white font-bold' : 'border-gray-400'}`}>
                              {rowData.value === 'no' && '✕'}
                            </div>
                        </div>
                      </div>
                  </div>

                  {/* Observations */}
                  <div className="col-span-2 p-1 border-t sm:border-t-0 border-gray-200">
                    <textarea 
                      className="w-full h-full min-h-[40px] p-1 text-xs outline-none bg-transparent resize-none border sm:border-0 rounded sm:rounded-none border-gray-200"
                      title="Observaciones"
                      placeholder="Observaciones..."
                      value={rowData.observation}
                      onChange={(e) => handleRowChange(item.id, 'observation', e.target.value)}
                    />
                  </div>
                </div>
               );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Footer Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4 sm:p-12 mt-4 border-t border-gray-300 page-break">
         <div className="text-center">
            <SignaturePad 
              label="Firma y Aclaración"
              value={signatures.subContractor?.data}
              onChange={(val) => handleSignatureChange('subContractor', val)}
            />
            <div className="text-xs font-bold text-gray-700 mt-1 uppercase">Sub Contratista Líder de la Operación</div>
         </div>
         <div className="text-center">
            <SignaturePad 
              label="Firma y Aclaración"
              value={signatures.responsible?.data}
              onChange={(val) => handleSignatureChange('responsible', val)}
            />
            <div className="text-xs font-bold text-gray-700 mt-1 uppercase">Responsable TACKER</div>
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
               filename={`tercerizados_${metadata.date}_${metadata.well || 'pozo'}`}
               orientation="p"
               className="w-full"
               pdfComponent={<OutsourcedOperationsPdf report={{ id: initialData?.id || crypto.randomUUID(), metadata, rows, signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ id: initialData?.id || crypto.randomUUID(), metadata, rows, signatures })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Checklist
           </Button>
        </div>

    </div>
  );
};
