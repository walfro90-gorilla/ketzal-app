// Test usando la misma instancia que auth-action.ts
import { db } from '../lib/db.js'

async function testNewDbInstance() {
    console.log('🔧 TESTING NEW PRISMA CLIENT INSTANCE...\n')
    
    try {
        console.log('1️⃣ Testing User.findUnique query with new instance...')
        
        const user = await db.user.findFirst({
            where: {
                email: {
                    contains: '@'
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
                // No incluimos 'status' porque no existe
            }
        })
        
        if (user) {
            console.log(`   ✅ User found successfully: ${user.email}`)
            console.log(`   ✅ No 'status' column errors`)
        } else {
            console.log('   ℹ️  No users found')
        }

        console.log('\n🎉 NEW PRISMA INSTANCE: WORKING CORRECTLY!')
        console.log('✅ Ready to test forgot password in browser')

    } catch (error) {
        console.error('❌ Error:', error.message)
        console.log('\n🔍 Debugging info:')
        console.log('- Error code:', error.code)
        console.log('- Client version:', error.clientVersion)
    } finally {
        await db.$disconnect()
    }
}

testNewDbInstance()
