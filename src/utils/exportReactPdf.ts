import React from 'react';
import { pdf } from '@react-pdf/renderer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReactPdfOptions {
  filename: string;
  to: string;
  message?: string;
}

export interface ReactPdfResult {
  emailSuccess: boolean;
  emailId?: string;
  emailError?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUPABASE_URL =
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_SUPABASE_URL ||
  'https://exgqsbvcyghrpmlawmaa.supabase.co';

const SUPABASE_ANON =
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3FzYnZjeWdocnBtbGF3bWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQzMjEsImV4cCI6MjA4NjI4MDMyMX0.KlwrEfx9X5zQChoX84vjDViS9icGjkjPu_3W1SGh22k';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a Blob to a base64 string (without the data URI prefix). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Generate a PDF from a @react-pdf/renderer `<Document>` element,
 * trigger a browser download, then send the PDF by email via the
 * Supabase `send-report-email` edge function.
 *
 * @param element  A React element whose root is a `<Document>` from @react-pdf/renderer.
 * @param options  filename, email recipient, optional message.
 */
export async function exportReactPdf(
  element: React.ReactElement,
  options: ReactPdfOptions,
): Promise<ReactPdfResult> {
  const { filename, to, message } = options;

  // ── 1. Generate PDF blob ──────────────────────────────────────────────────
  const blob = await pdf(element).toBlob();

  // ── 2. Trigger download ───────────────────────────────────────────────────
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.pdf`;
  anchor.click();
  // Revoke after a short delay so the download has time to start
  setTimeout(() => URL.revokeObjectURL(url), 5000);

  // ── 3. Send email ─────────────────────────────────────────────────────────
  try {
    const pdfBase64 = await blobToBase64(blob);

    const emailRes = await fetch(`${SUPABASE_URL}/functions/v1/send-report-email`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'apikey':        SUPABASE_ANON,
      },
      body: JSON.stringify({
        pdfBase64,
        filename,
        formType: filename,
        to,
        ...(message ? { additionalMessage: message } : {}),
        summary: {
          fecha:    new Date().toLocaleDateString('es-AR'),
          pozo:     '',
          equipo:   '',
          operador: '',
        },
      }),
    });

    const data = await emailRes.json().catch(() => ({}));

    if (!emailRes.ok) {
      return {
        emailSuccess: false,
        emailError: data?.error ?? data?.message ?? `HTTP ${emailRes.status}`,
      };
    }

    return { emailSuccess: true, emailId: data.emailId };
  } catch (err) {
    return {
      emailSuccess: false,
      emailError: err instanceof Error ? err.message : 'Error de red',
    };
  }
}
