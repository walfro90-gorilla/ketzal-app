-- ============================================================================
-- KETZAL · FASE 2 — catálogo (suppliers, categories, products, services, reviews)
-- Proyecto Supabase: Gorilla-Labs (wnujoyzdpdyxblgdtxjw). Solo crea objetos
-- nuevos en el schema `ketzal`. Aditivo: no toca public/auth/tiendas.
-- Naming snake_case, PKs uuid, lectura pública + escritura restringida por RLS.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helpers de RLS (SECURITY DEFINER para evitar recursión de políticas)
-- ----------------------------------------------------------------------------
create or replace function ketzal.is_superadmin()
returns boolean language sql stable security definer set search_path = ketzal, public as $$
  select exists (select 1 from ketzal.profiles where id = auth.uid() and role = 'superadmin');
$$;

create or replace function ketzal.my_supplier_id()
returns uuid language sql stable security definer set search_path = ketzal, public as $$
  select supplier_id from ketzal.profiles where id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- suppliers (proveedor turístico)
-- ----------------------------------------------------------------------------
create table if not exists ketzal.suppliers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  contact_email    text not null unique,
  phone_number     text,
  address          text,
  description      text,
  img_logo         text,
  supplier_type    text,
  supplier_sub_type text,
  location         jsonb,
  photos           jsonb,
  extras           jsonb,
  info             jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Vincular el perfil con su supplier (profiles.supplier_id se creó en Fase 1 sin FK)
alter table ketzal.profiles
  drop constraint if exists profiles_supplier_id_fkey,
  add constraint profiles_supplier_id_fkey
  foreign key (supplier_id) references ketzal.suppliers(id) on delete set null;

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table if not exists ketzal.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  image       text,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- products (tienda)
-- ----------------------------------------------------------------------------
create table if not exists ketzal.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null unique,
  description    text,
  price          numeric not null,
  price_axo      numeric,
  stock          integer not null default 0,
  image          text,
  images         jsonb,
  category       text,
  tags           jsonb,
  specifications jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- services (tours/experiencias) — supplier principal + transporte + hotel
