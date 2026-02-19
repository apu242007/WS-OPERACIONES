import { useState, useCallback } from 'react';
import { exportToPdf } from '../utils/exportPdf';

export type EmailStatus = 'idle' | 'sending' | 'sent' | 'error';

export const useExportPdf = (filename: string, orientation: 'p' | 'l' = 'p', elementId?: string) => {
  const [exporting, setExporting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const [emailTo, setEmailTo] = useState('');
  const [emailSendError, setEmailSendError] = useState('');

  const handleExport = useCallback(async (to: string, message?: string) => {
    setExporting(true);
    setEmailStatus('sending');
    setEmailTo(to);
    setEmailSendError('');

    // Allow UI to update before blocking main thread
    setTimeout(async () => {
      try {
        const result = await exportToPdf({ filename, orientation, elementId, to, message });
        if (result.emailSuccess) {
          setEmailStatus('sent');
        } else {
          setEmailStatus('error');
          setEmailSendError(result.emailError ?? 'Error desconocido');
        }
        // Auto-clear feedback after 6 seconds
        setTimeout(() => setEmailStatus('idle'), 6000);
      } catch (err) {
        setEmailStatus('error');
        setEmailSendError(err instanceof Error ? err.message : 'Error desconocido');
        setTimeout(() => setEmailStatus('idle'), 6000);
      } finally {
        setExporting(false);
      }
    }, 100);
  }, [filename, orientation, elementId]);

  return { handleExport, exporting, emailStatus, emailTo, emailSendError };
};