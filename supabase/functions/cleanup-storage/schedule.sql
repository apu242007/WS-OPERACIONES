-- Habilitar pg_cron (ya está disponible en Supabase)
-- Ejecutar en SQL Editor del Dashboard de Supabase

-- Programar limpieza automática el día 1 de cada mes a las 3 AM UTC
select cron.schedule(
  'cleanup-storage-monthly',
  '0 3 1 * *',  -- cron: minuto hora dia mes diasemana
  $$
    select net.http_post(
      url    := current_setting('app.supabase_url') || '/functions/v1/cleanup-storage',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
      body   := '{}'::jsonb
    );
  $$
);

-- Para ver los jobs programados:
-- select * from cron.job;

-- Para desactivar:
-- select cron.unschedule('cleanup-storage-monthly');
