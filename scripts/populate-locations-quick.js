const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const locations = [
  { country: 'México', state: 'Chihuahua', city: 'Chihuahua' },
  { country: 'México', state: 'Chihuahua', city: 'Ciudad Juárez' },
  { country: 'México', state: 'Chihuahua', city: 'Delicias' },
  { country: 'México', state: 'Chihuahua', city: 'Parral' },
  { country: 'México', state: 'Ciudad de México', city: 'Benito Juárez' },
  { country: 'México', state: 'Ciudad de México', city: 'Coyoacán' },
  { country: 'México', state: 'Ciudad de México', city: 'Miguel Hidalgo' },
  { country: 'México', state: 'Ciudad de México', city: 'Xochimilco' },
  { country: 'México', state: 'Guanajuato', city: 'León' },
  { country: 'México', state: 'Guanajuato', city: 'Salamanca' },
  { country: 'México', state: 'Guanajuato', city: 'Irapuato' },
  { country: 'México', state: 'Guanajuato', city: 'Celaya' },
  { country: 'México', state: 'Jalisco', city: 'Guadalajara' },
  { country: 'México', state: 'Jalisco', city: 'Puerto Vallarta' },
  { country: 'México', state: 'Jalisco', city: 'Zapopan' },
  { country: 'México', state: 'Jalisco', city: 'Tlaquepaque' },
  { country: 'México', state: 'Nuevo León', city: 'Monterrey' },
  { country: 'México', state: 'Nuevo León', city: 'San Pedro Garza García' },
  { country: 'México', state: 'Nuevo León', city: 'Guadalupe' },
  { country: 'México', state: 'Nuevo León', city: 'Apodaca' },
  { country: 'México', state: 'Oaxaca', city: 'Oaxaca de Juárez' },
  { country: 'México', state: 'Oaxaca', city: 'Huatulco' },
  { country: 'México', state: 'Oaxaca', city: 'Puerto Escondido' },
  { country: 'México', state: 'Oaxaca', city: 'Monte Albán' },
  { country: 'México', state: 'Puebla', city: 'Puebla de Zaragoza' },
  { country: 'México', state: 'Puebla', city: 'Cholula' },
  { country: 'México', state: 'Puebla', city: 'Atlixco' },
  { country: 'México', state: 'Puebla', city: 'Tehuacán' },
  { country: 'México', state: 'Quintana Roo', city: 'Cancún' },
  { country: 'México', state: 'Quintana Roo', city: 'Playa del Carmen' },
  { country: 'México', state: 'Quintana Roo', city: 'Cozumel' },
  { country: 'México', state: 'Quintana Roo', city: 'Tulum' },
  { country: 'México', state: 'Yucatán', city: 'Mérida' },
  { country: 'México', state: 'Yucatán', city: 'Chichen Itzá' },
  { country: 'México', state: 'Yucatán', city: 'Valladolid' },
  { country: 'México', state: 'Yucatán', city: 'Uxmal' },
];

async function populateLocations() {
  try {
    console.log('🗺️  Poblando base de datos con ubicaciones...');
    
    // Verificar si ya existen datos
    const existing = await prisma.global_locations.count();
    if (existing > 0) {
      console.log(`✅ Ya existen ${existing} ubicaciones en la DB`);
      return;
    }

    // Crear todas las ubicaciones
    await prisma.global_locations.createMany({
      data: locations,
      skipDuplicates: true
    });

    const total = await prisma.global_locations.count();
    console.log(`✅ ${total} ubicaciones agregadas exitosamente`);
    console.log('📊 Total de locations en DB:', total);
    
  } catch (error) {
    console.error('❌ Error poblando ubicaciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateLocations();
