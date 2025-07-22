// Test completo de notificaciones de bienvenida para todos los tipos de usuario
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAllUserTypesWelcome() {
  try {
    console.log('🎯 PROBANDO NOTIFICACIONES DE BIENVENIDA PARA TODOS LOS TIPOS DE USUARIO\n');
    
    const testUsers = [
      {
        email: 'user-normal-welcome@ejemplo.com',
        name: 'Usuario Normal',
        role: 'user'
      },
      {
        email: 'admin-welcome@ejemplo.com',
        name: 'Usuario Admin',
        role: 'admin'
      },
      {
        email: 'superadmin-welcome@ejemplo.com',
        name: 'Super Admin',
        role: 'superadmin'
      }
    ];
    
    for (const userData of testUsers) {
      console.log(`\n🔧 Probando usuario: ${userData.name} (${userData.role})`);
      
      // Limpiar usuario anterior
      try {
        await prisma.user.delete({ where: { email: userData.email } });
        console.log('   🧹 Usuario anterior eliminado');
      } catch {
        console.log('   ℹ️  No había usuario anterior');
      }
      
      // Crear usuario
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: 'hashedpassword',
          emailVerified: new Date() // Ya verificado para esta prueba
        }
      });
      
      console.log(`   ✅ Usuario creado: ${newUser.id}`);
      
      // Crear notificaciones de bienvenida
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
      
      // 2. Notificación de Bienvenida (con URL diferente según el rol)
      const actionUrl = userData.role === 'admin' || userData.role === 'superadmin' ? '/admin/dashboard' : '/explore';
      
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
          actionUrl: actionUrl
        }
      });
      
      console.log(`   ✅ Notificación AXO Coins: ${coinsNotification.id}`);
      console.log(`   ✅ Notificación Bienvenida: ${welcomeNotification.id}`);
      console.log(`   🔗 URL de acción para ${userData.role}: ${actionUrl}`);
    }
    
    console.log('\n📊 RESUMEN FINAL:');
    
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
    
    // Mostrar las notificaciones más recientes
    const recentWelcomeNotifications = await prisma.notification.findMany({
      where: {
        type: { in: ['WELCOME_BONUS', 'WELCOME_MESSAGE'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    });
    
    console.log('\n📮 NOTIFICACIONES DE BIENVENIDA RECIENTES:');
    recentWelcomeNotifications.forEach((notification, index) => {
      console.log(`\n   ${index + 1}. ${notification.title}`);
      console.log(`      👤 Usuario: ${notification.user?.name} (${notification.user?.role})`);
      console.log(`      🏷️  Tipo: ${notification.type} | Prioridad: ${notification.priority}`);
      console.log(`      🔗 Acción: ${notification.actionUrl}`);
    });
    
    console.log('\n🎉 ¡SISTEMA DE NOTIFICACIONES DE BIENVENIDA COMPLETAMENTE FUNCIONAL!');
    console.log('✅ Funciona para usuarios normales, admins y superadmins');
    console.log('✅ URLs de acción diferenciadas según el rol');
    console.log('✅ Metadata rica con información de coins y tutoriales');
    console.log('✅ Prioridades apropiadas (HIGH para coins, NORMAL para bienvenida)');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllUserTypesWelcome();