-- ----------------------------------------------------------------------------
create table if not exists ketzal.services (
  id                   uuid primary key default gen_random_uuid(),
  supplier_id          uuid not null references ketzal.suppliers(id) on delete cascade,
  name                 text not null,
  description          text,
  price                numeric not null,
  price_axo            numeric,
  location             text,
  available_from       timestamptz,
  available_to         timestamptz,
  size_tour            numeric,
  service_type         text,
  service_category     text,
  state_from           text,
  city_from            text,
  state_to             text,
  city_to              text,
  yt_link              text,
  packs                jsonb,
  images               jsonb,
  includes             jsonb,
  excludes             jsonb,
  faqs                 jsonb,
  itinerary            jsonb,
  dates                jsonb,
  add_ons              jsonb,
  seasonal_prices      jsonb,
  transport_provider_id uuid references ketzal.suppliers(id) on delete set null,
  hotel_provider_id    uuid references ketzal.suppliers(id) on delete set null,
  current_bookings     integer not null default 0,
  max_capacity         integer,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists idx_services_supplier on ketzal.services(supplier_id);
create index if not exists idx_services_transport on ketzal.services(transport_provider_id);
create index if not exists idx_services_hotel on ketzal.services(hotel_provider_id);

-- ----------------------------------------------------------------------------
-- reviews
-- ----------------------------------------------------------------------------
create table if not exists ketzal.reviews (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid not null references ketzal.services(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  comment    text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_reviews_service on ketzal.reviews(service_id);
create index if not exists idx_reviews_user on ketzal.reviews(user_id);

-- ----------------------------------------------------------------------------
-- updated_at automático (reusa ketzal.set_updated_at de Fase 1)
-- ----------------------------------------------------------------------------
drop trigger if exists trg_suppliers_updated_at on ketzal.suppliers;
create trigger trg_suppliers_updated_at before update on ketzal.suppliers
  for each row execute function ketzal.set_updated_at();
drop trigger if exists trg_categories_updated_at on ketzal.categories;
create trigger trg_categories_updated_at before update on ketzal.categories
  for each row execute function ketzal.set_updated_at();
drop trigger if exists trg_products_updated_at on ketzal.products;
create trigger trg_products_updated_at before update on ketzal.products
  for each row execute function ketzal.set_updated_at();
drop trigger if exists trg_services_updated_at on ketzal.services;
create trigger trg_services_updated_at before update on ketzal.services
  for each row execute function ketzal.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS: lectura pública (marketplace navegable, incl. anon), escritura acotada
-- ----------------------------------------------------------------------------
alter table ketzal.suppliers  enable row level security;
alter table ketzal.categories enable row level security;
alter table ketzal.products   enable row level security;
alter table ketzal.services   enable row level security;
alter table ketzal.reviews    enable row level security;

-- suppliers: público lee; superadmin escribe; dueño actualiza/borra el suyo
drop policy if exists suppliers_read on ketzal.suppliers;
create policy suppliers_read on ketzal.suppliers for select using (true);
drop policy if exists suppliers_insert on ketzal.suppliers;
create policy suppliers_insert on ketzal.suppliers for insert with check (ketzal.is_superadmin());
drop policy if exists suppliers_update on ketzal.suppliers;
create policy suppliers_update on ketzal.suppliers for update
  using (ketzal.is_superadmin() or id = ketzal.my_supplier_id())
  with check (ketzal.is_superadmin() or id = ketzal.my_supplier_id());
drop policy if exists suppliers_delete on ketzal.suppliers;
create policy suppliers_delete on ketzal.suppliers for delete using (ketzal.is_superadmin());

-- categories: público lee; superadmin escribe
drop policy if exists categories_read on ketzal.categories;
create policy categories_read on ketzal.categories for select using (true);
drop policy if exists categories_write on ketzal.categories;
create policy categories_write on ketzal.categories for all
  using (ketzal.is_superadmin()) with check (ketzal.is_superadmin());

-- products: público lee; superadmin escribe
drop policy if exists products_read on ketzal.products;
create policy products_read on ketzal.products for select using (true);
drop policy if exists products_write on ketzal.products;
create policy products_write on ketzal.products for all
  using (ketzal.is_superadmin()) with check (ketzal.is_superadmin());

-- services: público lee; dueño (supplier) o superadmin escriben
drop policy if exists services_read on ketzal.services;
create policy services_read on ketzal.services for select using (true);
drop policy if exists services_insert on ketzal.services;
create policy services_insert on ketzal.services for insert
  with check (ketzal.is_superadmin() or supplier_id = ketzal.my_supplier_id());
drop policy if exists services_update on ketzal.services;
create policy services_update on ketzal.services for update
  using (ketzal.is_superadmin() or supplier_id = ketzal.my_supplier_id())
  with check (ketzal.is_superadmin() or supplier_id = ketzal.my_supplier_id());
drop policy if exists services_delete on ketzal.services;
create policy services_delete on ketzal.services for delete
  using (ketzal.is_superadmin() or supplier_id = ketzal.my_supplier_id());

-- reviews: público lee; usuario autenticado crea la suya; edita/borra la suya
drop policy if exists reviews_read on ketzal.reviews;
create policy reviews_read on ketzal.reviews for select using (true);
drop policy if exists reviews_insert on ketzal.reviews;
create policy reviews_insert on ketzal.reviews for insert with check (user_id = auth.uid());
drop policy if exists reviews_update on ketzal.reviews;
create policy reviews_update on ketzal.reviews for update
  using (user_id = auth.uid() or ketzal.is_superadmin())
  with check (user_id = auth.uid() or ketzal.is_superadmin());
drop policy if exists reviews_delete on ketzal.reviews;
create policy reviews_delete on ketzal.reviews for delete
  using (user_id = auth.uid() or ketzal.is_superadmin());

-- ----------------------------------------------------------------------------
-- Grants: anon puede LEER el catálogo (browsing público); authenticated y
-- service_role ya reciben DML por default privileges de Fase 1. RLS sigue
-- aplicando encima de los grants.
-- ----------------------------------------------------------------------------
grant select on ketzal.suppliers, ketzal.categories, ketzal.products, ketzal.services, ketzal.reviews to anon;
grant select, insert, update, delete on ketzal.suppliers, ketzal.categories, ketzal.products, ketzal.services, ketzal.reviews to authenticated, service_role;
