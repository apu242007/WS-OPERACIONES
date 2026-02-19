// @ts-nocheck — Deno Edge Function, not compiled by Vite/tsc
/**
 * cleanup-storage: Elimina archivos subidos hace más de RETENTION_DAYS días.
 * Invocar desde Supabase Cron (pg_cron) o manualmente.
 *
 * Configurable via variable de entorno:
 *   STORAGE_RETENTION_DAYS (default: 90)
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BUCKET           = 'reports';
const RETENTION_DAYS   = parseInt(Deno.env.get('STORAGE_RETENTION_DAYS') ?? '90', 10);

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
    console.log(`[cleanup-storage] Eliminando archivos anteriores a ${cutoff.toISOString()} (retención: ${RETENTION_DAYS} días)`);

    // Listar todos los archivos en uploads/
    const { data: folders, error: listErr } = await supabase.storage
      .from(BUCKET)
      .list('uploads', { limit: 100 });

    if (listErr) throw new Error(`Error listando carpetas: ${listErr.message}`);

    const toDelete: string[] = [];
    let checked = 0;

    for (const folder of folders ?? []) {
      if (!folder.name) continue;

      const { data: files, error: filesErr } = await supabase.storage
        .from(BUCKET)
        .list(`uploads/${folder.name}`, { limit: 1000 });

      if (filesErr) {
        console.warn(`[cleanup-storage] Error listando uploads/${folder.name}:`, filesErr.message);
        continue;
      }

      for (const file of files ?? []) {
        checked++;
        const updatedAt = new Date(file.updated_at ?? file.created_at ?? 0);
        if (updatedAt < cutoff) {
          toDelete.push(`uploads/${folder.name}/${file.name}`);
        }
      }
    }

    console.log(`[cleanup-storage] Revisados: ${checked} archivos. A eliminar: ${toDelete.length}`);

    let deleted = 0;
    if (toDelete.length > 0) {
      // Eliminar en batches de 100
      for (let i = 0; i < toDelete.length; i += 100) {
        const batch = toDelete.slice(i, i + 100);
        const { error: delErr } = await supabase.storage.from(BUCKET).remove(batch);
        if (delErr) {
          console.error(`[cleanup-storage] Error eliminando batch:`, delErr.message);
        } else {
          deleted += batch.length;
        }
      }
    }

    const result = {
      success: true,
      checked,
      deleted,
      retentionDays: RETENTION_DAYS,
      cutoffDate: cutoff.toISOString(),
    };

    console.log('[cleanup-storage] ✅ Completado:', result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cleanup-storage] ❌ Error:', message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
