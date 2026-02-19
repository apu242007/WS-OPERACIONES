// @ts-nocheck — Deno Edge Function, not compiled by Vite/tsc
/**
 * send-report-email: Envía un PDF como adjunto por email usando Resend.
 *
 * Secrets requeridos en Supabase:
 *   RESEND_API_KEY  — obtenelo en https://resend.com
 *   EMAIL_FROM      — ej: "Operaciones WS <reportes@tudominio.com>"
 *                     (el dominio debe estar verificado en Resend,
 *                      o usar onboarding@resend.dev para pruebas)
 */

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const EMAIL_FROM     = Deno.env.get('EMAIL_FROM') ?? 'Operaciones WS <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      console.error('[send-report-email] RESEND_API_KEY secret no está configurado');
      return new Response(
        JSON.stringify({ success: false, error: 'RESEND_API_KEY not configured' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } },
      );
    }

    const {
      pdfBase64,
      filename  = 'reporte',
      formType  = 'Reporte',
      to        = 'jcastro@tackertools.com',
      summary   = {},
    } = body as {
      pdfBase64: string;
      filename?: string;
      formType?: string;
      to?: string;
      summary?: {
        fecha?:    string;
        pozo?:     string;
        equipo?:   string;
        operador?: string;
      };
    };

    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing pdfBase64' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } },
      );
    }

    console.log('[send-report-email] Enviando a:', to, '| Formulario:', formType, '| Archivo:', filename);

    const fecha    = summary.fecha    ?? new Date().toLocaleDateString('es-AR');
    const pozo     = summary.pozo     ?? '—';
    const equipo   = summary.equipo   ?? '—';
    const operador = summary.operador ?? '—';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c0392b; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">TACKER solutions</h1>
          <p style="color: #f5c6c6; margin: 4px 0 0;">Nuevo reporte generado</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">${formType}</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666; width: 120px;">Fecha</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${fecha}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Pozo</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${pozo}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Equipo</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${equipo}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Operador</td><td style="padding: 8px; font-weight: bold;">${operador}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 13px; color: #888;">El PDF se adjunta a este correo.</p>
        </div>
      </div>
    `;

    const attachmentName = `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`;

    const resendPayload = {
      from:    EMAIL_FROM,
      to:      [to],
      subject: `[Operaciones WS] ${formType} — ${fecha} | ${equipo} | ${pozo}`,
      html:    htmlBody,
      attachments: [
        {
          filename: attachmentName,
          content:  pdfBase64,
        },
      ],
    };

    const resendRes = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(resendPayload),
    });

    const resendData = await resendRes.json();
    console.log('[send-report-email] Resend response status:', resendRes.status);
    console.log('[send-report-email] Resend response:', JSON.stringify(resendData));

    if (!resendRes.ok) {
      throw new Error(`Resend error (${resendRes.status}): ${JSON.stringify(resendData)}`);
    }

    console.log('[send-report-email] ✅ Email enviado. ID:', resendData.id);
    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[send-report-email] ❌ Error:', message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }
});
