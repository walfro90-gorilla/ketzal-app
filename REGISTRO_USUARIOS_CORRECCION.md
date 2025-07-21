# Guía de Corrección de Funciones de Registro - Ketzal App

## 📋 Problema Identificado

**Fecha:** 21 de Julio, 2025  
**Issue:** Las funciones de registro (`registerAction`, `registerAdminAction`, `registerAdminActionV2`) estaban usando campos que ya no existen en el esquema actual de la base de datos después de la migración a Supabase PostgreSQL.

### Campos Problemáticos:
- ❌ `User.status` - No existe
- ❌ `User.adminRequest` - No existe  
- ❌ `User.company` - No existe
- ❌ `User.serviceType` - No existe
- ❌ `User.city` - No existe
- ❌ `User.documentation` - No existe
- ❌ `Supplier.userId` - No existe
- ❌ `Supplier.isApproved` - No existe
- ❌ `Supplier.isPending` - No existe

## 🔍 Esquema Actual de Base de Datos

### Modelo User
```javascript
User {
  id: String @id @default(cuid())
  name: String?
  email: String @unique
  password: String?
  emailVerified: DateTime?
  image: String?
  role: Role @default(admin)
  supplierId: Int?
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  axoCoinsEarned: Float? @default(50)
  referralCode: String?
  // Relations...
}
```

### Modelo Supplier
```javascript
Supplier {
  id: Int @id @default(autoincrement())
  name: String @unique
  contactEmail: String @unique
  phoneNumber: String?
  address: String?
  description: String?
  imgLogo: String?
  createdAt: DateTime @default(now())
  supplierType: String?
  location: Json?
  photos: Json?
  extras: Json?
  info: Json?
  supplierSubType: String?
  // Relations...
}
```

## ✅ Soluciones Implementadas

### 1. `registerAction` (Usuarios Normales)

**Antes:**
```javascript
const newUser = await db.user.create({
  data: {
    email: data.email,
    name: data.name,
    password: passwordHash,
    adminRequest: isAdminRequest,        // ❌ Campo inexistente
    status: 'PENDING_EMAIL_VERIFICATION', // ❌ Campo inexistente
    role: 'user'
  }
})
```

**Después:**
```javascript
const newUser = await db.user.create({
  data: {
    email: data.email,
    name: data.name,
    password: passwordHash,
    role: userRole, // ✅ "user" o "admin"
    // emailVerified se mantiene null hasta verificación
    // axoCoinsEarned usa el default de 50
  }
})
```

### 2. `registerAdminAction` (Administradores v1)

**Estrategia:** Crear Usuario + Supplier en transacción, vincularlos con `supplierId`

```javascript
const result = await db.$transaction(async (tx) => {
  // 1. Crear el Supplier primero
  const newSupplier = await tx.supplier.create({
    data: {
      name: data.company,
      contactEmail: data.email,
      phoneNumber: "",
      address: data.city,
      description: `Supplier for ${data.company}`,
      supplierType: data.serviceType,
      extras: {
        documentation: data.documentation,
        registrationInfo: "Admin registration"
      }
    }
  })

  // 2. Crear el Usuario vinculado al Supplier
  const newUser = await tx.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: passwordHash,
      role: 'admin',
      supplierId: newSupplier.id,
    }
  })

  return { user: newUser, supplier: newSupplier }
})
```

### 3. `registerAdminActionV2` (Administradores v2)

**Estrategia:** Crear Usuario como "user" normal, crear Supplier con metadata en `extras`

```javascript
const result = await db.$transaction(async (tx) => {
  // 1. Crear USUARIO (inicia como user normal)
  const newUser = await tx.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: passwordHash,
      role: 'user', // Se promociona después de aprobación
    }
  })

  // 2. Crear SUPPLIER (usar extras para campos adicionales)
  const newSupplier = await tx.supplier.create({
    data: {
      name: data.company,
      contactEmail: data.email,
      phoneNumber: data.phone || "",
      description: data.documentation,
      supplierType: data.serviceType,
      address: data.city,
      extras: {
        isApproved: false,
        isPending: true,
        registrationData: {
          company: data.company,
          serviceType: data.serviceType,
          city: data.city,
          documentation: data.documentation
        },
        registrationDate: new Date().toISOString()
      }
    }
  })

  // 3. Vincular user con supplier
  await tx.user.update({
    where: { id: newUser.id },
    data: { supplierId: newSupplier.id }
  })

  return { user: newUser, supplier: newSupplier }
})
```

## 🛠️ Pasos de Implementación

1. **Sincronización de Esquema:**
   ```bash
   npx prisma db pull     # Sincronizar con BD actual
   npx prisma generate    # Regenerar cliente
   ```

2. **Corrección de Código:**
   - Eliminar campos inexistentes
   - Usar campos disponibles en el esquema actual
   - Implementar transacciones para operaciones complejas
   - Usar `extras` JSON para metadata adicional

3. **Testing:**
   - Probar registro de usuario normal
   - Probar registro de administrador  
   - Verificar creación de relaciones Usuario-Supplier

## 📊 Estructura de Datos Final

### Usuario Normal
```javascript
{
  email: "user@example.com",
  name: "Normal User",
  password: "hashedPassword",
  role: "user",
  emailVerified: null, // Hasta verificación
  axoCoinsEarned: 50   // Default
}
```

### Usuario Administrador + Supplier
```javascript
// Usuario
{
  email: "admin@company.com",
  name: "Admin User", 
  password: "hashedPassword",
  role: "admin",
  supplierId: 1,
  emailVerified: null
}

// Supplier Vinculado
{
  id: 1,
  name: "Company Name",
  contactEmail: "admin@company.com",
  phoneNumber: "555-0123",
  address: "City", 
  supplierType: "hotel",
  description: "Documentation",
  extras: {
    isApproved: false,
    isPending: true,
    registrationData: { /* datos originales */ }
  }
}
```

## 🔄 Flujo de Aprobación de Administradores

1. **Registro:** Usuario se crea como "user" + Supplier "pending"
2. **Verificación Email:** Usuario verifica email
3. **Revisión Admin:** Super-admin revisa solicitud de Supplier
4. **Aprobación:** 
   - `Supplier.extras.isApproved = true`
   - `User.role = "admin"`
   - Usuario obtiene permisos de administrador

## 🧪 Testing

### URLs de Prueba:
- Normal: `http://localhost:3000/register`
- Admin: `http://localhost:3000/register-admin`

### Datos de Prueba:
```javascript
// Usuario Normal
{
  email: "test@example.com",
  name: "Test User",
  password: "password123"
}

// Usuario Admin
{
  email: "admin@testcompany.com",
  name: "Admin User", 
  password: "password123",
  company: "Test Company",
  serviceType: "hotel",
  city: "Test City",
  documentation: "Test docs"
}
```

## 📝 Notas Importantes

1. **Compatibilidad:** El esquema debe mantenerse sincronizado entre frontend y backend
2. **Migraciones:** Siempre usar `npx prisma db pull` después de cambios en BD
3. **Transacciones:** Usar transacciones para operaciones que involucran múltiples tablas
4. **JSON Fields:** Usar `extras` y otros campos JSON para metadatos flexibles
5. **Testing:** Probar ambos flujos de registro después de cada cambio

## 🔗 Referencias

- Archivo Principal: `actions/auth-action.ts`
- Esquema: `prisma/schema.prisma`  
- Configuración BD: `lib/db.ts`
- Variables Entorno: `.env`

---

**Última Actualización:** 21 de Julio, 2025  
**Estado:** ✅ Implementado y Funcional
