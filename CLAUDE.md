# Ketzal App

Marketplace de experiencias turísticas en México. Monolito full‑stack Next.js: el frontend, las API Routes y los Server Actions viven en este repo y hablan directamente a PostgreSQL (Supabase) vía Prisma.

> Documentación de arquitectura larga: [ARCHITECTURE.md](ARCHITECTURE.md) y FODA en [ARCHI-FODA.md](ARCHI-FODA.md). Documentos históricos de implementación (entrega por feature, no fuente de verdad) viven en [docs/](docs/).

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript** estricto
- **Prisma 6** sobre **PostgreSQL** (Supabase) — esquema en [prisma/schema.prisma](prisma/schema.prisma)
- **NextAuth v5 beta** con estrategia **JWT** (sin PrismaAdapter)
- **Shadcn/UI** (Radix) + **Tailwind CSS** — primitivos en [components/ui/](components/ui/)
- **Cloudinary** para imágenes, **Resend** para email, **Zod** para validación
- **Jest** + **ts-jest** para tests (cobertura baja, ver FODA)

## Dominio (lo que hay que tener en la cabeza)

Ketzal no es un e‑commerce clásico. Tiene tres piezas que reemplazan/extienden el carrito tradicional:

1. **TravelPlanner** — sustituye al carrito. Un usuario puede tener múltiples planners (por viaje/destino), cada uno con `PlannerItem`s que apuntan a `Service` (tour) o `Product` (shop). Estados: `PLANNING → RESERVED → CONFIRMED → TRAVELLING → COMPLETED`.
2. **Wallet** — saldo dual: `balanceMXN` (pesos) y `balanceAxo` (AXO Coins, moneda interna gamificada). Cada usuario recibe **50 AXO Coins de bienvenida** al registrarse (campo `User.axoCoinsEarned`, default 50). Transacciones tipificadas en `WalletTransactionType`.
3. **Wishlist** — listas con `shareCode` único (compartibles) y `priceAlert` por item.

`Payment` soporta cuotas (`installments` / `currentInstallment`) y precios duales (MXN + AXO).

`Service` (tour) y `Product` (shop) son entidades paralelas; ambos pueden estar en planners o wishlists. `Service` lleva proveedor principal + opcionales de transporte y hotel (tres FKs distintas hacia `Supplier`).

## Roles

Enum `Role` en minúsculas: `user | admin | superadmin`.
- `admin` = proveedor turístico (no es administrador de plataforma). El registro de `admin` crea también un `Supplier` y dispara una notificación `SUPPLIER_APPROVAL` al super‑admin para aprobación.
- `superadmin` = único rol con acceso a `/super-admin/*` (forzado en [middleware.ts](middleware.ts) + [auth.ts](auth.ts) callback `authorized`).

Super‑admin actual del entorno de desarrollo: `walfre.am@gmail.com`.

## Estructura

```
app/
  (auth)/         login, registro, forgot/reset password
  (protected)/    rutas que requieren sesión (services, users, suppliers, super-admin, home)
  (public)/       rutas abiertas (tours, store, planners, wallet, cart, supplier, …)
  api/            API Routes (auth, wallet, notifications, services, upload, admin, …)
actions/          Server Actions ("use server") — fuente principal de mutaciones
components/
  ui/             primitivos shadcn
  travel-planner/ Sidebar, AddToPlanner, SeatSelector, Timeline
  admin/, store/, dashboard/
context/          Contextos globales (WalletContext, TravelPlannerContext, CartContext heredado, …)
hooks/            useAuthDetection, useSessionReady, useSeatSelector, useFAQs
lib/              db (Prisma client), zod schemas, mail, cloudinary, supabaseClient, api/
prisma/           schema.prisma + migrations (dev.db es legado SQLite ignorado)
__tests__/        tests Jest (foundation en construcción)
docs/             docs históricos por feature (snapshot al momento de entrega, NO fuente de verdad)
scripts/          scripts de utilidad y diagnóstico (test:cloudinary, debug, seeds)
```

## Convenciones clave

- **Mutaciones → Server Actions** en `actions/*.ts` con `"use server"`. API Routes solo para integraciones externas o cosas que necesitan endpoint HTTP real (uploads, webhooks de auth, etc.).
- **Cliente Prisma**: importar de `@/lib/db` (singleton). No instanciar `new PrismaClient()`.
- **Sesión en servidor**: `await auth()` desde `@/auth`. El JWT incluye `role`, `supplierId`, `id`.
- **Validación**: Zod schemas en [lib/zod.ts](lib/zod.ts), usar `safeParse` y devolver errores al cliente.
- **Imágenes**: subir a Cloudinary vía `lib/cloudinary.ts`; mostrar con `<OptimizedImage>` / `<CloudinaryImage>`.
- **Notificaciones**: crear con `createNotification()` de [app/api/notifications/notifications.api.ts](app/api/notifications/notifications.api.ts). Tipos en enum `NotificationType`, prioridades en `NotificationPriority`.
- **Rutas protegidas**: lógica central en el callback `authorized` de [auth.ts](auth.ts) — listas explícitas de rutas públicas; el resto requiere sesión. El matcher en [middleware.ts](middleware.ts) excluye `api`, `_next/*`, estáticos.
- **Refactor backend a micro‑funciones serverless**: en curso a nivel de Vercel (ver [docs/REFACTOR_FRONTEND_GUIDE.md](docs/REFACTOR_FRONTEND_GUIDE.md)). Las URLs de la API **no cambian** — no tocar llamadas del cliente por este motivo.

