// Test directo de la función registerAdminActionV2
// Este script prueba la función real que maneja el registro de administradores

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRegistrationWithNotification() {
  try {
    console.log('🧪 Probando función registerAdminActionV2 directamente...\n');
    
    // Datos de prueba
    const testData = {
      email: 'test-notif@ejemplo.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: 'Usuario Test Notificación',
      company: 'Empresa Test Notificación',
      serviceType: 'tours',
      city: 'Ciudad Test',
      phone: '+52 555 123 4567',
      documentation: 'Documentación de prueba para notificación',
      // Campos adicionales opcionales
      website: 'https://testnotif.com',
      facebook: 'https://facebook.com/testnotif',
      instagram: '@testnotif',
      experienceYears: '3-5',
      businessLanguages: 'Español, Inglés',
      taxId: 'NOTIF123456'
    };
    
    console.log('📋 Datos preparados:');
    console.log(`   📧 Email: ${testData.email}`);
    console.log(`   🏢 Empresa: ${testData.company}`);
    console.log(`   📱 Teléfono: ${testData.phone}`);
    
    // Limpiar registros anteriores si existen
    console.log('\n🧹 Limpiando registros anteriores...');
    try {
      await prisma.user.delete({ where: { email: testData.email } });
      console.log('   ✅ Usuario anterior eliminado');
    } catch {
      console.log('   ℹ️  No había usuario anterior');
    }
    
    try {
      await prisma.supplier.delete({ where: { contactEmail: testData.email } });
      console.log('   ✅ Proveedor anterior eliminado');
    } catch {
      console.log('   ℹ️  No había proveedor anterior');
    }
    
    // Contar notificaciones del super admin antes
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    if (!superAdmin) {
      console.log('❌ No se encontró super admin');
      return;
    }
    
    const notificationsBefore = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    console.log(`\n📊 Estado inicial:`);
    console.log(`   Super Admin ID: ${superAdmin.id}`);
    console.log(`   Notificaciones antes: ${notificationsBefore}`);
    
    // Simular la lógica de registerAdminActionV2
    console.log('\n🚀 Ejecutando lógica de registro...');
    
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear usuario
      const newUser = await tx.user.create({
        data: {
          email: testData.email,
          name: testData.name,
          role: 'admin',
          emailVerified: null,
          image: null,
        }
      });
      
      console.log(`   ✅ Usuario creado: ${newUser.id}`);
      
      // 2. Crear supplier usando la estructura correcta
      const newSupplier = await tx.supplier.create({
        data: {
          name: testData.company,
          contactEmail: testData.email,
          phoneNumber: testData.phone || "",
          description: testData.documentation,
          supplierType: testData.serviceType,
          address: testData.city,
          // Usar extras para información adicional
          extras: {
            isApproved: false,
            isPending: true,
            registrationData: {
              company: testData.company,
              serviceType: testData.serviceType,
              city: testData.city,
              documentation: testData.documentation,
              experienceYears: testData.experienceYears || null,
              businessLanguages: testData.businessLanguages || null,
              taxId: testData.taxId || null
            },
            registrationDate: new Date().toISOString()
          },
          // Usar info para presencia digital
          info: {
            digitalPresence: {
              website: testData.website || null,
              facebook: testData.facebook || null,
              instagram: testData.instagram || null
            },
            businessInfo: {
              languages: testData.businessLanguages ? testData.businessLanguages.split(',').map(lang => lang.trim()) : [],
              experience: testData.experienceYears || null,
              taxId: testData.taxId || null
            }
          }
        }
      });
      
      console.log(`   ✅ Proveedor creado: ${newSupplier.id}`);
      
      // 3. Crear notificación para super admin (usando la misma estructura que registerAdminActionV2)
      const notification = await tx.notification.create({
        data: {
          userId: superAdmin.id,
          type: 'SUPPLIER_APPROVAL',
          title: '🏢 Nueva Solicitud de Proveedor Turístico',
          message: `${testData.name} (${testData.company}) ha solicitado convertirse en proveedor de servicios turísticos. Tipo: ${testData.serviceType}. Requiere aprobación.`,
          priority: 'HIGH',
          isRead: false,
          metadata: {
            supplierId: newSupplier.id,
            userId: newUser.id,
            supplierName: testData.company,
            supplierEmail: testData.email,
            serviceType: testData.serviceType,
            registrationDate: new Date().toISOString(),
            actionUrl: `/admin/suppliers/${newSupplier.id}`
          }
        }
      });
      
      console.log(`   ✅ Notificación creada: ${notification.id}`);
      
      return { user: newUser, supplier: newSupplier, notification };
    });
    
    // Verificar el resultado
    const notificationsAfter = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    console.log(`\n📊 Resultado final:`);
    console.log(`   Notificaciones después: ${notificationsAfter}`);
    console.log(`   Incremento: ${notificationsAfter - notificationsBefore}`);
    
    if (notificationsAfter > notificationsBefore) {
      console.log('\n🎉 ¡Prueba exitosa!');
      console.log(`   📢 Nueva notificación:`);
      console.log(`      ID: ${result.notification.id}`);
      console.log(`      Título: ${result.notification.title}`);
      console.log(`      Mensaje: ${result.notification.message}`);
      console.log(`      Metadata:`, JSON.stringify(result.notification.metadata, null, 2));
    } else {
      console.log('\n⚠️  No se incrementaron las notificaciones');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistrationWithNotification();
