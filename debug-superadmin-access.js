// Verificar estado del super-admin y debug del middleware
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugSuperAdmin() {
  try {
    console.log('🔍 DEBUG: VERIFICACIÓN DE SUPER-ADMIN');
    console.log('=====================================');
    
    // Buscar el super-admin
    const superAdmin = await prisma.user.findUnique({
      where: {
        email: 'walfre.am@gmail.com'
      }
    });
    
    if (!superAdmin) {
      console.log('❌ ERROR: Super-admin no encontrado');
      return;
    }
    
    console.log('✅ SUPER-ADMIN ENCONTRADO:');
    console.log(`- ID: ${superAdmin.id}`);
    console.log(`- Email: ${superAdmin.email}`);
    console.log(`- Nombre: ${superAdmin.name}`);
    console.log(`- Rol: ${superAdmin.role}`);
    console.log(`- Email Verificado: ${superAdmin.emailVerified ? 'Sí' : 'No'}`);
    console.log(`- Estado: ${superAdmin.status}`);
    console.log(`- Fecha Creación: ${superAdmin.createdAt}`);
    
    // Verificar si tiene contraseña
    console.log(`- Tiene Contraseña: ${superAdmin.password ? 'Sí' : 'No'}`);
    
    if (superAdmin.role !== 'superadmin') {
      console.log('❌ PROBLEMA: El rol no es "superadmin"');
      console.log('🔧 Corrigiendo rol...');
      
      await prisma.user.update({
        where: { email: 'walfre.am@gmail.com' },
        data: { role: 'superadmin' }
      });
      
      console.log('✅ Rol corregido a "superadmin"');
    }
    
    if (!superAdmin.emailVerified) {
      console.log('❌ PROBLEMA: Email no está verificado');
      console.log('🔧 Verificando email...');
      
      await prisma.user.update({
        where: { email: 'walfre.am@gmail.com' },
        data: { 
          emailVerified: new Date(),
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ Email verificado');
    }
    
    // Verificar estado final
    const updatedUser = await prisma.user.findUnique({
      where: { email: 'walfre.am@gmail.com' }
    });
    
    console.log('\n🎯 ESTADO FINAL:');
    console.log(`- Rol: ${updatedUser.role}`);
    console.log(`- Email Verificado: ${updatedUser.emailVerified ? 'Sí' : 'No'}`);
    console.log(`- Estado: ${updatedUser.status}`);
    
    if (updatedUser.role === 'superadmin' && updatedUser.emailVerified) {
      console.log('\n✅ SUPER-ADMIN CONFIGURADO CORRECTAMENTE');
      console.log('📋 PARA PROBAR:');
      console.log('1. Cierra el navegador completamente');
      console.log('2. Vuelve a abrir http://localhost:3000/login');
      console.log('3. Inicia sesión con walfre.am@gmail.com');
      console.log('4. Ve a http://localhost:3000/super-admin');
    } else {
      console.log('❌ AÚN HAY PROBLEMAS CON LA CONFIGURACIÓN');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSuperAdmin();
