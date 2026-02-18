
import React, { useState, useMemo, useEffect } from 'react';
import { TubingMeasurementReport } from '../types';
import { Button } from './ui/Button';
import { SignaturePad } from './ui/SignaturePad';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  initialData?: TubingMeasurementReport;
  onSave: (report: TubingMeasurementReport) => void;
  onCancel: () => void;
}

const TUBING_SPECS = [
  { tbg: "2.375", grado: "J55",  pesoLbPie: 7,     peso: 2.01,  maxTension: 71730,  pIntFluencia: 7700,  colapso: 8100,  diamInt: 50.67, diamExt: 60.33, drift: 48.29, diamCupla: 77.8,  diamRecalque: 2.59375, torqueMin: 970,  torqueOp: 1290, torqueMax: 1610, desplazamiento: 0.85, torquePsiOp: 426, torquePsiMax: 531, calibre: 48.28 },
  { tbg: "2.375", grado: "N80",  pesoLbPie: 7,     peso: 2.01,  maxTension: 104340, pIntFluencia: 11200, colapso: 11780, diamInt: 50.67, diamExt: 60.33, drift: 48.29, diamCupla: 77.8,  diamRecalque: 2.59375, torqueMin: 1350, torqueOp: 1800, torqueMax: 2250, desplazamiento: 0.85, torquePsiOp: 594, torquePsiMax: 743, calibre: 48.28 },
  { tbg: "2.875", grado: "J55",  pesoLbPie: 9.51,  peso: 3.02,  maxTension: 99600,  pIntFluencia: 7260,  colapso: 7680,  diamInt: 62,    diamExt: 73.03, drift: 59.61, diamCupla: 93.17, diamRecalque: "3 1/16", torqueMin: 1240, torqueOp: 1650, torqueMax: 2080, desplazamiento: 1.17, torquePsiOp: 544, torquePsiMax: 680, calibre: 59.61 },
  { tbg: "2.875", grado: "N80",  pesoLbPie: 9.51,  peso: 3.02,  maxTension: 144960, pIntFluencia: 10570, colapso: 11160, diamInt: 62,    diamExt: 73.03, drift: 59.61, diamCupla: 93.17, diamRecalque: "3 1/16", torqueMin: 1730, torqueOp: 2300, torqueMax: 2880, desplazamiento: 1.17, torquePsiOp: 759, torquePsiMax: 950, calibre: 59.61 },
  { tbg: "2.875", grado: "H90",  pesoLbPie: 9.72,  peso: 3.02,  maxTension: 99600,  pIntFluencia: 7260,  colapso: 7680,  diamInt: 62,    diamExt: 73.03, drift: 59.61, diamCupla: 102,   diamRecalque: "3 1/16", torqueMin: 1240, torqueOp: 1650, torqueMax: 2080, desplazamiento: 1.17, torquePsiOp: 544, torquePsiMax: 680, calibre: 59.61 },
  { tbg: "3.5",   grado: "J55",  pesoLbPie: 13.84, peso: 4.053, maxTension: 142460, pIntFluencia: 6990,  colapso: 7400,  diamInt: 76,    diamExt: 88.9,  drift: 72.82, diamCupla: 104,   diamRecalque: 3.75,    torqueMin: 1710, torqueOp: 2280, torqueMax: 2850, desplazamiento: 1.67, torquePsiOp: 752, torquePsiMax: 940, calibre: 72.82 },
  { tbg: "3.5",   grado: "N80",  pesoLbPie: 13.84, peso: 4.053, maxTension: 207220, pIntFluencia: 10160, colapso: 10530, diamInt: 76,    diamExt: 88.9,  drift: 72.82, diamCupla: 104,   diamRecalque: 3.75,    torqueMin: 2400, torqueOp: 3200, torqueMax: 4000, desplazamiento: 1.67, torquePsiOp: 1053, torquePsiMax: 1320, calibre: 72.82 },
];

