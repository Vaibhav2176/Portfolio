/**
 * Vercel Serverless & Express compatible handler for GitHub profile metrics
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set edge caching headers for CDN / serverless edge (30-min fresh, 24-hr stale-while-revalidate)
  res.setHeader?.('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');

  const username = req.query?.username || 'Vaibhav2176';

  try {
    const [profileRes, reposRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        signal: AbortSignal.timeout(6000)
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        signal: AbortSignal.timeout(6000)
      }).catch(err => {
        if (err.name === 'TimeoutError' || err.name === 'AbortError') throw err;
        return { ok: false, error: err };
      }),
      fetch(`https://github.com/users/${username}/contributions`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        signal: AbortSignal.timeout(6000)
      }).catch(err => {
        if (err.name === 'TimeoutError' || err.name === 'AbortError') throw err;
        return { ok: false, error: err };
      })
    ]);

    if (!profileRes.ok && !contribRes.ok) {
      const status = profileRes.status || contribRes.status || 500;
      return res.status(status === 404 ? 404 : 502).json({
        status: 'stale',
        data: {},
        message: status === 404 ? 'User profile not found' : 'Upstream GitHub rate limit or network error'
      });
    }

    if (profileRes.status === 404) {
      return res.status(404).json({
        status: 'stale',
        data: {},
        message: 'User profile not found'
      });
    }

    let profile = {};
    if (profileRes.ok) {
      try {
        profile = await profileRes.json();
      } catch {
        profile = {};
      }
    }

    let repos = [];
    if (reposRes.ok) {
      try {
        repos = await reposRes.json();
      } catch {
        repos = [];
      }
    }

    let totalContributions = null;
    let activeDays = null;
    const activeCells = {};

    if (contribRes.ok) {
      try {
        const html = await contribRes.text();

        // 1. Parse annual contributions count
        const totalMatch = html.match(/([0-9,]+)\s+contributions\s+in\s+the\s+last\s+year/i);
        if (totalMatch) {
          totalContributions = parseInt(totalMatch[1].replace(/,/g, ''), 10);
        }

        // 2. Extract tool-tip element contents indexed by element id
        const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
        const tooltipMap = {};
        let m;
        while ((m = tooltipRegex.exec(html)) !== null) {
          tooltipMap[m[1]] = m[2].trim();
        }

        // 3. Extract calendar day table cells with data-date
        const tdRegex = /<td[^>]+data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
        let daysWithContributions = 0;
        let sumFromCells = 0;

        while ((m = tdRegex.exec(html)) !== null) {
          const fullTag = m[0];
          const date = m[1];
          const levelMatch = fullTag.match(/data-level="(\d+)"/);
          const idMatch = fullTag.match(/id="([^"]+)"/);
          const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
          const id = idMatch ? idMatch[1] : null;

          let count = 0;
          if (id && tooltipMap[id]) {
            const countMatch = tooltipMap[id].match(/^([0-9,]+)\s+contribution/i);
            if (countMatch) {
              count = parseInt(countMatch[1].replace(/,/g, ''), 10);
            }
          }

          // Fallback to data-level if tooltip count was unparseable
          if (count === 0 && level > 0) {
            count = level;
          }

          if (count > 0 || level > 0) {
            daysWithContributions++;
            sumFromCells += count;
            activeCells[date] = { count, level };
          }
        }

        activeDays = daysWithContributions;
        if (totalContributions === null && sumFromCells > 0) {
          totalContributions = sumFromCells;
        }
      } catch {
        // Continue with whatever data was parsed
      }
    }

    const hasLiveContributions = typeof totalContributions === 'number' && Object.keys(activeCells).length > 0;
    const isLive = Boolean(profileRes.ok && contribRes.ok && hasLiveContributions);

    return res.status(200).json({
      status: isLive ? 'live' : 'stale',
      data: {
        publicRepos: typeof profile.public_repos === 'number' ? profile.public_repos : null,
        followers: typeof profile.followers === 'number' ? profile.followers : null,
        following: typeof profile.following === 'number' ? profile.following : null,
        totalContributions: typeof totalContributions === 'number' ? totalContributions : null,
        activeDays: typeof activeDays === 'number' ? activeDays : null,
        activeCells,
        repos: Array.isArray(repos) ? repos.slice(0, 3).map(r => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          url: r.html_url
        })) : []
      }
    });
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 500).json({
      status: 'error',
      data: {},
      message: isTimeout ? 'Upstream GitHub request timed out' : (error.message || 'Failed to fetch GitHub statistics')
    });
  }
}

