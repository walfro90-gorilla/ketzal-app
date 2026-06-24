# Plan de integración de Ketzal en el Supabase de Gorilla-Labs

> Estado: **PROPUESTA — nada ejecutado en la DB.** Survey de solo lectura realizado el 2026-05-27 vía Supabase Management API. Toda DDL aquí descrita está **pendiente de tu aprobación** explícita, fase por fase.

## Contexto

La base de datos original de Ketzal **se perdió**. Reconstruiremos sus tablas a partir de [prisma/schema.prisma](../prisma/schema.prisma) dentro del proyecto Supabase **`Gorilla-Labs`** (`wnujoyzdpdyxblgdtxjw`), que es producción de la oficina virtual. Objetivo: agregar Ketzal **quirúrgicamente**, reutilizando el login existente, sin duplicar ni romper nada.

## Lo que YA existe en ese Supabase (no se toca)

- **`public`** (21 tablas) — plataforma multi-tenant de agencia IA: `organizations`, `org_members`, `clients`, `projects`, `agents`, `tasks`, `campaigns`, `campaign_posts`, `leads`, `lead_campaigns`, `email_*`, `meetings`, `social_accounts`, `cron_jobs`, `cron_executions`, `token_logs`, `knowledge_base`, `skills`, etc. Todo va con `org_id → organizations`.
- **`auth`** — Supabase Auth (`auth.users`, 35 cols; 2 usuarios). **Este es el sistema de login a reutilizar.**
- **`tiendas`** (11 tablas) — otra app (e-commerce) ya namespaced en su propio schema: `shops`, `products`, `carts`, `cart_items`, `orders`, `order_items`, `profiles`, `subscriptions`, `plan_limits`, `onboarding_sessions`, `reserved_slugs`. **Este es el precedente que copiamos para Ketzal.**
- **Extensiones**: `pg_cron 1.6.4`, `pg_net`, `pgcrypto`, `vector 0.8.0`, `supabase_vault`, `uuid-ossp`.
- **pg_cron**: un único job `gorilla-cron-dispatcher` (`* * * * *`, cada minuto) que despacha tareas de la tabla `cron_jobs`. **Intocable.**
- **Funciones**: `get_user_org_ids()`, `provision_user_workspace()` (patrón de RLS y alta de workspace).

### Contrato de seguridad — lo que NO haré sin aprobación

- No tocar **ningún** objeto en `public`, `auth`, `tiendas`, `cron`, `storage`, `vault`, `realtime`.
- No tocar el job `gorilla-cron-dispatcher`.
- No tocar los otros proyectos Supabase (`prometheus-saas`, `trader-grail`).
- Solo crearé objetos nuevos dentro de un **schema `ketzal` dedicado** (no existe aún).

## Estrategia: schema `ketzal` + reutilizar `auth.users`

Igual que `tiendas`, Ketzal vive en su propio schema. Cero colisión con las 21 tablas de `public` (incluso aunque ambas tengan `products`/`profiles`, quedan aisladas por schema).

**Identidad/login**: se reutiliza **`auth.users`** (Supabase Auth). Ketzal NO crea su propia tabla de usuarios con password. Los datos propios de Ketzal por usuario van en **`ketzal.profiles`** (1:1 con `auth.users`, igual que `tiendas.profiles`):

```
ketzal.profiles
  id            uuid PK   -- = auth.users.id (poblado por trigger handle_new_user)
  email         text
  name          text
  role          ketzal.user_role  -- enum: user | admin | superadmin
  axo_coins_earned numeric default 50
  referral_code text
  supplier_id   uuid  -- FK -> ketzal.suppliers (nullable)
  image         text
  created_at/updated_at
```

`Account`, `VerificationToken`, `PasswordResetToken` del schema Prisma **se eliminan del diseño**: Supabase Auth ya hace OAuth, verificación de email y reset de password nativamente.

## Mapeo Prisma → schema `ketzal`

