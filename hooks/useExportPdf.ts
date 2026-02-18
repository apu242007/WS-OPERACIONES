import { useState, useCallback } from 'react';
import { exportToPdf } from '../utils/exportPdf';

export const useExportPdf = (filename: string, orientation: 'p' | 'l' = 'p', elementId?: string) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    // Allow UI to update before blocking main thread
    setTimeout(async () => {
        await exportToPdf({ filename, orientation, elementId });
        setExporting(false);
    }, 100);
  }, [filename, orientation, elementId]);

  return { handleExport, exporting };
};