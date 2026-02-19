
import React, { useState } from 'react';
import { PerformanceEvaluationReport, PerformanceEvaluationMetadata, PerformanceEvaluationRow } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';
import { PerformanceEvaluationPdf } from '../pdf/PerformanceEvaluationPdf';

interface Props {
  initialData?: PerformanceEvaluationReport;
  onSave: (report: PerformanceEvaluationReport) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  {
    title: "CONOCIMIENTOS DE TRABAJO (TEORICO Y PRACTICO)",
    items: [
      "Conoce las funciones de su puesto de trabajo.",
      "Posee los conocimientos necesarios para desempeñar su función.",
      "Conoce y cumple los procedimientos de la operadora y de la Cia.",
      "Conoce los riesgos asociados a su puesto de trabajo."
    ]
  },
  {
    title: "CALIDAD DE TRABAJO",
    items: [
      "Realiza su trabajo con exactitud, pulcritud y minuciosidad.",
      "Se preocupa por el orden y limpieza de su sector.",
      "Hace uso racional de los recursos."
    ]
  },
  {
    title: "CANTIDAD DE TRABAJO",
    items: [
      "Volumen de trabajo realizado normalmente.",
      "Rapidez y dinamismo en la ejecución de la tarea.",
      "Cumplimiento de las instrucciones recibidas."
    ]
  },
  {
    title: "DISCIPLINA",
    items: [
      "Posee buena conducta y comportamiento personal.",
      "Se adapta a las normas y reglamentos internos de la Cia.",
      "Cumple los horarios de trabajo.",
      "Acatamiento de órdenes."
    ]
  },
  {
    title: "COOPERACION",
    items: [
      "Colaboración con sus compañeros y jefes.",
      "Actitud ante situaciones imprevistas y/o de emergencia.",
      "Disposición para realizar tareas fuera de su rutina."
    ]
  },
  {
    title: "SEGURIDAD, SALUD Y MEDIO AMBIENTE",
    items: [
      "Utiliza correctamente los EPP.",
      "Cumple con las normas de seguridad, salud y medio ambiente.",
      "Participa en las charlas de seguridad y simulacros.",
      "Reporta actos y condiciones inseguras."
    ]
  }
];

