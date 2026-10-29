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

  // 10. LeetCode: Upstream response mapping and data type normalization
  {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          data: {
            matchedUser: {
              username: 'OerRUe2yaA',
              profile: { ranking: 1170898, reputation: 0 },
              submitStats: {
                acSubmissionNum: [
                  { difficulty: 'All', count: 152, submissions: 231 },
                  { difficulty: 'Easy', count: 86, submissions: 137 }
                ],
                totalSubmissionNum: [
                  { difficulty: 'All', count: 155, submissions: 352 }
                ]
              },
              userCalendar: {
                activeYears: [2025, 2026],
                streak: 34,
                totalActiveDays: 61,
                submissionCalendar: '{"1777334400":1,"1783814400":5}'
              }
            }
          }
        })
      });

      const req = { method: 'GET', query: { username: 'OerRUe2yaA' } };
      const res = createMockRes();
      await leetcodeHandler(req, res);

      assert('LeetCode handler returns HTTP 200 on valid upstream profile', res.statusCode === 200);
      assert('LeetCode ranking is returned as clean integer number (not formatted string with commas)', typeof res.body?.data?.ranking === 'number' && res.body.data.ranking === 1170898);
      assert('LeetCode ranking is finite and never NaN', Number.isFinite(res.body?.data?.ranking) && !isNaN(res.body?.data?.ranking));
      assert('LeetCode submissionCalendar is parsed into an object', typeof res.body?.data?.calendar?.submissionCalendar === 'object' && !Array.isArray(res.body?.data?.calendar?.submissionCalendar));
      assert('LeetCode submissionCalendar contains expected keys', res.body?.data?.calendar?.submissionCalendar['1777334400'] === 1);
      assert('LeetCode returns totalSubmitStats array', Array.isArray(res.body?.data?.totalSubmitStats) && res.body.data.totalSubmitStats[0]?.submissions === 352);
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  // 11. LeetCode: Ranking parsing and formatting robustness
  {
    const formatRanking = (raw) => {
      const cleanRank = typeof raw === 'string'
        ? Number(raw.replace(/,/g, ''))
        : Number(raw);
      return Number.isFinite(cleanRank) && cleanRank > 0
        ? `~${cleanRank.toLocaleString()}`
        : 'Unavailable';
    };

    assert('Ranking formatter handles clean integer 1170898', formatRanking(1170898) === `~${(1170898).toLocaleString()}`);
    assert('Ranking formatter handles comma-separated string "1,170,898"', formatRanking('1,170,898') === `~${(1170898).toLocaleString()}`);
    assert('Ranking formatter handles null safely', formatRanking(null) === 'Unavailable');
    assert('Ranking formatter handles undefined safely', formatRanking(undefined) === 'Unavailable');
    assert('Ranking formatter handles NaN / non-numeric string safely', formatRanking('not-a-number') === 'Unavailable');
    assert('Ranking formatter handles 0 safely', formatRanking(0) === 'Unavailable');
  }

  // 12. LeetCodeHeatmap: Calendar parser robustness (stringified JSON vs object)
  {
    const parseCalendar = (calendarData) => {
      if (!calendarData) return {};
      let raw = calendarData;
      if (typeof raw === 'string') {
        try {
          raw = JSON.parse(raw);
        } catch {
          return {};
        }
      }
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
      const map = {};
      for (const [timestamp, count] of Object.entries(raw)) {
        const tsNum = Number(timestamp);
        if (!isNaN(tsNum)) {
          const dateObj = new Date(tsNum * 1000);
          const yyyy = dateObj.getUTCFullYear();
          const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getUTCDate()).padStart(2, '0');
          const key = `${yyyy}-${mm}-${dd}`;
          map[key] = (map[key] || 0) + Number(count);
        }
      }
      return map;
    };

    const jsonStr = '{"1777334400": 2, "1783814400": 5}';
    const parsedFromStr = parseCalendar(jsonStr);
    assert('Heatmap parser parses JSON string successfully', Object.keys(parsedFromStr).length === 2 && Object.values(parsedFromStr).includes(2));

    const rawObj = { "1777334400": 3, "1783814400": 4 };
    const parsedFromObj = parseCalendar(rawObj);
    assert('Heatmap parser parses plain object successfully', Object.keys(parsedFromObj).length === 2 && Object.values(parsedFromObj).includes(3));

    assert('Heatmap parser handles malformed JSON string without throw', Object.keys(parseCalendar('{invalid-json')).length === 0);
    assert('Heatmap parser handles null without throw', Object.keys(parseCalendar(null)).length === 0);
    assert('Heatmap parser handles array input safely', Object.keys(parseCalendar([1, 2, 3])).length === 0);
  }

  // 13. GitHub: Upstream full response parsing with live contributions HTML
  {
    const originalFetch = globalThis.fetch;
    try {
      const mockHtml = `
        <div class="js-yearly-contributions">
          <h2>519 contributions in the last year</h2>
          <table class="ContributionCalendar-grid">
            <tr>
              <td data-date="2026-03-08" id="day-1" data-level="4" class="ContributionCalendar-day"></td>
              <td data-date="2026-03-09" id="day-2" data-level="1" class="ContributionCalendar-day"></td>
              <td data-date="2026-03-10" id="day-3" data-level="0" class="ContributionCalendar-day"></td>
            </tr>
          </table>
          <tool-tip for="day-1">74 contributions on March 8, 2026</tool-tip>
          <tool-tip for="day-2">3 contributions on March 9, 2026</tool-tip>
          <tool-tip for="day-3">No contributions on March 10, 2026</tool-tip>
        </div>
      `;

      globalThis.fetch = (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/contributions')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(mockHtml)
          });
        }
        if (urlStr.includes('/repos')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([
              { name: 'Portfolio', stargazers_count: 5, forks_count: 1, html_url: 'https://github.com/Vaibhav2176/Portfolio' }
            ])
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            public_repos: 9,
            followers: 2,
            following: 1
          })
        });
      };

      const req = { method: 'GET', query: { username: 'Vaibhav2176' } };
      const res = createMockRes();
      await githubHandler(req, res);

      assert('GitHub handler returns HTTP 200 on valid profile and contributions', res.statusCode === 200);
      assert('GitHub handler extracts totalContributions accurately', res.body?.data?.totalContributions === 519);
      assert('GitHub handler extracts activeDays accurately', res.body?.data?.activeDays === 2);
      assert('GitHub handler parses day-level active cells', res.body?.data?.activeCells?.['2026-03-08']?.count === 74);
      assert('GitHub handler preserves publicRepos count', res.body?.data?.publicRepos === 9);
      assert('GitHub handler includes repos array', Array.isArray(res.body?.data?.repos) && res.body.data.repos[0]?.name === 'Portfolio');
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  // 14. GitHub: Resilient fallback when contributions endpoint fails
  {
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/contributions')) {
          return Promise.resolve({ ok: false, status: 503 });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ public_repos: 9, followers: 0, following: 0 })
        });
      };

      const req = { method: 'GET', query: { username: 'Vaibhav2176' } };
      const res = createMockRes();
      await githubHandler(req, res);

      assert('GitHub handler succeeds even if contributions fetch fails', res.statusCode === 200);
      assert('GitHub status is stale when contributions fail', res.body?.status === 'stale');
      assert('GitHub totalContributions is null when unparseable', res.body?.data?.totalContributions === null);
      assert('GitHub activeCells defaults to empty object without throwing', typeof res.body?.data?.activeCells === 'object');
      assert('GitHub publicRepos remains intact', res.body?.data?.publicRepos === 9);
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  // 15. GitHub: Consumer fallback to last valid cached data on failure
  {
    const cachedData = {
      stats: { publicRepos: 9, totalContributions: 519, totalCommits: 291, activeDays: 73 },
      calendar: { totalContributions: 519, activeCells: { '2026-03-08': { count: 74, level: 4 } } }
    };
    const initialBaseline = {
      stats: { publicRepos: 6, totalContributions: 224, totalCommits: 291, activeDays: 32 }
    };

    const resolveFallbackState = (hasFailed, cachedPayload, baseline) => {
      if (hasFailed) {
        if (cachedPayload) {
          return { data: cachedPayload, status: 'cached' };
        }
        return { data: baseline, status: 'snapshot' };
      }
      return { data: cachedPayload, status: 'live' };
    };

    const fallbackWithCache = resolveFallbackState(true, cachedData, initialBaseline);
    assert('Consumer preserves last valid cached data on API failure', fallbackWithCache.data.stats.totalContributions === 519);
    assert('Consumer sets status to cached when using last valid cache', fallbackWithCache.status === 'cached');

    const fallbackWithoutCache = resolveFallbackState(true, null, initialBaseline);
    assert('Consumer falls back to static baseline when no cache exists', fallbackWithoutCache.data.stats.totalContributions === 224);
    assert('Consumer sets status to snapshot when using static baseline', fallbackWithoutCache.status === 'snapshot');

    const resolveProvenanceStatus = (apiStatus, apiContributions, hasCalendar) => {
      const isActuallyLive = apiStatus === 'live' && (typeof apiContributions === 'number' || hasCalendar);
      return isActuallyLive ? 'live' : (apiStatus === 'cached' ? 'cached' : 'snapshot');
    };
    assert('UI never marks fallback/stale data as live', resolveProvenanceStatus('stale', null, false) === 'snapshot');
    assert('UI marks live data as live only when genuine contributions exist', resolveProvenanceStatus('live', 519, true) === 'live');
  }

  // 16. GitHubHeatmap: Date bounds dynamic calculation
  {
    const calculateBounds = (refDate) => {
      const now = refDate || new Date();
      const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 364);
      while (startDate.getUTCDay() !== 0) {
        startDate.setUTCDate(startDate.getUTCDate() - 1);
      }
      return { startDate, endDate };
    };

    const bounds = calculateBounds(new Date('2026-10-29T12:00:00Z'));
    assert('Dynamic bounds endDate matches reference UTC date', bounds.endDate.toISOString().startsWith('2026-10-29'));
    assert('Dynamic bounds startDate aligns to Sunday (getUTCDay === 0)', bounds.startDate.getUTCDay() === 0);
    const spanDays = Math.round((bounds.endDate - bounds.startDate) / (1000 * 60 * 60 * 24));
    assert('Calendar matrix span covers full 52+ week window (>= 364 days)', spanDays >= 364 && spanDays <= 371);
  }

  console.log(`\nRESULTS: ${passed}/${total} assertions passed.`);
  if (passed !== total) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
