
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  onCancel: () => void;
}

interface MaterialRow {
  id: string;
  material: string;
  cantidad: number;
  poderCalorifico: number;
}

interface ExtintorRow {
  cantidad: string;
  masa: string;
  capacidadExtint: string;
  agenteExtintor: string;
  potencialCert: string;
}

interface FireLoadMetadata {
  superficie: string;
  tipoRiesgo: string;
  sectorReunion: string;
  nroDomicilio: string;
  coefExistencias: number;
  areaRiesgoM2: number;
}

const defaultMaterials = (): MaterialRow[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: String(i + 1),
    material: '',
    cantidad: 0,
    poderCalorifico: 0,
  }));

const usoOcupacion: { uso: string; m2porPersona: number }[] = [
  { uso: 'a) Salas de asambleas, auditorios, salas de conciertos, salas de baile', m2porPersona: 1 },
  { uso: 'b) Edificios educacionales, templos', m2porPersona: 2 },
  { uso: 'c) Lugares de trabajo, teatros, patios y terrazas destinadas a comedores', m2porPersona: 3 },
  { uso: 'd) Salones de billar, canchas de bolos y bochas, gimnasios, pistas de patinaje, albergues transitorios y alojamiento', m2porPersona: 5 },
  { uso: 'e) Edificios de escritorios y oficinas, bancos, tramitadoras, clínicas, salas médicas, casas de baile', m2porPersona: 8 },
  { uso: 'f) Viviendas privadas y colectivas', m2porPersona: 12 },
  { uso: 'g) Edificios industriales; el número de ocupantes será determinado por el propietario conforme a los datos del establecimiento', m2porPersona: 16 },
  { uso: 'h) Salas de juego', m2porPersona: 2 },
  { uso: 'i) Grandes tiendas, supermercados, planta baja y 1er. subsuelo', m2porPersona: 3 },
  { uso: 'j) Grandes tiendas, supermercados, pisos superiores', m2porPersona: 8 },
  { uso: 'k) Hoteles, planta baja y restaurantes', m2porPersona: 3 },
  { uso: 'l) Hoteles, pisos superiores', m2porPersona: 20 },
  { uso: 'm) Depósitos', m2porPersona: 30 },
];

// Potencial extintor requerido por Riesgo (Decreto 351/79 Anexo VII, Tabla 2)
// Clase A: índices mínimos por nivel de riesgo 1-5
const potencialClaseA: { rango: string; r1: string; r2: string; r3: string; r4: string; r5: string }[] = [
  { rango: 'Hasta 50 kg/m²', r1: '—', r2: '—', r3: '1A', r4: '2A', r5: '4A' },
  { rango: 'Desde 50 a 100 kg/m²', r1: '—', r2: '1A', r3: '2A', r4: '4A', r5: '6A' },
  { rango: 'Desde 25 a 100 kg/m²', r1: '1A', r2: '2A', r3: '4A', r4: '6A', r5: '10A' },
  { rango: 'Desde 101 a 500 kg/m²', r1: '2A', r2: '4A', r3: '6A', r4: '10A', r5: '20A' },
  { rango: 'Más de 500 kg/m²', r1: '4A', r2: '6A', r3: '10A', r4: '20A', r5: '40A' },
];

// Clase B
const potencialClaseB: { rango: string; r1: string; r2: string; r3: string; r4: string; r5: string }[] = [
  { rango: 'Hasta 50 kg/m²', r1: '—', r2: '—', r3: '20', r4: '40', r5: '—' },
  { rango: 'Desde 50 a 100 kg/m²', r1: '—', r2: '20', r3: '40', r4: '60', r5: '—' },
  { rango: 'Desde 101 a 200 kg/m²', r1: '20', r2: '40', r3: '60', r4: '80', r5: '—' },
  { rango: 'Desde 201 a 400 kg/m²', r1: '40', r2: '80', r3: '—', r4: '—', r5: '—' },
  { rango: 'Más de 400 kg/m²', r1: '60', r2: '—', r3: '—', r4: '—', r5: '—' },
];

