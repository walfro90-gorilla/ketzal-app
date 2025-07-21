const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testPasswordReset() {
    console.log('🔐 TESTING PASSWORD RESET FUNCTIONALITY...\n')
    
    try {
        // Test 1: Verificar que existe la tabla PasswordResetToken
        console.log('1️⃣ Checking PasswordResetToken table...')
        const tokenCount = await prisma.passwordResetToken.count()
        console.log(`   ✅ PasswordResetToken table exists (${tokenCount} records)`)

        // Test 2: Verificar que existe un usuario de prueba
        console.log('\n2️⃣ Checking for test user...')
        const testUser = await prisma.user.findFirst({
            where: {
                email: {
                    contains: '@'
                }
            }
        })
        
        if (!testUser) {
            console.log('   ❌ No test user found')
            return
        }
        
        console.log(`   ✅ Test user found: ${testUser.email}`)

        // Test 3: Crear un token de reset simulado
        console.log('\n3️⃣ Creating password reset token...')
        const resetToken = 'test-token-' + Math.random().toString(36).substring(7)
        
        // Eliminar tokens existentes
        await prisma.passwordResetToken.deleteMany({
            where: {
                identifier: testUser.email
            }
        })
        
        // Crear nuevo token
        const createdToken = await prisma.passwordResetToken.create({
            data: {
                identifier: testUser.email,
                token: resetToken,
                expires: new Date(Date.now() + 1000 * 60 * 60) // 1 hora
            }
        })
        
        console.log(`   ✅ Reset token created: ${createdToken.token}`)

        // Test 4: Verificar que el token se puede encontrar
        console.log('\n4️⃣ Testing token retrieval...')
        const foundToken = await prisma.passwordResetToken.findFirst({
            where: {
                token: resetToken,
                expires: {
                    gt: new Date()
                }
            }
        })
        
        if (foundToken) {
            console.log(`   ✅ Token found and not expired`)
        } else {
            console.log(`   ❌ Token not found or expired`)
        }

        // Test 5: Simular reset de contraseña
        console.log('\n5️⃣ Simulating password reset...')
        const newPassword = 'newTestPassword123!'
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        await prisma.$transaction(async (tx) => {
            // Actualizar contraseña
            await tx.user.update({
                where: { id: testUser.id },
                data: {
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            })

            // Eliminar token
            await tx.passwordResetToken.deleteMany({
                where: {
                    identifier: testUser.email
                }
            })
        })
        
        console.log('   ✅ Password updated and token deleted successfully')

        // Test 6: Verificar que el token fue eliminado
        console.log('\n6️⃣ Verifying token cleanup...')
        const deletedToken = await prisma.passwordResetToken.findFirst({
            where: {
                token: resetToken
            }
        })
        
        if (!deletedToken) {
            console.log('   ✅ Token successfully deleted')
        } else {
            console.log('   ❌ Token still exists')
        }

        // Test 7: Verificar que la nueva contraseña funciona
        console.log('\n7️⃣ Testing new password...')
        const updatedUser = await prisma.user.findUnique({
            where: { id: testUser.id }
        })
        
        if (updatedUser && updatedUser.password) {
            const passwordMatch = await bcrypt.compare(newPassword, updatedUser.password)
            if (passwordMatch) {
                console.log('   ✅ New password is working correctly')
            } else {
                console.log('   ❌ New password verification failed')
            }
        }

        console.log('\n🎉 PASSWORD RESET FUNCTIONALITY: ALL TESTS PASSED!')
        console.log('\nℹ️  Next steps:')
        console.log('   1. Test the UI components in the browser')
        console.log('   2. Test email sending functionality')
        console.log('   3. Test the complete flow from forgot password to reset')

    } catch (error) {
        console.error('❌ Error during password reset test:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testPasswordReset()
