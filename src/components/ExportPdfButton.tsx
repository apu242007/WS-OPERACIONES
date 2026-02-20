import React from 'react';
import { useExportPdf } from '../hooks/useExportPdf';

interface ExportPdfButtonProps {
  filename: string;
  elementId?: string;
  orientation?: 'p' | 'l';
  className?: string;
  label?: string;
  pdfComponent?: React.ReactElement;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  filename,
  className = '',
  label = 'Exportar PDF',
}) => {
  const { handleExport, exporting } = useExportPdf(filename);

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md transition-colors no-print ${className}`}
      title="Exportar PDF"
    >
      {exporting ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Generando...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
};
