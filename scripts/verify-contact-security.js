/**
 * ==============================================================================
 * CONTACT FLOW & SECURITY TEST SUITE (Stage 5 Verification)
 * Validates validation rules, header injection defenses, honeypot, rate limiting,
 * HTML escaping, and error handling with mocked email transport.
 * ==============================================================================
 */

import assert from 'node:assert';
import nodemailer from 'nodemailer';
import handler from '../api/contact.js';

// Mock response builder
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

// Mock request builder
function createMockReq({ method = 'POST', headers = {}, body = {}, ip = '192.168.1.1' } = {}) {
  return {
    method,
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
      ...headers
    },
    body
  };
}

let testsPassed = 0;
let testsFailed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    testsFailed++;
  }
}

async function runAllTests() {
  console.log('\n--- Running Stage 5 Contact Security Tests ---\n');

  // Test 1: Unsupported HTTP method (GET)
  await runTest('1. Rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 405);
    assert.strictEqual(res.headers['allow'], 'POST');
    assert.ok(res.body.error);
  });

  // Test 2: Unsupported Content-Type
  await runTest('2. Rejects unsupported Content-Type with 415 Unsupported Media Type', async () => {
    const req = createMockReq({ 
      method: 'POST', 
      headers: { 'content-type': 'text/plain' },
      body: 'Hello'
    });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 415);
    assert.ok(res.body.error);
  });

  // Test 3: Missing required fields
  await runTest('3. Rejects missing required fields with 400 Bad Request', async () => {
    const req = createMockReq({ body: { name: 'Alice' } });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body.error);
  });

  // Test 4: Whitespace-only fields
  await runTest('4. Rejects whitespace-only inputs with 400 Bad Request', async () => {
    const req = createMockReq({ 
      body: { name: '   ', email: 'alice@example.com', message: 'Valid message content here' } 
    });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body.error);
  });

  // Test 5: Malformed email address
  await runTest('5. Rejects malformed email addresses with 400 Bad Request', async () => {
    const req = createMockReq({ 
      body: { name: 'Bob Smith', email: 'not-an-email', message: 'Hello this is a valid message' } 
    });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body.error.toLowerCase().includes('valid email'));
  });

  // Test 6: Oversized message body
  await runTest('6. Rejects oversized message (> 5000 chars) with 400 Bad Request', async () => {
    const hugeMessage = 'A'.repeat(5001);
    const req = createMockReq({ 
      body: { name: 'Charlie', email: 'charlie@example.com', message: hugeMessage } 
    });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body.error.includes('5000'));
  });

  // Test 7: Honeypot submission
  await runTest('7. Silently discards honeypot submission with 200 OK (bot trap)', async () => {
    const req = createMockReq({ 
      body: { 
        name: 'Spam Bot', 
        email: 'bot@spam.com', 
        message: 'Buy our fake crypto tokens now!',
        website: 'http://spam-link.ru' // Honeypot filled
      } 
    });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  // Test 8: Rate limiting
  await runTest('8. Enforces rate limiting (max 5 requests per window) with 429 Too Many Requests', async () => {
    const testIp = '10.0.0.99';
    let lastRes;
    for (let i = 0; i < 6; i++) {
      const req = createMockReq({ 
        ip: testIp,
        body: { name: 'Test User', email: 'test@example.com', message: 'Valid inquiry message here' } 
      });
      const res = createMockRes();
      await handler(req, res);
      lastRes = res;
    }
    assert.strictEqual(lastRes.statusCode, 429);
    assert.strictEqual(lastRes.headers['retry-after'], '900');
    assert.ok(lastRes.body.error.includes('Too many requests'));
  });

  // Test 9: Safe client-facing error when email credentials are not set
  await runTest('9. Returns safe 500 without leaking stack traces or internal errors', async () => {
    const req = createMockReq({ 
      ip: '10.0.0.105',
      body: { name: 'Dave Miller', email: 'dave@example.com', message: 'Real world question about projects' } 
    });
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 500);
    assert.ok(res.body.error);
    assert.strictEqual(res.body.stack, undefined);
    assert.strictEqual(res.body.debug_step, undefined);
  });

  // Test 10: Mocked Transporter verifies HTML escaping & header CRLF sanitization
  await runTest('10. Escapes HTML entities and sanitizes CRLF headers in outgoing email', async () => {
    process.env.EMAIL_USER = 'test_sender@example.com';
    process.env.EMAIL_PASS = 'mock_pass';

    let capturedMailOptions = null;
    const origCreateTransport = nodemailer.createTransport;
    nodemailer.createTransport = () => ({
      sendMail: async (options) => {
        capturedMailOptions = options;
        return { messageId: 'mock-123' };
      }
    });

    try {
      const req = createMockReq({
        ip: '10.0.0.110',
        body: {
          name: 'Hacker\r\nBcc: victim@example.com',
          email: 'hacker@example.com',
          message: '<script>alert("xss")</script> & <b>bold</b>'
        }
      });
      const res = createMockRes();
      await handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.ok(capturedMailOptions, 'Mail was dispatched');

      // Verify CRLF was stripped from subject and replyTo
      assert.ok(!capturedMailOptions.subject.includes('\r'));
      assert.ok(!capturedMailOptions.subject.includes('\n'));
      assert.ok(!capturedMailOptions.replyTo.includes('\r'));
      assert.ok(!capturedMailOptions.replyTo.includes('\n'));

      // Verify HTML content was escaped (no raw <script> tags)
      assert.ok(capturedMailOptions.html.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'));
      assert.ok(capturedMailOptions.html.includes('&amp;'));
      assert.ok(!capturedMailOptions.html.includes('<script>'));
    } finally {
      nodemailer.createTransport = origCreateTransport;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;
    }
  });

  console.log(`\nResults: ${testsPassed} passed, ${testsFailed} failed.\n`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAllTests();

