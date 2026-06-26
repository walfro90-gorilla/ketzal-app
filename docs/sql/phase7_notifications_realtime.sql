-- ============================================================================
-- KETZAL · FASE 7 — Realtime de notifications + RPC para self-create
-- ============================================================================

-- Habilitar Realtime broadcast en ketzal.notifications.
-- Idempotente: si ya está en la publication no hace nada.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'ketzal'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table ketzal.notifications;
  end if;
end $$;

-- RPC: notification_create_self (cliente crea notification para si mismo).
-- Patrón senior: RLS de notifications NO tiene policy de INSERT (cero auto-spam
-- desde cliente). Este RPC SECURITY DEFINER es el único vector controlado.
-- p_user_id queda atado a auth.uid() — no se puede crear para otro usuario.
create or replace function ketzal.notification_create_self(
  p_title text,
  p_message text,
  p_type ketzal.notification_type default 'INFO',
  p_priority ketzal.notification_priority default 'NORMAL',
  p_metadata jsonb default null,
  p_action_url text default null
)
returns ketzal.notifications
language plpgsql
security definer
set search_path = ketzal, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_row ketzal.notifications;
begin
  if v_user_id is null then
    raise exception 'No autenticado';
  end if;
  if coalesce(trim(p_title), '') = '' then
    raise exception 'Titulo requerido';
  end if;
  insert into ketzal.notifications (user_id, title, message, type, priority, metadata, action_url)
  values (v_user_id, p_title, p_message, p_type, p_priority, p_metadata, p_action_url)
  returning * into v_row;
  return v_row;
end;
$$;

grant execute on function ketzal.notification_create_self(text, text, ketzal.notification_type, ketzal.notification_priority, jsonb, text)
  to authenticated, service_role;
