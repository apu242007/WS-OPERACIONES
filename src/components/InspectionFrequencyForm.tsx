
import React from 'react';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';
import { InspectionFrequencyPdf } from '../pdf/InspectionFrequencyPdf';

interface Props {
  onCancel: () => void;
}

interface FrequencyRow {
  component: string;
  daily: string;
  weekly: string;
  semiannual: string;
  annual: string;
  fiveYear: string;
  notes?: string;
}

const rows: FrequencyRow[] = [
  { component: 'Polea del bloque Corona y Rodamiento', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Gancho de taladro (diferente al gancho de succión)', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Bloque viajero, gancho de bloque adaptador de gancho p/bloque', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Conectores y adaptadores de eslabón', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Ganchos de tubería y ganchos de succión', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores de eslabón', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores de rev., Tubería, de taladro, tubería con cuello', daily: 'II', weekly: '', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores de cabillas de succión', daily: 'II', weekly: '', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Asa de la unión giratoria', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Unión giratoria (Rotatory Swivel)', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Unión giratoria de potencia (Power Swivel)', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Potencia rotaria', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Arañas cuando sean usadas como elevadores', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Final línea de amarre / Anclaje de líneas', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Compensador de movimiento de la línea de perforación', daily: 'II', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Cuadrante al ser utilizado como equipo de izamiento', daily: 'I', weekly: 'II', semiannual: 'III', annual: '', fiveYear: 'IV' },
  { component: 'Top Drive', daily: 'I', weekly: 'II', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Elevadores y herramientas de corrida de cabezal cuando sean utilizados como equipo de izamiento', daily: 'II', weekly: '', semiannual: 'III', annual: 'IV', fiveYear: '' },
  { component: 'Estructura y Sub-estructura UPSP (1) de servicios a pozo', daily: 'I', weekly: 'II', semiannual: '', annual: 'III', fiveYear: 'IV' },
  { component: 'Estructura y Sub-estructura de taladros de perforación', daily: 'I', weekly: 'II', semiannual: '', annual: 'III CADA 2 AÑOS', fiveYear: 'IV' },
  { component: 'Estructura y Sub-estructura UPSP (1) de servicios a pozo (Cat. 5)', daily: 'I', weekly: 'II', semiannual: '', annual: '', fiveYear: 'IV' },
];

const categoryColors: Record<string, string> = {
  I: 'bg-green-100 text-green-800',
  II: 'bg-blue-100 text-blue-800',
  III: 'bg-yellow-100 text-yellow-800',
  IV: 'bg-red-100 text-red-800',
};

const CatBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  const cls = categoryColors[value.trim().charAt(0)] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${cls}`}>
      {value}
    </span>
  );
};

export const InspectionFrequencyForm: React.FC<Props> = ({ onCancel }) => {
  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans">

      {/* Header */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
          <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl uppercase leading-tight">Frecuencia Mínima de Inspección</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>REF-INSP-001</div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="px-6 py-3 bg-gray-50 border-b border-black flex flex-wrap gap-4 text-xs font-semibold">
        <span className="text-gray-600 uppercase tracking-wide font-bold">Categorías:</span>
        <span className="inline-flex items-center gap-1"><span className="w-5 h-5 rounded bg-green-100 text-green-800 flex items-center justify-center font-bold text-xs">I</span> Inspección visual diaria</span>
        <span className="inline-flex items-center gap-1"><span className="w-5 h-5 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">II</span> Inspección visual frecuente</span>
        <span className="inline-flex items-center gap-1"><span className="w-5 h-5 rounded bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-xs">III</span> Inspección no destructiva</span>
        <span className="inline-flex items-center gap-1"><span className="w-5 h-5 rounded bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs">IV</span> Inspección certificada periódica</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white text-xs uppercase">
              <th className="text-left px-3 py-3 font-bold border border-gray-600 w-2/5">Componente</th>
              <th className="text-center px-2 py-3 font-bold border border-gray-600 whitespace-nowrap">Diaria</th>
              <th className="text-center px-2 py-3 font-bold border border-gray-600 whitespace-nowrap">Semanal</th>
              <th className="text-center px-2 py-3 font-bold border border-gray-600 whitespace-nowrap">Semestral</th>
              <th className="text-center px-2 py-3 font-bold border border-gray-600 whitespace-nowrap">Anual</th>
              <th className="text-center px-2 py-3 font-bold border border-gray-600 whitespace-nowrap">Cada 5 años</th>
            </tr>
            <tr className="bg-gray-700 text-gray-300 text-[10px] uppercase">
              <th className="text-left px-3 py-1 border border-gray-600"></th>
              <th className="text-center px-2 py-1 border border-gray-600 col-span-5" colSpan={5}>Categoría de inspección</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-3 py-2 border border-gray-200 text-gray-800 font-medium leading-snug">{row.component}</td>
                <td className="px-2 py-2 border border-gray-200 text-center"><CatBadge value={row.daily} /></td>
                <td className="px-2 py-2 border border-gray-200 text-center"><CatBadge value={row.weekly} /></td>
                <td className="px-2 py-2 border border-gray-200 text-center"><CatBadge value={row.semiannual} /></td>
                <td className="px-2 py-2 border border-gray-200 text-center"><CatBadge value={row.annual} /></td>
                <td className="px-2 py-2 border border-gray-200 text-center"><CatBadge value={row.fiveYear} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="px-6 py-4 bg-gray-50 border-t border-black text-xs text-gray-600 space-y-1">
        <div className="font-bold text-gray-800 underline">NOTAS:</div>
        <div>(1) UPSP: Unidad de Perforación y Servicios a Pozo.</div>
        <div>Las frecuencias indicadas son mínimas. El Supervisor de Campo puede aumentar la frecuencia según condiciones operativas.</div>
        <div>Toda inspección de Categoría III y IV debe ser realizada por personal certificado y registrada en el sistema de gestión.</div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
        <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1">
          Cerrar
        </Button>
        <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-3 sm:order-2">
          🖨️ Imprimir
        </Button>
        <div className="w-full sm:w-auto order-1 sm:order-3">
          <ExportPdfButton
            filename="frecuencia_minima_inspeccion"
            orientation="l"
            className="w-full"
            pdfComponent={<InspectionFrequencyPdf />}
          />
        </div>
      </div>
    </div>
  );
};
