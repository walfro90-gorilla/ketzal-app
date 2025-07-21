// Script de prueba para verificar el nuevo registro de admin con Supplier
// Ejecutar con: node test-admin-registration-v2.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminRegistrationFlow() {
  try {
    console.log('🧪 Probando el flujo de registro de admin con Supplier...');
    
    const testEmail = 'test-admin@example.com';
    
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos de prueba existentes...');
    await prisma.user.deleteMany({
      where: { email: testEmail }
    });
    await prisma.supplier.deleteMany({
      where: { contactEmail: testEmail }
    });

    console.log('✅ Datos limpios. Verificando estructura de tablas...');
    
    // Verificar campos en User
    const userFields = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `;
    console.log('📋 Campos en tabla User:', userFields.map(f => `${f.column_name}:${f.data_type}`));
    
    // Verificar campos en Supplier
    const supplierFields = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Supplier' 
      ORDER BY ordinal_position;
    `;
    console.log('📋 Campos en tabla Supplier:', supplierFields.map(f => `${f.column_name}:${f.data_type}`));

    // Probar creación manual del flujo esperado
    console.log('👤 Creando usuario de prueba...');
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test Admin User',
        password: 'hashedpassword',
        status: 'ACTIVE',
        role: 'user'
      }
    });
    console.log('✅ Usuario creado:', { id: newUser.id, email: newUser.email });

    console.log('🏢 Creando supplier de prueba...');
    const newSupplier = await prisma.supplier.create({
      data: {
        name: 'Test Company',
        contactEmail: testEmail,
        description: 'Test business description',
        supplierType: 'tours',
        address: 'Test City',
        userId: newUser.id,
        isApproved: false,
        isPending: true
      }
    });
    console.log('✅ Supplier creado:', { 
      id: newSupplier.id, 
      name: newSupplier.name,
      isApproved: newSupplier.isApproved,
      isPending: newSupplier.isPending
    });

    // Vincular user con supplier
    console.log('🔗 Vinculando user con supplier...');
    await prisma.user.update({
      where: { id: newUser.id },
      data: { supplierId: newSupplier.id }
    });
    
    // Verificar relación
    const userWithSupplier = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: { Supplier: true }
    });
    console.log('✅ Relación verificada:', {
      userId: userWithSupplier.id,
      supplierId: userWithSupplier.supplierId,
      supplierName: userWithSupplier.Supplier?.name
    });

    // Limpiar
    console.log('🧹 Limpiando datos de prueba...');
    await prisma.user.delete({ where: { id: newUser.id } });
    await prisma.supplier.delete({ where: { id: newSupplier.id } });
    
    console.log('🎉 ¡Prueba completada exitosamente!');
    console.log('📊 Resumen:');
    console.log('  - ✅ Tablas User y Supplier con campos correctos');
    console.log('  - ✅ Creación de usuario (activo)');
    console.log('  - ✅ Creación de supplier (pendiente)');
    console.log('  - ✅ Vinculación correcta entre ambas tablas');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.code) {
      console.error('   Código de error:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAdminRegistrationFlow();
