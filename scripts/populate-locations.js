const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Iniciando script...');
  
  try {
    // Crear múltiples ubicaciones de prueba
    const locations = [
      { country: 'México', state: 'Ciudad de México', city: 'Ciudad de México' },
      { country: 'México', state: 'Jalisco', city: 'Guadalajara' },
      { country: 'México', state: 'Nuevo León', city: 'Monterrey' },
      { country: 'Estados Unidos', state: 'California', city: 'Los Angeles' },
      { country: 'Estados Unidos', state: 'Texas', city: 'Houston' },
      { country: 'Colombia', state: 'Bogotá D.C.', city: 'Bogotá' },
      { country: 'España', state: 'Madrid', city: 'Madrid' }
    ];

    console.log('📝 Insertando ubicaciones...');
    
    for (const location of locations) {
      const result = await prisma.global_location.create({
        data: location
      });
      console.log('✅ Ubicación creada:', result);
    }
    
    console.log('🎉 ¡Script completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
