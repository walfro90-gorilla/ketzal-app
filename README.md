# Ketzal Marketplace

Ketzal es una plataforma de marketplace turístico desarrollada en Next.js 15 que permite a usuarios gestionar servicios turísticos, planificar viajes, administrar productos y facilitar transacciones entre proveedores y viajeros.

## 🎯 Características Principales

- **Sistema de Autenticación**: Registro, login, verificación de email y recuperación de contraseñas
- **Gestión de Usuarios**: Perfiles de usuarios, proveedores y administradores
- **Catálogo de Servicios**: Tours, hoteles, transporte y actividades turísticas
- **Planificador de Viajes**: Herramienta para crear itinerarios personalizados
- **Sistema de Productos**: Marketplace de productos relacionados con viajes
- **Billetera Digital**: Gestión de fondos y transacciones
- **Sistema de Notificaciones**: Comunicación en tiempo real con usuarios
- **Panel Administrativo**: Gestión completa del sistema
- **Gestión de Imágenes**: Integración con Cloudinary para optimización

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd ketzal-marketplace

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Configurar base de datos
npx prisma db push
npx prisma generate

# Ejecutar en desarrollo
npm run dev
```

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
```

## 📚 Documentación Completa

### 📋 Documentación Principal

- **[Índice de Documentación](./INDICE_DOCUMENTACION.md)** - Punto de entrada y navegación general
- **[Documentación API Completa](./DOCUMENTACION_API_COMPLETA.md)** - Documentación detallada de todas las APIs, componentes y funciones
- **[Guía de Referencia Rápida](./GUIA_REFERENCIA_RAPIDA.md)** - Referencia rápida con ejemplos de código y patrones comunes

### 🛠️ Guías Específicas

- `DEBUGGING_GUIDE.md` - Guía de depuración del sistema
- `IMAGE_OPTIMIZATION_GUIDE.md` - Guía de optimización de imágenes
- `TRAVEL_PLANNER_GUIDE.md` - Guía del planificador de viajes
- `NOTIFICATION_SYSTEM_COMPLETE.md` - Sistema completo de notificaciones
- `WALLET_IMPLEMENTATION_FINAL.md` - Implementación de la billetera digital
- `SUPER_ADMIN_IMPLEMENTATION_COMPLETE.md` - Panel de administración

## 🏗️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Shadcn/UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth v5
- **Validación**: Zod
- **Gestión de Imágenes**: Cloudinary
- **Email**: Resend

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Desarrollo normal
npm run dev:turbo        # Con Turbopack
npm run dev:full         # Con verificación del backend

# Construcción
npm run build            # Build para producción
npm run start            # Iniciar en producción

# Base de datos
npx prisma studio        # Interfaz visual de BD
npx prisma generate      # Generar cliente
npx prisma db push       # Aplicar cambios a BD

# Testing
npm run test:cloudinary     # Test de Cloudinary
npm run check:backend       # Verificar backend
```

## 📊 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (auth)/            # Páginas de autenticación
│   └── (protected)/       # Páginas protegidas
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── admin/            # Componentes administrativos
│   └── travel-planner/   # Componentes del planificador
├── hooks/                # Custom hooks
├── lib/                  # Funciones utilitarias
├── types/                # Tipos TypeScript
└── validations/          # Esquemas Zod
```

## 🔍 Para Desarrolladores

### Nuevos Desarrolladores
1. Lee la [Guía de Referencia Rápida](./GUIA_REFERENCIA_RAPIDA.md)
2. Revisa el [Índice de Documentación](./INDICE_DOCUMENTACION.md)
3. Explora la [Documentación Completa](./DOCUMENTACION_API_COMPLETA.md)

### Desarrolladores Experimentados
- Consulta las APIs específicas en la documentación completa
- Revisa los hooks personalizados y componentes disponibles
- Utiliza los patrones establecidos para nuevas funcionalidades

## 📝 Contribución

1. **Antes de empezar**: Lee la documentación relevante
2. **Configuración**: Asegúrate de tener el entorno configurado
3. **Desarrollo**: Usa los patrones establecidos
4. **Testing**: Prueba tus cambios
5. **Documentación**: Actualiza la documentación si es necesario

## 🚨 Solución de Problemas

- **Error de autenticación**: Verifica `NEXTAUTH_SECRET` y `NEXTAUTH_URL`
- **Problemas de base de datos**: Ejecuta `npx prisma db push`
- **Imágenes no cargan**: Verifica configuración de Cloudinary
- **Guía completa**: [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)

## 📞 Recursos

- **Documentación**: [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md)
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://authjs.dev/

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Compatible con**: Next.js 15, React 18, TypeScript 5
