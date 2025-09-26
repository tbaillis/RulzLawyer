const http = require('http');

console.log('🧪 Testing server endpoints...');

function testEndpoint(path, description) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`✅ ${description} - Status: ${res.statusCode}`);
                console.log(`   Response length: ${data.length} bytes`);
                resolve({ status: res.statusCode, data, path });
            });
        });

        req.on('error', (err) => {
            console.error(`❌ ${description} - Error:`, err.message);
            reject(err);
        });

        req.setTimeout(5000, () => {
            console.error(`❌ ${description} - Timeout`);
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function runTests() {
    try {
        await testEndpoint('/api/health', 'Health Check');
        await testEndpoint('/api/status', 'Status Check');
        await testEndpoint('/', 'Home Page');
        await testEndpoint('/test', 'Test Page');
        
        console.log('\n🎉 All tests completed successfully!');
    } catch (error) {
        console.error('\n💥 Test failed:', error.message);
    }
}

runTests();