const CASING_DATA = [
  { od: "5",     lbPie: 13,   diamIntMm: 114.15, driftMm: 110.97, ltsPorMt: 10.23 },
  { od: "5",     lbPie: 15,   diamIntMm: 111.96, driftMm: 108.79, ltsPorMt: 9.85  },
  { od: "5",     lbPie: 18,   diamIntMm: 108.61, driftMm: 105.44, ltsPorMt: 9.27  },
  { od: "5.5",   lbPie: 14,   diamIntMm: 127.7,  driftMm: 124.13, ltsPorMt: 12.73 },
  { od: "5.5",   lbPie: 15.5, diamIntMm: 125.73, driftMm: 122.56, ltsPorMt: 12.42 },
  { od: "5.5",   lbPie: 17,   diamIntMm: 124.26, driftMm: 121.08, ltsPorMt: 12.13 },
  { od: "5.5",   lbPie: 20,   diamIntMm: 121.36, driftMm: 118.19, ltsPorMt: 11.57 },
  { od: "7",     lbPie: 23,   diamIntMm: 161.7,  driftMm: 158.52, ltsPorMt: 20.54 },
  { od: "7",     lbPie: 26,   diamIntMm: 159.41, driftMm: 156.24, ltsPorMt: 19.96 },
  { od: "7",     lbPie: 29,   diamIntMm: 157.07, driftMm: 153.9,  ltsPorMt: 19.38 },
  { od: "7",     lbPie: 32,   diamIntMm: 154.79, driftMm: 151.61, ltsPorMt: 18.82 },
  { od: "9.625", lbPie: 32.3, diamIntMm: 228.63, driftMm: 224.66, ltsPorMt: 41.12 },
  { od: "9.625", lbPie: 36,   diamIntMm: 226.59, driftMm: 222.63, ltsPorMt: 40.34 },
  { od: "9.625", lbPie: 40,   diamIntMm: 224.41, driftMm: 220.45, ltsPorMt: 39.47 },
  { od: "9.625", lbPie: 43.5, diamIntMm: 222.38, driftMm: 218.41, ltsPorMt: 38.85 },
  { od: "9.625", lbPie: 47,   diamIntMm: 220.5,  driftMm: 216.54, ltsPorMt: 38.2  },
  { od: "9.625", lbPie: 53.5, diamIntMm: 216.79, driftMm: 212.83, ltsPorMt: 36.92 },
];

const DEFAULT_TOOLS = [
  { herramienta: 'N/A 11-25', metros: 0.23 },
  { herramienta: 'red', metros: 0.45 },
  { herramienta: 'pm x 6', metros: 55.19 },
  { herramienta: 'red', metros: 0.65 },
  { herramienta: 'tijera', metros: 3 },
  { herramienta: 'union', metros: 0.79 },
  { herramienta: '2 red', metros: 1.11 },
  { herramienta: 'zto', metros: 1.7 },
  { herramienta: 'prolong', metros: 2.69 }
];

