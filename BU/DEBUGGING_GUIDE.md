# 🐛 Guía de Debugging - Wallet y Autenticación

Esta guía explica cómo activar las herramientas de debugging disponibles en la aplicación para diagnosticar problemas de autenticación y wallet.

## Herramientas de Debugging Disponibles

### 1. **SessionDebugger Component**
**Ubicación:** `components/SessionDebugger.tsx`
**Propósito:** Visualiza en tiempo real el estado de autenticación y sesión

**Para activar:**
1. Abrir `app/layout.tsx`
2. Descomentar la línea de import:
   ```tsx
   import SessionDebugger from "@/components/SessionDebugger";
   ```
3. Descomentar el componente en el JSX:
   ```tsx
   <SessionDebugger />
   ```

### 2. **Logs de WalletContext**
**Ubicación:** `context/WalletContext.tsx`
**Propósito:** Logs detallados del ciclo de vida del wallet

**Para activar:**
```tsx
// Cambiar esta línea:
const DEBUG_WALLET = false;
// Por:
const DEBUG_WALLET = true;
```

### 3. **Logs de AuthDetection**
**Ubicación:** `hooks/useAuthDetection.ts`
**Propósito:** Logs detallados del proceso de detección de autenticación

**Para activar:**
```tsx
// Cambiar esta línea:
const DEBUG_AUTH = false;
// Por:
const DEBUG_AUTH = true;
```

### 4. **Logs de Wallet Page**
**Ubicación:** `app/(protected)/wallet/page.tsx`
**Propósito:** Logs específicos de la página del wallet

**Para activar:**
```tsx
// Cambiar esta línea:
const DEBUG_WALLET_PAGE = false;
// Por:
const DEBUG_WALLET_PAGE = true;
```

**Además, descomentar las variables de sesión:**
```tsx
// Descomentar estas líneas si necesitas acceso a más datos de sesión:
const rawSession = useSession();
const readySession = useSessionReady();
```

### 5. **Logs del Layout**
**Ubicación:** `app/layout.tsx`
**Propósito:** Logs de la sesión del servidor

**Para activar:**
Descomentar la línea:
```tsx
console.log("session layout", session);
```

## Escenarios Comunes de Debugging

### Problema: Wallet no se carga tras login
1. Activar `DEBUG_AUTH` y `DEBUG_WALLET`
2. Observar en consola el flujo de autenticación
3. Verificar que `detectionMethod` sea válido
4. Comprobar que `userId` esté disponible

### Problema: Session parece inconsistente
1. Activar `SessionDebugger` componente
2. Activar `DEBUG_AUTH`
3. Observar las diferencias entre `useSession` y `useAuthDetection`

### Problema: Timing issues con NextAuth
1. Activar `DEBUG_WALLET_PAGE`
2. Descomentar `rawSession` y `readySession`
3. Comparar los diferentes métodos de detección

## Logs Esperados

### Flujo Normal de Login:
```
🕵️ AuthDetection: Starting detection...
✅ AuthDetection: Detected via useSession
🚀 WalletProvider: Auth ready! Attempting to load wallet
📡 Fetching wallet from API...
✅ Wallet loaded successfully
```

### Flujo con Problemas de Timing:
```
🕵️ AuthDetection: Starting detection...
🚀 AuthDetection: On protected route, fetching session data...
✅ AuthDetection: Got complete session data
🚀 WalletProvider: Auth ready! Attempting to load wallet
```

## Importante

- **Siempre desactivar el debugging en producción**
- Los flags están configurados como `false` por defecto
- El `SessionDebugger` está comentado por defecto
- Todos los logs están disponibles pero no se muestran sin activación manual

## Estructura de Debugging

```
🐛 DEBUGGING FLAGS:
├── DEBUG_WALLET (WalletContext)
├── DEBUG_AUTH (useAuthDetection)  
├── DEBUG_WALLET_PAGE (wallet page)
└── SessionDebugger (componente visual)
```

Esta estructura permite debugging granular y selectivo según el área que necesites diagnosticar.
