const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testRegistrationWithExtraData() {
  try {
    console.log('🧪 Probando registro con información adicional...\n');
    
    // Datos de prueba con información adicional
    const testData = {
      email: 'test-supplier@ejemplo.com',
      name: 'Juan Pérez',
      password: 'password123',
      company: 'Aventuras México',
      serviceType: 'tours',
      city: 'Playa del Carmen',
      phone: '+52 984 123 4567',
      documentation: 'Empresa especializada en ecoturismo con 10 años de experiencia.',
      // Información adicional
      website: 'https://aventurasmexico.com',
      facebook: 'https://facebook.com/aventurasmexico',
      instagram: '@aventuras_mexico',
      tiktok: '@aventurasmexico',
      youtube: 'https://youtube.com/@aventurasmexico',
      whatsappBusiness: '+52 984 765 4321',
      experienceYears: '6-10',
      businessLanguages: 'Español, Inglés, Francés',
      taxId: 'AME123456789'
    };
    
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testData.email }
    });
    
    if (existingUser) {
      console.log('⚠️  Usuario ya existe, eliminando primero...');
      await prisma.user.delete({ where: { email: testData.email } });
    }
    
    const existingSupplier = await prisma.supplier.findUnique({
      where: { contactEmail: testData.email }
    });
    
    if (existingSupplier) {
      console.log('⚠️  Proveedor ya existe, eliminando primero...');
      await prisma.supplier.delete({ where: { contactEmail: testData.email } });
    }
    
    // Crear usuario y proveedor con información completa
    const passwordHash = await bcrypt.hash(testData.password, 10);
    
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear USUARIO
      const newUser = await tx.user.create({
        data: {
          email: testData.email,
          name: testData.name,
          password: passwordHash,
          role: 'user',
        }
      });
      
      // 2. Crear SUPPLIER con información completa
      const newSupplier = await tx.supplier.create({
        data: {
          name: testData.company,
          contactEmail: testData.email,
          phoneNumber: testData.phone || "",
          description: testData.documentation,
          supplierType: testData.serviceType,
          address: testData.city,
          // Usar extras para información adicional y de registro
          extras: {
            isApproved: false,
            isPending: true,
            registrationData: {
              company: testData.company,
              serviceType: testData.serviceType,
              city: testData.city,
              documentation: testData.documentation,
              // Información adicional
              experienceYears: testData.experienceYears || null,
              businessLanguages: testData.businessLanguages || null,
              taxId: testData.taxId || null,
              whatsappBusiness: testData.whatsappBusiness || null
            },
            registrationDate: new Date().toISOString()
          },
          // Usar info para almacenar la presencia digital (redes sociales)
          info: {
            digitalPresence: {
              website: testData.website || null,
              facebook: testData.facebook || null,
              instagram: testData.instagram || null,
              tiktok: testData.tiktok || null,
              youtube: testData.youtube || null
            },
            businessInfo: {
              languages: testData.businessLanguages ? testData.businessLanguages.split(',').map(lang => lang.trim()) : [],
              experience: testData.experienceYears || null,
              taxId: testData.taxId || null,
              whatsappBusiness: testData.whatsappBusiness || null
            }
          }
        }
      });
      
      // 3. Vincular user con supplier
      await tx.user.update({
        where: { id: newUser.id },
        data: { supplierId: newSupplier.id }
      });
      
      return { user: newUser, supplier: newSupplier };
    });
    
    console.log('✅ Usuario y proveedor creados exitosamente!');
    console.log(`👤 Usuario ID: ${result.user.id}`);
    console.log(`🏢 Proveedor ID: ${result.supplier.id}`);
    
    // Verificar que se guardó correctamente
    const savedSupplier = await prisma.supplier.findUnique({
      where: { id: result.supplier.id }
    });
    
    console.log('\n📊 Información guardada:');
    console.log('Extras:', JSON.stringify(savedSupplier.extras, null, 2));
    console.log('Info:', JSON.stringify(savedSupplier.info, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistrationWithExtraData();
