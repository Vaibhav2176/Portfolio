import githubHandler from '../api/github.js';
import leetcodeHandler from '../api/leetcode.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

async function runTests() {
  console.log('--- TESTING GITHUB & LEETCODE APIS ---');
  let passed = 0;
  let total = 0;

  function assert(desc, condition) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${desc}`);
    }
  }

  // 1. GitHub: Rejection of non-GET
  {
    const req = { method: 'POST', query: {} };
    const res = createMockRes();
    await githubHandler(req, res);
    assert('GitHub rejects POST with 405', res.statusCode === 405);
    assert('GitHub returns error object on 405', res.body && res.body.error === 'Method Not Allowed');
  }

  // 2. GitHub: Cache-Control header present
  {
    const req = { method: 'GET', query: { username: 'Vaibhav2176' } };
    const res = createMockRes();
    await githubHandler(req, res);
    assert('GitHub sets Cache-Control header', res.headers['cache-control']?.includes('s-maxage'));
    assert('GitHub response has valid status', ['live', 'stale', 'error'].includes(res.body?.status));
    assert('GitHub response has guaranteed data object', typeof res.body?.data === 'object');
  }

  // 3. LeetCode: Rejection of non-GET
  {
    const req = { method: 'PUT', query: {} };
    const res = createMockRes();
    await leetcodeHandler(req, res);
    assert('LeetCode rejects PUT with 405', res.statusCode === 405);
    assert('LeetCode returns error object on 405', res.body && res.body.error === 'Method Not Allowed');
  }

  // 4. LeetCode: Cache-Control header present
  {
    const req = { method: 'GET', query: { username: 'OerRUe2yaA' } };
    const res = createMockRes();
    await leetcodeHandler(req, res);
    assert('LeetCode sets Cache-Control header', res.headers['cache-control']?.includes('s-maxage'));
    assert('LeetCode response has valid status', ['live', 'stale', 'error'].includes(res.body?.status));
    assert('LeetCode response has guaranteed data object', typeof res.body?.data === 'object');
  }

  // 5. GitHub: Nonexistent user / network failure fallback
  {
    const req = { method: 'GET', query: { username: 'thisuserdefinitelydoesnotexist99918274198234' } };
    const res = createMockRes();
    await githubHandler(req, res);
    assert('GitHub nonexistent user or network failure handled safely', [404, 403, 500].includes(res.statusCode) || ['stale', 'error'].includes(res.body?.status));
    assert('GitHub failure returns guaranteed data object', typeof res.body?.data === 'object');
  }

  // 6. LeetCode: Nonexistent user / network failure fallback
  {
    const req = { method: 'GET', query: { username: 'nonexistent_user_9999999999999999' } };
    const res = createMockRes();
    await leetcodeHandler(req, res);
    assert('LeetCode nonexistent user or network failure returns safely without crash', [404, 500].includes(res.statusCode) || ['stale', 'error'].includes(res.body?.status));
    assert('LeetCode failure returns guaranteed data object', typeof res.body?.data === 'object');
  }

  // 7. Security: Verify error responses never leak private credentials or stack traces
  {
    const req = { method: 'GET', query: { username: 'test' } };
    const resGH = createMockRes();
    const resLC = createMockRes();
    await githubHandler(req, resGH);
    await leetcodeHandler(req, resLC);

    const ghStr = JSON.stringify(resGH.body);
    const lcStr = JSON.stringify(resLC.body);

    assert('GitHub response never contains Authorization or token leaks', !ghStr.includes('Bearer') && !ghStr.includes('token'));
    assert('LeetCode response never contains secret leaks', !lcStr.includes('Bearer') && !lcStr.includes('token') && !lcStr.includes('password'));
    assert('GitHub response never leaks internal file paths or stack', !ghStr.includes('node:internal') && !ghStr.includes('.js:'));
    assert('LeetCode response never leaks internal file paths or stack', !lcStr.includes('node:internal') && !lcStr.includes('.js:'));
  }

  // 8. Consumer Resilience: Test frontend Activity.jsx mapping with empty/stale API payload
  {
    const emptyApiPayload = { status: 'stale', data: {} };
    const initialGithubBaseline = {
      stats: { publicRepos: 6, totalContributions: 224, totalCommits: 291, activeDays: 32 },
      topRepositories: [{ name: 'toolverse-hub', stars: 2 }]
    };
    
    // Simulate Activity.jsx logic
    const apiData = emptyApiPayload.data || {};
    const livePayload = {
      ...initialGithubBaseline,
      stats: {
        ...initialGithubBaseline.stats,
        publicRepos: apiData.publicRepos || initialGithubBaseline.stats.publicRepos
      },
      topRepositories: Array.isArray(apiData.repos) && apiData.repos.length > 0
        ? apiData.repos
        : initialGithubBaseline.topRepositories
    };

    assert('Consumer safely falls back to baseline publicRepos on empty API data', livePayload.stats.publicRepos === 6);
    assert('Consumer safely preserves topRepositories on empty API data', livePayload.topRepositories[0].name === 'toolverse-hub');
  }

  // 9. Timeout Handling: Verify simulated upstream TimeoutError returns HTTP 504 and safe payload
  {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = () => Promise.reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
      
      const req = { method: 'GET', query: { username: 'timeout_test' } };
      const resGH = createMockRes();
      const resLC = createMockRes();
      
      await githubHandler(req, resGH);
      await leetcodeHandler(req, resLC);

      assert('GitHub returns 504 on upstream timeout', resGH.statusCode === 504);
      assert('GitHub timeout body indicates timeout', resGH.body?.message?.includes('timed out'));
      assert('LeetCode returns 504 on upstream timeout', resLC.statusCode === 504);
      assert('LeetCode timeout body indicates timeout', resLC.body?.message?.includes('timed out'));
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  console.log(`\nRESULTS: ${passed}/${total} assertions passed.`);
  if (passed !== total) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
