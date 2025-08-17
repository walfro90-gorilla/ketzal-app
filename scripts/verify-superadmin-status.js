const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function verifySuperAdmin() {
    console.log('🔍 VERIFICANDO ESTADO DEL SUPER-ADMIN ACTUAL...\n')
    
    try {
        // Verificar el usuario super-admin
        const superAdmin = await db.user.findUnique({
            where: {
                email: 'walfre.am@gmail.com'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                supplierId: true,
                emailVerified: true,
                createdAt: true
            }
        })

        if (!superAdmin) {
            console.log('❌ Super-admin no encontrado')
            return
        }

        console.log('✅ SUPER-ADMIN ENCONTRADO:')
        console.log(`   Email: ${superAdmin.email}`)
        console.log(`   Nombre: ${superAdmin.name}`)
        console.log(`   Rol: ${superAdmin.role}`)
        console.log(`   Email Verificado: ${superAdmin.emailVerified ? 'Sí' : 'No'}`)
        console.log(`   Supplier ID: ${superAdmin.supplierId || 'Ninguno'}`)
        console.log(`   Creado: ${superAdmin.createdAt}`)

        // Verificar si necesita actualizar el rol
        if (superAdmin.role !== 'superadmin') {
            console.log(`\n⚠️  Rol actual: "${superAdmin.role}" - Necesita actualización a "superadmin"`)
        } else {
            console.log('\n✅ Rol ya es "superadmin" - Todo correcto')
        }

        // Verificar solicitudes pendientes de administradores
        console.log('\n🔍 VERIFICANDO SOLICITUDES PENDIENTES...')
        
        const pendingSuppliers = await db.supplier.findMany({
            select: {
                id: true,
                name: true,
                contactEmail: true,
                supplierType: true,
                extras: true,
                UserSuppliers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        console.log(`📊 Total Suppliers: ${pendingSuppliers.length}`)
        
        let pendingCount = 0
        pendingSuppliers.forEach(supplier => {
            const isPending = supplier.extras && 
                            typeof supplier.extras === 'object' &&
                            supplier.extras.isPending === true
            
            if (isPending) {
                pendingCount++
                console.log(`   📋 PENDIENTE: ${supplier.name} (${supplier.contactEmail})`)
                console.log(`      Tipo: ${supplier.supplierType}`)
                console.log(`      Usuario: ${supplier.UserSuppliers[0]?.name} - Rol: ${supplier.UserSuppliers[0]?.role}`)
            }
        })

        console.log(`\n📈 RESUMEN:`)
        console.log(`   Total Suppliers: ${pendingSuppliers.length}`)
        console.log(`   Solicitudes Pendientes: ${pendingCount}`)
        console.log(`   Super-admin: ${superAdmin.role === 'superadmin' ? 'Configurado' : 'Necesita configuración'}`)

        console.log('\n🎯 PRÓXIMOS PASOS:')
        if (superAdmin.role !== 'superadmin') {
            console.log('1. Actualizar rol a superadmin')
        }
        console.log('2. Crear middleware para proteger rutas de super-admin')
        console.log('3. Crear páginas del panel de administración')
        console.log('4. Implementar funciones de aprobación')

    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await db.$disconnect()
    }
}

verifySuperAdmin()
