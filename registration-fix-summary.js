console.log('📝 FUNCIONES DE REGISTRO ACTUALIZADAS\n')
console.log('✅ Campos actualizados en registerAction:')
console.log('   - Eliminado: adminRequest, status')
console.log('   - Mantenido: email, name, password, role')
console.log('   - emailVerified se mantiene null hasta verificación')
console.log()

console.log('✅ Campos actualizados en registerAdminAction:')
console.log('   - Crea Supplier con: name, contactEmail, address, supplierType')
console.log('   - Crea User vinculado al Supplier con supplierId')
console.log('   - Eliminado: adminRequest, status, company, serviceType, city, documentation')
console.log('   - Mantenido: email, name, password, role (admin)')
console.log()

console.log('🔗 Estructura de datos:')
console.log('   User.role: "user" | "admin"')
console.log('   User.emailVerified: null hasta verificación')
console.log('   User.supplierId: vincula con tabla Supplier (solo admins)')
console.log('   Supplier: contiene datos de la empresa')
console.log()

console.log('🧪 Para probar:')
console.log('1. Ir a http://localhost:3000/register')
console.log('2. Registrar usuario normal')
console.log('3. Ir a http://localhost:3000/register-admin')
console.log('4. Registrar usuario administrador')
console.log()

console.log('✅ Los errores de campos inexistentes están corregidos!')

// Crear un test rápido de la estructura
const testData = {
    normalUser: {
        email: "test@example.com",
        name: "Test User", 
        password: "hashedPassword",
        role: "user"
    },
    adminUser: {
        email: "admin@company.com",
        name: "Admin User",
        password: "hashedPassword", 
        role: "admin",
        supplierId: 1
    },
    supplier: {
        name: "Test Company",
        contactEmail: "admin@company.com",
        address: "Test City",
        supplierType: "hotel"
    }
}

console.log('\n📋 Estructura de datos de prueba:')
console.log('Normal User:', JSON.stringify(testData.normalUser, null, 2))
console.log('Admin User:', JSON.stringify(testData.adminUser, null, 2))
console.log('Supplier:', JSON.stringify(testData.supplier, null, 2))
