// Test completo del CRUD de notificaciones
// Este script prueba todas las funciones de la API de notifications

import { 
    createNotification,
    getNotifications,
    getNotification,
    getUserNotifications,
    getNotificationStats,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateNotification,
    deleteNotification,
    deleteReadNotifications,
    createQuickNotification,
    NotificationType,
    NotificationPriority,
    type CreateNotificationData
} from './notifications.api';

async function testNotificationsCRUD() {
    console.log('🧪 INICIANDO PRUEBAS COMPLETAS DEL CRUD DE NOTIFICACIONES\n');

    // Primero obtener un usuario real de la base de datos
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    let testUserId = 'test-user-id';

    try {
        console.log('🔍 Obteniendo un usuario real de la base de datos...');
        const usersResponse = await fetch(`${BACKEND_URL}/api/users`);
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            if (users.length > 0) {
                testUserId = users[0].id;
                console.log(`✅ Usuario de prueba: ${users[0].name} (${users[0].email})`);
                console.log(`🆔 ID: ${testUserId}\n`);
            }
        }
    } catch (error) {
        console.log('⚠️ Usando ID de usuario genérico para las pruebas\n');
    }

    let createdNotificationId: string | null = null;

    try {
        // Test 1: CREATE notification
        console.log('1️⃣ PROBANDO CREATE NOTIFICATION');
        const newNotification: CreateNotificationData = {
            userId: testUserId,
            title: 'Notificación de Prueba',
            message: 'Esta es una notificación de prueba creada por el script de testing del CRUD',
            type: NotificationType.INFO,
            priority: NotificationPriority.NORMAL,
            actionUrl: '/test-action'
        };

        const created = await createNotification(newNotification);
        createdNotificationId = created.id;
        console.log(`✅ Notificación creada exitosamente`);
        console.log(`   📝 ID: ${created.id}`);
        console.log(`   🏷️ Título: ${created.title}`);
        console.log(`   📅 Creada: ${created.createdAt}`);
        console.log('');

        // Test 2: READ - Get all notifications
        console.log('2️⃣ PROBANDO GET ALL NOTIFICATIONS');
        const allNotifications = await getNotifications();
        console.log(`✅ Total de notificaciones: ${allNotifications.length}`);
        console.log('');

        // Test 3: READ - Get notification by ID
        console.log('3️⃣ PROBANDO GET NOTIFICATION BY ID');
        const foundNotification = await getNotification(createdNotificationId);
        console.log(`✅ Notificación encontrada: ${foundNotification.title}`);
        console.log(`   📖 Leída: ${foundNotification.isRead ? 'Sí' : 'No'}`);
        console.log('');

        // Test 4: READ - Get user notifications
        console.log('4️⃣ PROBANDO GET USER NOTIFICATIONS');
        const userNotifications = await getUserNotifications(testUserId);
        console.log(`✅ Notificaciones del usuario: ${userNotifications.length}`);
        console.log('');

        // Test 5: READ - Get unread notifications only
        console.log('5️⃣ PROBANDO GET UNREAD NOTIFICATIONS');
        const unreadNotifications = await getUserNotifications(testUserId, false);
        console.log(`✅ Notificaciones no leídas: ${unreadNotifications.length}`);
        console.log('');

        // Test 6: READ - Get notification stats
        console.log('6️⃣ PROBANDO GET NOTIFICATION STATS');
        const stats = await getNotificationStats(testUserId);
        console.log(`✅ Estadísticas:`);
        console.log(`   📊 Total: ${stats.total}`);
        console.log(`   ❌ No leídas: ${stats.unread}`);
        console.log(`   ✅ Leídas: ${stats.read}`);
        console.log('');

        // Test 7: UPDATE - Mark as read
        console.log('7️⃣ PROBANDO MARK AS READ');
        const markedAsRead = await markNotificationAsRead(createdNotificationId);
        console.log(`✅ Notificación marcada como leída`);
        console.log(`   📖 Estado: ${markedAsRead.isRead ? 'Leída' : 'No leída'}`);
        console.log(`   ⏰ Leída en: ${markedAsRead.readAt}`);
        console.log('');

        // Test 8: UPDATE notification
        console.log('8️⃣ PROBANDO UPDATE NOTIFICATION');
        const updatedNotification = await updateNotification(createdNotificationId, {
            title: 'Título Actualizado',
            message: 'Este mensaje ha sido actualizado por la prueba',
            priority: NotificationPriority.HIGH
        });
        console.log(`✅ Notificación actualizada`);
        console.log(`   🏷️ Nuevo título: ${updatedNotification.title}`);
        console.log(`   ⚡ Nueva prioridad: ${updatedNotification.priority}`);
        console.log('');

        // Test 9: CREATE - Quick notification
        console.log('9️⃣ PROBANDO CREATE QUICK NOTIFICATION');
        const quickNotification = await createQuickNotification(
            testUserId,
            'Notificación Rápida',
            'Esta es una notificación rápida de prueba',
            NotificationType.SUCCESS
        );
        console.log(`✅ Notificación rápida creada`);
        console.log(`   📝 ID: ${quickNotification.id}`);
        console.log(`   🏷️ Título: ${quickNotification.title}`);
        console.log('');

        // Test 10: Stats after adding more notifications
        console.log('🔟 PROBANDO STATS ACTUALIZADAS');
        const updatedStats = await getNotificationStats(testUserId);
        console.log(`✅ Estadísticas actualizadas:`);
        console.log(`   📊 Total: ${updatedStats.total}`);
        console.log(`   ❌ No leídas: ${updatedStats.unread}`);
        console.log(`   ✅ Leídas: ${updatedStats.read}`);
        console.log('');

        // Test 11: Mark all as read
        console.log('1️⃣1️⃣ PROBANDO MARK ALL AS READ');
        const markAllResult = await markAllNotificationsAsRead(testUserId);
        console.log(`✅ Todas las notificaciones marcadas como leídas`);
        console.log(`   📝 Cantidad actualizada: ${markAllResult.count || 'N/A'}`);
        console.log('');

        // Test 12: Delete read notifications
        console.log('1️⃣2️⃣ PROBANDO DELETE READ NOTIFICATIONS');
        const deleteResult = await deleteReadNotifications(testUserId);
        console.log(`✅ Notificaciones leídas eliminadas`);
        console.log(`   🗑️ Cantidad eliminada: ${deleteResult.count || 'N/A'}`);
        console.log('');

        // Test 13: Delete specific notification
        console.log('1️⃣3️⃣ PROBANDO DELETE NOTIFICATION');
        if (quickNotification.id) {
            const deleteSpecificResult = await deleteNotification(quickNotification.id);
            console.log(`✅ Notificación específica eliminada`);
            console.log(`   📝 Mensaje: ${deleteSpecificResult.message || 'Eliminada exitosamente'}`);
        }
        console.log('');

        // Test final: Final stats
        console.log('📈 ESTADÍSTICAS FINALES');
        const finalStats = await getNotificationStats(testUserId);
        console.log(`✅ Estado final:`);
        console.log(`   📊 Total: ${finalStats.total}`);
        console.log(`   ❌ No leídas: ${finalStats.unread}`);
        console.log(`   ✅ Leídas: ${finalStats.read}`);
        console.log('');

        console.log('🎉 ¡TODAS LAS PRUEBAS DEL CRUD COMPLETADAS EXITOSAMENTE!');
        console.log('');
        console.log('✅ Funciones probadas:');
        console.log('   • createNotification()');
        console.log('   • getNotifications()');
        console.log('   • getNotification(id)');
        console.log('   • getUserNotifications()');
        console.log('   • getNotificationStats()');
        console.log('   • markNotificationAsRead()');
        console.log('   • markAllNotificationsAsRead()');
        console.log('   • updateNotification()');
        console.log('   • deleteNotification()');
        console.log('   • deleteReadNotifications()');
        console.log('   • createQuickNotification()');

    } catch (error: any) {
        console.error('❌ ERROR EN LAS PRUEBAS:');
        console.error(`   Mensaje: ${error.message}`);
        console.error(`   Detalles: ${error}`);
        
        if (error.message.includes('fetch')) {
            console.log('\n💡 SOLUCIONES SUGERIDAS:');
            console.log('   1. Verificar que el backend esté corriendo en puerto 4000');
            console.log('   2. Verificar que la base de datos esté conectada');
            console.log('   3. Verificar que los endpoints de notifications existan');
            console.log('   4. Revisar los logs del backend para más detalles');
        }
    }
}

// Auto-ejecutar si es llamado directamente
if (typeof window === 'undefined') {
    // Entorno Node.js - ejecutar directamente
    testNotificationsCRUD().catch(console.error);
}

export { testNotificationsCRUD };
