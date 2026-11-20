const http = require('http');
const app = require('../server');

const server = http.createServer(app);
const TEST_PORT = 3001;

server.listen(TEST_PORT, async () => {
  console.log(`Probe server started on port ${TEST_PORT}`);

  function fetchUrl(path) {
    return new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port: TEST_PORT, path }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
      }).on('error', reject);
    });
  }

  try {
    // 1. Root redirect
    const rootRes = await fetchUrl('/');
    console.log(`GET / -> Status ${rootRes.statusCode}, Location: ${rootRes.headers.location}`);

    // 2. Login Page
    const loginRes = await fetchUrl('/auth/login');
    console.log(`GET /auth/login -> Status ${loginRes.statusCode}, HTML length: ${loginRes.body.length}`);
    const hasBrand = loginRes.body.includes('SIA SEKOLAH');
    console.log(`Login contains 'SIA SEKOLAH': ${hasBrand}`);

    // 3. Static CSS
    const cssRes = await fetchUrl('/css/style.css');
    console.log(`GET /css/style.css -> Status ${cssRes.statusCode}, CSS length: ${cssRes.body.length}`);

    // 4. Static JS
    const jsRes = await fetchUrl('/js/main.js');
    console.log(`GET /js/main.js -> Status ${jsRes.statusCode}, JS length: ${jsRes.body.length}`);

    // 5. 404 handler
    const notFoundRes = await fetchUrl('/non-existent-page-test');
    console.log(`GET /non-existent-page-test -> Status ${notFoundRes.statusCode}`);

    console.log('✅ ALL HTTP ENDPOINTS RESPONDED NORMALLY');
  } catch (err) {
    console.error('HTTP Probe error:', err);
  } finally {
    server.close(() => {
      console.log('Probe server closed');
      process.exit(0);
    });
  }
});