## Comandos

```bash
npm run dev            # next dev
npm run dev:turbo      # next dev --turbopack
npm run build          # build de producción (corre prisma generate por postinstall)
npm run start          # next start
npm run lint           # next lint
npm run test           # jest
npm run test:watch     # jest --watch
npm run test:coverage  # jest --coverage
npm run dev:full       # check:backend && dev
```

Migraciones Prisma: `npx prisma migrate dev` / `npx prisma generate`. Variables sensibles en `.env` (no commitear).

## Testing

- **Framework**: Jest + ts-jest, `testEnvironment: 'node'`. Config en [jest.config.cjs](jest.config.cjs).
- **Convenciones**: tests viven en `__tests__/`, espejando la estructura de origen (`__tests__/lib/*.test.ts` para `lib/`, `__tests__/actions/*.test.ts` para `actions/`, etc.).
- **`testPathIgnorePatterns`** excluye `scripts/`, `docs/`, `.next/`, `node_modules/`.
- **Estrategia**: prioridad a tests puros (schemas Zod, helpers, validaciones) que no requieren mock de DB. Server Actions se testean mockeando `@/auth` y `@/lib/db`. Para componentes UI, instalar `@testing-library/react` + `@testing-library/jest-dom` y `testEnvironment: 'jsdom'` por archivo.
- **Estado actual** (6 suites, 56 tests verdes):
  - [__tests__/lib/zod-schemas.test.ts](__tests__/lib/zod-schemas.test.ts) — schemas Zod (sign‑in, sign‑up, sign‑up admin con normalización E.164 de phone, forgot/reset password).
  - [__tests__/lib/planners-api.test.ts](__tests__/lib/planners-api.test.ts) — CRUD del proxy `planners.api.ts` (fetch al backend NestJS, ISO date conversion, error paths).
  - [__tests__/actions/auth-action.test.ts](__tests__/actions/auth-action.test.ts) — `registerAction` (user/admin), `registerAdminActionV2` (transacción User+Supplier), notificación al super‑admin no fatal.
  - [__tests__/actions/super-admin-actions.test.ts](__tests__/actions/super-admin-actions.test.ts) — `verifySuperAdmin`, `approveAdminRequest`, `rejectAdminRequest` con mocks de `@/auth` y `@/lib/db`.
  - [__tests__/api/wallet-route.test.ts](__tests__/api/wallet-route.test.ts) — `GET /api/wallet` (400/404/200/500).
  - [__tests__/service-creation.test.ts](__tests__/service-creation.test.ts) — service creation action.
- **Pendiente**: notification flow E2E, wallet transactions (transfer/convert/withdraw cuando existan), tests de componentes UI con `@testing-library/react` (ya instalado, falta `jest-environment jsdom` por test).
- **Dependencias instaladas para componentes**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jest-environment-jsdom`. Para tests de UI, agrega `/** @jest-environment jsdom */` al inicio del archivo.

## Trampas conocidas

- **PrismaAdapter está deshabilitado** porque la sesión es JWT, no DB. No habilitar sin migrar la estrategia.
- **`prisma/dev.db`** es legado de SQLite ignorado en `.gitignore`; el datasource real es PostgreSQL (Supabase).
- **El enum `UserStatus`** existe en el schema pero no está mapeado al modelo `User`. Si necesitas estado de aprobación, decide primero si re-añadir el campo o usar otro mecanismo (rol + `Notification`).
- **Carpeta `docs/`** son docs históricos por feature — útiles como referencia pero el código pudo haber evolucionado. No referenciar desde código vivo.

## Tareas comunes y dónde van

| Tarea | Empezar por |
|---|---|
| Nuevo tipo de notificación | enum `NotificationType` en [prisma/schema.prisma](prisma/schema.prisma) → `createNotification()` |
| Nuevo Server Action de mutación | `actions/<dominio>-action.ts` con `"use server"` |
| Nueva ruta pública | `app/(public)/<ruta>/page.tsx` + verificar lista `publicRoutes` en [auth.ts](auth.ts) |
| Añadir campo a Service / Product / User | editar `schema.prisma` → `prisma migrate dev --name <slug>` → tipar en zod si entra por formulario |
| Nuevo método de pago / cuota | extender `Payment` y enum `PaymentStatus` |
| Componente UI nuevo (botón, etc.) | `components/ui/` siguiendo el patrón shadcn existente |