export const PerformanceEvaluationForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState<PerformanceEvaluationMetadata>(initialData?.metadata || {
    date: new Date().toISOString().split('T')[0],
    evaluatedName: '',
    evaluatedPosition: '',
    evaluatedArea: '',
    evaluatorName: '',
    evaluatorPosition: '',
    evaluatorArea: ''
  });

  const [rows, setRows] = useState<PerformanceEvaluationRow[]>(() => {
    if (initialData?.rows && initialData.rows.length > 0) return initialData.rows;
    const allRows: PerformanceEvaluationRow[] = [];
    CATEGORIES.forEach(cat => {
      cat.items.forEach(q => {
        allRows.push({
          id: crypto.randomUUID(),
          category: cat.title,
          question: q,
          score: null
        });
      });
    });
    return allRows;
  });

  const [trainingNeeds, setTrainingNeeds] = useState(initialData?.trainingNeeds || '');
  const [signatures, setSignatures] = useState(initialData?.signatures || {});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (id: string, score: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, score: r.score === score ? null : score } : r));
  };

  const handleSignatureChange = (role: 'evaluator' | 'evaluated' | 'manager', dataUrl: string | undefined) => {
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

  const calculateAverage = () => {
    const validScores = rows.filter(r => r.score !== null);
    if (validScores.length === 0) return '0';
    const sum = validScores.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return (sum / validScores.length).toFixed(2);
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
          <h1 className="font-black text-xl uppercase leading-tight">EVALUACIÓN DE DESEMPEÑO</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>RRHH-001-A1</div>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-black text-sm bg-gray-50 print:bg-transparent">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Evaluado */}
            <div className="border border-gray-300 p-4 rounded bg-white relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-gray-500">DATOS DEL EVALUADO</div>
                <div className="space-y-3 mt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                     <span className="w-24 font-bold text-xs text-gray-500">NOMBRE:</span>
                     <input name="evaluatedName" title="Nombre del evaluado" value={metadata.evaluatedName} onChange={handleMetadataChange} className="flex-1 border-b border-gray-300 outline-none bg-transparent" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                     <span className="w-24 font-bold text-xs text-gray-500">PUESTO:</span>
                     <input name="evaluatedPosition" title="Puesto del evaluado" value={metadata.evaluatedPosition} onChange={handleMetadataChange} className="flex-1 border-b border-gray-300 outline-none bg-transparent" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                     <span className="w-24 font-bold text-xs text-gray-500">ÁREA/SECTOR:</span>
                     <input name="evaluatedArea" title="Área/Sector del evaluado" value={metadata.evaluatedArea} onChange={handleMetadataChange} className="flex-1 border-b border-gray-300 outline-none bg-transparent" />
                  </div>
                </div>
            </div>

            {/* Evaluador */}
            <div className="border border-gray-300 p-4 rounded bg-white relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-gray-500">DATOS DEL EVALUADOR</div>
                <div className="space-y-3 mt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                     <span className="w-24 font-bold text-xs text-gray-500">NOMBRE:</span>
                     <input name="evaluatorName" title="Nombre del evaluador" value={metadata.evaluatorName} onChange={handleMetadataChange} className="flex-1 border-b border-gray-300 outline-none bg-transparent" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                     <span className="w-24 font-bold text-xs text-gray-500">PUESTO:</span>
                     <input name="evaluatorPosition" title="Puesto del evaluador" value={metadata.evaluatorPosition} onChange={handleMetadataChange} className="flex-1 border-b border-gray-300 outline-none bg-transparent" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                     <span className="w-24 font-bold text-xs text-gray-500">ÁREA/SECTOR:</span>
                     <input name="evaluatorArea" title="Área/Sector del evaluador" value={metadata.evaluatorArea} onChange={handleMetadataChange} className="flex-1 border-b border-gray-300 outline-none bg-transparent" />
                  </div>
                </div>
            </div>
         </div>
         
         <div className="flex justify-end mt-2">
            <div className="flex items-center gap-2">
               <span className="font-bold text-xs uppercase text-gray-500">Fecha de Evaluación:</span>
               <input type="date" name="date" title="Fecha de evaluación" value={metadata.date} onChange={handleMetadataChange} className="border-b border-black outline-none bg-transparent text-sm" />
            </div>
         </div>
      </div>

      {/* Instructions */}
      <div className="p-3 border-b border-black text-center text-xs bg-gray-100 font-medium text-gray-600 print:bg-transparent">
         Escala de Calificación: 1 (Malo) - 2 (Regular) - 3 (Bueno) - 4 (Muy Bueno) - 5 (Excelente)
      </div>

      {/* Main Table */}
      <div className="w-full">
         {/* Desktop Header */}
         <div className="hidden sm:grid grid-cols-12 bg-gray-200 text-center font-bold border-b border-black text-xs h-8 items-center">
             <div className="col-span-9 border-r border-black pl-4 text-left">FACTOR DE EVALUACIÓN</div>
             <div className="col-span-3">PUNTAJE</div>
         </div>

         {CATEGORIES.map((category, catIdx) => {
            const catRows = rows.filter(r => r.category === category.title);
            return (
               <React.Fragment key={catIdx}>
                  <div className="bg-gray-100 border-b border-black font-bold p-2 text-xs uppercase print:bg-gray-200">
                     {category.title}
                  </div>
                  {catRows.map(row => (
                     <div key={row.id} className="flex flex-col sm:grid sm:grid-cols-12 border-b border-gray-300 hover:bg-gray-50 min-h-[40px] items-center">
                        <div className="col-span-9 border-r border-black p-3 sm:p-2 sm:pl-4 text-sm sm:text-xs font-medium w-full">
                           {row.question}
                        </div>
                        <div className="col-span-3 p-2 w-full flex justify-center border-t sm:border-t-0 border-gray-100">
                           <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map(score => (
                                 <div 
                                    key={score}
                                    onClick={() => handleScoreChange(row.id, score)}
                                    className={`w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center border rounded-full cursor-pointer transition-colors text-xs font-bold ${row.score === score ? 'bg-black text-white border-black' : 'hover:bg-gray-200 border-gray-300 text-gray-600'}`}
                                 >
                                    {score}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  ))}
               </React.Fragment>
            );
         })}
         
         {/* Total Row */}
         <div className="bg-gray-100 border-b border-black p-4 flex justify-between items-center print:bg-transparent">
            <span className="font-bold text-sm uppercase text-gray-700">Promedio General:</span>
            <span className="text-2xl font-bold bg-white px-6 py-2 rounded border border-gray-300 shadow-sm">{calculateAverage()}</span>
         </div>
      </div>

      {/* Training Needs */}
      <div className="p-4 border-b border-black">
         <div className="font-bold mb-2 uppercase text-xs text-gray-500">Necesidades de Capacitación / Entrenamiento Detectadas:</div>
         <textarea 
            className="w-full h-32 p-3 resize-none outline-none border border-gray-300 rounded text-sm bg-[linear-gradient(transparent,transparent_23px,#e5e7eb_24px)] [background-size:100%_24px] leading-6"
            title="Necesidades de capacitación"
            value={trainingNeeds}
            onChange={(e) => setTrainingNeeds(e.target.value)}
            placeholder="Detallar..."
         />
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 page-break-inside-avoid">
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.evaluated?.data} 
                   onChange={(val) => handleSignatureChange('evaluated', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma del Evaluado</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.evaluator?.data} 
                   onChange={(val) => handleSignatureChange('evaluator', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma del Evaluador</div>
          </div>
          <div className="text-center">
             <div className="border-b border-black mb-1 h-20 flex items-end justify-center">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.manager?.data} 
                   onChange={(val) => handleSignatureChange('manager', val)}
                />
             </div>
             <div className="font-bold text-xs uppercase text-gray-500">Firma Gerencia</div>
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
               filename={`evaluacion_desempeno_${metadata.date}`}
               orientation="p"
               className="w-full"
               pdfComponent={<PerformanceEvaluationPdf report={{ id: initialData?.id || crypto.randomUUID(), metadata, rows, trainingNeeds, averageScore: calculateAverage(), signatures }} />}
             />
           </div>
           <Button variant="primary" onClick={() => onSave({ 
              id: initialData?.id || crypto.randomUUID(), 
              metadata, 
              rows, 
              trainingNeeds,
              averageScore: calculateAverage(),
              signatures 
            })} className="w-full sm:w-auto order-first sm:order-last">
             Guardar Evaluación
           </Button>
        </div>

    </div>
  );
};
