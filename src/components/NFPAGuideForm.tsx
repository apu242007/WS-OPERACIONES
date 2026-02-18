import React from 'react';
import { ExportPdfButton } from './ExportPdfButton';

interface Props {
  onCancel: () => void;
}

const NFPA_IMAGE_URL =
  'https://raw.githubusercontent.com/apu242007/WS-OPERACIONES/main/src/1721314043890.jpg';

export const NFPAGuideForm: React.FC<Props> = ({ onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 font-sans" id="nfpa-guide-print">
      {/* Action bar */}
      <div className="flex items-center justify-between mb-4 no-print">
        <button
          onClick={onCancel}
          title="Volver"
          aria-label="Volver"
          className="text-sm text-blue-600 hover:underline"
        >
          {String.fromCharCode(8592)} Volver
        </button>
        <ExportPdfButton filename="NFPA-704-Guia-Clasificaciones" orientation="l" />
      </div>

      {/* Guide image */}
      <div className="flex justify-center">
        <img
          src={NFPA_IMAGE_URL}
          alt="Guia de explicaciones de las clasificaciones de la NFPA 704"
          title="Guia NFPA 704"
          className="w-full max-w-3xl h-auto object-contain rounded shadow"
        />
      </div>

      {/* Footer note */}
      <p className="mt-3 text-center text-xs text-gray-500">
        Este cuadro es solamente para referencia. Para las especificaciones completas, consulta la norma 704 de la NFPA.
      </p>
    </div>
  );
};
