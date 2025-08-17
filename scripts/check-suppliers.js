const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsersAndSuppliers() {
  try {
    console.log('🔍 Verificando usuarios y proveedores en la base de datos...\n');
    
    // Obtener usuarios recientes
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        Supplier: true
      }
    });
    
    console.log(`📊 Total de usuarios encontrados: ${recentUsers.length}\n`);
    
    recentUsers.forEach((user, index) => {
      console.log(`👤 Usuario ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Supplier ID: ${user.supplierId}`);
      console.log(`   Creado: ${user.createdAt}`);
      
      if (user.Supplier) {
        console.log(`   🏢 SUPPLIER VINCULADO:`);
        console.log(`      ID: ${user.Supplier.id}`);
        console.log(`      Nombre: ${user.Supplier.name}`);
        console.log(`      Email: ${user.Supplier.contactEmail}`);
        console.log(`      Teléfono: ${user.Supplier.phoneNumber}`);
        console.log(`      Tipo: ${user.Supplier.supplierType}`);
        console.log(`      Ciudad: ${user.Supplier.address}`);
        console.log(`      Extras:`, JSON.stringify(user.Supplier.extras, null, 2));
        console.log(`      Info:`, JSON.stringify(user.Supplier.info, null, 2));
      }
      console.log('   ---\n');
    });
    
    // También obtener proveedores directamente
    const recentSuppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    
    console.log(`\n🏢 Proveedores más recientes:`);
    recentSuppliers.forEach((supplier, index) => {
      console.log(`   Proveedor ${index + 1}: ${supplier.name} (${supplier.contactEmail})`);
      if (supplier.extras) {
        console.log(`   Extras:`, JSON.stringify(supplier.extras, null, 2));
      }
      if (supplier.info) {
        console.log(`   Info:`, JSON.stringify(supplier.info, null, 2));
      }
      console.log('   ---\n');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsersAndSuppliers();
