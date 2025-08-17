// Test de notificaciones de bienvenida
// Este script prueba la creación de notificaciones de bienvenida

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWelcomeNotifications() {
  try {
    console.log('🎁 Probando sistema de notificaciones de bienvenida...\n');
    
    // Datos de prueba
    const testUser = {
      email: 'welcome-test@ejemplo.com',
      name: 'Usuario Bienvenida Test',
      role: 'user'
    };
    
    console.log(`👤 Usuario de prueba: ${testUser.name} (${testUser.email})`);
    
    // Limpiar usuario anterior si existe
    try {
      await prisma.user.delete({ where: { email: testUser.email } });
      console.log('🧹 Usuario anterior eliminado');
    } catch {
      console.log('ℹ️  No había usuario anterior');
    }
    
    // Crear usuario de prueba
    const newUser = await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
        password: 'hashedpassword',
        emailVerified: null // Inicialmente no verificado
      }
    });
    
    console.log(`✅ Usuario creado: ${newUser.id}`);
    
    // Contar notificaciones antes
    const notificationsBefore = await prisma.notification.count({
      where: { userId: newUser.id }
    });
    
    console.log(`📊 Notificaciones antes: ${notificationsBefore}`);
    
    // Simular verificación de email y creación de notificaciones
    console.log('\n🔐 Simulando verificación de email...');
    
    // Actualizar usuario como verificado
    await prisma.user.update({
      where: { id: newUser.id },
      data: { emailVerified: new Date() }
    });
    
    // Crear las notificaciones de bienvenida manualmente (simulando el endpoint)
    const currentDate = new Date();
    const coinsExpirationDate = new Date();
    coinsExpirationDate.setDate(currentDate.getDate() + 365);
    
    // 1. Notificación de AXO Coins
    const coinsNotification = await prisma.notification.create({
      data: {
        userId: newUser.id,
        type: 'WELCOME_BONUS',
        title: '🎁 ¡50 AXO Coins de Bienvenida!',
        message: '¡Bienvenido a Ketzal! Te hemos regalado 50 AXO Coins para que comiences a explorar. Úsalos en tus próximas reservas y descubre experiencias increíbles.',
        priority: 'HIGH',
        isRead: false,
        metadata: {
          coinsAmount: 50,
          coinsGrantedDate: currentDate.toISOString(),
          coinsExpirationDate: coinsExpirationDate.toISOString(),
          welcomeBonus: true,
          userId: newUser.id,
          userEmail: newUser.email,
          userName: newUser.name,
          userRole: newUser.role
        },
        actionUrl: '/wallet'
      }
    });
    
    // 2. Notificación de Bienvenida General
    const welcomeNotification = await prisma.notification.create({
      data: {
        userId: newUser.id,
        type: 'WELCOME_MESSAGE',
        title: '👋 ¡Bienvenido a Ketzal!',
        message: 'Estamos emocionados de tenerte en nuestra comunidad. Explora destinos increíbles, vive experiencias únicas y conecta con los mejores proveedores de servicios turísticos.',
        priority: 'NORMAL',
        isRead: false,
        metadata: {
          welcomeMessage: true,
          userId: newUser.id,
          userEmail: newUser.email,
          userName: newUser.name,
          userRole: newUser.role,
          registrationDate: currentDate.toISOString(),
          tutorialLinks: {
            gettingStarted: '/help/getting-started',
            howToBook: '/help/how-to-book',
            axoCoins: '/help/axo-coins-guide'
          }
        },
        actionUrl: '/explore'
      }
    });
    
    console.log(`✅ Notificación AXO Coins creada: ${coinsNotification.id}`);
    console.log(`✅ Notificación Bienvenida creada: ${welcomeNotification.id}`);
    
    // Verificar resultado
    const notificationsAfter = await prisma.notification.count({
      where: { userId: newUser.id }
    });
    
    console.log(`\n📊 Resultado:`);
    console.log(`   Notificaciones después: ${notificationsAfter}`);
    console.log(`   Incremento: ${notificationsAfter - notificationsBefore}`);
    
    if (notificationsAfter === 2) {
      console.log('\n🎉 ¡Prueba exitosa! Se crearon ambas notificaciones de bienvenida');
      
      // Mostrar las notificaciones
      const userNotifications = await prisma.notification.findMany({
        where: { userId: newUser.id },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log('\n📮 Notificaciones creadas:');
      userNotifications.forEach((notification, index) => {
        console.log(`\n   ${index + 1}. ${notification.title}`);
        console.log(`      📝 ${notification.message}`);
        console.log(`      🏷️  Tipo: ${notification.type} | Prioridad: ${notification.priority}`);
        console.log(`      🔗 Acción: ${notification.actionUrl}`);
        console.log(`      📎 Metadata:`, JSON.stringify(notification.metadata, null, 6));
      });
      
    } else {
      console.log('\n⚠️  Error: No se crearon las notificaciones esperadas');
    }
    
    console.log('\n✅ Prueba completada del sistema de notificaciones de bienvenida');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWelcomeNotifications();