| Modelo Prisma actual | Tabla nueva | Notas |
|---|---|---|
| `User` | se divide: `auth.users` (identidad) + `ketzal.profiles` (rol, axo coins, etc.) | reutiliza login |
| `Account` / `VerificationToken` / `PasswordResetToken` | — (eliminar) | Supabase Auth lo cubre |
| `Supplier` | `ketzal.suppliers` | |
| `Service` | `ketzal.services` | 3 FK a suppliers (principal/transporte/hotel) |
| `Product` | `ketzal.products` | aislado de `tiendas.products` |
| `Categories` | `ketzal.categories` | |
| `Review` | `ketzal.reviews` | `user_id → auth.users` |
| `Payment` | `ketzal.payments` | cuotas + MXN/AXO |
| `TravelPlanner` | `ketzal.travel_planners` | `user_id → auth.users` |
| `PlannerItem` | `ketzal.planner_items` | |
| `Wallet` | `ketzal.wallets` | `user_id → auth.users` |
| `WalletTransaction` | `ketzal.wallet_transactions` | |
| `Wishlist` | `ketzal.wishlists` | |
| `WishlistItem` | `ketzal.wishlist_items` | |
| `Notification` | `ketzal.notifications` | |
| `global_locations` | `ketzal.global_locations` (o compartir) | datos de referencia país/estado/ciudad |
| enums (`Role`, `PaymentStatus`, `PlannerStatus`, `WalletTransactionType`, `NotificationType`, `NotificationPriority`) | enums nativos en `ketzal` | |

**Convención de nombres**: el resto de la plataforma usa `snake_case` + tablas en plural. Propongo seguirlo en `ketzal` (consistencia). Implica mapear con `@map`/`@@map` + `@@schema("ketzal")` si seguimos usando Prisma.

## Decisiones abiertas (requieren tu respuesta)

1. **Sistema de auth**:
   - **(A) Adoptar Supabase Auth** — reutiliza `auth.users` como pediste; reescribe la capa de auth de Ketzal (NextAuth → `@supabase/supabase-js` + `@supabase/ssr`). Mayor cambio, pero alineado con `tiendas`/oficina y con email-verify/reset gratis.
   - **(B) Mantener NextAuth** — Prisma apunta a `ketzal` schema con su propia tabla `users`. Mínimo cambio de código, **pero NO reutiliza `auth.users`** (crea identidad paralela), contradice el objetivo.
2. **ORM**: ¿seguimos con Prisma (multi-schema, apuntando a este Supabase) o migramos a `@supabase/supabase-js` como el resto de la plataforma?
3. **Naming**: ¿`snake_case` (consistencia con plataforma) o conservar el naming actual de Prisma (menos cambios en Ketzal)?

## Decisiones tomadas (2026-05-27)

1. **Auth**: Supabase Auth, reutilizando `auth.users`.
2. **Capa de datos**: `@supabase/supabase-js` (se retira Prisma de Ketzal).
3. **Naming**: `snake_case` plural.

## Rollout por fases (cada fase, aprobación previa)

1. **Fase 0 (hecha)**: survey read-only + este plan + reminder de expiración del token.
2. **Fase 1 (HECHA — 2026-05-27)**: ejecutado contra la DB y verificado.
   - `ketzal` schema + enum `ketzal.user_role` + `ketzal.profiles` (1:1 auth.users) + trigger `updated_at` + RLS (select/update propio) + grants.
   - `public.handle_new_user` reemplazado por versión **app-aware**: si `raw_user_meta_data->>'app'='ketzal'` crea solo el perfil; cualquier otro signup mantiene el flujo de agencia idéntico (org + 7 agentes). Verificado con test transaccional (rolled back): alta ketzal creó perfil y NO creó org.
   - PostgREST: `db_schema` ahora `public,graphql_public,tiendas,ketzal` (aditivo).
   - SQL de referencia: [sql/phase1_ketzal_schema.sql](sql/phase1_ketzal_schema.sql).
