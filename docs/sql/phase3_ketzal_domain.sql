-- ============================================================================
-- KETZAL · FASE 3 — dominio core (planners, wishlists, wallet, payments, notifs)
-- Proyecto Supabase: Gorilla-Labs (wnujoyzdpdyxblgdtxjw). Aditivo en `ketzal`.
-- Principio RLS: datos privados por usuario. Lectura solo del dueño (o público
-- si is_public en planners/wishlists). Escrituras de dinero/notifs van por
-- backend (service_role, que bypassa RLS) — el cliente NO inserta transacciones.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums de dominio (labels en MAYÚSCULA = semántica documentada en CLAUDE.md)
-- ----------------------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on t.typnamespace=n.oid where n.nspname='ketzal' and t.typname='payment_status') then
    create type ketzal.payment_status as enum ('PENDING','PARTIAL','COMPLETED','REFUNDED');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on t.typnamespace=n.oid where n.nspname='ketzal' and t.typname='planner_status') then
    create type ketzal.planner_status as enum ('PLANNING','RESERVED','CONFIRMED','TRAVELLING','COMPLETED');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on t.typnamespace=n.oid where n.nspname='ketzal' and t.typname='wallet_txn_type') then
    create type ketzal.wallet_txn_type as enum ('DEPOSIT','WITHDRAWAL','PURCHASE','REFUND','TRANSFER_SENT','TRANSFER_RECEIVED','REWARD');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on t.typnamespace=n.oid where n.nspname='ketzal' and t.typname='notification_type') then
    create type ketzal.notification_type as enum ('INFO','SUCCESS','WARNING','ERROR','SUPPLIER_APPROVAL','USER_REGISTRATION','WELCOME_BONUS','WELCOME_MESSAGE','BOOKING_UPDATE','SYSTEM_UPDATE');
  end if;
  if not exists (select 1 from pg_type t join pg_namespace n on t.typnamespace=n.oid where n.nspname='ketzal' and t.typname='notification_priority') then
    create type ketzal.notification_priority as enum ('LOW','NORMAL','HIGH','URGENT');
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Travel planners (sustituye al carrito) + items
-- ----------------------------------------------------------------------------
create table if not exists ketzal.travel_planners (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  destination text,
  start_date  timestamptz,
  end_date    timestamptz,
  status      ketzal.planner_status not null default 'PLANNING',
  total_mxn   numeric not null default 0,
  total_axo   numeric not null default 0,
  is_public   boolean not null default false,
  share_code  text unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_planners_user on ketzal.travel_planners(user_id);

create table if not exists ketzal.planner_items (
  id            uuid primary key default gen_random_uuid(),
  planner_id    uuid not null references ketzal.travel_planners(id) on delete cascade,
  service_id    uuid references ketzal.services(id) on delete set null,
  product_id    uuid references ketzal.products(id) on delete set null,
  quantity      integer not null default 1,
  price_mxn     numeric not null,
  price_axo     numeric,
  selected_date timestamptz,
  notes         text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_planner_items_planner on ketzal.planner_items(planner_id);

-- ----------------------------------------------------------------------------
-- Wishlists + items
-- ----------------------------------------------------------------------------
create table if not exists ketzal.wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null default 'Mi Lista de Deseos',
  is_public  boolean not null default false,
  share_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_wishlists_user on ketzal.wishlists(user_id);

create table if not exists ketzal.wishlist_items (
  id          uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references ketzal.wishlists(id) on delete cascade,
  service_id  uuid references ketzal.services(id) on delete set null,
  product_id  uuid references ketzal.products(id) on delete set null,
  price_alert numeric,
  created_at  timestamptz not null default now()
);
create index if not exists idx_wishlist_items_wishlist on ketzal.wishlist_items(wishlist_id);

-- ----------------------------------------------------------------------------
-- Wallet (saldo dual MXN + AXO) + transacciones
-- ----------------------------------------------------------------------------
create table if not exists ketzal.wallets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  balance_mxn numeric not null default 0,
  balance_axo numeric not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists ketzal.wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  wallet_id   uuid not null references ketzal.wallets(id) on delete cascade,
  type        ketzal.wallet_txn_type not null,
  amount_mxn  numeric,
  amount_axo  numeric,
  description text not null,
  reference   text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_wallet_txn_wallet on ketzal.wallet_transactions(wallet_id);

-- ----------------------------------------------------------------------------
-- Payments (cuotas + dual MXN/AXO)
-- ----------------------------------------------------------------------------
create table if not exists ketzal.payments (
  id                  uuid primary key default gen_random_uuid(),
  planner_id          uuid references ketzal.travel_planners(id) on delete set null,
  user_id             uuid not null references auth.users(id) on delete cascade,
  amount_mxn          numeric not null,
  amount_axo          numeric,
  status              ketzal.payment_status not null default 'PENDING',
  installments        integer not null default 1,
  current_installment integer not null default 1,
  due_date            timestamptz,
  paid_at             timestamptz,
  payment_method      text,
  transaction_id      text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_payments_user on ketzal.payments(user_id);

-- ----------------------------------------------------------------------------
-- Notifications
-- ----------------------------------------------------------------------------
create table if not exists ketzal.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  message    text not null,
  type       ketzal.notification_type not null default 'INFO',
  is_read    boolean not null default false,
  priority   ketzal.notification_priority not null default 'NORMAL',
  metadata   jsonb,
  action_url text,
  created_at timestamptz not null default now(),
  read_at    timestamptz
);
create index if not exists idx_notifications_user_read on ketzal.notifications(user_id, is_read);
create index if not exists idx_notifications_created on ketzal.notifications(created_at);

-- ----------------------------------------------------------------------------
-- Triggers updated_at (reusa ketzal.set_updated_at)
-- ----------------------------------------------------------------------------
drop trigger if exists trg_planners_updated_at on ketzal.travel_planners;
create trigger trg_planners_updated_at before update on ketzal.travel_planners for each row execute function ketzal.set_updated_at();
drop trigger if exists trg_wishlists_updated_at on ketzal.wishlists;
create trigger trg_wishlists_updated_at before update on ketzal.wishlists for each row execute function ketzal.set_updated_at();
drop trigger if exists trg_wallets_updated_at on ketzal.wallets;
create trigger trg_wallets_updated_at before update on ketzal.wallets for each row execute function ketzal.set_updated_at();
drop trigger if exists trg_payments_updated_at on ketzal.payments;
create trigger trg_payments_updated_at before update on ketzal.payments for each row execute function ketzal.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table ketzal.travel_planners     enable row level security;
alter table ketzal.planner_items        enable row level security;
alter table ketzal.wishlists            enable row level security;
alter table ketzal.wishlist_items       enable row level security;
alter table ketzal.wallets              enable row level security;
alter table ketzal.wallet_transactions  enable row level security;
alter table ketzal.payments             enable row level security;
alter table ketzal.notifications        enable row level security;

-- travel_planners: dueño total; público lee si is_public
drop policy if exists planners_select on ketzal.travel_planners;
create policy planners_select on ketzal.travel_planners for select
  using (user_id = auth.uid() or is_public = true or ketzal.is_superadmin());
drop policy if exists planners_insert on ketzal.travel_planners;
create policy planners_insert on ketzal.travel_planners for insert with check (user_id = auth.uid());
drop policy if exists planners_update on ketzal.travel_planners;
create policy planners_update on ketzal.travel_planners for update
  using (user_id = auth.uid() or ketzal.is_superadmin()) with check (user_id = auth.uid() or ketzal.is_superadmin());
drop policy if exists planners_delete on ketzal.travel_planners;
create policy planners_delete on ketzal.travel_planners for delete
  using (user_id = auth.uid() or ketzal.is_superadmin());

-- planner_items: por dueño del planner (público lee si el planner es público)
drop policy if exists planner_items_select on ketzal.planner_items;
create policy planner_items_select on ketzal.planner_items for select
  using (exists (select 1 from ketzal.travel_planners p where p.id = planner_id and (p.user_id = auth.uid() or p.is_public = true or ketzal.is_superadmin())));
drop policy if exists planner_items_write on ketzal.planner_items;
create policy planner_items_write on ketzal.planner_items for all
  using (exists (select 1 from ketzal.travel_planners p where p.id = planner_id and (p.user_id = auth.uid() or ketzal.is_superadmin())))
  with check (exists (select 1 from ketzal.travel_planners p where p.id = planner_id and (p.user_id = auth.uid() or ketzal.is_superadmin())));

-- wishlists: igual patrón que planners
drop policy if exists wishlists_select on ketzal.wishlists;
create policy wishlists_select on ketzal.wishlists for select
  using (user_id = auth.uid() or is_public = true or ketzal.is_superadmin());
drop policy if exists wishlists_insert on ketzal.wishlists;
create policy wishlists_insert on ketzal.wishlists for insert with check (user_id = auth.uid());
drop policy if exists wishlists_update on ketzal.wishlists;
create policy wishlists_update on ketzal.wishlists for update
  using (user_id = auth.uid() or ketzal.is_superadmin()) with check (user_id = auth.uid() or ketzal.is_superadmin());
drop policy if exists wishlists_delete on ketzal.wishlists;
create policy wishlists_delete on ketzal.wishlists for delete
  using (user_id = auth.uid() or ketzal.is_superadmin());

drop policy if exists wishlist_items_select on ketzal.wishlist_items;
create policy wishlist_items_select on ketzal.wishlist_items for select
  using (exists (select 1 from ketzal.wishlists w where w.id = wishlist_id and (w.user_id = auth.uid() or w.is_public = true or ketzal.is_superadmin())));
drop policy if exists wishlist_items_write on ketzal.wishlist_items;
create policy wishlist_items_write on ketzal.wishlist_items for all
  using (exists (select 1 from ketzal.wishlists w where w.id = wishlist_id and (w.user_id = auth.uid() or ketzal.is_superadmin())))
  with check (exists (select 1 from ketzal.wishlists w where w.id = wishlist_id and (w.user_id = auth.uid() or ketzal.is_superadmin())));

-- wallets: dueño SOLO LECTURA; cambios de saldo via backend (service_role bypassa RLS)
drop policy if exists wallets_select on ketzal.wallets;
create policy wallets_select on ketzal.wallets for select
  using (user_id = auth.uid() or ketzal.is_superadmin());

-- wallet_transactions: dueño SOLO LECTURA; inserciones via backend
drop policy if exists wallet_txn_select on ketzal.wallet_transactions;
create policy wallet_txn_select on ketzal.wallet_transactions for select
  using (exists (select 1 from ketzal.wallets w where w.id = wallet_id and (w.user_id = auth.uid() or ketzal.is_superadmin())));

-- payments: dueño SOLO LECTURA; creación/captura via backend
drop policy if exists payments_select on ketzal.payments;
create policy payments_select on ketzal.payments for select
  using (user_id = auth.uid() or ketzal.is_superadmin());

-- notifications: dueño lee y marca como leída; creación via backend; borra la suya
drop policy if exists notifications_select on ketzal.notifications;
create policy notifications_select on ketzal.notifications for select
  using (user_id = auth.uid() or ketzal.is_superadmin());
drop policy if exists notifications_update on ketzal.notifications;
create policy notifications_update on ketzal.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists notifications_delete on ketzal.notifications;
create policy notifications_delete on ketzal.notifications for delete
  using (user_id = auth.uid() or ketzal.is_superadmin());

-- ----------------------------------------------------------------------------
-- Grants: NO anon (datos privados). authenticated/service_role reciben DML por
-- default privileges de Fase 1; RLS es la verdadera puerta. service_role
-- bypassa RLS para la lógica de backend (wallet/payments/notifications).
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on
  ketzal.travel_planners, ketzal.planner_items, ketzal.wishlists, ketzal.wishlist_items,
  ketzal.wallets, ketzal.wallet_transactions, ketzal.payments, ketzal.notifications
  to authenticated, service_role;
