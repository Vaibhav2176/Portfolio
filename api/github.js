/**
 * Vercel Serverless & Express compatible handler for GitHub profile metrics
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set edge caching headers for CDN / serverless edge
  res.setHeader?.('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const username = req.query?.username || 'Vaibhav2176';

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        signal: AbortSignal.timeout(5000)
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        signal: AbortSignal.timeout(5000)
      })
    ]);

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({
        status: 'stale',
        data: {},
        message: 'Upstream GitHub rate limit or error'
      });
    }

    const profile = await profileRes.json();
    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    return res.status(200).json({
      status: 'live',
      data: {
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
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

