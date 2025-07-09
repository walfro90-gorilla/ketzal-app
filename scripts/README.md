# 🧪 Testing Suite para Cloudinary

Este directorio contiene una suite completa de tests para verificar que las funciones de Cloudinary funcionen correctamente en tu aplicación.

## 📋 **TIPOS DE TESTS DISPONIBLES**

### 1. 🔍 **Test de Verificación Estática** (`test-cloudinary.js`)
Verifica la configuración y estructura sin ejecutar uploads reales.

```powershell
npm run test:cloudinary
```

**Qué verifica:**
- ✅ Importación correcta de Cloudinary
- ✅ Estructura del API route
- ✅ Funciones en lib/cloudinary.ts
- ✅ Variables de entorno
- ✅ Configuración del endpoint
- ✅ Componente ImageUploader

### 2. 🚀 **Test Práctico** (`test-cloudinary-practical.js`)
Ejecuta pruebas reales con imágenes de ejemplo.

```powershell
# Con servidor en desarrollo activo
npm run dev
# En otra terminal:
npm run test:cloudinary:practical
```

**Qué hace:**
- 📥 Descarga imagen de prueba
- 🌐 Prueba upload real al API
- 🖥️ Verifica funciones del servidor
- 🔗 Prueba optimización de URLs
- 🧹 Limpia archivos temporales

### 3. 🧪 **Tests Unitarios** (`cloudinary.test.ts`)
Tests unitarios completos con mocks.

```powershell
npm run test:cloudinary:unit
```

**Qué cubre:**
- ✅ Cada función individualmente
- ✅ Manejo de errores
- ✅ Validaciones de tamaño
- ✅ Interfaces TypeScript
- ✅ Tests de rendimiento

### 4. 🎯 **Ejecutar Todos los Tests**
```powershell
npm run test:cloudinary:all
```

## 🏃‍♂️ **GUÍA DE USO RÁPIDA**

### Para verificación rápida (sin servidor):
```powershell
npm run test:cloudinary
```

### Para prueba completa (con servidor):
```powershell
# Terminal 1
npm run dev

# Terminal 2  
npm run test:cloudinary:practical
```

### Para desarrollo (tests unitarios):
```powershell
npm run test:cloudinary:unit
```

## 📊 **INTERPRETACIÓN DE RESULTADOS**

### ✅ **Todos los tests pasan**
```
🎉 ¡Todas las funciones de Cloudinary están correctamente configuradas!
```

### ⚡ **Tests parciales**
```
⚡ Funciones principales funcionando. Algunas requieren servidor activo.
```
- **Solución**: Ejecuta `npm run dev` y repite los tests

### ❌ **Tests fallan**
```
⚠️ Algunas configuraciones necesitan atención.
```
- **Solución**: Revisa las variables de entorno en `.env.local`

## 🔧 **CONFIGURACIÓN REQUERIDA**

### Variables de entorno (`.env.local`):
```env
CLOUDINARY_CLOUD_NAME="dgmmzh8nb"
CLOUDINARY_API_KEY="766325626977677"
CLOUDINARY_API_SECRET="g0qgbgJNL8rsG2Ng4X9rP6oxpow"
```

### Archivos necesarios:
- ✅ `app/api/upload/route.js` - API route para uploads
- ✅ `lib/cloudinary.ts` - Funciones de utilidad
- ✅ `components/images-uploader.tsx` - Componente UI

## 🎯 **CASOS DE USO**

### 1. **Desarrollo inicial**
Ejecuta tests estáticos para verificar configuración:
```powershell
npm run test:cloudinary
```

### 2. **Antes de deployment**
Ejecuta tests completos para verificar funcionamiento:
```powershell
npm run test:cloudinary:all
```

### 3. **Debugging de uploads**
Ejecuta tests prácticos para diagnosticar problemas:
```powershell
npm run test:cloudinary:practical
```

### 4. **Refactoring de código**
Ejecuta tests unitarios para mantener compatibilidad:
```powershell
npm run test:cloudinary:unit
```

## 🔍 **ESTRUCTURA DE ARCHIVOS**

```
ketzal-app/
├── scripts/
│   ├── test-cloudinary.js              # Tests estáticos
│   └── test-cloudinary-practical.js    # Tests prácticos
├── __tests__/
│   └── cloudinary.test.ts             # Tests unitarios
├── lib/
│   ├── cloudinary.ts                  # Funciones principales
│   └── CLOUDINARY_USAGE.md           # Documentación de uso
└── app/api/upload/
    └── route.js                       # API endpoint
```

## 💡 **CONSEJOS PARA DEBUGGING**

### 1. **Error de conexión**
```
⚠️ Servidor no disponible en localhost:3000
```
**Solución**: Ejecuta `npm run dev` en otra terminal

### 2. **Error de credenciales**
```
❌ Error: Authentication failed
```
**Solución**: Verifica variables en `.env.local`

### 3. **Error de archivo no encontrado**
```
❌ lib/cloudinary.ts no encontrado
```
**Solución**: Ejecuta desde el directorio raíz del proyecto

### 4. **Timeouts en upload**
```
❌ Upload failed: timeout
```
**Solución**: Verifica conexión a internet y credenciales

## 🚀 **SIGUIENTES PASOS**

Después de ejecutar los tests exitosamente:

1. **✅ Tests pasando**: Tu configuración está lista
2. **🔧 Integra en CI/CD**: Añade `npm run test:cloudinary` 
3. **📱 Prueba en producción**: Verifica uploads en ambiente real
4. **📊 Monitorea**: Configura logging para uploads en producción

## 📞 **SOPORTE**

Si encuentras problemas:
1. Ejecuta `npm run test:cloudinary` para diagnóstico básico
2. Revisa los logs detallados en cada test
3. Verifica que todas las dependencias estén instaladas
4. Consulta `CLOUDINARY_USAGE.md` para ejemplos de uso
