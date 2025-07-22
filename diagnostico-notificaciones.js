const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnosticoCompleto() {
  try {
    console.log('🔍 DIAGNÓSTICO COMPLETO DEL PROBLEMA...\n');
    
    // 1. Buscar el usuario más reciente (Jimmy Aguilar)
    const usuarioReciente = await prisma.user.findFirst({
      where: {
        email: 'walfre.am@gmail.com',
        role: { not: 'superadmin' }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!usuarioReciente) {
      console.log('❌ No se encontró el usuario Jimmy Aguilar');
      
      // Buscar cualquier usuario reciente
      const cualquierUsuario = await prisma.user.findFirst({
        where: { role: { not: 'superadmin' } },
        orderBy: { createdAt: 'desc' }
      });
      
      if (cualquierUsuario) {
        console.log('👤 Usuario más reciente encontrado:');
        console.log(`   Email: ${cualquierUsuario.email}`);
        console.log(`   Nombre: ${cualquierUsuario.name}`);
      }
      return;
    }
    
    console.log('👤 Usuario Jimmy Aguilar:');
    console.log(`   ID: ${usuarioReciente.id}`);
    console.log(`   Email: ${usuarioReciente.email}`);
    console.log(`   Nombre: ${usuarioReciente.name}`);
    console.log(`   Rol: ${usuarioReciente.role}`);
    console.log(`   Email verificado: ${usuarioReciente.emailVerified ? '✅ SÍ (' + usuarioReciente.emailVerified.toLocaleString() + ')' : '❌ NO'}`);
    console.log(`   Creado: ${usuarioReciente.createdAt.toLocaleString()}`);
    
    // 2. Buscar si es supplier por email
    const supplier = await prisma.supplier.findFirst({
      where: { contactEmail: usuarioReciente.email }
    });
    
    if (supplier) {
      console.log(`   Es supplier: ✅ SÍ (ID: ${supplier.id}, Empresa: ${supplier.name})`);
    } else {
      console.log(`   Es supplier: ❌ NO`);
    }
    
    // 3. Buscar TODAS sus notificaciones
    const notificacionesUsuario = await prisma.notification.findMany({
      where: { userId: usuarioReciente.id },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`\n📮 NOTIFICACIONES DEL USUARIO JIMMY: ${notificacionesUsuario.length}`);
    
    if (notificacionesUsuario.length === 0) {
      console.log('❌ NO tiene notificaciones de bienvenida');
    } else {
      console.log('📋 Sus notificaciones:');
      notificacionesUsuario.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title}`);
        console.log(`      Tipo: ${notif.type} | Prioridad: ${notif.priority}`);
        console.log(`      Fecha: ${notif.createdAt.toLocaleString()}`);
      });
    }
    
    // 4. Verificar tokens de verificación pendientes
    const tokenVerificacion = await prisma.verificationToken.findFirst({
      where: { identifier: usuarioReciente.email }
    });
    
    console.log(`\n🔐 Token de verificación: ${tokenVerificacion ? 'Existe (pendiente)' : 'No existe (ya usado o expirado)'}`);
    
    // 5. Ver notificaciones del super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    const notificacionesSuperAdmin = await prisma.notification.findMany({
      where: { userId: superAdmin.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`\n👑 ÚLTIMAS NOTIFICACIONES SUPER ADMIN: ${notificacionesSuperAdmin.length}`);
    notificacionesSuperAdmin.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title} (${notif.type})`);
      console.log(`      Fecha: ${notif.createdAt.toLocaleString()}`);
    });
    
    // 6. DIAGNÓSTICO FINAL
    console.log('\n🔍 DIAGNÓSTICO:');
    
    if (usuarioReciente.emailVerified && notificacionesUsuario.length === 0) {
      console.log('❌ PROBLEMA: Email verificado pero NO hay notificaciones de bienvenida');
      console.log('💡 CAUSA POSIBLE: Error en el endpoint de verificación o función de notificaciones');
      console.log('🔧 SOLUCIÓN: Crear las notificaciones manualmente o revisar el código');
    } else if (!usuarioReciente.emailVerified) {
      console.log('⚠️  NORMAL: Email no verificado, notificaciones se crearán cuando verifique');
      console.log('🔧 ACCIÓN: Usuario debe verificar email para recibir notificaciones');
    } else if (notificacionesUsuario.length > 0) {
      console.log('✅ TODO CORRECTO: Usuario tiene notificaciones');
    }
    
    // 7. Crear notificaciones manualmente si es necesario
    if (usuarioReciente.emailVerified && notificacionesUsuario.length === 0) {
      console.log('\n🛠️  CREANDO NOTIFICACIONES MANUALMENTE...');
      
      const currentDate = new Date();
      const coinsExpirationDate = new Date();
      coinsExpirationDate.setDate(currentDate.getDate() + 365);
      
      // Crear notificación de AXO Coins
      const coinsNotif = await prisma.notification.create({
        data: {
          userId: usuarioReciente.id,
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
            userId: usuarioReciente.id,
            userEmail: usuarioReciente.email,
            userName: usuarioReciente.name,
            userRole: usuarioReciente.role
          },
          actionUrl: '/wallet'
        }
      });
      
      // Crear notificación de bienvenida
      const welcomeNotif = await prisma.notification.create({
        data: {
          userId: usuarioReciente.id,
          type: 'WELCOME_MESSAGE',
          title: '👋 ¡Bienvenido a Ketzal!',
          message: 'Estamos emocionados de tenerte en nuestra comunidad. Explora destinos increíbles, vive experiencias únicas y conecta con los mejores proveedores de servicios turísticos.',
          priority: 'NORMAL',
          isRead: false,
          metadata: {
            welcomeMessage: true,
            userId: usuarioReciente.id,
            userEmail: usuarioReciente.email,
            userName: usuarioReciente.name,
            userRole: usuarioReciente.role,
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
      
      console.log(`✅ Notificación AXO Coins creada: ${coinsNotif.id}`);
      console.log(`✅ Notificación Bienvenida creada: ${welcomeNotif.id}`);
      console.log('🎉 ¡PROBLEMA SOLUCIONADO! Jimmy ahora tiene sus notificaciones de bienvenida');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnosticoCompleto();
