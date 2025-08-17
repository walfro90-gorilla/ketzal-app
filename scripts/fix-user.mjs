// Simple debug usando la configuración existente de la app
import { db } from "./lib/db.js";

async function debugUser() {
  try {
    console.log('🔍 Verificando super-admin...');
    
    const user = await db.user.findUnique({
      where: { email: 'walfre.am@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('Usuario encontrado:');
    console.log(`- Email: ${user.email}`);
    console.log(`- Rol: ${user.role}`);
    console.log(`- Email Verificado: ${user.emailVerified}`);
    console.log(`- Estado: ${user.status}`);
    
    // Arreglar si es necesario
    if (user.role !== 'superadmin' || !user.emailVerified) {
      console.log('🔧 Corrigiendo...');
      await db.user.update({
        where: { email: 'walfre.am@gmail.com' },
        data: {
          role: 'superadmin',
          emailVerified: user.emailVerified || new Date(),
          status: 'ACTIVE'
        }
      });
      console.log('✅ Corregido');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugUser();
