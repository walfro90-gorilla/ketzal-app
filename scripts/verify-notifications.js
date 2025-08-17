const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyNotifications() {
  try {
    console.log('📊 Verificando estado final del sistema de notificaciones...\n');
    
    // 1. Obtener super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });
    
    if (!superAdmin) {
      console.log('❌ No se encontró super admin');
      return;
    }
    
    console.log(`👤 Super Admin encontrado:`);
    console.log(`   ID: ${superAdmin.id}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Nombre: ${superAdmin.name || 'Sin nombre'}`);
    
    // 2. Contar todas las notificaciones
    const totalNotifications = await prisma.notification.count({
      where: { userId: superAdmin.id }
    });
    
    // 3. Contar notificaciones no leídas
    const unreadNotifications = await prisma.notification.count({
      where: { 
        userId: superAdmin.id,
        isRead: false 
      }
    });
    
    console.log(`\n📮 Resumen de notificaciones:`);
    console.log(`   Total: ${totalNotifications}`);
    console.log(`   No leídas: ${unreadNotifications}`);
    
    // 4. Mostrar las 5 notificaciones más recientes
    const recentNotifications = await prisma.notification.findMany({
      where: { userId: superAdmin.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`\n📋 Últimas 5 notificaciones:`);
    recentNotifications.forEach((notification, index) => {
      console.log(`\n   ${index + 1}. [${notification.isRead ? '✅' : '🔴'}] ${notification.title}`);
      console.log(`      📅 ${notification.createdAt.toLocaleString()}`);
      console.log(`      📝 ${notification.message}`);
      console.log(`      🏷️  Tipo: ${notification.type} | Prioridad: ${notification.priority}`);
      if (notification.metadata) {
        console.log(`      📎 Metadata:`, JSON.stringify(notification.metadata, null, 6));
      }
    });
    
    // 5. Verificar notificaciones de tipo SUPPLIER_APPROVAL
    const supplierNotifications = await prisma.notification.count({
      where: { 
        userId: superAdmin.id,
        type: 'SUPPLIER_APPROVAL'
      }
    });
    
    console.log(`\n🏢 Notificaciones de proveedores: ${supplierNotifications}`);
    
    // 6. Verificar usuarios registrados como admin/supplier
    const adminUsers = await prisma.user.count({
      where: { role: 'admin' }
    });
    
    const userSuppliers = await prisma.user.count({
      where: { role: 'user', supplierId: { not: null } }
    });
    
    console.log(`\n👥 Usuarios registrados:`);
    console.log(`   Admins: ${adminUsers}`);
    console.log(`   Usuarios con supplier: ${userSuppliers}`);
    
    // 7. Verificar suppliers pendientes
    const pendingSuppliers = await prisma.supplier.count({
      where: {
        extras: {
          path: ['isApproved'],
          equals: false
        }
      }
    });
    
    console.log(`   Suppliers pendientes: ${pendingSuppliers}`);
    
    console.log('\n✅ Verificación completa del sistema de notificaciones');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyNotifications();
