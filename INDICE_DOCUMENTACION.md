# Índice de Documentación - Ketzal Marketplace

## 📖 Bienvenido a la Documentación de Ketzal

Ketzal es una plataforma de marketplace turístico desarrollada en Next.js 15 que permite a usuarios gestionar servicios turísticos, planificar viajes, administrar productos y facilitar transacciones entre proveedores y viajeros.

## 🎯 Descripción del Proyecto

**Ketzal Marketplace** es una aplicación web completa que incluye:

- **Sistema de Autenticación**: Registro, login, verificación de email y recuperación de contraseñas
- **Gestión de Usuarios**: Perfiles de usuarios, proveedores y administradores
- **Catálogo de Servicios**: Tours, hoteles, transporte y actividades turísticas
- **Planificador de Viajes**: Herramienta para crear itinerarios personalizados
- **Sistema de Productos**: Marketplace de productos relacionados con viajes
- **Billetera Digital**: Gestión de fondos y transacciones
- **Sistema de Notificaciones**: Comunicación en tiempo real con usuarios
- **Panel Administrativo**: Gestión completa del sistema
- **Gestión de Imágenes**: Integración con Cloudinary para optimización

### Tecnologías Principales

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Shadcn/UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth v5
- **Validación**: Zod
- **Gestión de Imágenes**: Cloudinary
- **Email**: Resend
- **Deployment**: Vercel/Netlify compatible

## 📚 Documentación Disponible

### 📋 Documentación Principal

| Documento | Descripción | Público Objetivo |
|-----------|-------------|------------------|
| **[DOCUMENTACION_API_COMPLETA.md](./DOCUMENTACION_API_COMPLETA.md)** | Documentación completa de todas las APIs, componentes, hooks y funciones públicas del sistema | Desarrolladores que necesitan información detallada |
| **[GUIA_REFERENCIA_RAPIDA.md](./GUIA_REFERENCIA_RAPIDA.md)** | Referencia rápida con ejemplos de código y patrones comunes | Desarrolladores que buscan soluciones inmediatas |

### 📋 Documentación Específica Existente

| Documento | Descripción |
|-----------|-------------|
| `ADDTOPLANNERBUTTON_IMPROVEMENTS.md` | Mejoras del botón "Agregar al Planificador" |
| `DEBUGGING_GUIDE.md` | Guía de depuración del sistema |
| `IMAGE_OPTIMIZATION_GUIDE.md` | Guía de optimización de imágenes |
| `KETZAL_MARKETPLACE_PLAN.md` | Plan maestro del marketplace |
| `NOTIFICATION_SYSTEM_COMPLETE.md` | Sistema completo de notificaciones |
| `PLANNER_DETAIL_IMPROVEMENTS.md` | Mejoras del detalle del planificador |
| `REGISTRO_USUARIOS_CORRECCION.md` | Correcciones del sistema de registro |
| `SEAT_SELECTOR_IMPLEMENTATION.md` | Implementación del selector de asientos |
| `SOLUCION_CLOUDINARY.md` | Solución de integración con Cloudinary |
| `SUPER_ADMIN_IMPLEMENTATION_COMPLETE.md` | Implementación del panel de super administrador |
| `TRANSACTION_HISTORY_FIX.md` | Corrección del historial de transacciones |
| `TRAVEL_PLANNER_GUIDE.md` | Guía del planificador de viajes |
| `USER_NOTIFICATIONS_SYSTEM_COMPLETE.md` | Sistema completo de notificaciones de usuario |
| `WALLET_IMPLEMENTATION_FINAL.md` | Implementación final de la billetera |
| `WELCOME_NOTIFICATIONS_SYSTEM_COMPLETE.md` | Sistema completo de notificaciones de bienvenida |

## 🚀 Empezando

### Para Desarrolladores Nuevos

1. **Inicio Rápido**: Lee la [Guía de Referencia Rápida](./GUIA_REFERENCIA_RAPIDA.md)
2. **Configuración**: Sigue las instrucciones de instalación en el README.md
3. **Arquitectura**: Revisa la [Documentación Completa](./DOCUMENTACION_API_COMPLETA.md) para entender la estructura

### Para Desarrolladores Experimentados

1. **APIs**: Consulta directamente las secciones específicas en la documentación completa
2. **Componentes**: Revisa la librería de componentes y sus props
3. **Hooks**: Utiliza los hooks personalizados para funcionalidades comunes

### Para Administradores de Sistema

1. **Panel Admin**: Revisa `SUPER_ADMIN_IMPLEMENTATION_COMPLETE.md`
2. **Configuración**: Consulta las guías específicas de configuración
3. **Monitoreo**: Utiliza las herramientas de debugging disponibles

