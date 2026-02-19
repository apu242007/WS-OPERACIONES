import { supabase } from './supabase';

const BUCKET = 'reports';

// Max dimensions and quality for image compression
const MAX_IMAGE_PX = 1920;
const IMAGE_QUALITY = 0.82; // JPEG quality — buen balance tamaño/calidad

/**
 * Comprime una imagen usando canvas antes de subirla.
 * Reduce fotos de celular de ~4MB a ~300-600KB sin pérdida visual perceptible.
 */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file; // PDFs y otros pasan sin cambio

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_IMAGE_PX || height > MAX_IMAGE_PX) {
        const ratio = Math.min(MAX_IMAGE_PX / width, MAX_IMAGE_PX / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
          console.log(`[uploadFile] Compresión: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB (${Math.round((1 - compressed.size / file.size) * 100)}% reducción)`);
          resolve(compressed);
        },
        'image/jpeg',
        IMAGE_QUALITY,
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

/**
 * Sube un archivo a Supabase Storage (bucket "reports") y devuelve la URL pública.
 * Las imágenes se comprimen automáticamente antes de subir.
 */
export async function uploadFile(
  file: File,
  customFileName?: string
): Promise<string> {
  // Comprimir imágenes antes de subir
  const fileToUpload = await compressImage(file);

  const fileName = customFileName ?? `${Date.now()}_${fileToUpload.name}`;
  const filePath = `uploads/${new Date().toISOString().slice(0, 7)}/${fileName}`;

  console.log('[uploadFile] Subiendo a Supabase Storage:', { bucket: BUCKET, filePath, size: fileToUpload.size, type: fileToUpload.type });

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: false,
      contentType: fileToUpload.type || 'application/octet-stream',
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