function getClasificacion(qfi: number): { label: string; color: string; bg: string; desc: string } {
  if (qfi <= 10) return { label: 'LEVE', color: 'text-green-800', bg: 'bg-green-400', desc: 'Carga de fuego leve (≤ 10 kg/m²)' };
  if (qfi <= 30) return { label: 'ORDINARIO', color: 'text-orange-800', bg: 'bg-orange-400', desc: 'Carga de fuego ordinaria (10–30 kg/m²)' };
  if (qfi <= 60) return { label: 'EXTRA BAJO', color: 'text-red-700', bg: 'bg-red-400', desc: 'Carga de fuego extra bajo (30–60 kg/m²)' };
  if (qfi <= 100) return { label: 'EXTRA MEDIO', color: 'text-red-900', bg: 'bg-red-600', desc: 'Carga de fuego extra medio (60–100 kg/m²)' };
  return { label: 'EXTRA ALTO', color: 'text-white', bg: 'bg-red-900', desc: 'Carga de fuego extra alto (> 100 kg/m²)' };
}

function getRiesgoNumero(qfi: number): number {
  if (qfi <= 10) return 1;
  if (qfi <= 30) return 2;
  if (qfi <= 60) return 3;
  if (qfi <= 100) return 4;
  return 5;
}

export const FireLoadCalcForm: React.FC<Props> = ({ onCancel }) => {
  const [metadata, setMetadata] = useState<FireLoadMetadata>({
    superficie: '',
    tipoRiesgo: '',
    sectorReunion: '',
    nroDomicilio: '',
    coefExistencias: 1,
    areaRiesgoM2: 0,
  });

  const [materials, setMaterials] = useState<MaterialRow[]>(defaultMaterials());

  const [extintorRow, setExtintorRow] = useState<ExtintorRow>({
    cantidad: '',
    masa: '',
    capacidadExtint: '',
    agenteExtintor: '',
    potencialCert: '',
  });

  const [usoSeleccionado, setUsoSeleccionado] = useState<number | null>(null);
  const [nUnidadesEntrada, setNUnidadesEntrada] = useState<number>(100);
  const [nPersonasOcup, setNPersonasOcup] = useState<number>(0);

  // ── Cálculos principales ──────────────────────────────────────────
  const cargaCalorTotal = materials.reduce((acc, r) => acc + (r.cantidad * r.poderCalorifico), 0);
  const pesoEquivMadera = cargaCalorTotal / 4.4;
  const superficieM2 = parseFloat(metadata.superficie) || 0;
  const qfi = superficieM2 > 0 ? pesoEquivMadera / superficieM2 : 0;
  const qfiTotal = qfi * (metadata.coefExistencias || 1);
  const clasificacion = getClasificacion(qfiTotal);
  const riesgoNum = getRiesgoNumero(qfiTotal);

  // Extintores sugeridos
  const extintoresSugeridos = metadata.areaRiesgoM2 > 0 ? Math.ceil(metadata.areaRiesgoM2 / 200) : 0;

  // Factor de ocupación
  const usoItem = usoSeleccionado !== null ? usoOcupacion[usoSeleccionado] : null;
  const nFactorOcupacion = usoItem && superficieM2 > 0 ? Math.ceil(superficieM2 / usoItem.m2porPersona) : 0;
  const nFactorPersonas = nUnidadesEntrada > 0 ? Math.ceil(nUnidadesEntrada * 0.2) : 0;
  const totalPersonasEdificio = nFactorPersonas + nPersonasOcup;

  const handleMeta = (field: keyof FireLoadMetadata, value: string | number) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleMaterial = (idx: number, field: keyof MaterialRow, value: string | number) => {
    setMaterials(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const addMaterial = () => {
    setMaterials(prev => [...prev, { id: String(prev.length + 1), material: '', cantidad: 0, poderCalorifico: 0 }]);
  };

  const removeMaterial = (idx: number) => {
    if (materials.length <= 1) return;
    setMaterials(prev => prev.filter((_, i) => i !== idx));
  };

  const inputCls = 'w-full outline-none bg-transparent border-b border-gray-300 focus:border-brand-red px-1 py-0.5 text-sm';
  const thCls = 'px-2 py-2 text-xs font-bold uppercase tracking-wide text-white text-center border border-gray-600';
  const tdCls = 'px-2 py-1.5 text-xs text-center border border-gray-200';

  return (
    <div id="print-area" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none font-sans text-sm">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 border-b-2 border-black">
        <div className="col-span-3 p-4 border-b sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center select-none">
          <div className="text-3xl font-black text-brand-red italic tracking-tighter">TACKER</div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-[-4px]">solutions</div>
        </div>
        <div className="col-span-6 p-4 flex items-center justify-center text-center border-b sm:border-b-0 sm:border-r-2 border-black bg-gray-50 sm:bg-white">
          <h1 className="font-black text-xl uppercase leading-tight text-brand-red">Determinación de la Carga de Fuego</h1>
        </div>
        <div className="col-span-3 p-4 flex flex-col items-center justify-center font-bold text-sm text-gray-600">
          <div>Dec. 351/79 – Anexo VII</div>
        </div>
      </div>

      {/* ── DATOS PRINCIPALES ─────────────────────────────── */}
      <div className="bg-sky-100 border-b border-black">
        <div className="bg-sky-600 text-white text-xs font-bold uppercase px-4 py-1 tracking-wide">Datos Principales</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
          {[
            { label: 'Superficie', field: 'superficie' as const, placeholder: 'Ej: Depósito' },
            { label: 'Tipo de Riesgo', field: 'tipoRiesgo' as const, placeholder: 'Ej: Clase A' },
            { label: 'Sector / Reunión', field: 'sectorReunion' as const, placeholder: 'Ej: Sector Norte' },
            { label: 'N° y Domicilio del Inmueble', field: 'nroDomicilio' as const, placeholder: 'Dirección' },
          ].map(({ label, field, placeholder }) => (
            <div key={field} className="flex flex-col gap-1">
              <label htmlFor={field} className="text-[10px] font-bold uppercase text-gray-500">{label}</label>
              <input
                id={field}
                title={label}
                placeholder={placeholder}
                className="border-b border-gray-400 outline-none bg-transparent text-sm font-medium uppercase py-0.5"
                value={metadata[field] as string}
                onChange={e => handleMeta(field, e.target.value)}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label htmlFor="superficieM2" className="text-[10px] font-bold uppercase text-gray-500">Superficie del Sector (m²)</label>
            <input
              id="superficieM2"
              title="Superficie del Sector en m²"
              type="number"
              placeholder="0"
              className="border-b border-gray-400 outline-none bg-transparent text-sm font-medium py-0.5"
              value={metadata.superficie === '' ? '' : parseFloat(metadata.superficie) || ''}
              onChange={e => handleMeta('superficie', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="coefExistencias" className="text-[10px] font-bold uppercase text-gray-500">Coef. de Existencias (K)</label>
            <input
              id="coefExistencias"
              title="Coeficiente de Existencias"
              type="number"
              step="0.1"
              placeholder="1.0"
              className="border-b border-gray-400 outline-none bg-transparent text-sm font-medium py-0.5"
              value={metadata.coefExistencias}
              onChange={e => handleMeta('coefExistencias', parseFloat(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>

      {/* ── TABLA MATERIALES ──────────────────────────────── */}
      <div className="border-b border-black">
        <div className="bg-sky-600 text-white text-xs font-bold uppercase px-4 py-1 tracking-wide">
          Cálculo Carga de Fuego Total (kg/m²) — Dec. 351/79 Anexo I-0-3-4-5-6-7
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-sky-700">
                <th className={`${thCls} w-8`}>#</th>
                <th className={`${thCls} text-left`}>Material / Sustancia</th>
                <th className={thCls}>Cantidad (kg)</th>
                <th className={thCls}>Poder Calorífico (Mcal/kg)</th>
                <th className={thCls}>Carga de Calor (Mcal)</th>
                <th className={`${thCls} w-8 no-print`}></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((row, idx) => {
                const cargaCalor = row.cantidad * row.poderCalorifico;
                return (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                    <td className={`${tdCls} font-bold text-gray-500`}>{idx + 1}</td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input
                        title={`Material ${idx + 1}`}
                        placeholder="Nombre del material"
                        className={inputCls}
                        value={row.material}
                        onChange={e => handleMaterial(idx, 'material', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input
                        title={`Cantidad kg material ${idx + 1}`}
                        type="number"
                        placeholder="0"
                        className={`${inputCls} text-center`}
                        value={row.cantidad || ''}
                        onChange={e => handleMaterial(idx, 'cantidad', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-2 py-1 border border-gray-200">
                      <input
                        title={`Poder calorífico material ${idx + 1}`}
                        type="number"
                        step="0.1"
                        placeholder="4.4"
                        className={`${inputCls} text-center`}
                        value={row.poderCalorifico || ''}
                        onChange={e => handleMaterial(idx, 'poderCalorifico', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-center font-bold text-sky-800 bg-sky-50">
                      {cargaCalor > 0 ? cargaCalor.toFixed(2) : '—'}
                    </td>
                    <td className="px-1 py-1 border border-gray-200 text-center no-print">
                      <button
                        title="Eliminar fila"
                        aria-label="Eliminar fila"
                        onClick={() => removeMaterial(idx)}
                        className="text-red-400 hover:text-red-700 text-base font-bold leading-none"
                      >×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-sky-700 text-white font-bold">
                <td className="px-2 py-2 border border-sky-500 text-center" colSpan={4}>Total Peso en Kg → CALCULO EN KG POR CONVENIENCIA</td>
                <td className="px-2 py-2 border border-sky-500 text-center text-lg">{cargaCalorTotal.toFixed(2)} <span className="text-xs font-normal">Mcal</span></td>
                <td className="border border-sky-500 no-print"></td>
              </tr>
            </tfoot>
          </table>
          <div className="mt-2 no-print">
            <button
              title="Agregar fila de material"
              aria-label="Agregar fila de material"
              onClick={addMaterial}
              className="text-xs px-3 py-1 rounded border border-sky-400 text-sky-700 hover:bg-sky-50 font-semibold"
            >
              + Agregar material
            </button>
            <span className="text-[10px] text-gray-400 ml-3">Nota: Agregar más filas si es necesario</span>
          </div>
        </div>
      </div>

      {/* ── FÓRMULAS Y CLASIFICACIÓN ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-black">

        {/* Fórmulas */}
        <div className="p-4 space-y-3 border-r border-black">
          <div className="bg-sky-600 text-white text-xs font-bold uppercase px-2 py-1 rounded tracking-wide -mx-4 -mt-4 mb-4">Fórmulas (Dec. 351/79)</div>

          {/* Pem */}
          <div className="bg-gray-50 rounded border border-gray-200 p-3">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Fórmula Peso Equivalente en Madera (Pem)</div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Total de Calorías (Q÷) =</span>
              <span className="font-black text-sky-700 text-base">{cargaCalorTotal.toFixed(2)}</span>
              <span>Mcal</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
              <span>Peso Madera (4.4 Mcal/kg) →</span>
              <span className="font-black text-sky-800 text-base bg-sky-100 px-2 rounded">{pesoEquivMadera.toFixed(2)}</span>
              <span>kg</span>
            </div>
          </div>

          {/* Qfi */}
          <div className="bg-gray-50 rounded border border-gray-200 p-3">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Fórmula Carga de Fuego (Qfi)</div>
            <div className="text-xs text-gray-600">
              Kg/m² Total eq. de madera / Superficie sector m²
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{pesoEquivMadera.toFixed(2)} kg ÷ {superficieM2 || '?'} m² =</span>
              <span className="font-black text-sky-800 text-xl bg-sky-100 px-2 rounded">{qfi.toFixed(2)}</span>
              <span className="text-xs">kg/m²</span>
            </div>
          </div>

          {/* Qfi Total */}
          <div className="bg-gray-50 rounded border border-gray-200 p-3">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Fórmula Carga de Fuego Total Existente (Qfi Total)</div>
            <div className="text-xs text-gray-600">Qfi × Coeficiente de Existencias (K)</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{qfi.toFixed(2)} × {metadata.coefExistencias} =</span>
              <span className="font-black text-sky-800 text-xl bg-sky-100 px-2 rounded">{qfiTotal.toFixed(2)}</span>
              <span className="text-xs">kg/m²</span>
            </div>
          </div>
        </div>

        {/* Clasificación */}
        <div className="p-4 flex flex-col gap-3">
          <div className="bg-sky-600 text-white text-xs font-bold uppercase px-2 py-1 rounded tracking-wide -mx-4 -mt-4 mb-4">Clasificación (Qi)</div>

          <div className="text-xs text-gray-500 mb-1">Nota: Basar según la Qi</div>

          {/* Tabla clasificación */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-3 py-2 border border-gray-600 text-left font-bold">Carga de Fuego</th>
                <th className="px-3 py-2 border border-gray-600 text-center font-bold">Clasificación</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rango: '≤ 10 kg/m²', label: 'LEVE', bg: 'bg-green-400 text-green-900' },
                { rango: '10 – 30 kg/m²', label: 'ORDINARIO', bg: 'bg-orange-400 text-orange-900' },
                { rango: '30 – 60 kg/m²', label: 'EXTRA BAJO', bg: 'bg-red-400 text-white' },
                { rango: '60 – 100 kg/m²', label: 'EXTRA MEDIO', bg: 'bg-red-600 text-white' },
                { rango: '> 100 kg/m²', label: 'EXTRA ALTO', bg: 'bg-red-900 text-white' },
              ].map(row => (
                <tr key={row.label}>
                  <td className="px-3 py-1.5 border border-gray-200 text-gray-700">{row.rango}</td>
                  <td className={`px-3 py-1.5 border border-gray-200 text-center font-bold ${row.bg}`}>{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Resultado clasificación */}
          <div className={`mt-4 rounded-lg p-4 text-center border-2 ${clasificacion.bg} border-transparent`}>
            <div className="text-xs text-white/80 uppercase font-semibold mb-1">Clasificación obtenida</div>
            <div className="text-3xl font-black text-white tracking-wide">{clasificacion.label}</div>
            <div className="text-sm font-bold text-white mt-1">{qfiTotal.toFixed(2)} kg/m²</div>
            <div className="text-xs text-white/80 mt-1">Riesgo N° {riesgoNum}</div>
          </div>
        </div>
      </div>

      {/* ── POTENCIAL EXTINTOR ────────────────────────────── */}
      <div className="border-b border-black">
        <div className="bg-sky-600 text-white text-xs font-bold uppercase px-4 py-1 tracking-wide">
          Potencial Extintor (Nro. 2-7 — Dec. 351/79)
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Clase A */}
          <div>
            <div className="text-xs font-bold uppercase text-gray-600 mb-2 border-b border-gray-200 pb-1">Fuegos Clase A</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className={thCls}>Carga de Fuego</th>
                  {[1, 2, 3, 4, 5].map(r => (
                    <th key={r} className={`${thCls} ${r === riesgoNum ? 'bg-yellow-500 text-gray-900' : ''}`}>
                      Riesgo {r} {r === riesgoNum ? '◀' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {potencialClaseA.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1.5 border border-gray-200 text-gray-700 font-medium">{row.rango}</td>
                    {[row.r1, row.r2, row.r3, row.r4, row.r5].map((v, vi) => (
                      <td key={vi} className={`${tdCls} font-bold ${vi + 1 === riesgoNum ? 'bg-yellow-100 text-yellow-800' : ''}`}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-100 border-t-2 border-gray-300">
                  <td className="px-2 py-1.5 border border-gray-200 text-xs font-bold text-gray-600" colSpan={2}>Distancia máx. a recorrer hasta extintor</td>
                  <td className={tdCls} colSpan={4}>20 m</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-2 py-1.5 border border-gray-200 text-xs font-bold text-gray-600" colSpan={2}>Distancia máx. sin rociadores automáticos</td>
                  <td className={tdCls} colSpan={4}>0–15 m</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clase B */}
          <div>
            <div className="text-xs font-bold uppercase text-gray-600 mb-2 border-b border-gray-200 pb-1">Fuegos Clase B</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className={thCls}>Carga de Fuego</th>
                  {[1, 2, 3, 4, 5].map(r => (
                    <th key={r} className={`${thCls} ${r === riesgoNum ? 'bg-yellow-500 text-gray-900' : ''}`}>
                      Riesgo {r} {r === riesgoNum ? '◀' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {potencialClaseB.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1.5 border border-gray-200 text-gray-700 font-medium">{row.rango}</td>
                    {[row.r1, row.r2, row.r3, row.r4, row.r5].map((v, vi) => (
                      <td key={vi} className={`${tdCls} font-bold ${vi + 1 === riesgoNum ? 'bg-yellow-100 text-yellow-800' : ''}`}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-100 border-t-2 border-gray-300">
                  <td className="px-2 py-1.5 border border-gray-200 text-xs font-bold text-gray-600" colSpan={2}>Nota: Total la celda que corresponda</td>
                  <td className={tdCls} colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── CANTIDAD EXTINTORES SUGERIDOS ─────────────────── */}
      <div className="border-b border-black">
        <div className="bg-sky-600 text-white text-xs font-bold uppercase px-4 py-1 tracking-wide">
          Cálculo Cantidad de Extintores Sugeridos
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label htmlFor="areaRiesgo" className="text-xs font-bold uppercase text-gray-500 w-40">Área de riesgo (m²)</label>
              <input
                id="areaRiesgo"
                title="Área de riesgo en m²"
                type="number"
                className="w-28 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-red"
                value={metadata.areaRiesgoM2 || ''}
                onChange={e => handleMeta('areaRiesgoM2', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <span className="text-xs text-gray-500">m²</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase text-gray-500 w-40">Extintores sugeridos</span>
              <span className="text-2xl font-black text-sky-700 bg-sky-100 px-4 py-1 rounded">{extintoresSugeridos}</span>
              <span className="text-xs text-gray-400">(1 por cada 200 m²)</span>
            </div>
          </div>

          {/* Detalle extintor */}
          <div>
            <div className="text-xs font-bold uppercase text-gray-600 mb-2">Extintores Definitivos — Cantidad de Extintores I</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {([
                { label: 'Cantidad', field: 'cantidad' as const, placeholder: 'Ej: 2' },
                { label: 'Masa', field: 'masa' as const, placeholder: 'Ej: 10 kg' },
                { label: 'Capacidad Extint.', field: 'capacidadExtint' as const, placeholder: 'Ej: 10 l' },
                { label: 'Agente Extintor', field: 'agenteExtintor' as const, placeholder: 'Ej: PQS, CO2' },
                { label: 'Potencial s/ certificado', field: 'potencialCert' as const, placeholder: 'Ej: 4A / 40B' },
              ] as { label: string; field: keyof ExtintorRow; placeholder: string }[]).map(({ label, field, placeholder }) => (
                <div key={field} className="flex flex-col gap-0.5">
                  <label htmlFor={`ext-${field}`} className="text-[10px] font-bold uppercase text-gray-400">{label}</label>
                  <input
                    id={`ext-${field}`}
                    title={label}
                    placeholder={placeholder}
                    className="border-b border-gray-300 outline-none text-sm py-0.5 focus:border-brand-red bg-transparent uppercase"
                    value={extintorRow[field]}
                    onChange={e => setExtintorRow(prev => ({ ...prev, [field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              <span className="font-bold">Nota:</span> Colocar en dato
            </div>
          </div>
        </div>
      </div>

      {/* ── FACTOR DE OCUPACIÓN ───────────────────────────── */}
      <div className="border-b border-black">
        <div className="bg-sky-600 text-white text-xs font-bold uppercase px-4 py-1 tracking-wide">
          Cálculo en Función del Valor y Factor de Ocupación
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nUnidades" className="text-[10px] font-bold uppercase text-gray-500">N/ Factor de personas</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="nUnidades"
                    title="N Factor de personas"
                    type="number"
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-red"
                    value={nUnidadesEntrada}
                    onChange={e => setNUnidadesEntrada(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Ocupantes por unité / piso, destinado a una unidad de bloque</div>
              </div>
              <div>
                <label htmlFor="nPersonasOcup" className="text-[10px] font-bold uppercase text-gray-500">Otras personas (pisos)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="nPersonasOcup"
                    title="Otras personas"
                    type="number"
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-brand-red"
                    value={nPersonasOcup}
                    onChange={e => setNPersonasOcup(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sky-50 rounded border border-sky-200 p-3 text-center">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">N/ Factor de Ocupación</div>
                <div className="text-2xl font-black text-sky-700">{nFactorOcupacion}</div>
                <div className="text-xs text-gray-400 mt-1">personas (uso seleccionado)</div>
              </div>
              <div className="bg-sky-50 rounded border border-sky-200 p-3 text-center">
                <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Total Personas Edificio</div>
                <div className="text-2xl font-black text-sky-700">{totalPersonasEdificio}</div>
                <div className="text-xs text-gray-400 mt-1">Calculado al 20% libre para otros pisos</div>
              </div>
            </div>
          </div>

          {/* Tabla USO */}
          <div>
            <div className="text-xs font-bold uppercase text-gray-600 mb-2">USO — m² por persona (seleccione el tipo)</div>
            <div className="overflow-y-auto max-h-64 border border-gray-200 rounded">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-gray-700 text-white">
                  <tr>
                    <th className="px-2 py-2 text-left font-bold border border-gray-600">USO</th>
                    <th className="px-2 py-2 text-center font-bold border border-gray-600 whitespace-nowrap">m² / persona</th>
                  </tr>
                </thead>
                <tbody>
                  {usoOcupacion.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer transition-colors ${usoSeleccionado === idx ? 'bg-sky-200 font-bold' : idx % 2 === 0 ? 'bg-white hover:bg-sky-50' : 'bg-gray-50 hover:bg-sky-50'}`}
                      onClick={() => setUsoSeleccionado(idx)}
                    >
                      <td className="px-2 py-1.5 border border-gray-200 leading-snug">{item.uso}</td>
                      <td className="px-2 py-1.5 border border-gray-200 text-center font-bold text-sky-700">{item.m2porPersona}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {usoSeleccionado !== null && (
              <div className="mt-2 text-xs text-sky-700 font-semibold">
                Seleccionado: {usoOcupacion[usoSeleccionado].uso} — {usoOcupacion[usoSeleccionado].m2porPersona} m²/persona
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER LEGAL ─────────────────────────────────── */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 text-center">
        GENERADO POR WS OPERACIONES — Dec. 351/79 — TODOS LOS DERECHOS RESERVADOS — SE PROHÍBE SU REPRODUCCIÓN RÉPLICA.
      </div>

      {/* ── ACCIONES ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end p-4 sm:p-6 border-t border-gray-200 no-print bg-gray-50">
        <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
          Cerrar
        </Button>
        <Button variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto order-2">
          🖨️ Imprimir
        </Button>
        <div className="w-full sm:w-auto order-1 sm:order-3">
          <ExportPdfButton
            filename="calculo_carga_de_fuego"
            orientation="p"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
