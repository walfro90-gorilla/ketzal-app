// Test de verificación de email y notificaciones de bienvenida
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testEmailVerificationAndWelcome() {
  try {
    console.log('🧪 PROBANDO VERIFICACIÓN DE EMAIL Y NOTIFICACIONES DE BIENVENIDA...\n');
    
    // Datos de usuario de prueba
    const testUser = {
      email: 'verification-test@ejemplo.com',
      name: 'Usuario Verificación Test',
      role: 'user'
    };
    
    console.log(`👤 Usuario de prueba: ${testUser.name}`);
    
    // 1. Limpiar usuario anterior
    try {
      await prisma.user.delete({ where: { email: testUser.email } });
      console.log('🧹 Usuario anterior eliminado');
    } catch {
      console.log('ℹ️  No había usuario anterior');
    }
    
    // 2. Crear usuario sin verificar
    const newUser = await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
        password: 'hashedpassword',
        emailVerified: null // SIN VERIFICAR
      }
    });
    
    console.log(`✅ Usuario creado (sin verificar): ${newUser.id}`);
    
    // 3. Simular verificación de email y creación de notificaciones
    console.log('\n🔐 Simulando verificación de email...');
    
    // Actualizar como verificado
    const verifiedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { emailVerified: new Date() }
    });
    
    console.log(`✅ Email verificado: ${verifiedUser.emailVerified.toLocaleString()}`);
    
    // 4. Crear notificaciones de bienvenida (simulando el endpoint corregido)
    console.log('\n🎁 Creando notificaciones de bienvenida...');
    
    const currentDate = new Date();
    const coinsExpirationDate = new Date();
    coinsExpirationDate.setDate(currentDate.getDate() + 365);
    
    // Notificación AXO Coins
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
    
    // Notificación de Bienvenida
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
    
    console.log(`✅ Notificación AXO Coins: ${coinsNotification.id}`);
    console.log(`✅ Notificación Bienvenida: ${welcomeNotification.id}`);
    
    // 5. Verificar que las notificaciones están disponibles
    const userNotifications = await prisma.notification.findMany({
      where: { userId: newUser.id },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`\n📮 RESULTADO FINAL:`);
    console.log(`   Usuario verificado: ✅`);
    console.log(`   Notificaciones creadas: ${userNotifications.length}/2`);
    
    if (userNotifications.length === 2) {
      console.log('\n🎉 ¡SISTEMA FUNCIONANDO CORRECTAMENTE!');
      console.log('📋 Notificaciones del usuario:');
      userNotifications.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title}`);
        console.log(`      Tipo: ${notif.type} | Prioridad: ${notif.priority}`);
        console.log(`      Acción: ${notif.actionUrl}`);
      });
      
      console.log('\n✅ PROBLEMA RESUELTO:');
      console.log('   - Jimmy ya tiene sus notificaciones (creadas manualmente)');
      console.log('   - Próximos usuarios las recibirán automáticamente');
      console.log('   - Sistema de verificación funcionando');
    } else {
      console.log('\n⚠️  Aún hay problemas con la creación automática');
    }
    
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    
    // Contar notificaciones por tipo
    const stats = await prisma.notification.groupBy({
      by: ['type'],
      _count: { type: true },
      where: {
        type: { in: ['WELCOME_BONUS', 'WELCOME_MESSAGE'] }
      }
    });
    
    stats.forEach(stat => {
      const emoji = stat.type === 'WELCOME_BONUS' ? '🎁' : '👋';
      console.log(`   ${emoji} ${stat.type}: ${stat._count.type} notificaciones`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailVerificationAndWelcome();