## 🔧 Configuración del Proyecto

### Variables de Entorno Requeridas

```bash
# Base de datos
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="tu-secreto-super-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Email (Resend)
RESEND_API_KEY="re_..."

# Backend URL
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

### Instalación y Desarrollo

```bash
# 1. Clonar el repositorio
git clone [repository-url]

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 4. Configurar base de datos
npx prisma db push
npx prisma generate

# 5. Ejecutar en desarrollo
npm run dev

# Opciones adicionales:
npm run dev:turbo    # Con Turbopack
npm run dev:full     # Verificación completa del backend
```

## 📊 Estructura de la Aplicación

### Arquitectura Frontend

```
app/
├── (auth)/                 # Rutas de autenticación
│   ├── login/
│   ├── register/
│   └── reset-password/
├── (protected)/            # Rutas protegidas
│   ├── dashboard/
│   ├── perfil/
│   └── admin/
├── (public)/               # Rutas públicas
│   ├── servicios/
│   ├── productos/
│   └── destinos/
└── api/                    # API Routes
    ├── auth/
    ├── users/
    ├── services/
    ├── products/
    ├── notifications/
    └── wallet/
```

### Componentes Organizados

```
components/
├── ui/                     # Componentes base (Button, Input, etc.)
├── auth/                   # Componentes de autenticación
├── admin/                  # Componentes administrativos
├── travel-planner/         # Planificador de viajes
├── wallet/                 # Billetera digital
├── dashboard/              # Dashboard components
└── [feature]/              # Componentes específicos por funcionalidad
```

### Hooks Personalizados

```
hooks/
├── useAuthDetection.ts     # Detección de autenticación
├── useSessionReady.ts      # Estado de sesión
├── useSeatSelector.ts      # Selección de asientos
├── useScrollDirection.ts   # Dirección del scroll
├── useMobile.ts           # Detección de dispositivo móvil
├── useFAQs.ts             # Gestión de FAQs
└── use-toast.ts           # Sistema de notificaciones toast
```

## 🔍 Navegación por Funcionalidades

### Autenticación y Usuarios

- **Documentación**: [Sección de Autenticación](./DOCUMENTACION_API_COMPLETA.md#apis-públicas)
- **Componentes**: `LoginForm`, `RegisterForm`, `ForgotPasswordForm`
- **Hooks**: `useAuthDetection`, `useSessionReady`
- **APIs**: `/api/auth/*`, `/api/users`, `/api/check-user-*`

### Servicios Turísticos

- **Documentación**: [Sección de Servicios](./DOCUMENTACION_API_COMPLETA.md#3-api-de-servicios)
- **Componentes**: `ServiceCard`, `TourPricing`, `SeatSelector`
- **Validación**: `serviceSchema`
- **APIs**: `/api/services/*`

### Planificador de Viajes

- **Documentación**: [Travel Planner Guide](./TRAVEL_PLANNER_GUIDE.md)
- **Componentes**: `ItineraryBuilder`, `PlannerCart`, `TimelineService`
- **Tipos**: `PlannerCart`, `TimelineService`
- **Hooks**: `useSeatSelector`

### Sistema de Products

- **Documentación**: [Sección de Productos](./DOCUMENTACION_API_COMPLETA.md#4-api-de-productos)
- **Funciones**: `getAllProducts`, `searchProducts`, `filterProducts`
- **Tipos**: `Product`, `ProductCategory`, `ProductSpecifications`
- **Componentes**: `ProductCard`

### Gestión de Imágenes

- **Documentación**: [Guía de Optimización](./IMAGE_OPTIMIZATION_GUIDE.md)
- **Componentes**: `CloudinaryImage`, `ImagesUploader`
- **Funciones**: `uploadToCloudinaryAPI`, `getOptimizedImageUrl`
- **APIs**: `/api/upload`, `/api/delete-image`

### Sistema de Notificaciones

- **Documentación**: [Sistema Completo](./NOTIFICATION_SYSTEM_COMPLETE.md)
- **Componentes**: `NotificationBell`
- **Hooks**: `useToast`
- **APIs**: `/api/notifications/*`

### Billetera Digital

- **Documentación**: [Implementación Final](./WALLET_IMPLEMENTATION_FINAL.md)
- **Componentes**: Componentes en `/wallet`
- **Funciones**: `getWallet`, `addFunds`, `transferFunds`
- **APIs**: `/api/wallet/*`

### Panel Administrativo

- **Documentación**: [Super Admin Implementation](./SUPER_ADMIN_IMPLEMENTATION_COMPLETE.md)
- **Componentes**: `SuperAdminPanel`, `RegisterAdminForm`
- **APIs**: `/api/admin/*`

## 🛠️ Herramientas de Desarrollo

### Scripts NPM Disponibles

```bash
# Desarrollo
npm run dev              # Desarrollo normal
npm run dev:turbo        # Con Turbopack
npm run dev:full         # Con verificación del backend

# Construcción
npm run build            # Build para producción
npm run start            # Iniciar en producción

# Linting y calidad
npm run lint             # ESLint

# Base de datos
npx prisma studio        # Interfaz visual de BD
npx prisma generate      # Generar cliente
npx prisma db push       # Aplicar cambios a BD

# Testing específico
npm run test:cloudinary          # Test de Cloudinary
npm run test:cloudinary:all      # Test completo de Cloudinary

# Verificación del sistema
npm run check:backend            # Verificar backend
npm run images:check             # Verificar optimización de imágenes
```

### Herramientas de Debugging

- **Session Debug**: `/api/debug-session`
- **Force Logout**: `/api/force-logout`
- **Componente Debug**: `SessionDebugger`
- **Guía**: [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)

## 📝 Contribución y Desarrollo

### Flujo de Trabajo Recomendado

1. **Antes de empezar**: Lee la documentación relevante
2. **Configuración**: Asegúrate de tener el entorno configurado
3. **Desarrollo**: Usa los patrones establecidos en la guía de referencia
4. **Testing**: Prueba tus cambios con las herramientas disponibles
5. **Documentación**: Actualiza la documentación si es necesario

### Patrones de Código

- **Validación**: Siempre usa esquemas Zod
- **Tipos**: Aprovecha TypeScript al máximo
- **Componentes**: Sigue los patrones de Shadcn/UI
- **Estilos**: Usa Tailwind CSS con el sistema de design
- **Estado**: Maneja loading, error y success states
- **Autenticación**: Siempre verifica permisos

### Testing

- **Cloudinary**: `npm run test:cloudinary:all`
- **APIs**: Usa `/api/test` para pruebas
- **Componentes**: Testing manual con Storybook (si está configurado)

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de autenticación**: Verifica `NEXTAUTH_SECRET` y `NEXTAUTH_URL`
2. **Problemas de base de datos**: Ejecuta `npx prisma db push`
3. **Imágenes no cargan**: Verifica configuración de Cloudinary
4. **Estilos no aplicados**: Revisa configuración de Tailwind CSS

### Recursos de Ayuda

- **Debugging Guide**: [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)
- **Issues específicos**: Revisa documentos de solución específicos
- **Logs**: Usa las herramientas de debugging integradas

## 📞 Soporte y Contacto

### Documentación

- **Completa**: [DOCUMENTACION_API_COMPLETA.md](./DOCUMENTACION_API_COMPLETA.md)
- **Referencia rápida**: [GUIA_REFERENCIA_RAPIDA.md](./GUIA_REFERENCIA_RAPIDA.md)
- **Guías específicas**: Ver archivos individuales en el repositorio

### Recursos Externos

- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://authjs.dev/
- **Zod**: https://zod.dev/
- **Cloudinary**: https://cloudinary.com/documentation

---

## 📋 Checklist para Nuevos Desarrolladores

### Setup Inicial
- [ ] Clonar repositorio
- [ ] Instalar dependencias (`npm install`)
- [ ] Configurar variables de entorno
- [ ] Configurar base de datos (`npx prisma db push`)
- [ ] Ejecutar en desarrollo (`npm run dev`)

### Conocimiento Básico
- [ ] Leer [Guía de Referencia Rápida](./GUIA_REFERENCIA_RAPIDA.md)
- [ ] Entender estructura del proyecto
- [ ] Familiarizarse con componentes principales
- [ ] Conocer hooks personalizados disponibles

### Desarrollo Avanzado
- [ ] Revisar [Documentación Completa](./DOCUMENTACION_API_COMPLETA.md)
- [ ] Entender patrones de autenticación
- [ ] Conocer sistema de validación con Zod
- [ ] Practicar con ejemplos de código

### Especialización
- [ ] Elegir área de especialización (frontend, backend, admin)
- [ ] Revisar documentación específica
- [ ] Implementar funcionalidades siguiendo patrones establecidos

---

**Última actualización**: Diciembre 2024  
**Versión de la documentación**: 1.0  
**Compatible con**: Next.js 15, React 18, TypeScript 5

Esta documentación está en constante evolución. Asegúrate de consultar siempre la versión más reciente para obtener información actualizada sobre las funcionalidades y APIs del sistema Ketzal Marketplace.