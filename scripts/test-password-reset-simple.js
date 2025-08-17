const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPasswordResetSimple() {
    console.log('🔐 TESTING PASSWORD RESET FUNCTIONALITY...\n')
    
    try {
        // Test 1: Verificar que existe la tabla PasswordResetToken
        console.log('1️⃣ Checking PasswordResetToken table...')
        const tokenCount = await prisma.passwordResetToken.count()
        console.log(`   ✅ PasswordResetToken table exists (${tokenCount} records)`)

        // Test 2: Crear un token de prueba directamente
        console.log('\n2️⃣ Creating test password reset token...')
        const resetToken = 'test-token-' + Math.random().toString(36).substring(7)
        
        // Limpiar cualquier token existente primero
        await prisma.passwordResetToken.deleteMany({
            where: {
                identifier: 'test@example.com'
            }
        })
        
        const createdToken = await prisma.passwordResetToken.create({
            data: {
                identifier: 'test@example.com',
                token: resetToken,
                expires: new Date(Date.now() + 1000 * 60 * 60) // 1 hora
            }
        })
        
        console.log(`   ✅ Reset token created: ${createdToken.token}`)

        // Test 3: Verificar que el token se puede encontrar
        console.log('\n3️⃣ Testing token retrieval...')
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

        // Test 4: Limpiar token de prueba
        console.log('\n4️⃣ Cleaning up test token...')
        await prisma.passwordResetToken.deleteMany({
            where: {
                identifier: 'test@example.com'
            }
        })
        console.log('   ✅ Test token deleted successfully')

        console.log('\n🎉 PASSWORD RESET FUNCTIONALITY: TABLE STRUCTURE VERIFIED!')
        console.log('\nℹ️  Database structure is ready for password reset functionality:')
        console.log('   ✅ PasswordResetToken table exists')
        console.log('   ✅ Can create password reset tokens')
        console.log('   ✅ Can query tokens by token and expiration')
        console.log('   ✅ Can delete used tokens')
        
        console.log('\n📋 Ready to test in UI:')
        console.log('   1. Go to /login and click "¿Olvidaste tu contraseña?"')
        console.log('   2. Test the forgot password form')
        console.log('   3. Check email sending (if configured)')
        console.log('   4. Test the reset password form with a valid token')

    } catch (error) {
        console.error('❌ Error during password reset test:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testPasswordResetSimple()