3. **Fase 2 (HECHA — 2026-05-27)**: catálogo en `ketzal` + RLS, ejecutado y verificado.
   - Tablas: `suppliers`, `categories`, `products`, `services` (FKs supplier/transport/hotel → suppliers), `reviews` (→ services, → auth.users). PKs uuid, snake_case.
   - Helpers RLS: `ketzal.is_superadmin()`, `ketzal.my_supplier_id()` (SECURITY DEFINER).
   - RLS en las 5 tablas: **lectura pública** (anon+authenticated); escritura acotada (superadmin / dueño del supplier; reviews por su autor). Índices + triggers `updated_at`. Grants a anon (select) y authenticated/service_role (DML).
   - FK `profiles.supplier_id → suppliers.id` añadida.
   - SQL de referencia: [sql/phase2_ketzal_catalog.sql](sql/phase2_ketzal_catalog.sql).
   - **Auth validado end-to-end** antes de esta fase: signUp(app=ketzal) → perfil role=user/axo=50, sin org de agencia; login OK; cleanup OK. (Nota: el proyecto tiene confirmación de email desactivada.)
4. **Fase 3 (HECHA — 2026-05-27)**: dominio core en `ketzal`, ejecutado y verificado.
   - Enums: `payment_status`, `planner_status`, `wallet_txn_type`, `notification_type`, `notification_priority`.
   - Tablas: `travel_planners`, `planner_items`, `wishlists`, `wishlist_items`, `wallets`, `wallet_transactions`, `payments`, `notifications` + índices + triggers `updated_at`.
   - RLS: planners/wishlists = dueño total + lectura pública si `is_public`; items via dueño del padre; **wallets/wallet_transactions/payments = solo lectura del dueño** (escrituras de dinero por backend/service_role); notifications = dueño lee/marca/borra, creación por backend.
   - Total en `ketzal`: 14 tablas (todas con RLS), 6 enums, 20 FKs. SQL: [sql/phase3_ketzal_domain.sql](sql/phase3_ketzal_domain.sql).
5. **Fase 4 (EN CURSO — 2026-05-27)**: cableado de la app (conviviendo con NextAuth, sin romperlo).
   - Deps: `@supabase/ssr`, `@supabase/supabase-js@latest` (2.106), `ws` (+ `@types/ws`).
   - `.env.local` (gitignored) con `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Clientes: [lib/supabase/client.ts](../lib/supabase/client.ts) (browser), [lib/supabase/server.ts](../lib/supabase/server.ts) (server, cookies), [lib/supabase/middleware.ts](../lib/supabase/middleware.ts) (helper de refresh, aún NO cableado al middleware raíz). Todos con `db.schema = 'ketzal'`.
   - Auth helpers: [lib/supabase/auth-actions.ts](../lib/supabase/auth-actions.ts) — `ketzalSignUp` (con `app:'ketzal'`), `ketzalSignIn`, `ketzalSignOut`, `getKetzalUser`.
   - Tipos: [lib/supabase/database.types.ts](../lib/supabase/database.types.ts) (schema ketzal completo; regenerable desde la API/CLI).
   - **Fix Node 20**: supabase-js construye realtime al instanciar y Node < 22 no trae WebSocket nativo → en `server.ts` se pasa `realtime: { transport: ws }`. Browser/Edge usan WebSocket nativo.
   - Smoke test: [scripts/supabase-smoke.mjs](../scripts/supabase-smoke.mjs) → anon lee `services` (público), `profiles` da 401 (sin grant). PASS.
   - **Pendiente**: UI de login/registro contra Supabase Auth, cablear `middleware.ts` raíz (refresh de sesión) y retirar NextAuth cuando el flujo nuevo esté probado; migrar lecturas/mutaciones de datos a supabase-js.
6. **Fase 5 (pendiente)**: seeds mínimos + smoke tests.

Cada fase se entrega como SQL revisable antes de ejecutarse contra la DB.