export const TubingMeasurementForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [metadata, setMetadata] = useState(initialData?.metadata || {
    grado: '',
    diametro: '',
    nPieza: '',
    equipo: '',
    fecha: new Date().toISOString().split('T')[0],
    pozo: '',
    observations: '',
    carreraZtoTopeFinal: '',
    htaCbNumero: ''
  });

  const [tubos, setTubos] = useState<number[]>(initialData?.tubos || Array(19).fill(0));
  
  const [poolHerramientas, setPoolHerramientas] = useState(
    initialData?.poolHerramientas || DEFAULT_TOOLS.map(t => ({ ...t, id: crypto.randomUUID() }))
  );

  const [signatures, setSignatures] = useState<TubingMeasurementReport['signatures']>(initialData?.signatures || {
    inspector: {},
    supervisor: {}
  });

  // Find active spec based on metadata selection
  const activeSpec = useMemo(() => {
    return TUBING_SPECS.find(s => s.grado === metadata.grado && s.tbg === metadata.diametro);
  }, [metadata.grado, metadata.diametro]);

  // Calculations
  const calculated = useMemo(() => {
    const totalMetros = tubos.reduce((a, b) => a + (Number(b) || 0), 0);
    const cantidadTubos = tubos.filter(t => t > 0).length;
    const totalPoolMetros = poolHerramientas.reduce((a, b) => a + (Number(b.metros) || 0), 0);
    
    // Weight calculation: Total Metros * spec.peso (kg/m)
    const pesoTotalKg = activeSpec ? totalMetros * activeSpec.peso : 0;
    
    // Volume calculation: Total Metros * spec.desplazamiento (assuming l/m per prompt or similar ratio)
    // The constant uses "desplazamiento: 0.85" etc. Assuming this is lts/m as per prompt logic.
    const totalVolumeLts = activeSpec ? totalMetros * activeSpec.desplazamiento : 0;

    return { totalMetros, cantidadTubos, pesoTotalKg, totalVolumeLts, totalPoolMetros };
  }, [tubos, activeSpec, poolHerramientas]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleTuboChange = (index: number, value: string) => {
    const newTubos = [...tubos];
    newTubos[index] = parseFloat(value) || 0;
    setTubos(newTubos);
  };

  const handlePoolChange = (id: string, value: string) => {
    setPoolHerramientas(prev => prev.map(item => 
      item.id === id ? { ...item, metros: parseFloat(value) || 0 } : item
    ));
  };

  const handleSignatureChange = (role: 'inspector' | 'supervisor', dataUrl: string | undefined, name?: string) => {
    setSignatures(prev => {
      const prevData = prev[role];
      if (name !== undefined) {
         return { ...prev, [role]: { ...prevData, name } };
      }
      return { 
        ...prev, 
        [role]: { 
          ...prevData, 
          data: dataUrl, 
          timestamp: dataUrl ? new Date().toISOString() : prevData.timestamp 
        } 
      };
    });
  };

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:w-full font-sans text-xs">
      
      {/* Header */}
      <div className="bg-brand-red text-white p-3 flex flex-col sm:flex-row sm:justify-between items-center print:bg-brand-red print:text-white">
        <div className="font-bold text-lg mb-2 sm:mb-0 text-center sm:text-left">PLANILLA DE MEDICIÓN DE TUBING</div>
        <div className="text-right text-xs">
          <div className="font-bold opacity-80">OPERACIONES WS</div>
          <div className="opacity-80">Formulario Técnico</div>
        </div>
      </div>

      {/* Section 1: Metadata */}
      <div className="p-4 border-b border-gray-300 bg-gray-50 print:bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
           <div>
              <label className="block font-bold mb-1 uppercase text-gray-600">Grado</label>
              <select name="grado" value={metadata.grado} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white">
                 <option value="">- Seleccionar -</option>
                 <option value="J55">J55</option>
                 <option value="N80">N80</option>
                 <option value="H90">H90</option>
              </select>
           </div>
           <div>
              <label className="block font-bold mb-1 uppercase text-gray-600">Diámetro</label>
              <select name="diametro" value={metadata.diametro} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white">
                 <option value="">- Seleccionar -</option>
                 <option value="2.375">2.375"</option>
                 <option value="2.875">2.875"</option>
                 <option value="3.5">3.5"</option>
              </select>
           </div>
           <div>
              <label className="block font-bold mb-1 uppercase text-gray-600">N° de Pieza</label>
              <input name="nPieza" value={metadata.nPieza} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white" />
           </div>
           <div>
              <label className="block font-bold mb-1 uppercase text-gray-600">Equipo / Tacker</label>
              <input name="equipo" value={metadata.equipo} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white uppercase" />
           </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
           <div>
              <label className="block font-bold mb-1 uppercase text-gray-600">Fecha</label>
              <input type="date" name="fecha" value={metadata.fecha} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white" />
           </div>
           <div>
              <label className="block font-bold mb-1 uppercase text-gray-600">Pozo</label>
              <input name="pozo" value={metadata.pozo} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white uppercase" />
           </div>
           <div className="sm:col-span-2">
              <label className="block font-bold mb-1 uppercase text-gray-600">Observaciones</label>
              <textarea name="observations" rows={1} value={metadata.observations} onChange={handleMetadataChange} className="w-full border border-gray-300 rounded px-2 py-1.5 outline-none bg-white resize-none" />
           </div>
        </div>
      </div>

      {/* Section 2: Specs Table */}
      <div className="p-4 border-b border-gray-300">
         <h3 className="font-bold text-sm mb-2 uppercase text-gray-700">Propiedades de la Cañería</h3>
         {activeSpec ? (
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
               <table className="w-full border-collapse border-none text-center bg-white text-[10px]">
                  <thead>
                     <tr className="bg-gray-100 font-bold border-b border-gray-300">
                        <th className="p-2 border-r border-gray-200">Diám.</th>
                        <th className="p-2 border-r border-gray-200">Grado</th>
                        <th className="p-2 border-r border-gray-200">Peso lb/pie</th>
                        <th className="p-2 border-r border-gray-200 bg-yellow-50">Peso kg/m</th>
                        <th className="p-2 border-r border-gray-200">Máx Tensión</th>
                        <th className="p-2 border-r border-gray-200">Colapso</th>
                        <th className="p-2 border-r border-gray-200">Diám.Int</th>
                        <th className="p-2 border-r border-gray-200">Diám.Ext</th>
                        <th className="p-2 border-r border-gray-200">Drift</th>
                        <th className="p-2 border-r border-gray-200 text-blue-800">Torque Op</th>
                        <th className="p-2 border-r border-gray-200 text-red-800">Torque Máx</th>
                        <th className="p-2 border-r border-gray-200 bg-blue-50">Desplaz.</th>
                        <th className="p-2">Calibre</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td className="p-2 border-r border-gray-200 font-bold">{activeSpec.tbg}</td>
                        <td className="p-2 border-r border-gray-200 font-bold">{activeSpec.grado}</td>
                        <td className="p-2 border-r border-gray-200">{activeSpec.pesoLbPie}</td>
                        <td className="p-2 border-r border-gray-200 bg-yellow-50 font-bold">{activeSpec.peso}</td>
                        <td className="p-2 border-r border-gray-200">{activeSpec.maxTension}</td>
                        <td className="p-2 border-r border-gray-200">{activeSpec.colapso}</td>
                        <td className="p-2 border-r border-gray-200">{activeSpec.diamInt}</td>
                        <td className="p-2 border-r border-gray-200">{activeSpec.diamExt}</td>
                        <td className="p-2 border-r border-gray-200">{activeSpec.drift}</td>
                        <td className="p-2 border-r border-gray-200 font-bold text-blue-700">{activeSpec.torqueOp}</td>
                        <td className="p-2 border-r border-gray-200 font-bold text-red-700">{activeSpec.torqueMax}</td>
                        <td className="p-2 border-r border-gray-200 bg-blue-50 font-bold">{activeSpec.desplazamiento}</td>
                        <td className="p-2">{activeSpec.calibre}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         ) : (
            <div className="text-gray-500 italic text-center p-4 border-2 border-dashed border-gray-300 rounded bg-gray-50">
               Seleccione Grado y Diámetro para ver propiedades
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
         {/* Section 3: Tool Pool */}
         <div className="p-4 border-b md:border-b-0 md:border-r border-gray-300">
            <h3 className="font-bold text-sm mb-2 uppercase text-gray-700">Pool de Herramientas</h3>
            <table className="w-full border-collapse border border-gray-400 text-xs rounded overflow-hidden">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="border p-2 text-left">Herramienta</th>
                     <th className="border p-2 w-24">Metros</th>
                  </tr>
               </thead>
               <tbody>
                  {poolHerramientas.map((tool) => (
                     <tr key={tool.id}>
                        <td className="border p-2 pl-2 font-medium">{tool.herramienta}</td>
                        <td className="border p-0">
                           <input 
                              type="number" 
                              step="0.01" 
                              className="w-full h-full text-center outline-none bg-transparent p-1 font-bold"
                              value={tool.metros}
                              onChange={(e) => handlePoolChange(tool.id, e.target.value)}
                           />
                        </td>
                     </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                     <td className="border p-2 text-right pr-4 uppercase text-gray-600">Total Pool:</td>
                     <td className="border p-2 text-center text-blue-800">{calculated.totalPoolMetros.toFixed(2)} m</td>
                  </tr>
               </tbody>
            </table>
            
            <div className="mt-6 space-y-3">
               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold w-40 text-gray-700">Carrera Zto Tope Final:</span>
                  <input 
                     name="carreraZtoTopeFinal" 
                     value={metadata.carreraZtoTopeFinal} 
                     onChange={handleMetadataChange} 
                     className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none bg-white" 
                  />
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-bold w-40 text-gray-700">HTA C/B N°:</span>
                  <input 
                     name="htaCbNumero" 
                     value={metadata.htaCbNumero} 
                     onChange={handleMetadataChange} 
                     className="flex-1 border border-gray-300 rounded px-3 py-1.5 outline-none bg-white" 
                  />
               </div>
            </div>
         </div>

         {/* Section 4: Tubing Measurement Grid */}
         <div className="p-4">
            <h3 className="font-bold text-sm mb-2 uppercase text-gray-700">Medición de Tubos (Metros)</h3>
            
            {/* Mobile Scroll Indicator */}
            <div className="sm:hidden bg-blue-50 border border-blue-200 rounded-md p-3 mb-3 flex items-center gap-2">
              <span className="text-blue-600 text-lg">👈👉</span>
              <span className="text-xs text-blue-700 font-medium">
                Deslizá horizontalmente para ver todos los tubos
              </span>
            </div>

            <div className="border border-gray-400 p-0 rounded overflow-x-auto bg-gray-50">
               <div className="flex min-w-[900px]">
                  {tubos.map((val, idx) => (
                     <div key={idx} className="flex flex-col items-center flex-1 border-r border-gray-300 last:border-r-0 min-w-[45px]">
                        <span className="text-[10px] font-bold text-gray-500 py-1 bg-gray-200 w-full text-center border-b border-gray-300 block">{idx + 1}</span>
                        <input 
                           type="number" 
                           step="0.01"
                           className="w-full text-center text-xs p-2 bg-white focus:bg-blue-50 focus:outline-none"
                           value={val === 0 ? '' : val}
                           onChange={(e) => handleTuboChange(idx, e.target.value)}
                           placeholder="-"
                        />
                     </div>
                  ))}
               </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="border p-3 rounded-lg bg-blue-50 border-blue-200">
                  <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Total Metros</div>
                  <div className="text-2xl font-bold text-blue-800">{calculated.totalMetros.toFixed(2)} m</div>
               </div>
               <div className="border p-3 rounded-lg bg-gray-50 border-gray-200">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cant. Tubos</div>
                  <div className="text-2xl font-bold text-gray-800">{calculated.cantidadTubos}</div>
               </div>
               <div className="border p-3 rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider mb-1">Peso Total</div>
                  <div className="text-2xl font-bold text-yellow-800">{calculated.pesoTotalKg.toFixed(2)} kg</div>
               </div>
               <div className="border p-3 rounded-lg bg-green-50 border-green-200">
                  <div className="text-[10px] text-green-700 font-bold uppercase tracking-wider mb-1">Volumen Total</div>
                  <div className="text-2xl font-bold text-green-800">{calculated.totalVolumeLts.toFixed(2)} lts</div>
               </div>
            </div>
         </div>
      </div>

      {/* Section 5: Casing Reference */}
      <div className="p-4 border-b border-gray-300">
         <h3 className="font-bold text-sm mb-2 uppercase text-gray-700">Tabla Referencia Revestidor (Casing)</h3>
         <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full border-collapse text-center text-[10px] min-w-[500px]">
               <thead>
                  <tr className="bg-gray-100 font-bold border-b border-gray-300">
                     <th className="p-2 border-r border-gray-200">OD (pulg)</th>
                     <th className="p-2 border-r border-gray-200">Peso (lb/pie)</th>
                     <th className="p-2 border-r border-gray-200">Diám. Int. (mm)</th>
                     <th className="p-2 border-r border-gray-200">Drift (mm)</th>
                     <th className="p-2">Capacidad (Lts/m)</th>
                  </tr>
               </thead>
               <tbody>
                  {CASING_DATA.map((row, idx) => {
                     // Simple grouping color logic based on OD
                     const bgClass = row.od === "5" ? "bg-red-50/50" : 
                                     row.od === "5.5" ? "bg-blue-50/50" : 
                                     row.od === "7" ? "bg-green-50/50" : "bg-yellow-50/50";
                     return (
                        <tr key={idx} className={`${bgClass} border-b border-gray-200 last:border-b-0`}>
                           <td className="p-1 font-bold border-r border-gray-200">{row.od}</td>
                           <td className="p-1 border-r border-gray-200">{row.lbPie}</td>
                           <td className="p-1 border-r border-gray-200">{row.diamIntMm}</td>
                           <td className="p-1 border-r border-gray-200">{row.driftMm}</td>
                           <td className="p-1 font-bold">{row.ltsPorMt}</td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* Section 6: Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 page-break-inside-avoid">
          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
             <div className="mb-4">
                <label className="block text-xs font-bold uppercase mb-1 text-gray-500">Nombre Inspector:</label>
                <input 
                   className="w-full border-b border-gray-400 bg-transparent outline-none text-sm py-1 font-medium" 
                   value={signatures.inspector?.name || ''}
                   onChange={(e) => handleSignatureChange('inspector', undefined, e.target.value)}
                   placeholder="Ingrese nombre..."
                />
             </div>
             <div className="h-32 bg-white border border-gray-300 rounded mb-2 overflow-hidden">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.inspector?.data} 
                   onChange={(val) => handleSignatureChange('inspector', val)}
                />
             </div>
             <div className="text-center font-bold text-xs uppercase text-gray-400 tracking-wider">Firma Inspector</div>
          </div>

          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
             <div className="mb-4">
                <label className="block text-xs font-bold uppercase mb-1 text-gray-500">Nombre Supervisor:</label>
                <input 
                   className="w-full border-b border-gray-400 bg-transparent outline-none text-sm py-1 font-medium" 
                   value={signatures.supervisor?.name || ''}
                   onChange={(e) => handleSignatureChange('supervisor', undefined, e.target.value)}
                   placeholder="Ingrese nombre..."
                />
             </div>
             <div className="h-32 bg-white border border-gray-300 rounded mb-2 overflow-hidden">
                <SignaturePad 
                   label="" 
                   className="h-full border-0 w-full"
                   value={signatures.supervisor?.data} 
                   onChange={(val) => handleSignatureChange('supervisor', val)}
                />
             </div>
             <div className="text-center font-bold text-xs uppercase text-gray-400 tracking-wider">Firma Supervisor</div>
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
               filename={`medicion_tuberia_${metadata.fecha}_${metadata.pozo || 'pozo'}`}
               orientation="l"
               className="w-full"
             />
         </div>
         <Button variant="primary" onClick={() => onSave({ 
            id: initialData?.id || crypto.randomUUID(), 
            metadata, 
            tubos, 
            poolHerramientas,
            specs: activeSpec || null,
            calculados: calculated,
            signatures 
          })} className="w-full sm:w-auto">
           Guardar Planilla
         </Button>
      </div>

    </div>
  );
};
