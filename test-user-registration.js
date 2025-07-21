// Script de prueba para verificar el registro de usuario
// Ejecutar con: node test-user-registration.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testUserRegistration() {
  try {
    console.log('🧪 Probando registro de usuario...');
    
    // Datos de prueba
    const testUser = {
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      password: 'password123'
    };

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });

    if (existingUser) {
      console.log('🗑️ Eliminando usuario de prueba existente...');
      await prisma.user.delete({
        where: { email: testUser.email }
      });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(testUser.password, 10);

    // Crear usuario
    console.log('👤 Creando nuevo usuario...');
    const newUser = await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        password: passwordHash
      }
    });

    console.log('✅ Usuario creado exitosamente:');
    console.log('  - ID:', newUser.id);
    console.log('  - Email:', newUser.email);
    console.log('  - Nombre:', newUser.name);
    console.log('  - Creado en:', newUser.createdAt);
    console.log('  - Actualizado en:', newUser.updatedAt);
    
    // Limpiar después de la prueba
    console.log('🧹 Limpiando usuario de prueba...');
    await prisma.user.delete({
      where: { id: newUser.id }
    });
    
    console.log('🎉 ¡Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.code) {
      console.error('   Código de error:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testUserRegistration();
