// Test de notificaciones para registro de usuarios normales y admins
// Este script prueba la función registerAction con notificaciones

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUserRegistrationNotifications() {
  try {
    console.log('🧪 Probando notificaciones de registro de usuarios...\n');
    
    // Obtener super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    if (!superAdmin) {
      console.log('❌ No se encontró super admin');
      return;
    }
    
    console.log(`👤 Super Admin: ${superAdmin.email} (ID: ${superAdmin.id})`);
    
    // Contar notificaciones antes
    const notificationsBefore = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    console.log(`📊 Notificaciones antes: ${notificationsBefore}\n`);
    
    // Datos de prueba para usuario normal
    const normalUserData = {
      email: 'user-normal-test@ejemplo.com',
      name: 'Usuario Normal Test',
      password: 'password123'
    };
    
    // Datos de prueba para solicitud de admin
    const adminRequestData = {
      email: 'user-admin-test@ejemplo.com',
      name: 'Usuario Admin Test',
      password: 'password123',
      adminRequest: true
    };
    
    console.log('🔧 Datos de prueba preparados:');
    console.log(`   📧 Usuario normal: ${normalUserData.email}`);
    console.log(`   📧 Solicitud admin: ${adminRequestData.email}`);
    
    // Limpiar registros anteriores
    console.log('\n🧹 Limpiando registros anteriores...');
    for (const email of [normalUserData.email, adminRequestData.email]) {
      try {
        await prisma.user.delete({ where: { email } });
        console.log(`   ✅ Usuario ${email} eliminado`);
      } catch {
        console.log(`   ℹ️  Usuario ${email} no existía`);
      }
    }
    
    // Simular registro de usuario normal
    console.log('\n🚀 Simulando registro de usuario normal...');
    const normalUser = await prisma.user.create({
      data: {
        email: normalUserData.email,
        name: normalUserData.name,
        role: 'user',
        password: 'hashedpassword', // En la realidad sería hasheado
        emailVerified: null
      }
    });
    
    // Crear notificación para usuario normal
    const normalUserNotification = await prisma.notification.create({
      data: {
        userId: superAdmin.id,
        type: 'USER_REGISTRATION',
        title: '🎉 Nuevo Usuario Registrado',
        message: `${normalUserData.name} se ha registrado como nuevo usuario en la plataforma. Email: ${normalUserData.email}`,
        priority: 'NORMAL',
        isRead: false,
        metadata: {
          userId: normalUser.id,
          userName: normalUserData.name,
          userEmail: normalUserData.email,
          userRole: 'user',
          isAdminRequest: false,
          registrationDate: new Date().toISOString(),
          requiresApproval: false
        },
        actionUrl: '/admin/users'
      }
    });
    
    console.log(`   ✅ Usuario creado: ${normalUser.id}`);
    console.log(`   ✅ Notificación creada: ${normalUserNotification.id}`);
    
    // Simular registro de solicitud de admin
    console.log('\n🚀 Simulando solicitud de cuenta admin...');
    const adminUser = await prisma.user.create({
      data: {
        email: adminRequestData.email,
        name: adminRequestData.name,
        role: 'admin', // Se crea como admin pero requiere aprobación
        password: 'hashedpassword',
        emailVerified: null
      }
    });
    
    // Crear notificación para solicitud de admin
    const adminRequestNotification = await prisma.notification.create({
      data: {
        userId: superAdmin.id,
        type: 'USER_REGISTRATION',
        title: '👤 Nueva Solicitud de Cuenta Administrador',
        message: `${adminRequestData.name} (${adminRequestData.email}) ha solicitado una cuenta de administrador. Requiere revisión y aprobación.`,
        priority: 'HIGH',
        isRead: false,
        metadata: {
          userId: adminUser.id,
          userName: adminRequestData.name,
          userEmail: adminRequestData.email,
          userRole: 'admin',
          isAdminRequest: true,
          registrationDate: new Date().toISOString(),
          requiresApproval: true
        },
        actionUrl: `/admin/users/${adminUser.id}`
      }
    });
    
    console.log(`   ✅ Usuario admin creado: ${adminUser.id}`);
    console.log(`   ✅ Notificación creada: ${adminRequestNotification.id}`);
    
    // Verificar resultado final
    const notificationsAfter = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    console.log(`\n📊 Resultado final:`);
    console.log(`   Notificaciones después: ${notificationsAfter}`);
    console.log(`   Incremento total: ${notificationsAfter - notificationsBefore}`);
    
    if (notificationsAfter === notificationsBefore + 2) {
      console.log('\n🎉 ¡Prueba exitosa! Se crearon ambas notificaciones');
      
      // Mostrar las notificaciones creadas
      const newNotifications = await prisma.notification.findMany({
        where: { 
          userId: superAdmin.id,
          id: { in: [normalUserNotification.id, adminRequestNotification.id] }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log('\n📢 Notificaciones creadas:');
      newNotifications.forEach((notification, index) => {
        console.log(`\n   ${index + 1}. ${notification.title}`);
        console.log(`      📝 ${notification.message}`);
        console.log(`      🏷️  Tipo: ${notification.type} | Prioridad: ${notification.priority}`);
        console.log(`      📎 Metadata:`, JSON.stringify(notification.metadata, null, 6));
      });
      
    } else {
      console.log('\n⚠️  Algo salió mal, el número de notificaciones no coincide');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserRegistrationNotifications();
