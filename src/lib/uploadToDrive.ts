const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;

export async function uploadFileToDrive(
  file: File,
  customFileName?: string
): Promise<string> {
  const fileName = customFileName ?? `${Date.now()}_${file.name}`;

  // ── Validar configuración ────────────────────────────────────────────────
  if (!SUPABASE_URL)      console.error('[uploadFileToDrive] VITE_SUPABASE_URL no está definida');
  if (!SUPABASE_ANON_KEY) console.error('[uploadFileToDrive] VITE_SUPABASE_ANON_KEY no está definida');
  if (!FOLDER_ID)         console.error('[uploadFileToDrive] VITE_GDRIVE_FOLDER_ID no está definida');

  console.log('[uploadFileToDrive] Iniciando subida:', {
    fileName,
    mimeType: file.type || '(vacío — se usará application/octet-stream)',
    size: file.size,
    folderId: FOLDER_ID ?? '(no definido)',
    endpoint: `${SUPABASE_URL}/functions/v1/upload-to-drive`,
  });

  // ── Convertir a base64 ───────────────────────────────────────────────────
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const b64 = result.split(',')[1];
      console.log('[uploadFileToDrive] Base64 generado, longitud:', b64?.length ?? 0);
      resolve(b64);
    };
    reader.onerror = (e) => {
      console.error('[uploadFileToDrive] FileReader error:', e);
      reject(new Error('Error leyendo el archivo'));
    };
    reader.readAsDataURL(file);
  });

  // ── Llamar Edge Function ─────────────────────────────────────────────────
  const payload = {
    fileName,
    fileContent: base64,
    mimeType: file.type || 'application/octet-stream',
    folderId: FOLDER_ID,
  };

  console.log('[uploadFileToDrive] Enviando a Edge Function...');

  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/upload-to-drive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    console.error('[uploadFileToDrive] Error de red (fetch falló):', networkErr);
    throw new Error(`Error de red al conectar con la Edge Function: ${networkErr}`);
  }

  console.log('[uploadFileToDrive] Edge Function HTTP status:', response.status);

  // Leer el cuerpo siempre (incluso en error) para poder loguearlo
  const rawText = await response.text();
  console.log('[uploadFileToDrive] Edge Function raw response:', rawText);

  let data: { success: boolean; fileId?: string; fileUrl?: string; error?: string };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Edge Function devolvió respuesta no-JSON (status ${response.status}): ${rawText}`);
  }

  if (!response.ok || !data.success) {
    throw new Error(`Error en Edge Function (${response.status}): ${data.error ?? rawText}`);
  }

  const fileUrl = data.fileUrl ?? `https://drive.google.com/file/d/${data.fileId}/view`;
  console.log('[uploadFileToDrive] ✅ Subida exitosa:', fileUrl);
  return fileUrl;
}