const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;

export async function uploadFileToDrive(
  file: File,
  customFileName?: string
): Promise<string> {
  const fileName = customFileName ?? `${Date.now()}_${file.name}`;
  
  // Convertir archivo a base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // solo la parte base64, sin el prefijo
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/upload-to-drive`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        fileName,
        fileContent: base64,
        mimeType: file.type,
        folderId: FOLDER_ID,
      }),
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error ?? "Error subiendo archivo a Drive");
  }

  // Retorna la URL pública del archivo
  return `https://drive.google.com/file/d/${data.fileId}/view`;
}