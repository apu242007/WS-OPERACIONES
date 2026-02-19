// @ts-nocheck — Deno Edge Function, not compiled by Vite/tsc
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ─── JWT helpers ────────────────────────────────────────────────────────────

function base64url(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/** Convert PKCS#8 PEM private key to ArrayBuffer */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function signRS256(input: string, privateKeyPem: string): Promise<string> {
  const keyData = pemToArrayBuffer(privateKeyPem);
  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(input),
  );
  return base64url(new Uint8Array(sig));
}

async function getGoogleAccessToken(serviceAccountJson: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      iss: serviceAccountJson.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${payload}`;
  const signature = await signRS256(signingInput, serviceAccountJson.private_key);
  const jwt = `${signingInput}.${signature}`;

  console.log('[upload-to-drive] Requesting Google OAuth token for:', serviceAccountJson.client_email);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  console.log('[upload-to-drive] OAuth response status:', tokenRes.status);

  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(`OAuth token error (${tokenRes.status}): ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token as string;
}

// ─── Drive upload ────────────────────────────────────────────────────────────

async function uploadFileToDrive(
  accessToken: string,
  fileName: string,
  fileContentBase64: string,
  mimeType: string,
  folderId: string,
): Promise<string> {
  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });
  const boundary = 'foo_bar_baz_boundary_xyz';

  // Multipart body: metadata + binary (base64-decoded)
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    'Content-Transfer-Encoding: base64',
    '',
    fileContentBase64,
    `--${boundary}--`,
  ].join('\r\n');

  console.log('[upload-to-drive] Uploading file:', fileName, 'mimeType:', mimeType, 'folderId:', folderId);
  console.log('[upload-to-drive] Base64 length:', fileContentBase64.length);

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body,
    },
  );

  const uploadData = await uploadRes.json();
  console.log('[upload-to-drive] Drive API response status:', uploadRes.status);
  console.log('[upload-to-drive] Drive API response:', JSON.stringify(uploadData));

  if (!uploadRes.ok) {
    throw new Error(`Drive upload error (${uploadRes.status}): ${JSON.stringify(uploadData)}`);
  }

  return uploadData.id as string;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    // Parse request
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    const { fileName, fileContent, mimeType, folderId } = body as {
      fileName?: string;
      fileContent?: string;
      mimeType?: string;
      folderId?: string;
    };

    console.log('[upload-to-drive] Received request — fileName:', fileName, 'mimeType:', mimeType, 'folderId:', folderId);

    // Validate fields
    const missing: string[] = [];
    if (!fileName) missing.push('fileName');
    if (!fileContent) missing.push('fileContent');
    if (!mimeType) missing.push('mimeType');
    if (!folderId) missing.push('folderId');
    if (missing.length > 0) {
      const msg = `Missing required fields: ${missing.join(', ')}`;
      console.error('[upload-to-drive]', msg);
      return new Response(
        JSON.stringify({ success: false, error: msg }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    // Load service account
    const saRaw = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    if (!saRaw) {
      const msg = 'GOOGLE_SERVICE_ACCOUNT_JSON secret is not set';
      console.error('[upload-to-drive]', msg);
      return new Response(
        JSON.stringify({ success: false, error: msg }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    let serviceAccount: { client_email: string; private_key: string };
    try {
      serviceAccount = JSON.parse(saRaw);
    } catch {
      const msg = 'GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON';
      console.error('[upload-to-drive]', msg);
      return new Response(
        JSON.stringify({ success: false, error: msg }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      const msg = 'Service account JSON missing client_email or private_key';
      console.error('[upload-to-drive]', msg);
      return new Response(
        JSON.stringify({ success: false, error: msg }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    // Get OAuth token
    const accessToken = await getGoogleAccessToken(serviceAccount);

    // Upload to Drive
    const fileId = await uploadFileToDrive(
      accessToken,
      fileName!,
      fileContent!,
      mimeType!,
      folderId!,
    );

    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
    console.log('[upload-to-drive] SUCCESS — fileId:', fileId, 'url:', fileUrl);

    return new Response(
      JSON.stringify({ success: true, fileId, fileUrl }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[upload-to-drive] Unhandled error:', message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }
});
