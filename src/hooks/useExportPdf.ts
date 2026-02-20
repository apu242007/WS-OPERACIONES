import { useState, useCallback } from 'react';

export const useExportPdf = (filename: string) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(() => {
    setExporting(true);
    const originalTitle = document.title;
    document.title = filename;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      setExporting(false);
    }, 100);
  }, [filename]);

  return { handleExport, exporting };
};
