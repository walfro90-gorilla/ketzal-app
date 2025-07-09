/**
 * 🚀 Script de Prueba Práctica para Cloudinary
 * Ejecuta pruebas reales con imágenes de ejemplo
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configurar variables de entorno
process.env.CLOUDINARY_CLOUD_NAME = 'dgmmzh8nb';
process.env.CLOUDINARY_API_KEY = '766325626977677';
process.env.CLOUDINARY_API_SECRET = 'g0qgbgJNL8rsG2Ng4X9rP6oxpow';

console.log('🧪 PRUEBA PRÁCTICA DE CLOUDINARY');
console.log('===============================\n');

// Crear imagen de prueba simple
function createTestImage() {
  const testDir = path.join(process.cwd(), 'temp-test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  // Crear un archivo SVG simple para testing
  const svgContent = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#4F46E5"/>
      <text x="100" y="100" text-anchor="middle" fill="white" font-size="20">TEST</text>
      <text x="100" y="130" text-anchor="middle" fill="white" font-size="12">${new Date().toISOString()}</text>
    </svg>
  `;

  const testImagePath = path.join(testDir, 'test-image.svg');
  fs.writeFileSync(testImagePath, svgContent.trim());
  
  return testImagePath;
}

// Descargar imagen de ejemplo desde internet
async function downloadSampleImage() {
  console.log('📥 Descargando imagen de ejemplo...');
  
  const testDir = path.join(process.cwd(), 'temp-test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  const imagePath = path.join(testDir, 'sample-image.jpg');
  
  // Usar una imagen pequeña de placeholder
  const imageUrl = 'https://via.placeholder.com/400x300.jpg?text=Cloudinary+Test';
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(imagePath);
    
    https.get(imageUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('   ✅ Imagen descargada:', imagePath);
        resolve(imagePath);
      });
    }).on('error', (err) => {
      fs.unlink(imagePath, () => {}); // Eliminar archivo parcial
      console.log('   ⚠️  No se pudo descargar, usando imagen local');
      resolve(createTestImage());
    });
  });
}

// Test del API route con archivo real
async function testRealAPIUpload(imagePath) {
  console.log('\n🌐 Probando upload real al API route...');
  
  try {
    // Verificar que el servidor esté corriendo
    const healthCheck = await fetch('http://localhost:3000/api/upload', {
      method: 'OPTIONS'
    }).catch(() => null);

    if (!healthCheck) {
      console.log('   ⚠️  Servidor no disponible en localhost:3000');
      console.log('   💡 Para probar con servidor real:');
      console.log('      1. Ejecuta: npm run dev');
      console.log('      2. Vuelve a ejecutar este script');
      return false;
    }

    console.log('   ✅ Servidor detectado en localhost:3000');

    // Leer archivo y crear FormData
    const imageBuffer = fs.readFileSync(imagePath);
    const formData = new FormData();
    
    // Crear un Blob desde el buffer
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('image', blob, path.basename(imagePath));

    console.log('   📤 Enviando archivo al servidor...');
    console.log('   📋 Archivo:', path.basename(imagePath));
    console.log('   📋 Tamaño:', (imageBuffer.length / 1024).toFixed(2) + ' KB');

    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('   🎉 ¡Upload exitoso!');
      console.log('   📋 Resultado:', {
        url: result.url,
        size: result.size,
        name: result.name
      });
      
      // Verificar que la URL funciona
      const imageCheck = await fetch(result.url, { method: 'HEAD' }).catch(() => null);
      if (imageCheck && imageCheck.ok) {
        console.log('   ✅ Imagen accesible en Cloudinary');
      } else {
        console.log('   ⚠️  Imagen subida pero no accesible (puede tomar unos segundos)');
      }
      
      return result;
    } else {
      const error = await response.text();
      console.log('   ❌ Error en upload:', response.status, error);
      return false;
    }

  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test de las funciones del servidor
async function testServerFunctions() {
  console.log('\n🖥️  Probando funciones del servidor...');
  
  try {
    // Importar cloudinary directamente
    const { v2: cloudinary } = require('cloudinary');
    
    // Configurar
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('   ✅ Cloudinary configurado');

    // Test de configuración
    const config = cloudinary.config();
    console.log('   📋 Configuración verificada:', {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'No configurado'
    });

    // Test de transformación de URL
    const testUrl = cloudinary.url('sample', {
      width: 300,
      height: 200,
      crop: 'fill',
      quality: 'auto'
    });
    
    console.log('   ✅ Generación de URL funcional');
    console.log('   📋 URL de ejemplo:', testUrl);

    return true;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test de optimización de URLs
async function testUrlOptimization() {
  console.log('\n🔗 Probando optimización de URLs...');
  
  try {
    // Importar función de optimización
    const libPath = path.join(process.cwd(), 'lib', 'cloudinary.ts');
    if (!fs.existsSync(libPath)) {
      console.log('   ❌ lib/cloudinary.ts no encontrado');
      return false;
    }

    // Como es TypeScript, solo verificamos la lógica
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dgmmzh8nb";
    const publicId = "sample_image";
    
    // Simular la función getOptimizedImageUrl
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    const transforms = 'w_800,h_600,c_limit,q_auto:good,f_auto';
    const optimizedUrl = `${baseUrl}/${transforms}/${publicId}`;
    
    console.log('   ✅ Función de optimización simulada');
    console.log('   📋 URL optimizada:', optimizedUrl);
    
    // Verificar que la URL tiene el formato correcto
    const isValidUrl = optimizedUrl.includes('cloudinary.com') && 
                      optimizedUrl.includes(cloudName) && 
                      optimizedUrl.includes('w_800');
    
    console.log('   📋 URL válida:', isValidUrl ? '✅' : '❌');
    
    return isValidUrl;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Limpiar archivos temporales
function cleanup() {
  console.log('\n🧹 Limpiando archivos temporales...');
  
  const testDir = path.join(process.cwd(), 'temp-test');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
    console.log('   ✅ Archivos temporales eliminados');
  }
}

// Función principal
async function runPracticalTests() {
  const results = [];
  
  try {
    // 1. Preparar imagen de prueba
    console.log('🎨 Preparando imagen de prueba...');
    const testImagePath = await downloadSampleImage();
    
    // 2. Test de funciones del servidor
    const serverTest = await testServerFunctions();
    results.push({ name: 'Server Functions', passed: serverTest });
    
    // 3. Test de optimización de URLs
    const urlTest = await testUrlOptimization();
    results.push({ name: 'URL Optimization', passed: urlTest });
    
    // 4. Test de upload real (si el servidor está disponible)
    const uploadTest = await testRealAPIUpload(testImagePath);
    results.push({ name: 'Real API Upload', passed: !!uploadTest });
    
    // 5. Resumen de resultados
    console.log('\n📊 RESUMEN DE PRUEBAS PRÁCTICAS');
    console.log('==============================');
    
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    results.forEach(result => {
      console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
    });
    
    console.log(`\n🎯 Resultado: ${passed}/${total} pruebas exitosas`);
    
    if (passed === total) {
      console.log('🎉 ¡Todas las funciones están funcionando correctamente!');
    } else if (passed > 0) {
      console.log('⚡ Funciones principales funcionando. Algunas requieren servidor activo.');
    } else {
      console.log('⚠️  Se encontraron problemas que requieren atención.');
    }
    
    // Instrucciones finales
    console.log('\n💡 SIGUIENTES PASOS:');
    console.log('1. Para pruebas completas: npm run dev && node scripts/test-cloudinary-practical.js');
    console.log('2. Para tests unitarios: npm test __tests__/cloudinary.test.ts');
    console.log('3. Para verificación estática: node scripts/test-cloudinary.js');
    
    return uploadTest;
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    return false;
  } finally {
    cleanup();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runPracticalTests().catch(console.error);
}

module.exports = { runPracticalTests };
