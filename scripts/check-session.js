// Script para verificar la sesión actual del usuario
const https = require('http');

console.log('🔍 VERIFICANDO SESIÓN ACTUAL...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/debug-session',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Script'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('📊 RESPUESTA DE DEBUG-SESSION:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.authenticated) {
        console.log('\n✅ USUARIO AUTENTICADO');
        console.log(`📧 Email: ${response.user.email}`);
        console.log(`👤 Rol: ${response.user.role}`);
        console.log(`🆔 ID: ${response.user.id}`);
        
        if (response.user.role === 'superadmin') {
          console.log('\n🎯 USUARIO TIENE ROL SUPER-ADMIN CORRECTO');
          console.log('El problema debe estar en otro lado...');
        } else {
          console.log('\n❌ PROBLEMA ENCONTRADO: ROL INCORRECTO');
          console.log(`Expected: superadmin, Found: ${response.user.role}`);
        }
      } else {
        console.log('\n❌ USUARIO NO AUTENTICADO');
        console.log('Necesitas hacer login primero');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error making request:', error);
});

req.end();
