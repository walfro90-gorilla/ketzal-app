const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando datos en la base de datos SQLite local...\n');
    
    const locations = await prisma.global_locations.findMany();
    console.log(`📊 Total de registros: ${locations.length}\n`);
    
    // Agrupar por países
    const byCountry = {};
    locations.forEach(loc => {
      byCountry[loc.country] = (byCountry[loc.country] || 0) + 1;
    });
    
    console.log('🌍 Distribución por países:');
    Object.entries(byCountry).forEach(([country, count]) => {
      console.log(`   ${country}: ${count} ubicaciones`);
    });
    
    console.log('\n📍 Primeros 5 registros:');
    locations.slice(0, 5).forEach((loc, index) => {
      console.log(`   ${index + 1}. ${loc.country} > ${loc.state} > ${loc.city}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
