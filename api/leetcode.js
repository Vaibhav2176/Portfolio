/**
 * Vercel Serverless & Express compatible handler for LeetCode profile metrics
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set edge caching headers for CDN / serverless edge
  res.setHeader?.('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const username = req.query?.username || 'OerRUe2yaA';

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          userCalendar {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;

    const upstream = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        status: 'stale',
        data: {},
        message: 'LeetCode upstream unavailable'
      });
    }

    const json = await upstream.json();
    const user = json.data?.matchedUser;

    if (!user) {
      return res.status(404).json({
        status: 'stale',
        data: {},
        message: 'User profile not found'
      });
    }

    // Safely parse submissionCalendar string into an object
    let parsedCalendar = {};
    if (user.userCalendar?.submissionCalendar) {
      if (typeof user.userCalendar.submissionCalendar === 'string') {
        try {
          parsedCalendar = JSON.parse(user.userCalendar.submissionCalendar);
        } catch {
          parsedCalendar = {};
        }
      } else if (typeof user.userCalendar.submissionCalendar === 'object') {
        parsedCalendar = user.userCalendar.submissionCalendar;
      }
    }

    const rawRanking = user.profile?.ranking;
    const numericRanking = typeof rawRanking === 'number'
      ? rawRanking
      : (Number(String(rawRanking).replace(/,/g, '')) || null);

    return res.status(200).json({
      status: 'live',
      data: {
        ranking: Number.isFinite(numericRanking) && numericRanking > 0 ? numericRanking : null,
        submitStats: user.submitStats?.acSubmissionNum || [],
        totalSubmitStats: user.submitStats?.totalSubmissionNum || [],
        calendar: {
          streak: user.userCalendar?.streak || 0,
          totalActiveDays: user.userCalendar?.totalActiveDays || 0,
          submissionCalendar: parsedCalendar
        }
      }
    });
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 500).json({
      status: 'error',
      data: {},
      message: isTimeout ? 'Upstream LeetCode request timed out' : (error.message || 'Failed to fetch LeetCode statistics')
    });
  }
}

