import React from 'react';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  onCancel: () => void;
}

const healthData = [
  { level: 4, desc: 'Puede ser mortal' },
  { level: 3, desc: 'Puede causar daño serio o permanente' },
  { level: 2, desc: 'Puede causar la incapacitación temporal o daño residual' },
  { level: 1, desc: 'Puede causar la irritación significativa' },
  { level: 0, desc: 'No existe peligro' },
];

const flammabilityData = [
  { level: 4, desc: 'Se vaporizará y se quemará fácilmente bajo las temperaturas normales' },
  { level: 3, desc: 'Se puede encender bajo casi todas las temperaturas ambientes' },
  { level: 2, desc: 'Se debe calentar o someterlo a una temperatura ambiente alta para quemarse' },
  { level: 1, desc: 'Debe ser precalentado antes de que la ignición pueda ocurrir' },
  { level: 0, desc: 'No se quemará' },
];

const instabilityData = [
  { level: 4, desc: 'Puede estallar bajo las temperaturas y presiones normales' },
  { level: 3, desc: 'Puede explotar a altas temperaturas o por impacto' },
  { level: 2, desc: 'Cambios químicos violentos bajo las temperaturas o presiones altas' },
  { level: 1, desc: 'Normalmente estable. Las altas temperaturas lo convierten en inestable' },
  { level: 0, desc: 'Estable' },
];

const specialData = [
  { symbol: 'OX', label: 'Oxidante' },
  { symbol: 'SA', label: 'Asfixiantes simples' },
  { symbol: 'W̶', label: 'Reacciona violenta o explosivamente con agua' },
];

