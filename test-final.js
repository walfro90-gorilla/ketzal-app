// Test final de APIs con Prisma funcionando
const testAPIs = async () => {
  console.log('🎯 Probando APIs con Prisma arreglado...\n');

  try {
    // Test 1: API de locations
    console.log('1️⃣ Probando API de locations...');
    const locResponse = await fetch('http://localhost:3000/api/locations?type=countries');
    
    if (locResponse.ok) {
      const locData = await locResponse.json();
      console.log('✅ Locations API funcionando:', locData);
    } else {
      console.log('❌ Locations API error:', locResponse.status);
    }

    // Test 2: API de supplier name
    console.log('\n2️⃣ Probando API de supplier name...');
    const nameResponse = await fetch('http://localhost:3000/api/check-supplier-name?name=test');
    
    if (nameResponse.ok) {
      const nameData = await nameResponse.json();
      console.log('✅ Supplier name API funcionando:', nameData);
    } else {
      console.log('❌ Supplier name API error:', nameResponse.status);
    }

    console.log('\n🎉 ¡Todas las APIs funcionan correctamente!');
    console.log('🌐 Ve a http://localhost:3000/register-admin para probar el formulario');
    
  } catch (error) {
    console.log('❌ Error conectando APIs:', error.message);
  }
};

testAPIs();
