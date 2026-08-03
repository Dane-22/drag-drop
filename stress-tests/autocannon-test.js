const autocannon = require('autocannon');
const http = require('http');

const PORT = 5000;
const URL = `http://localhost:${PORT}`;

async function runBenchmark() {
  console.log('Fetching JWT token...');
  
  // 1. Authenticate to get a token
  const token = await new Promise((resolve, reject) => {
    const req = http.request(
      `${URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk.toString();
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.token) {
              resolve(parsed.token);
            } else {
              reject(new Error('No token found: ' + body));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(JSON.stringify({ username: 'super_admin', password: 'password123' }));
    req.end();
  });

  console.log('Token acquired. Starting Autocannon benchmark...');

  // 2. Run autocannon on /api/get_data with token
  const instance = autocannon(
    {
      url: `${URL}/api/get_data`,
      connections: 100, // default
      pipelining: 1, // default
      duration: 10, // 10 seconds
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    (err, result) => {
      if (err) {
        console.error('Autocannon error:', err);
      } else {
        console.log('\n--- AUTOCANNON RESULTS ---');
        console.log(`Requests/sec: ${result.requests.average}`);
        console.log(`Latency 99th percentile: ${result.latency.p99} ms`);
        console.log(`Total Requests: ${result.requests.total}`);
        console.log(`Errors: ${result.errors}`);
        console.log(`Timeouts: ${result.timeouts}`);
      }
    }
  );

  autocannon.track(instance, { renderProgressBar: true });
}

runBenchmark().catch(console.error);
