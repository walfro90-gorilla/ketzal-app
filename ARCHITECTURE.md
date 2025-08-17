# Arquitectura de Ketzal App Frontend

Este documento describe la arquitectura general del proyecto Ketzal App Frontend, un marketplace de experiencias turísticas en México.

## Resumen Tecnológico

La aplicación está construida como un monolito full-stack utilizando **Next.js** y **TypeScript**. Aprovecha el **App Router** de Next.js para la renderización en el servidor (SSR), la generación de sitios estáticos (SSG) y la creación de APIs.

- **Framework Principal**: [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos ORM**: [Prisma](https://www.prisma.io/)
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/)
- **UI**: [React](https://react.dev/), [Shadcn/UI](https://ui.shadcn.com/) y [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Vercel (inferido por el uso de Next.js)

## Arquitectura del Frontend

El frontend está estructurado siguiendo las convenciones del App Router de Next.js.

### 1. **Componentes de UI**

- La interfaz de usuario se construye con **React** y **TypeScript**.
- Se utiliza **Shadcn/UI** como librería de componentes, lo que permite tener componentes accesibles y personalizables que se pueden extender fácilmente. Los componentes base se encuentran en `components/`.
- **Tailwind CSS** se utiliza para el estilismo de bajo nivel (utility-first), permitiendo una alta personalización y un diseño consistente. La configuración se encuentra en `tailwind.config.ts`.

### 2. **Enrutamiento y Layouts**

- El enrutamiento se gestiona con el **App Router** de Next.js, utilizando una estructura de directorios dentro de `app/`.
- **Layouts anidados**: Se definen layouts raíz (`app/layout.tsx`) y layouts específicos para diferentes secciones de la aplicación (ej. `app/(protected)/layout.tsx`).
- **Grupos de rutas**: Se utilizan para organizar las rutas sin afectar la URL.
  - `(auth)`: Rutas de autenticación (login, registro).
  - `(protected)`: Rutas que requieren que el usuario esté autenticado.
  - `(public)`: Rutas públicas accesibles para todos.
- La protección de rutas se implementa a través del archivo `middleware.ts`, que verifica la sesión del usuario antes de permitir el acceso a las rutas protegidas.

## Arquitectura del Backend

El backend está integrado en la misma aplicación Next.js, aprovechando sus capacidades "full-stack".

### 1. **API y Lógica de Servidor**

- **API Routes**: Se definen endpoints de API dentro de `app/api/`. Estos se utilizan para tareas como la comunicación con servicios de terceros o para operaciones que no se exponen directamente a través de Server Actions.
- **Server Actions**: La mayoría de las mutaciones de datos (crear, actualizar, eliminar) se manejan con **Server Actions**, definidas en el directorio `actions/`. Esto permite llamar a funciones del servidor directamente desde los componentes de React, simplificando el manejo de formularios y la lógica del cliente.

### 2. **Autenticación y Autorización**

- Se utiliza **NextAuth.js** (`auth.ts`, `auth.config.ts`) para gestionar la autenticación.
- Soporta el inicio de sesión con credenciales (email/contraseña) y potencialmente proveedores de OAuth.
- La sesión del usuario se gestiona tanto en el cliente como en el servidor, y se utiliza para proteger rutas y APIs.
- Se definen roles de usuario (ej. `USER`, `ADMIN`, `SUPER_ADMIN`) para la autorización, controlando el acceso a funcionalidades específicas como el panel de super-administrador.

### 3. **Base de Datos**

- **Prisma** actúa como el ORM para interactuar con la base de datos. La configuración del cliente de Prisma se encuentra en `prisma.ts`.
- El esquema de la base de datos (`schema.prisma`) define los modelos de datos, como `User`, `Supplier`, `Service`, `Itinerary`, etc.
- Las migraciones de la base de datos son gestionadas por Prisma Migrate.

## Estructura de Directorios Principal

```
.
├── actions/         # Server Actions para mutaciones de datos.
├── app/             # App Router: páginas, layouts y APIs.
│   ├── (auth)/      # Rutas de autenticación.
│   ├── (protected)/ # Rutas protegidas.
│   ├── (public)/    # Rutas públicas.
│   └── api/         # API Routes.
├── components/      # Componentes de React (UI).
├── lib/             # Funciones de utilidad y librerías auxiliares.
├── prisma/          # Esquema y migraciones de Prisma.
├── public/          # Archivos estáticos (imágenes, fuentes).
├── tests/           # Pruebas unitarias y de integración.
├── auth.ts          # Configuración principal de NextAuth.js.
├── middleware.ts    # Middleware para protección de rutas.
└── next.config.ts   # Configuración de Next.js.
```

## Flujo de Datos y Lógica de Negocio

1.  **Renderizado de Páginas**: El usuario solicita una página. Next.js la renderiza en el servidor, obteniendo los datos necesarios directamente desde la base de datos a través de Prisma.
2.  **Interacción del Usuario**: El usuario interactúa con la UI (ej. llena un formulario).
3.  **Mutación de Datos**: Al enviar un formulario, se invoca una **Server Action**.
4.  **Lógica de Servidor**: La Server Action ejecuta la lógica de negocio (validación, actualización de la base de datos con Prisma, etc.).
5.  **Actualización de la UI**: Next.js revalida los datos y actualiza automáticamente la UI del cliente, mostrando los cambios sin necesidad de una recarga completa de la página.

Esta arquitectura permite un desarrollo rápido y cohesivo, manteniendo una separación clara de responsabilidades entre el frontend y el backend, a pesar de estar en el mismo proyecto.
