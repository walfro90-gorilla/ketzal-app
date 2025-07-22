// Test simple para el CRUD de notificaciones sin usar imports complejos
const BACKEND_URL = 'http://localhost:4000';

async function testNotificationsCRUDSimple() {
    console.log('🧪 INICIANDO PRUEBAS SIMPLES DEL CRUD DE NOTIFICACIONES\n');

    // Obtener un usuario real
    let testUserId = 'test-user';
    
    try {
        console.log('🔍 1. Obteniendo usuario de la base de datos...');
        const usersResponse = await fetch(`${BACKEND_URL}/api/users`);
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            if (users && users.length > 0) {
                testUserId = users[0].id;
                console.log(`✅ Usuario encontrado: ${users[0].name} (ID: ${testUserId})\n`);
            }
        }
    } catch (error) {
        console.log('⚠️ Error al obtener usuarios, usando ID genérico\n');
    }

    let notificationId = null;

    try {
        // Test 1: CREATE notification
        console.log('📝 2. CREANDO NOTIFICACIÓN...');
        const createResponse = await fetch(`${BACKEND_URL}/api/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: testUserId,
                title: 'Test Notification',
                message: 'Esta es una notificación de prueba del CRUD',
                type: 'INFO',
                priority: 'NORMAL'
            })
        });

        if (createResponse.ok) {
            const created = await createResponse.json();
            notificationId = created.id;
            console.log(`✅ Notificación creada: ${created.title} (ID: ${created.id})\n`);
        } else {
            console.log(`❌ Error al crear: ${createResponse.status} ${createResponse.statusText}\n`);
        }

        // Test 2: GET all notifications
        console.log('📋 3. OBTENIENDO TODAS LAS NOTIFICACIONES...');
        const getAllResponse = await fetch(`${BACKEND_URL}/api/notifications`);
        if (getAllResponse.ok) {
            const allNotifications = await getAllResponse.json();
            console.log(`✅ Total de notificaciones: ${allNotifications.length}\n`);
        } else {
            console.log(`❌ Error al obtener todas: ${getAllResponse.status}\n`);
        }

        // Test 3: GET notification by ID
        if (notificationId) {
            console.log('🔍 4. OBTENIENDO NOTIFICACIÓN POR ID...');
            const getOneResponse = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}`);
            if (getOneResponse.ok) {
                const notification = await getOneResponse.json();
                console.log(`✅ Notificación encontrada: ${notification.title}\n`);
            } else {
                console.log(`❌ Error al obtener por ID: ${getOneResponse.status}\n`);
            }
        }

        // Test 4: GET user notifications
        console.log('👤 5. OBTENIENDO NOTIFICACIONES DEL USUARIO...');
        const getUserResponse = await fetch(`${BACKEND_URL}/api/notifications/user/${testUserId}`);
        if (getUserResponse.ok) {
            const userNotifications = await getUserResponse.json();
            console.log(`✅ Notificaciones del usuario: ${userNotifications.length}\n`);
        } else {
            console.log(`❌ Error al obtener del usuario: ${getUserResponse.status}\n`);
        }

        // Test 5: GET notification stats
        console.log('📊 6. OBTENIENDO ESTADÍSTICAS...');
        const getStatsResponse = await fetch(`${BACKEND_URL}/api/notifications/user/${testUserId}/stats`);
        if (getStatsResponse.ok) {
            const stats = await getStatsResponse.json();
            console.log(`✅ Estadísticas - Total: ${stats.total}, No leídas: ${stats.unread}, Leídas: ${stats.read}\n`);
        } else {
            console.log(`❌ Error al obtener estadísticas: ${getStatsResponse.status}\n`);
        }

        // Test 6: MARK as read
        if (notificationId) {
            console.log('📖 7. MARCANDO COMO LEÍDA...');
            const markReadResponse = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}/mark-read`, {
                method: 'PATCH'
            });
            if (markReadResponse.ok) {
                const marked = await markReadResponse.json();
                console.log(`✅ Marcada como leída: ${marked.isRead}\n`);
            } else {
                console.log(`❌ Error al marcar como leída: ${markReadResponse.status}\n`);
            }
        }

        // Test 7: UPDATE notification
        if (notificationId) {
            console.log('✏️ 8. ACTUALIZANDO NOTIFICACIÓN...');
            const updateResponse = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Título Actualizado',
                    message: 'Mensaje actualizado por la prueba',
                    priority: 'HIGH'
                })
            });
            if (updateResponse.ok) {
                const updated = await updateResponse.json();
                console.log(`✅ Notificación actualizada: ${updated.title}\n`);
            } else {
                console.log(`❌ Error al actualizar: ${updateResponse.status}\n`);
            }
        }

        // Test 8: CREATE quick notification
        console.log('⚡ 9. CREANDO NOTIFICACIÓN RÁPIDA...');
        const quickResponse = await fetch(`${BACKEND_URL}/api/notifications/quick`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: testUserId,
                title: 'Notificación Rápida',
                message: 'Esta es una notificación rápida',
                type: 'SUCCESS'
            })
        });
        
        let quickNotificationId = null;
        if (quickResponse.ok) {
            const quick = await quickResponse.json();
            quickNotificationId = quick.id;
            console.log(`✅ Notificación rápida creada: ${quick.title}\n`);
        } else {
            console.log(`❌ Error al crear rápida: ${quickResponse.status}\n`);
        }

        // Test 9: MARK ALL as read
        console.log('📚 10. MARCANDO TODAS COMO LEÍDAS...');
        const markAllResponse = await fetch(`${BACKEND_URL}/api/notifications/user/${testUserId}/mark-all-read`, {
            method: 'PATCH'
        });
        if (markAllResponse.ok) {
            console.log(`✅ Todas marcadas como leídas\n`);
        } else {
            console.log(`❌ Error al marcar todas: ${markAllResponse.status}\n`);
        }

        // Test 10: DELETE notification
        if (quickNotificationId) {
            console.log('🗑️ 11. ELIMINANDO NOTIFICACIÓN...');
            const deleteResponse = await fetch(`${BACKEND_URL}/api/notifications/${quickNotificationId}`, {
                method: 'DELETE'
            });
            if (deleteResponse.ok) {
                console.log(`✅ Notificación eliminada exitosamente\n`);
            } else {
                console.log(`❌ Error al eliminar: ${deleteResponse.status}\n`);
            }
        }

        // Final stats
        console.log('📈 12. ESTADÍSTICAS FINALES...');
        const finalStatsResponse = await fetch(`${BACKEND_URL}/api/notifications/user/${testUserId}/stats`);
        if (finalStatsResponse.ok) {
            const finalStats = await finalStatsResponse.json();
            console.log(`✅ Estado final - Total: ${finalStats.total}, No leídas: ${finalStats.unread}, Leídas: ${finalStats.read}\n`);
        }

        console.log('🎉 ¡TODAS LAS PRUEBAS COMPLETADAS!');
        console.log('\n✅ FUNCIONES PROBADAS:');
        console.log('   • POST /api/notifications (CREATE)');
        console.log('   • GET /api/notifications (READ ALL)');
        console.log('   • GET /api/notifications/:id (READ ONE)');
        console.log('   • GET /api/notifications/user/:userId (READ BY USER)');
        console.log('   • GET /api/notifications/user/:userId/stats (STATS)');
        console.log('   • PATCH /api/notifications/:id/mark-read (MARK READ)');
        console.log('   • PATCH /api/notifications/:id (UPDATE)');
        console.log('   • POST /api/notifications/quick (QUICK CREATE)');
        console.log('   • PATCH /api/notifications/user/:userId/mark-all-read (MARK ALL READ)');
        console.log('   • DELETE /api/notifications/:id (DELETE)');

    } catch (error) {
        console.error('❌ ERROR GENERAL EN LAS PRUEBAS:');
        console.error('   ', error.message);
        console.log('\n💡 VERIFICAR:');
        console.log('   1. Backend corriendo en puerto 4000');
        console.log('   2. Base de datos conectada');
        console.log('   3. Módulo de notifications registrado');
    }
}

// Auto-ejecutar
testNotificationsCRUDSimple().catch(console.error);

module.exports = { testNotificationsCRUDSimple };
