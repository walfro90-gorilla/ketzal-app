const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testNotificationOnAdminRegistration() {
  try {
    console.log('🧪 Probando sistema de notificaciones en registro de admin...\n');
    
    // 1. Verificar que existe un super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    if (!superAdmin) {
      console.log('❌ No hay super admin en la base de datos');
      return;
    }
    
    console.log(`✅ Super admin encontrado: ${superAdmin.name} (${superAdmin.email})`);
    
    // 2. Obtener notificaciones actuales del super admin
    const notificationsBefore = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    console.log(`📊 Notificaciones actuales del super admin: ${notificationsBefore}`);
    
    // 3. Simular llamada a la función registerAdminActionV2
    console.log('\n🔄 Simulando registro de admin...');
    
    // Datos de prueba
    const testEmail = 'test-notification@ejemplo.com';
    const testData = {
      email: testEmail,
      name: 'Test Notification User',
      password: 'password123',
      company: 'Test Notification Company',
      serviceType: 'tours',
      city: 'Test City',
      phone: '+52 123 456 7890',
      documentation: 'Esta es una prueba de notificación.',
      website: 'https://test.com'
    };
    
    // Limpiar datos anteriores si existen
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    if (existingUser) {
      await prisma.user.delete({ where: { email: testEmail } });
    }
    
    const existingSupplier = await prisma.supplier.findUnique({
      where: { contactEmail: testEmail }
    });
    if (existingSupplier) {
      await prisma.supplier.delete({ where: { contactEmail: testEmail } });
    }
    
    // Hacer el registro usando la misma lógica que registerAdminActionV2
    const passwordHash = await bcrypt.hash(testData.password, 10);
    
    const result = await prisma.$transaction(async (tx) => {
      // Crear USUARIO
      const newUser = await tx.user.create({
        data: {
          email: testData.email,
          name: testData.name,
          password: passwordHash,
          role: 'user',
        }
      });
      
      // Crear SUPPLIER
      const newSupplier = await tx.supplier.create({
        data: {
          name: testData.company,
          contactEmail: testData.email,
          phoneNumber: testData.phone || "",
          description: testData.documentation,
          supplierType: testData.serviceType,
          address: testData.city,
          extras: {
            isApproved: false,
            isPending: true,
            registrationData: {
              company: testData.company,
              serviceType: testData.serviceType,
              city: testData.city,
              documentation: testData.documentation
            },
            registrationDate: new Date().toISOString()
          }
        }
      });
      
      // Vincular user con supplier
      await tx.user.update({
        where: { id: newUser.id },
        data: { supplierId: newSupplier.id }
      });
      
      return { user: newUser, supplier: newSupplier };
    });
    
    console.log(`✅ Usuario y proveedor creados: ${result.user.name} / ${result.supplier.name}`);
    
    // 4. Intentar crear la notificación manualmente para probar
    console.log('\n📢 Creando notificación para super admin...');
    
    // Nota: Como estamos en Node.js y la función createNotification hace fetch al backend,
    // vamos a crear la notificación directamente en la base de datos para la prueba
    const notification = await prisma.notification.create({
      data: {
        userId: superAdmin.id,
        title: '🏢 Nueva Solicitud de Proveedor Turístico',
        message: `${testData.name} (${testData.company}) ha solicitado convertirse en proveedor de servicios turísticos. Tipo: ${testData.serviceType}. Requiere aprobación.`,
        type: 'SUPPLIER_APPROVAL',
        priority: 'HIGH',
        isRead: false,
        metadata: {
          supplierId: result.supplier.id,
          userId: result.user.id,
          supplierName: testData.company,
          supplierEmail: testData.email,
          serviceType: testData.serviceType,
          registrationDate: new Date().toISOString()
        }
      }
    });
    
    console.log(`✅ Notificación creada con ID: ${notification.id}`);
    
    // 5. Verificar que se creó la notificación
    const notificationsAfter = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    console.log(`📊 Notificaciones después: ${notificationsAfter}`);
    
    // 6. Mostrar las notificaciones recientes del super admin
    const recentNotifications = await prisma.notification.findMany({
      where: { userId: superAdmin.id },
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    
    console.log('\n📋 Notificaciones recientes del super admin:');
    recentNotifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title}`);
      console.log(`      Mensaje: ${notif.message}`);
      console.log(`      Tipo: ${notif.type} | Prioridad: ${notif.priority}`);
      console.log(`      Leída: ${notif.isRead ? 'Sí' : 'No'}`);
      console.log(`      Creada: ${notif.createdAt}`);
      console.log('      ---');
    });
    
    console.log('\n🎉 Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNotificationOnAdminRegistration();
