import assert from 'node:assert';
import handler, { extractClientIp, checkRateLimit, isRateLimitedInMemory } from '../api/contact.js';

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    }
  };
}

function createMockReq({ headers = {}, body = {} } = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body
  };
}

async function run() {
  console.log('--- DEEP RATE LIMITING & CONCURRENCY VERIFICATION ---');
  let passed = 0;
  let total = 0;

  function test(desc, fn) {
    total++;
    try {
      fn();
      console.log(`  [PASS] ${desc}`);
      passed++;
    } catch (e) {
      console.error(`  [FAIL] ${desc}:`, e.message);
    }
  }

  async function asyncTest(desc, fn) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] ${desc}`);
      passed++;
    } catch (e) {
      console.error(`  [FAIL] ${desc}:`, e.message);
    }
  }

  // 1. IP Extraction & Spoofing defense
  test('extractClientIp: standard x-forwarded-for extracts first client IP', () => {
    const req = { headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' } };
    assert.strictEqual(extractClientIp(req), '203.0.113.195');
  });

  test('extractClientIp: prioritizes x-real-ip when provided by edge', () => {
    const req = { headers: { 'x-real-ip': '198.51.100.42', 'x-forwarded-for': 'spoofed.ip' } };
    assert.strictEqual(extractClientIp(req), '198.51.100.42');
  });

  test('extractClientIp: strips IPv6 mapped IPv4 prefix', () => {
    const req = { socket: { remoteAddress: '::ffff:192.0.2.1' } };
    assert.strictEqual(extractClientIp(req), '192.0.2.1');
  });

  test('extractClientIp: falls back to safe default on malformed/spoofed characters', () => {
    const req = { headers: { 'x-real-ip': 'evil<script>alert(1)</script>' } };
    assert.strictEqual(extractClientIp(req), '127.0.0.1');
  });

  // 2. Quota & Exceeding Quota
  await asyncTest('Sequential requests 1..5 succeed, 6th triggers 429', async () => {
    const ip = '172.16.0.1';
    for (let i = 1; i <= 5; i++) {
      const res = await checkRateLimit(ip);
      assert.strictEqual(res.isLimited, false, `Request ${i} should be allowed`);
    }
    const sixth = await checkRateLimit(ip);
    assert.strictEqual(sixth.isLimited, true, 'Request 6 should be rate-limited');
  });

  // 3. Concurrent Requests Simulation
  await asyncTest('Concurrency: 10 simultaneous requests from same IP allow exactly 5', async () => {
    const ip = '172.16.0.2';
    const promises = Array.from({ length: 10 }, () => checkRateLimit(ip));
    const results = await Promise.all(promises);
    const allowed = results.filter(r => !r.isLimited).length;
    const blocked = results.filter(r => r.isLimited).length;
    assert.strictEqual(allowed, 5, `Expected 5 allowed, got ${allowed}`);
    assert.strictEqual(blocked, 5, `Expected 5 blocked, got ${blocked}`);
  });

  // 4. Missing IP handling
  await asyncTest('Missing IP header defaults gracefully without throwing', async () => {
    const req = createMockReq({ headers: {} });
    const ip = extractClientIp(req);
    assert.strictEqual(ip, '127.0.0.1');
    const status = await checkRateLimit(ip + '_test_unique');
    assert.strictEqual(status.isLimited, false);
  });

  // 5. Full Handler HTTP 429 & Retry-After response
  await asyncTest('Full HTTP Handler returns 429 and Retry-After: 900 on rate limit violation', async () => {
    const ip = '172.16.0.99';
    let lastRes;
    for (let i = 0; i < 6; i++) {
      const req = createMockReq({
        headers: { 'x-real-ip': ip },
        body: { name: 'RateLimit Test', email: 'rt@example.com', message: 'Test message' }
      });
      const res = createMockRes();
      await handler(req, res);
      lastRes = res;
    }
    assert.strictEqual(lastRes.statusCode, 429);
    assert.strictEqual(lastRes.headers['retry-after'], '900');
    assert.ok(lastRes.body.error.includes('Too many requests'));
  });

  console.log(`\nRESULTS: ${passed}/${total} assertions passed.`);
  if (passed !== total) process.exit(1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

