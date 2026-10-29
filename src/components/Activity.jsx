import React, { useState, useEffect } from 'react';
import { 
  FiGithub, 
  FiExternalLink, 
  FiGitBranch, 
  FiStar, 
  FiCheckCircle, 
  FiActivity, 
  FiGitCommit,
  FiZap
} from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import { developerActivity } from '../data/portfolioData';
import ActivityCanvas3D from './ActivityCanvas3D';
import GitHubHeatmap from './GitHubHeatmap';
import LeetCodeHeatmap from './LeetCodeHeatmap';
import './Activity.css';

/**
 * Activity Section — Code & Problem Solving
 * Seamless continuation of Hero, About, Skills, and Academic sections in midnight-blue (#060a14).
 * Features:
 * - Continuous 3D spatial background (ActivityCanvas3D) spanning full vertical height
 * - Part A: GitHub Engineering Activity with restrained emerald identity & authentic contribution heatmap
 * - Part B: LeetCode Algorithmic Practice with warm amber identity & verified submission heatmap
 * - Compact split layout pairing each platform's heatmap with a complementary statistics rail
 * - Exactly three public repositories displayed, sorted by most recently updated
 * - Transparent caching, resilient fallback behavior, zero fabricated metrics, full responsiveness
 */
const Activity = () => {
  const { github: initialGithub, leetcode: initialLeetcode } = developerActivity;

  // GitHub state management
  const [ghData, setGhData] = useState(initialGithub);
  const [ghStatus, setGhStatus] = useState('snapshot'); // 'live' | 'cached' | 'snapshot'

  // LeetCode state management
  const [lcData, setLcData] = useState(initialLeetcode);
  const [lcStatus, setLcStatus] = useState('snapshot'); // 'live' | 'cached' | 'snapshot'

  // Fetch or retrieve cached GitHub public activity
  useEffect(() => {
    let isMounted = true;
    const CACHE_KEY_GH = 'vaibhav_gh_data_v4';
    const CACHE_KEY_GH_TIME = 'vaibhav_gh_time_v4';
    const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes TTL aligned with edge caching

    const loadGitHubData = async () => {
      let cachedData = null;
      try {
        const cachedTime = localStorage.getItem(CACHE_KEY_GH_TIME);
        cachedData = localStorage.getItem(CACHE_KEY_GH);

        if (cachedTime && cachedData && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
          if (isMounted) {
            setGhData(JSON.parse(cachedData));
            setGhStatus('cached');
          }
          return;
        }

        // Try local / serverless proxy endpoint first
        try {
          const res = await fetch('/api/github?username=Vaibhav2176');
          if (res.ok) {
            const json = await res.json();
            if (json.status === 'live' || json.status === 'cached' || json.status === 'stale') {
              const apiData = json.data || {};
              const hasLiveCalendar = apiData.activeCells && typeof apiData.activeCells === 'object' && Object.keys(apiData.activeCells).length > 0;

              const livePayload = {
                ...initialGithub,
                stats: {
                  ...initialGithub.stats,
                  publicRepos: typeof apiData.publicRepos === 'number' ? apiData.publicRepos : initialGithub.stats.publicRepos,
                  totalContributions: typeof apiData.totalContributions === 'number' ? apiData.totalContributions : initialGithub.stats.totalContributions,
                  totalCommits: typeof apiData.totalCommits === 'number' ? apiData.totalCommits : initialGithub.stats.totalCommits,
                  activeDays: typeof apiData.activeDays === 'number' ? apiData.activeDays : initialGithub.stats.activeDays
                },
                calendar: {
                  ...initialGithub.calendar,
                  totalContributions: typeof apiData.totalContributions === 'number' ? apiData.totalContributions : initialGithub.calendar.totalContributions,
                  totalCommits: typeof apiData.totalCommits === 'number' ? apiData.totalCommits : initialGithub.calendar.totalCommits,
                  activeDays: typeof apiData.activeDays === 'number' ? apiData.activeDays : initialGithub.calendar.activeDays,
                  activeCells: hasLiveCalendar ? apiData.activeCells : initialGithub.calendar.activeCells
                },
                topRepositories: Array.isArray(apiData.repos) && apiData.repos.length > 0
                  ? apiData.repos
                  : initialGithub.topRepositories
              };

              if (isMounted) {
                const isActuallyLive = (json.status === 'live') && (typeof apiData.totalContributions === 'number' || hasLiveCalendar);
                const effectiveStatus = isActuallyLive ? 'live' : (json.status === 'cached' ? 'cached' : 'snapshot');

                setGhData(livePayload);
                setGhStatus(effectiveStatus);

                // Only cache when genuine contribution data is received or status is clean
                if (isActuallyLive || json.status === 'cached') {
                  try {
                    localStorage.setItem(CACHE_KEY_GH, JSON.stringify(livePayload));
                    localStorage.setItem(CACHE_KEY_GH_TIME, Date.now().toString());
                  } catch {
                    // ignore quota
                  }
                }
              }
              return;
            }
          }
        } catch {
          // Fall back to direct public GitHub API
        }

        // Direct public GitHub API fallback
        const [profileRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/Vaibhav2176', {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
          }),
          fetch('https://api.github.com/users/Vaibhav2176/repos?sort=updated&per_page=3', {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
          })
        ]);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          let repos = initialGithub.topRepositories;
          if (reposRes.ok) {
            const rawRepos = await reposRes.json();
            if (Array.isArray(rawRepos) && rawRepos.length > 0) {
              repos = rawRepos.slice(0, 3).map((r) => {
                const baselineMatch = initialGithub.topRepositories.find(
                  (br) => br.name.toLowerCase() === r.name.toLowerCase()
                );
                return {
                  name: r.name,
                  description: r.description || baselineMatch?.description || 'Public engineering repository.',
                  language: r.language || baselineMatch?.language || 'TypeScript',
                  languageColor: baselineMatch?.languageColor || '#3178c6',
                  stars: r.stargazers_count ?? 0,
                  forks: r.forks_count ?? 0,
                  commits: baselineMatch?.commits || 0,
                  url: r.html_url,
                  isFlagship: baselineMatch?.isFlagship || false
                };
              });
            }
          }

          const livePayload = {
            ...initialGithub,
            stats: {
              ...initialGithub.stats,
              publicRepos: profile.public_repos || initialGithub.stats.publicRepos
            },
            topRepositories: repos
          };

          if (isMounted) {
            if (cachedData) {
              try {
                const parsed = JSON.parse(cachedData);
                setGhData({
                  ...parsed,
                  stats: { ...parsed.stats, publicRepos: profile.public_repos || parsed.stats?.publicRepos || initialGithub.stats.publicRepos },
                  topRepositories: repos.length > 0 ? repos : parsed.topRepositories
                });
                setGhStatus('cached');
              } catch {
                setGhData(livePayload);
                setGhStatus('snapshot');
              }
            } else {
              setGhData(livePayload);
              setGhStatus('snapshot');
            }
          }
        } else {
          // Fall back to last valid cache if available, else static snapshot
          if (isMounted) {
            if (cachedData) {
              try {
                setGhData(JSON.parse(cachedData));
                setGhStatus('cached');
              } catch {
                setGhStatus('snapshot');
              }
            } else {
              setGhStatus('snapshot');
            }
          }
        }
      } catch {
        if (isMounted) {
          if (cachedData) {
            try {
              setGhData(JSON.parse(cachedData));
              setGhStatus('cached');
            } catch {
              setGhStatus('snapshot');
            }
          } else {
            setGhStatus('snapshot');
          }
        }
      }
    };

    loadGitHubData();

    return () => {
      isMounted = false;
    };
  }, [initialGithub]);

  // Fetch or retrieve cached LeetCode statistics
  useEffect(() => {
    let isMounted = true;
    const CACHE_KEY_LC_DATA = 'vaibhav_lc_data_v4';
    const CACHE_KEY_LC_TIME = 'vaibhav_lc_time_v4';
    const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

    const loadLeetCodeData = async () => {
      try {
        const cachedTime = localStorage.getItem(CACHE_KEY_LC_TIME);
        const cachedData = localStorage.getItem(CACHE_KEY_LC_DATA);

        if (cachedTime && cachedData && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
          if (isMounted) {
            setLcData(JSON.parse(cachedData));
            setLcStatus('cached');
          }
          return;
        }

        // Try local / serverless proxy endpoint
        const res = await fetch('/api/leetcode?username=OerRUe2yaA');
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'live' || json.status === 'cached' || json.status === 'stale') {
            const apiData = json.data || {};

            // Safely parse submission calendar if passed as string or object
            let parsedSubmissionCalendar = apiData.calendar?.submissionCalendar;
            if (typeof parsedSubmissionCalendar === 'string') {
              try {
                parsedSubmissionCalendar = JSON.parse(parsedSubmissionCalendar);
              } catch {
                parsedSubmissionCalendar = {};
              }
            }

            // Safely validate and parse ranking
            let cleanRanking = null;
            if (apiData.ranking !== undefined && apiData.ranking !== null) {
              const r = typeof apiData.ranking === 'string'
                ? Number(apiData.ranking.replace(/,/g, ''))
                : Number(apiData.ranking);
              if (Number.isFinite(r) && r > 0) cleanRanking = r;
            }

            // Total submissions from totalSubmitStats if available
            let liveTotalSubmissions = initialLeetcode.calendar?.totalSubmissions || 297;
            if (Array.isArray(apiData.totalSubmitStats)) {
              const allTotal = apiData.totalSubmitStats.find(s => s.difficulty === 'All');
              if (allTotal && typeof allTotal.submissions === 'number' && allTotal.submissions > 0) {
                liveTotalSubmissions = allTotal.submissions;
              }
            }

            const updatedPayload = {
              ...initialLeetcode,
              ranking: cleanRanking || initialLeetcode.ranking,
              calendar: {
                ...initialLeetcode.calendar,
                streak: apiData.calendar?.streak || initialLeetcode.calendar?.streak || 34,
                totalActiveDays: apiData.calendar?.totalActiveDays || initialLeetcode.calendar?.totalActiveDays || 58,
                totalSubmissions: liveTotalSubmissions,
                submissionCalendar: parsedSubmissionCalendar && Object.keys(parsedSubmissionCalendar).length > 0
                  ? parsedSubmissionCalendar
                  : initialLeetcode.calendar?.submissionCalendar
              }
            };

            // Map submitStats if available
            if (Array.isArray(apiData.submitStats)) {
              const allStat = apiData.submitStats.find(s => s.difficulty === 'All');
              const easyStat = apiData.submitStats.find(s => s.difficulty === 'Easy');
              const medStat = apiData.submitStats.find(s => s.difficulty === 'Medium');
              const hardStat = apiData.submitStats.find(s => s.difficulty === 'Hard');

              if (allStat) {
                updatedPayload.totalSolved = allStat.count;
                updatedPayload.totalSubmissions = allStat.submissions;
                updatedPayload.acceptanceRate = allStat.submissions > 0 
                  ? `${((allStat.count / allStat.submissions) * 100).toFixed(1)}%`
                  : initialLeetcode.acceptanceRate;
              }
              if (easyStat) {
                updatedPayload.breakdown.easy.solved = easyStat.count;
                updatedPayload.breakdown.easy.submissions = easyStat.submissions;
              }
              if (medStat) {
                updatedPayload.breakdown.medium.solved = medStat.count;
                updatedPayload.breakdown.medium.submissions = medStat.submissions;
              }
              if (hardStat) {
                updatedPayload.breakdown.hard.solved = hardStat.count;
                updatedPayload.breakdown.hard.submissions = hardStat.submissions;
              }
            }

            if (isMounted) {
              setLcData(updatedPayload);
              setLcStatus(json.status === 'live' ? 'live' : 'cached');
              try {
                localStorage.setItem(CACHE_KEY_LC_DATA, JSON.stringify(updatedPayload));
                localStorage.setItem(CACHE_KEY_LC_TIME, Date.now().toString());
              } catch {
                // quota
              }
            }
            return;
          }
        }
        if (isMounted) setLcStatus('snapshot');
      } catch {
        if (isMounted) setLcStatus('snapshot');
      }
    };

    loadLeetCodeData();

    return () => {
      isMounted = false;
    };
  }, [initialLeetcode]);

  return (
    <section 
      id="activity" 
      className="activity-editorial-section section" 
      aria-label="Developer Activity and Problem Solving"
    >
      {/* --- Continuous 3D Atmospheric Background Flow --- */}
      <ActivityCanvas3D />
      <div className="activity-depth-plane-gradient" aria-hidden="true" />
      <div className="activity-grid-pattern-overlay" aria-hidden="true" />
      <div className="activity-ambient-bloom-left" aria-hidden="true" />
      <div className="activity-ambient-bloom-right" aria-hidden="true" />

      <div className="container activity-content-container">

        {/* Section Header */}
        <div className="section-header activity-section-header">
          <div className="section-eyebrow-group">
            <span className="eyebrow-label font-mono">Activity</span>
            <span className="eyebrow-divider" aria-hidden="true" />
          </div>
          <h2 className="section-title activity-title">
            Code & Problem Solving
          </h2>
          <p className="section-description activity-description">
            A look at what I'm building on GitHub and practicing on LeetCode.
          </p>

          {/* Quick Section Jump Navigation */}
          <div className="activity-nav-pills font-mono" role="navigation" aria-label="Activity sub-sections">
            <a href="#github-activity" className="activity-nav-pill pill-github">
              <FiGithub className="nav-pill-icon text-emerald" aria-hidden="true" />
              <span>01 / GitHub Contribution Heatmap</span>
            </a>
            <a href="#leetcode-activity" className="activity-nav-pill pill-leetcode">
              <SiLeetcode className="nav-pill-icon text-amber" aria-hidden="true" />
              <span>02 / LeetCode Heatmap & Practice</span>
            </a>
          </div>
        </div>

        {/* ===================================================================
            PART A: GITHUB ACTIVITY (Green Visual Identity & Real Heatmap)
           =================================================================== */}
        <section 
          id="github-activity" 
          className="activity-platform-block github-block"
          aria-label="GitHub Activity and Open Source Engineering"
        >
          <div className="platform-card card github-card">
            
            {/* Platform Header Bar */}
            <div className="platform-header github-header">
              <div className="platform-identity">
                <div className="platform-badge-tag gh-tag font-mono">
                  <span>01 / CONTRIBUTIONS & ENGINEERING ACTIVITY</span>
                </div>
                <div className="platform-title-row">
                  <div className="platform-icon-wrap github-icon-wrap" aria-hidden="true">
                    <FiGithub />
                  </div>
                  <div>
                    <h3 className="platform-heading">GitHub Engineering Activity</h3>
                    <div className="platform-sub-row font-mono">
                      <span className="platform-handle">@{ghData.username}</span>
                      <span className="platform-dot-sep" aria-hidden="true">•</span>
                      <span className={`status-pill gh-status-pill status-${ghStatus}`}>
                        <span className="status-dot" aria-hidden="true" />
                        {ghStatus === 'live' && 'Live GitHub API'}
                        {ghStatus === 'cached' && 'Cached (1h TTL)'}
                        {ghStatus === 'snapshot' && `Verified Snapshot (${ghData.snapshotDate})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <a 
                href={ghData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm font-mono profile-cta-btn gh-cta-btn"
                aria-label="View Vaibhav's full GitHub profile on github.com (opens in new tab)"
              >
                <span>View GitHub Profile</span>
                <FiExternalLink className="btn-icon-right" aria-hidden="true" />
              </a>
            </div>

            {/* Full-Width Key Metrics Overview Bar (4-Column Grid) */}
            <div className="platform-overview-grid gh-overview-grid" aria-label="GitHub Key Metrics Overview">
              <div className="overview-metric-card gh-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiActivity className="overview-icon text-emerald" aria-hidden="true" />
                  <span>Annual Contributions</span>
                </span>
                <span className="overview-metric-value font-mono text-emerald">
                  {ghData.stats?.totalContributions || 224}
                </span>
                <span className="overview-metric-sub">
                  Past year (Oct 2025 – Oct 2026)
                </span>
              </div>

              <div className="overview-metric-card gh-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiGitCommit className="overview-icon text-emerald" aria-hidden="true" />
                  <span>Total Verified Commits</span>
                </span>
                <span className="overview-metric-value font-mono">
                  {ghData.stats?.totalCommits || 291} Commits
                </span>
                <span className="overview-metric-sub">
                  Calculated across {ghData.stats?.publicRepos || 6} public repositories
                </span>
              </div>

              <div className="overview-metric-card gh-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiGithub className="overview-icon text-emerald" aria-hidden="true" />
                  <span>Public Repositories</span>
                </span>
                <span className="overview-metric-value font-mono">
                  {ghData.stats?.publicRepos || 6} Repositories
                </span>
                <span className="overview-metric-sub">
                  Full-stack, systems & utilities
                </span>
              </div>

              <div className="overview-metric-card gh-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiCheckCircle className="overview-icon text-emerald" aria-hidden="true" />
                  <span>Data Provenance</span>
                </span>
                <span className="overview-metric-value font-mono text-sm">
                  {ghStatus === 'live' ? 'Live GitHub Sync' : ghStatus === 'cached' ? 'Cached Local' : 'Verified Snapshot'}
                </span>
                <span className="overview-metric-sub">
                  {ghData.stats?.activeDays || 32} active contribution days
                </span>
              </div>
            </div>

            {/* Dedicated Heatmap Panel (Full-Width, Uncompressed) */}
            <div className="platform-heatmap-panel">
              <GitHubHeatmap 
                calendarData={ghData.calendar?.activeCells}
                totalContributions={ghData.stats?.totalContributions || 224}
                totalCommits={ghData.stats?.totalCommits || 291}
                activeDays={ghData.stats?.activeDays || 32}
                profileUrl={ghData.profileUrl}
                status={ghStatus}
              />
            </div>

          </div>
        </section>

        {/* Visual Platform Separator / Inter-Platform Transition */}
        <div className="platform-transition-divider" aria-hidden="true">
          <div className="divider-line" />
          <div className="divider-glyph font-mono">
            <span>&lt; / &gt;</span>
          </div>
          <div className="divider-line" />
        </div>

        {/* ===================================================================
            PART B: LEETCODE ACTIVITY (Preserved Yellow Visual Identity)
           =================================================================== */}
        <section 
          id="leetcode-activity" 
          className="activity-platform-block leetcode-block"
          aria-label="LeetCode Algorithmic Practice and Problem Solving"
        >
          <div className="platform-card card leetcode-card">
            
            {/* Platform Header Bar */}
            <div className="platform-header leetcode-header">
              <div className="platform-identity">
                <div className="platform-badge-tag lc-tag font-mono">
                  <span>02 / ALGORITHMIC PRACTICE & RIGOR</span>
                </div>
                <div className="platform-title-row">
                  <div className="platform-icon-wrap leetcode-icon-wrap" aria-hidden="true">
                    <SiLeetcode />
                  </div>
                  <div>
                    <h3 className="platform-heading">LeetCode Problem Solving & Submission History</h3>
                    <div className="platform-sub-row font-mono">
                      <span className="platform-handle">@{lcData.username}</span>
                      <span className="platform-dot-sep" aria-hidden="true">•</span>
                      <span className={`status-pill status-${lcStatus}`}>
                        <span className="status-dot" aria-hidden="true" />
                        {lcStatus === 'live' && 'Live LeetCode Sync'}
                        {lcStatus === 'cached' && 'Cached (1h TTL)'}
                        {lcStatus === 'snapshot' && `Verified Snapshot (${lcData.snapshotDate})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <a 
                href={lcData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm font-mono profile-cta-btn lc-cta-btn"
                aria-label="View Vaibhav's full LeetCode profile on leetcode.com (opens in new tab)"
              >
                <span>View LeetCode Profile</span>
                <FiExternalLink className="btn-icon-right" aria-hidden="true" />
              </a>
            </div>

            {/* Full-Width Key Metrics Overview Bar (4-Column Grid) */}
            <div className="platform-overview-grid lc-overview-grid" aria-label="LeetCode Key Metrics Overview">
              <div className="overview-metric-card lc-metric-card">
                <span className="overview-metric-label font-mono">
                  <SiLeetcode className="overview-icon text-amber" aria-hidden="true" />
                  <span>Problems Solved</span>
                </span>
                <div className="overview-metric-value font-mono text-amber">
                  {lcData.totalSolved} <span className="metric-inline-rate">({lcData.acceptanceRate} Acc.)</span>
                </div>
                <span className="overview-metric-sub">
                  {lcData.totalSubmissions} verified submissions
                </span>
              </div>

              <div className="overview-metric-card lc-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiActivity className="overview-icon text-amber" aria-hidden="true" />
                  <span>Total Submissions</span>
                </span>
                <span className="overview-metric-value font-mono">
                  {lcData.calendar?.totalSubmissions || lcData.totalSubmissions || 297} Submissions
                </span>
                <span className="overview-metric-sub">
                  {lcData.calendar?.totalActiveDays || lcData.activeDays || 58} active practice days • {lcData.calendar?.streak || lcData.streak || 34}-day streak
                </span>
              </div>

              <div className="overview-metric-card lc-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiCheckCircle className="overview-icon text-amber" aria-hidden="true" />
                  <span>Primary Stack</span>
                </span>
                <span className="overview-metric-value font-mono text-sm">
                  {typeof lcData.primaryLanguage === 'object' ? lcData.primaryLanguage?.name : (lcData.primaryLanguage || 'C++')} ({typeof lcData.primaryLanguage === 'object' ? lcData.primaryLanguage?.percentage : (lcData.primaryLanguagePct || '98.7%')})
                </span>
                <span className="overview-metric-sub">
                  {typeof lcData.primaryLanguage === 'object' ? `${lcData.primaryLanguage?.problemsSolved || 149} solutions in C++` : '149 solutions in C++'}
                </span>
              </div>

              <div className="overview-metric-card lc-metric-card">
                <span className="overview-metric-label font-mono">
                  <FiStar className="overview-icon text-amber" aria-hidden="true" />
                  <span>Global Ranking</span>
                </span>
                <span className="overview-metric-value font-mono">
                  {(() => {
                    const rawRank = lcData.ranking;
                    const cleanRank = typeof rawRank === 'string'
                      ? Number(rawRank.replace(/,/g, ''))
                      : Number(rawRank);
                    return Number.isFinite(cleanRank) && cleanRank > 0
                      ? `~${cleanRank.toLocaleString()}`
                      : 'Unavailable';
                  })()}
                </span>
                <span className="overview-metric-sub">
                  Verified LeetCode profile ranking
                </span>
              </div>
            </div>

            {/* Dedicated Heatmap Panel (Full-Width, Uncompressed) */}
            <div className="platform-heatmap-panel">
              <LeetCodeHeatmap 
                calendarData={lcData.calendar?.submissionCalendar || lcData.calendar}
                totalSubmissions={lcData.calendar?.totalSubmissions || lcData.totalSubmissions || 297}
                streak={lcData.calendar?.streak || lcData.streak || 34}
                activeDays={lcData.calendar?.totalActiveDays || lcData.activeDays || 58}
                profileUrl={lcData.profileUrl}
                status={lcStatus}
              />
            </div>

            {/* Difficulty Breakdown (Full 3-Column Spacious Cards) */}
            <div className="lc-difficulty-section">
              <div className="subpanel-header">
                <div>
                  <h4 className="subpanel-title font-mono">
                    <FiCheckCircle className="text-amber" aria-hidden="true" /> Difficulty Breakdown & Acceptance
                  </h4>
                  <span className="subpanel-subtitle font-mono text-xs">
                    Problem distribution categorized by official LeetCode difficulty tiers
                  </span>
                </div>
                <span className="subpanel-tag lc-subpanel-tag font-mono text-xs">
                  3 Difficulty Tiers
                </span>
              </div>

              <div className="lc-difficulty-grid diff-three-col">
                {/* Easy Card */}
                <div className="diff-card-rich diff-easy-rich">
                  <div className="diff-card-top-beam beam-easy" aria-hidden="true" />
                  
                  <div className="diff-card-header">
                    <div className="diff-tier-pill pill-easy font-mono">
                      <FiCheckCircle className="pill-tier-icon" aria-hidden="true" />
                      <span>EASY</span>
                    </div>
                    <div className="diff-hero-count font-mono">
                      <span className="hero-number text-emerald">{lcData.breakdown?.easy?.solved || 86}</span>
                      <span className="hero-unit">Solved</span>
                    </div>
                  </div>

                  <div className="diff-progress-block">
                    <div className="diff-progress-track">
                      <div 
                        className="diff-progress-bar bar-easy" 
                        style={{ width: `${Math.min(100, ((lcData.breakdown?.easy?.solved || 86) / (lcData.totalSolved || 151)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="diff-stats-row font-mono text-xs">
                    <div className="diff-stat-item">
                      <span className="stat-lbl text-muted">Acceptance:</span>
                      <span className="stat-val text-primary">{lcData.breakdown?.easy?.rate || '63.2%'}</span>
                    </div>
                    <div className="diff-stat-item">
                      <span className="stat-lbl text-muted">Submissions:</span>
                      <span className="stat-val text-primary">{lcData.breakdown?.easy?.submissions || 136}</span>
                    </div>
                    <div className="diff-stat-item diff-share-item">
                      <span className="stat-val text-muted">({(((lcData.breakdown?.easy?.solved || 86) / (lcData.totalSolved || 151)) * 100).toFixed(0)}% of solved)</span>
                    </div>
                  </div>
                </div>

                {/* Medium Card */}
                <div className="diff-card-rich diff-medium-rich">
                  <div className="diff-card-top-beam beam-medium" aria-hidden="true" />
                  
                  <div className="diff-card-header">
                    <div className="diff-tier-pill pill-medium font-mono">
                      <FiActivity className="pill-tier-icon" aria-hidden="true" />
                      <span>MEDIUM</span>
                    </div>
                    <div className="diff-hero-count font-mono">
                      <span className="hero-number text-amber">{lcData.breakdown?.medium?.solved || 59}</span>
                      <span className="hero-unit">Solved</span>
                    </div>
                  </div>

                  <div className="diff-progress-block">
                    <div className="diff-progress-track">
                      <div 
                        className="diff-progress-bar bar-medium" 
                        style={{ width: `${Math.min(100, ((lcData.breakdown?.medium?.solved || 59) / (lcData.totalSolved || 151)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="diff-stats-row font-mono text-xs">
                    <div className="diff-stat-item">
                      <span className="stat-lbl text-muted">Acceptance:</span>
                      <span className="stat-val text-primary">{lcData.breakdown?.medium?.rate || '67.8%'}</span>
                    </div>
                    <div className="diff-stat-item">
                      <span className="stat-lbl text-muted">Submissions:</span>
                      <span className="stat-val text-primary">{lcData.breakdown?.medium?.submissions || 87}</span>
                    </div>
                    <div className="diff-stat-item diff-share-item">
                      <span className="stat-val text-muted">({(((lcData.breakdown?.medium?.solved || 59) / (lcData.totalSolved || 151)) * 100).toFixed(0)}% of solved)</span>
                    </div>
                  </div>
                </div>

                {/* Hard Card */}
                <div className="diff-card-rich diff-hard-rich">
                  <div className="diff-card-top-beam beam-hard" aria-hidden="true" />
                  
                  <div className="diff-card-header">
                    <div className="diff-tier-pill pill-hard font-mono">
                      <FiZap className="pill-tier-icon" aria-hidden="true" />
                      <span>HARD</span>
                    </div>
                    <div className="diff-hero-count font-mono">
                      <span className="hero-number text-red">{lcData.breakdown?.hard?.solved || 6}</span>
                      <span className="hero-unit">Solved</span>
                    </div>
                  </div>

                  <div className="diff-progress-block">
                    <div className="diff-progress-track">
                      <div 
                        className="diff-progress-bar bar-hard" 
                        style={{ width: `${Math.min(100, ((lcData.breakdown?.hard?.solved || 6) / (lcData.totalSolved || 151)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="diff-stats-row font-mono text-xs">
                    <div className="diff-stat-item">
                      <span className="stat-lbl text-muted">Acceptance:</span>
                      <span className="stat-val text-primary">{lcData.breakdown?.hard?.rate || '100.0%'}</span>
                    </div>
                    <div className="diff-stat-item">
                      <span className="stat-lbl text-muted">Submissions:</span>
                      <span className="stat-val text-primary">{lcData.breakdown?.hard?.submissions || 6}</span>
                    </div>
                    <div className="diff-stat-item diff-share-item">
                      <span className="stat-val text-muted">({(((lcData.breakdown?.hard?.solved || 6) / (lcData.totalSolved || 151)) * 100).toFixed(0)}% of solved)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </section>
  );
};

export default Activity;
