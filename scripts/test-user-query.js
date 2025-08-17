const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function testUserQuery() {
    console.log('🔍 TESTING USER QUERY WITH SYNCHRONIZED SCHEMA...\n')
    
    try {
        // Esta es la misma query que está fallando en forgotPasswordAction
        const user = await db.user.findUnique({
            where: {
                email: 'walfre.am@gmail.com'
            }
        })
        
        if (user) {
            console.log('✅ USER QUERY SUCCESS!')
            console.log(`   Email: ${user.email}`)
            console.log(`   Name: ${user.name}`)
            console.log(`   ID: ${user.id}`)
            console.log('✅ No "status column" error!')
        } else {
            console.log('ℹ️  User not found, but query executed successfully')
        }

        console.log('\n🎉 SCHEMA SYNCHRONIZED - READY TO TEST!')

    } catch (error) {
        console.error('❌ Error:', error.message)
        console.log('Error code:', error.code)
    } finally {
        await db.$disconnect()
    }
}

testUserQuery()
