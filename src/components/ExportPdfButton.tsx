import React, { useState, useRef, useEffect } from 'react';
import { useExportPdf } from '../hooks/useExportPdf';
import { exportReactPdf } from '../utils/exportReactPdf';
import type { EmailStatus } from '../hooks/useExportPdf';

interface ExportPdfButtonProps {
  filename: string;
  elementId?: string;
  orientation?: 'p' | 'l';
  className?: string;
  label?: string;
  /**
   * Optional: a `<Document>` element built with @react-pdf/renderer.
   * When provided the button uses react-pdf to generate the PDF instead
   * of the html2canvas fallback, producing pixel-perfect output.
   *
   * Example:
   *   <ExportPdfButton
   *     filename="bump_test"
   *     pdfComponent={<BumpTestPdf report={report} />}
   *   />
   */
  pdfComponent?: React.ReactElement;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  filename,
  elementId,
  orientation = 'p',
  className = '',
  label = 'Exportar PDF',
  pdfComponent,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [emailFieldError, setEmailFieldError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  // ── html2canvas path (existing) ──────────────────────────────────────────
  const { handleExport, exporting: htmlExporting, emailStatus: htmlStatus,
          emailTo: htmlEmailTo, emailSendError: htmlError } =
    useExportPdf(filename, orientation as 'p' | 'l', elementId);

  // ── @react-pdf/renderer path (new) ──────────────────────────────────────
  const [reactExporting, setReactExporting]       = useState(false);
  const [reactStatus,    setReactStatus]          = useState<EmailStatus>('idle');
  const [reactEmailTo,   setReactEmailTo]         = useState('');
  const [reactError,     setReactError]           = useState('');

  // Derived: use the active path's state
  const usingReact  = !!pdfComponent;
  const exporting   = usingReact ? reactExporting   : htmlExporting;
  const emailStatus = usingReact ? reactStatus      : htmlStatus;
  const emailTo     = usingReact ? reactEmailTo     : htmlEmailTo;
  const emailSendError = usingReact ? reactError    : htmlError;

  useEffect(() => {
    if (modalOpen) {
      const t = setTimeout(() => emailRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [modalOpen]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleOpenModal = () => {
    if (exporting) return;
    setEmailFieldError('');
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (!isValidEmail(emailInput)) {
      setEmailFieldError('Ingresá un email válido');
      emailRef.current?.focus();
      return;
    }
    setEmailFieldError('');
    setModalOpen(false);

    if (usingReact && pdfComponent) {
      // ── @react-pdf/renderer path ─────────────────────────────────────────
      setReactExporting(true);
      setReactStatus('sending');
      setReactEmailTo(emailInput);
      setReactError('');

      exportReactPdf(pdfComponent, {
        filename,
        to: emailInput,
        message: messageInput.trim() || undefined,
      }).then(result => {
        setReactStatus(result.emailSuccess ? 'sent' : 'error');
        if (!result.emailSuccess) setReactError(result.emailError ?? 'Error desconocido');
        setTimeout(() => setReactStatus('idle'), 6000);
      }).catch(err => {
        setReactStatus('error');
        setReactError(err instanceof Error ? err.message : 'Error desconocido');
        setTimeout(() => setReactStatus('idle'), 6000);
      }).finally(() => setReactExporting(false));
    } else {
      // ── html2canvas path (existing) ──────────────────────────────────────
      handleExport(emailInput, messageInput.trim() || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') setModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={exporting}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-md transition-colors no-print ${className}`}
        title="Generar archivo PDF"
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

      {emailStatus === 'sent' && (
        <p className="no-print mt-1 text-xs text-green-600 font-medium">
          \u2705 Email enviado a {emailTo}
        </p>
      )}
      {emailStatus === 'error' && (
        <p className="no-print mt-1 text-xs text-red-600 font-medium">
          \u274c Error al enviar: {emailSendError}
        </p>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 no-print"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onKeyDown={handleKeyDown}>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Enviar PDF por email</h2>
            </div>

            <div className="mb-4">
              <label htmlFor="export-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email destinatario <span className="text-red-500">*</span>
              </label>
              <input
                id="export-email"
                ref={emailRef}
                type="email"
                value={emailInput}
                onChange={e => { setEmailInput(e.target.value); setEmailFieldError(''); }}
                placeholder="usuario@empresa.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${emailFieldError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}`}
              />
              {emailFieldError && <p className="mt-1 text-xs text-red-500">{emailFieldError}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="export-message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje adicional{' '}
                <span className="text-gray-400 text-xs font-normal">(opcional)</span>
              </label>
              <textarea
                id="export-message"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Notas o comentarios para el destinatario..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Enviar y descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
