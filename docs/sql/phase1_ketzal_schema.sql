-- ============================================================================
-- KETZAL · FASE 1 — schema base + auth (PROPUESTA, NO EJECUTADA)
-- Proyecto Supabase: Gorilla-Labs (wnujoyzdpdyxblgdtxjw)
-- Revisar y aprobar antes de correr. Solo crea objetos nuevos en el schema
-- `ketzal` + UN cambio quirúrgico y backward-compatible al trigger de signup.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0) Schema dedicado (igual que el schema `tiendas` existente)
-- ----------------------------------------------------------------------------
create schema if not exists ketzal;

-- ----------------------------------------------------------------------------
-- 1) Enums de dominio (en el schema ketzal, no en public)
-- ----------------------------------------------------------------------------
create type ketzal.user_role as enum ('user', 'admin', 'superadmin');

-- (Los demás enums —payment_status, planner_status, wallet_txn_type,
--  notification_type, notification_priority— se crean en Fase 2/3.)

-- ----------------------------------------------------------------------------
-- 2) Perfil de usuario Ketzal (1:1 con auth.users, patrón de tiendas.profiles)
--    NO guarda password/email_verified: eso lo maneja Supabase Auth.
-- ----------------------------------------------------------------------------
create table ketzal.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text not null,
  name             text,
  role             ketzal.user_role not null default 'user',
  axo_coins_earned numeric not null default 50,
  referral_code    text unique,
  supplier_id      uuid,            -- FK -> ketzal.suppliers (se agrega en Fase 2)
  image            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table ketzal.profiles is 'Datos de usuario específicos de Ketzal. Identidad/login vive en auth.users.';

-- updated_at automático
create or replace function ketzal.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on ketzal.profiles
  for each row execute function ketzal.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3) RLS — cada usuario ve/edita solo su propio perfil
-- ----------------------------------------------------------------------------
alter table ketzal.profiles enable row level security;

create policy "profiles_select_own"
  on ketzal.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on ketzal.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT lo hace el trigger SECURITY DEFINER (abajo), no el cliente.

-- ----------------------------------------------------------------------------
-- 4) Exponer el schema ketzal al API de Supabase (PostgREST) + grants
--    NOTA: además hay que añadir 'ketzal' a "Exposed schemas" en
--    Dashboard > Settings > API. Esto solo da los privilegios SQL.
-- ----------------------------------------------------------------------------
grant usage on schema ketzal to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema ketzal to authenticated, service_role;
alter default privileges in schema ketzal
  grant select, insert, update, delete on tables to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 5) ⚠️ CAMBIO QUIRÚRGICO al trigger compartido de signup.
--    auth.users.on_auth_user_created -> public.handle_new_user() corre en CADA
--    alta y hoy provisiona un workspace de AGENCIA (org + 7 agentes). Para
--    usuarios B2C de Ketzal eso es incorrecto. Hacemos la función app-aware:
--    si el signup trae metadata app='ketzal', crea SOLO el perfil Ketzal y
--    NO toca organizations/agents. Cualquier otro signup mantiene el
--    comportamiento ACTUAL idéntico (backward-compatible: la agencia no setea
--    app='ketzal'). Es un reemplazo de la función; el trigger no cambia.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  new_org_id uuid;
  display_name text;
begin
  -- Rama Ketzal (B2C): solo perfil, sin workspace de agencia.
  if (new.raw_user_meta_data->>'app') = 'ketzal' then
    insert into ketzal.profiles (id, email, name)
    values (
      new.id,
      new.email,
      coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
      )
    );
    return new;
  end if;

  -- Comportamiento ACTUAL de la agencia (sin cambios) -----------------------
  display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.organizations (name, slug, owner_id)
  values (display_name || '''s Workspace', new.id::text, new.id)
  returning id into new_org_id;

  insert into public.org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  perform public.seed_org_agents(new_org_id);
  perform public.claim_orphan_resources(new_org_id);

  return new;
end;
$function$;

-- ============================================================================
-- Flujo de alta en la app Ketzal (referencia, no es SQL):
--   await supabase.auth.signUp({
--     email, password,
--     options: { data: { app: 'ketzal', full_name } }   // <- app:'ketzal'
--   })
-- El trigger detecta app='ketzal' y crea ketzal.profiles automáticamente.
-- El rol arranca en 'user'; admin (proveedor)/superadmin se asignan por un
-- flujo controlado aparte (Fase 2/3), nunca desde el cliente.
-- ============================================================================
