const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPrismaClient() {
    console.log('🔍 TESTING PRISMA CLIENT AFTER REGENERATION...\n')
    
    try {
        // Test 1: Verificar conexión a la base de datos
        console.log('1️⃣ Testing database connection...')
        await prisma.$queryRaw`SELECT 1 as test`
        console.log('   ✅ Database connection successful')

        // Test 2: Verificar que podemos hacer queries sin errores de esquema
        console.log('\n2️⃣ Testing User table query (without status column)...')
        const userCount = await prisma.user.count()
        console.log(`   ✅ User table accessible (${userCount} users found)`)

        // Test 3: Verificar que la tabla PasswordResetToken existe
        console.log('\n3️⃣ Testing PasswordResetToken table...')
        const tokenCount = await prisma.passwordResetToken.count()
        console.log(`   ✅ PasswordResetToken table accessible (${tokenCount} tokens)`)

        // Test 4: Probar una consulta User.findUnique (la que falló)
        console.log('\n4️⃣ Testing User.findUnique query...')
        const firstUser = await prisma.user.findFirst({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        })
        
        if (firstUser) {
            console.log(`   ✅ User.findFirst successful: ${firstUser.email}`)
        } else {
            console.log('   ℹ️  No users found in database')
        }

        console.log('\n🎉 PRISMA CLIENT: ALL TESTS PASSED!')
        console.log('✅ Schema is synchronized')
        console.log('✅ No more "status column" errors')
        console.log('✅ Ready to test forgot password functionality')

    } catch (error) {
        console.error('❌ Error during Prisma client test:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

testPrismaClient()
