import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'reports';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sube un archivo a Supabase Storage (bucket "reports") y devuelve la URL pública.
 * Reemplaza la integración con Google Drive que requería permisos de organización.
 */
export async function uploadFileToDrive(
  file: File,
  customFileName?: string
): Promise<string> {
  if (!SUPABASE_URL)      console.error('[uploadFile] VITE_SUPABASE_URL no está definida');
  if (!SUPABASE_ANON_KEY) console.error('[uploadFile] VITE_SUPABASE_ANON_KEY no está definida');

  const fileName = customFileName ?? `${Date.now()}_${file.name}`;
  const filePath = `uploads/${new Date().toISOString().slice(0, 7)}/${fileName}`;

  console.log('[uploadFile] Subiendo a Supabase Storage:', { bucket: BUCKET, filePath, size: file.size, type: file.type });

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });

  if (error) {
    console.error('[uploadFile] ❌ Error subiendo a Supabase Storage:', error.message);
    throw new Error(`Error subiendo archivo: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  const publicUrl = urlData.publicUrl;

  console.log('[uploadFile] ✅ Subida exitosa:', publicUrl);
  return publicUrl;
}
