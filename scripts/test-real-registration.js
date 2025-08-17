const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRealRegistration() {
  try {
    console.log('🧪 Probando registro real con la función registerAdminActionV2...\n');
    
    // Simular datos del formulario
    const formData = {
      email: 'real-test@ejemplo.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: 'Usuario Real Test',
      company: 'Empresa Real Test',
      serviceType: 'tours',
      city: 'Ciudad Test',
      phone: '+52 123 456 7890',
      documentation: 'Documentación de prueba real',
      website: 'https://realtest.com',
      facebook: 'https://facebook.com/realtest',
      instagram: '@realtest',
      experienceYears: '3-5',
      businessLanguages: 'Español, Inglés',
      taxId: 'TEST123456'
    };
    
    console.log('📋 Datos de prueba preparados');
    console.log(`📧 Email: ${formData.email}`);
    console.log(`🏢 Empresa: ${formData.company}`);
    
    // Limpiar datos anteriores si existen
    try {
      await prisma.user.delete({ where: { email: formData.email } });
      console.log('🧹 Usuario anterior eliminado');
    } catch (e) {
      // No existe, está bien
    }
    
    try {
      await prisma.supplier.delete({ where: { contactEmail: formData.email } });
      console.log('🧹 Proveedor anterior eliminado');
    } catch (e) {
      // No existe, está bien
    }
    
    // Contar notificaciones antes
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    const notificationsBefore = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    console.log(`📊 Notificaciones del super admin antes: ${notificationsBefore}`);
    
    // Importar y ejecutar la función real (esto requiere que el servidor esté corriendo)
    console.log('\n🚀 Ejecutando registerAdminActionV2...');
    
    // Simular la llamada con fetch al endpoint
    const response = await fetch('http://localhost:3002/api/auth/register-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Respuesta del servidor:', result);
    } else {
      console.log('❌ Error del servidor:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
    // Verificar notificaciones después
    const notificationsAfter = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    console.log(`📊 Notificaciones del super admin después: ${notificationsAfter}`);
    
    if (notificationsAfter > notificationsBefore) {
      console.log('🎉 ¡Nueva notificación creada exitosamente!');
      
      // Mostrar la notificación más reciente
      const latestNotification = await prisma.notification.findFirst({
        where: { userId: superAdmin.id },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log('\n📢 Notificación más reciente:');
      console.log(`   Título: ${latestNotification.title}`);
      console.log(`   Mensaje: ${latestNotification.message}`);
      console.log(`   Tipo: ${latestNotification.type}`);
      console.log(`   Prioridad: ${latestNotification.priority}`);
    } else {
      console.log('⚠️  No se creó nueva notificación');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRealRegistration();
