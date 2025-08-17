// Test simple para diagnosticar APIs
const testAPIs = async () => {
  console.log('🔍 Probando APIs en modo debug...\n');

  // Test 1: API de locations
  try {
    console.log('1️⃣ Probando API de locations...');
    const locResponse = await fetch('http://localhost:3001/api/locations?type=countries');
    console.log('Status:', locResponse.status);
    console.log('Headers:', locResponse.headers.get('content-type'));
    
    if (locResponse.ok) {
      const locData = await locResponse.json();
      console.log('✅ Locations API funcionando:', locData);
    } else {
      const errorText = await locResponse.text();
      console.log('❌ Locations API error:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Error conectando locations API:', error.message);
  }

  console.log('\n---\n');

  // Test 2: API de supplier name
  try {
    console.log('2️⃣ Probando API de supplier name...');
    const nameResponse = await fetch('http://localhost:3001/api/check-supplier-name?name=test');
    console.log('Status:', nameResponse.status);
    console.log('Headers:', nameResponse.headers.get('content-type'));
    
    if (nameResponse.ok) {
      const nameData = await nameResponse.json();
      console.log('✅ Supplier name API funcionando:', nameData);
    } else {
      const errorText = await nameResponse.text();
      console.log('❌ Supplier name API error:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Error conectando supplier name API:', error.message);
  }

  console.log('\n🏁 Diagnóstico completo');
};

// Ejecutar cuando se llame el script
testAPIs().catch(console.error);
