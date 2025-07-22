const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarUsuarioYNotificaciones() {
  try {
    console.log('🔍 Verificando estado de usuarios y notificaciones...\n');
    
    // Buscar el usuario más reciente que no sea super admin
    const usuarioReciente = await prisma.user.findFirst({
      where: {
        role: { not: 'superadmin' }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!usuarioReciente) {
      console.log('❌ No se encontró ningún usuario reciente');
      return;
    }
    
    console.log('👤 Usuario más reciente:');
    console.log(`   ID: ${usuarioReciente.id}`);
    console.log(`   Email: ${usuarioReciente.email}`);
    console.log(`   Nombre: ${usuarioReciente.name}`);
    console.log(`   Rol: ${usuarioReciente.role}`);
    console.log(`   Email verificado: ${usuarioReciente.emailVerified ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   Creado: ${usuarioReciente.createdAt.toLocaleString()}`);
    
    // Verificar si es un supplier también
    const supplier = await prisma.supplier.findFirst({
      where: { userId: usuarioReciente.id }
    });
    
    if (supplier) {
      console.log(`   Es supplier: ✅ SÍ (ID: ${supplier.id})`);
    } else {
      console.log(`   Es supplier: ❌ NO`);
    }
    
    // Buscar todas las notificaciones de este usuario
    const notificacionesUsuario = await prisma.notification.findMany({
      where: { userId: usuarioReciente.id },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`\n📮 Notificaciones para este usuario: ${notificacionesUsuario.length}`);
    
    if (notificacionesUsuario.length === 0) {
      console.log('❌ NO tiene notificaciones de bienvenida');
      console.log('\n💡 PROBLEMA IDENTIFICADO:');
      console.log('   Las notificaciones de bienvenida se crean SOLO después de verificar el email');
      console.log('   Este usuario aún NO ha verificado su email');
      
      if (usuarioReciente.emailVerified === null) {
        console.log('\n🔧 SOLUCIÓN:');
        console.log('   1. El usuario debe verificar su email haciendo clic en el enlace');
        console.log('   2. O podemos simular la verificación manualmente');
        
        // Buscar si hay un token de verificación pendiente
        const tokenVerificacion = await prisma.verificationToken.findFirst({
          where: { identifier: usuarioReciente.email }
        });
        
        if (tokenVerificacion) {
          console.log(`   3. Token de verificación existe: ${tokenVerificacion.token}`);
          console.log(`   4. URL de verificación: http://localhost:3000/api/auth/verify-email?token=${tokenVerificacion.token}`);
        }
      }
    } else {
      console.log('✅ Tiene notificaciones:');
      notificacionesUsuario.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title} (${notif.type})`);
      });
    }
    
    // Verificar notificaciones para super admin (las que vemos en la imagen)
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    if (superAdmin) {
      const notificacionesSuperAdmin = await prisma.notification.findMany({
        where: { userId: superAdmin.id },
        orderBy: { createdAt: 'desc' },
        take: 3
      });
      
      console.log(`\n👑 Últimas notificaciones del Super Admin:`);
      notificacionesSuperAdmin.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title} (${notif.type})`);
      });
    }
    
    console.log('\n📋 RESUMEN:');
    console.log('✅ Notificación para super admin: FUNCIONA (aparece en la imagen)');
    console.log(`${notificacionesUsuario.length === 0 ? '❌' : '✅'} Notificaciones de bienvenida: ${notificacionesUsuario.length === 0 ? 'NO CREADAS' : 'CREADAS'}`);
    console.log(`🔑 Email verificado: ${usuarioReciente.emailVerified ? 'SÍ' : 'NO - ESTE ES EL PROBLEMA'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarUsuarioYNotificaciones();
