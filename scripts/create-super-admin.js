// Script para crear el super-admin inicial
// Ejecutar con: node scripts/create-super-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('👑 Creando super-admin inicial...');
    
    const superAdminData = {
      email: 'walfre.am@gmail.com',
      name: 'Walfre',
      password: 'KetzalSuperAdmin2025!', // Cambiar por una contraseña segura
      role: 'superadmin',
      status: 'ACTIVE'
    };

    // Verificar si el super-admin ya existe
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { email: superAdminData.email }
    });

    if (existingSuperAdmin) {
      console.log('⚠️ Super-admin ya existe. Actualizando permisos...');
      const updated = await prisma.user.update({
        where: { email: superAdminData.email },
        data: {
          role: 'superadmin',
          status: 'ACTIVE',
          emailVerified: new Date()
        }
      });
      console.log('✅ Super-admin actualizado:', updated.email);
      return;
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(superAdminData.password, 10);

    // Crear super-admin
    const newSuperAdmin = await prisma.user.create({
      data: {
        email: superAdminData.email,
        name: superAdminData.name,
        password: passwordHash,
        role: 'superadmin',
        status: 'ACTIVE',
        emailVerified: new Date(), // Marcar como verificado
        adminRequest: false
      }
    });

    console.log('✅ Super-admin creado exitosamente:');
    console.log('  - ID:', newSuperAdmin.id);
    console.log('  - Email:', newSuperAdmin.email);
    console.log('  - Nombre:', newSuperAdmin.name);
    console.log('  - Rol:', newSuperAdmin.role);
    console.log('  - Estado:', newSuperAdmin.status);
    console.log('  - Creado en:', newSuperAdmin.createdAt);
    
    console.log('');
    console.log('🔐 Credenciales de acceso:');
    console.log('  Email:', superAdminData.email);
    console.log('  Password:', superAdminData.password);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login!');

  } catch (error) {
    console.error('❌ Error al crear super-admin:', error.message);
    if (error.code) {
      console.error('   Código de error:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