export const NFPAGuideForm: React.FC<Props> = ({ onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 font-sans" id="nfpa-guide-print">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 no-print">
        <button
          onClick={onCancel}
          title="Volver"
          aria-label="Volver"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver
        </button>
        <ExportPdfButton filename="NFPA-704-Guia-Clasificaciones" orientation="p" />
      </div>

      {/* Title */}
      <div className="bg-black text-white text-center font-bold text-lg py-3 px-4 rounded-t-lg flex items-center justify-center gap-3 mb-0">
        {/* mini diamond */}
        <DiamondMini />
        <span>GUÍA DE EXPLICACIONES DE LAS CLASIFICACIONES DE LA NFPA</span>
        <DiamondMini />
      </div>

      {/* Main grid: 2 columns top, 2 columns bottom */}
      <div className="border border-gray-400 rounded-b-lg overflow-hidden">

        {/* ── Row 1: Health (blue) + Diamond visual + Flammability (red) ── */}
        <div className="grid grid-cols-[1fr_auto_1fr]">
          {/* Health – blue */}
          <div className="border-r border-b border-gray-300 bg-blue-100 p-3">
            <h2 className="font-bold text-blue-900 text-sm mb-2 border-b border-blue-300 pb-1 uppercase tracking-wide">
              Peligro para la Salud
            </h2>
            <ul className="space-y-1">
              {healthData.map(({ level, desc }) => (
                <li key={level} className="flex gap-2 text-xs text-blue-900">
                  <span className="font-bold w-3 shrink-0">{level}</span>
                  <span>= {desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NFPA Diamond center */}
          <div className="flex items-center justify-center border-r border-b border-gray-300 bg-white px-4 py-3">
            <NFPADiamond />
          </div>

          {/* Flammability – red */}
          <div className="border-b border-gray-300 bg-red-50 p-3">
            <h2 className="font-bold text-red-800 text-sm mb-2 border-b border-red-300 pb-1 uppercase tracking-wide text-right">
              Peligro de Inflamabilidad
            </h2>
            <ul className="space-y-1">
              {flammabilityData.map(({ level, desc }) => (
                <li key={level} className="flex gap-2 justify-end text-xs text-red-900">
                  <span>=&nbsp;{desc}</span>
                  <span className="font-bold w-3 shrink-0">{level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Row 2: Special (white/black) + Instability (yellow) ── */}
        <div className="grid grid-cols-[1fr_auto_1fr]">
          {/* Special Hazard – dark */}
          <div className="border-r border-gray-300 bg-gray-900 p-4">
            <h2 className="font-bold text-white text-sm mb-3 border-b border-gray-600 pb-1 uppercase tracking-wide">
              Peligro Especial
            </h2>
            <ul className="space-y-3">
              {specialData.map(({ symbol, label }) => (
                <li key={symbol} className="flex items-center gap-3 text-white">
                  <span className="font-black text-2xl w-10 text-center leading-none">{symbol}</span>
                  <span className="text-sm">= {label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Center spacer under diamond */}
          <div className="border-r border-gray-300 bg-white px-4" />

          {/* Instability – yellow */}
          <div className="bg-yellow-50 p-3">
            <h2 className="font-bold text-yellow-800 text-sm mb-2 border-b border-yellow-300 pb-1 uppercase tracking-wide text-right">
              Peligro de Inestabilidad
            </h2>
            <ul className="space-y-1">
              {instabilityData.map(({ level, desc }) => (
                <li key={level} className="flex gap-2 justify-end text-xs text-yellow-900">
                  <span>=&nbsp;{desc}</span>
                  <span className="font-bold w-3 shrink-0">{level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="bg-gray-50 border-t border-gray-300 text-center text-xs text-gray-500 py-2 px-4">
          Este cuadro es solamente para referencia. Para las especificaciones completas, consulta la norma 704 de la NFPA.
        </div>
      </div>

      {/* ── Scale reference cards ── */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health card */}
        <div className="rounded-lg border-2 border-blue-500 overflow-hidden">
          <div className="bg-blue-600 text-white font-bold text-xs text-center py-1 uppercase tracking-wide">
            Salud (Azul)
          </div>
          <table className="w-full text-xs">
            <tbody>
              {healthData.map(({ level, desc }) => (
                <tr key={level} className="border-b border-blue-100 last:border-0">
                  <td className="bg-blue-500 text-white font-black text-center w-8 py-2">{level}</td>
                  <td className="px-2 py-1 text-gray-800">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flammability card */}
        <div className="rounded-lg border-2 border-red-500 overflow-hidden">
          <div className="bg-red-600 text-white font-bold text-xs text-center py-1 uppercase tracking-wide">
            Inflamabilidad (Rojo)
          </div>
          <table className="w-full text-xs">
            <tbody>
              {flammabilityData.map(({ level, desc }) => (
                <tr key={level} className="border-b border-red-100 last:border-0">
                  <td className="bg-red-500 text-white font-black text-center w-8 py-2">{level}</td>
                  <td className="px-2 py-1 text-gray-800">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instability card */}
        <div className="rounded-lg border-2 border-yellow-500 overflow-hidden">
          <div className="bg-yellow-500 text-gray-900 font-bold text-xs text-center py-1 uppercase tracking-wide">
            Inestabilidad (Amarillo)
          </div>
          <table className="w-full text-xs">
            <tbody>
              {instabilityData.map(({ level, desc }) => (
                <tr key={level} className="border-b border-yellow-100 last:border-0">
                  <td className="bg-yellow-400 text-gray-900 font-black text-center w-8 py-2">{level}</td>
                  <td className="px-2 py-1 text-gray-800">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special hazard card */}
      <div className="mt-4 rounded-lg border-2 border-gray-700 overflow-hidden">
        <div className="bg-gray-800 text-white font-bold text-xs text-center py-1 uppercase tracking-wide">
          Peligro Especial (Blanco)
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-300">
          {specialData.map(({ symbol, label }) => (
            <div key={symbol} className="flex flex-col items-center p-3 bg-white">
              <span className="font-black text-3xl text-gray-900 mb-1">{symbol}</span>
              <span className="text-xs text-center text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

const DiamondMini: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true">
    <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="white" strokeWidth="1.5" />
    <polygon points="20,2 38,20 20,20 2,20" fill="#3B82F6" />
    <polygon points="2,20 20,20 20,38" fill="#EAB308" />
    <polygon points="38,20 20,20 20,38" fill="#EF4444" />
    <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="white" strokeWidth="1" />
    <line x1="2" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1" />
    <line x1="20" y1="2" x2="20" y2="38" stroke="white" strokeWidth="1" />
  </svg>
);

const NFPADiamond: React.FC = () => (
  <svg
    width="180"
    height="180"
    viewBox="0 0 200 200"
    aria-label="Rombo NFPA 704"
    role="img"
  >
    {/* Outer diamond border */}
    <polygon points="100,4 196,100 100,196 4,100" fill="white" stroke="#374151" strokeWidth="3" />

    {/* Blue – Health (left) */}
    <polygon points="100,4 4,100 100,100" fill="#2563EB" />
    {/* Red – Flammability (top-right) */}
    <polygon points="100,4 196,100 100,100" fill="#DC2626" />
    {/* Yellow – Instability (right/bottom-right) */}
    <polygon points="196,100 100,196 100,100" fill="#CA8A04" />
    {/* White – Special (bottom-left) */}
    <polygon points="4,100 100,196 100,100" fill="#F9FAFB" />

    {/* Inner dividers */}
    <polygon points="100,4 196,100 100,196 4,100" fill="none" stroke="white" strokeWidth="2" />
    <line x1="4" y1="100" x2="196" y2="100" stroke="white" strokeWidth="2" />
    <line x1="100" y1="4" x2="100" y2="196" stroke="white" strokeWidth="2" />

    {/* Labels */}
    <text x="52" y="108" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">3</text>
    <text x="148" y="70" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">2</text>
    <text x="148" y="140" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">1</text>
    <text x="52" y="155" textAnchor="middle" fill="#1F2937" fontSize="16" fontWeight="bold">OX</text>
  </svg>
);
