const http = require('http');

const checkEndpoint = (url, description) => {
    return new Promise((resolve) => {
        const request = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`✅ ${description} - Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        console.log(`   Response: ${Array.isArray(parsed) ? `Array with ${parsed.length} items` : 'Object'}`);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            console.log(`   First item keys: ${Object.keys(parsed[0]).join(', ')}`);
                        }
                    } catch (e) {
                        console.log(`   Response: ${data.substring(0, 100)}...`);
                    }
                }
                resolve({ success: true, status: res.statusCode });
            });
        });

        request.on('error', (err) => {
            console.log(`❌ ${description} - Error: ${err.message}`);
            resolve({ success: false, error: err.message });
        });

        request.setTimeout(5000, () => {
            request.destroy();
            console.log(`⏰ ${description} - Timeout`);
            resolve({ success: false, error: 'Timeout' });
        });
    });
};

const main = async () => {
    console.log('🔍 Verificando Backend en puerto 4000...\n');

    const endpoints = [
        { url: 'http://localhost:4000', description: 'Health Check' },
        { url: 'http://localhost:4000/users', description: 'GET /users' },
        { url: 'http://localhost:4000/suppliers', description: 'GET /suppliers' },
        { url: 'http://localhost:4000/users/search?name=test', description: 'GET /users/search' }
    ];

    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint.url, endpoint.description);
        console.log('');
    }

    console.log('✨ Verificación completada');
};

main().catch(console.error);
