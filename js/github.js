// ── GITHUB REPOS LOADER ──
const GITHUB_USER = 'KingKatal';

// Manual project data as fallback / enhancement
const manualProjects = [
  {
    name: 'business-intelligence-dashboard',
    description: 'A full Business Intelligence Dashboard with data pipeline, KPI reporting, and interactive visualisations built with Python and web technologies.',
    topics: ['Python', 'BI', 'Data Analysis', 'Dashboard'],
    html_url: 'https://github.com/KingKatal/business-intelligence-dashboard',
    icon: 'i-chart',
    featured: true
  },
  {
    name: 'KataFarm',
    description: 'Smart agricultural information system for small-scale Malawian farmers. Combines GIS data, field inputs, and real-time guidance for better yields.',
    topics: ['Python', 'Flask', 'GIS', 'Agriculture', 'Mobile'],
    html_url: 'https://github.com/KingKatal',
    icon: 'i-leaf',
    featured: true
  }
];

function iconForRepo(name, topics = []) {
  const n = name.toLowerCase();
  const t = topics.map(x => x.toLowerCase()).join(' ');
  if (n.includes('farm') || t.includes('agri'))       return 'i-leaf';
  if (n.includes('dashboard') || t.includes('bi'))     return 'i-chart';
  if (n.includes('gis') || t.includes('map'))          return 'i-map';
  if (n.includes('web') || t.includes('html'))         return 'i-globe';
  if (n.includes('data') || t.includes('python'))      return 'i-code';
  if (n.includes('design') || t.includes('graphic'))   return 'i-palette';
  if (n.includes('security') || t.includes('cyber'))   return 'i-lock';
  if (n.includes('api') || t.includes('backend'))      return 'i-server';
  return 'i-monitor';
}

// Renders an icon from the inline SVG sprite in index.html
const svgIcon = (id, cls = '') => `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;

function buildProjectCard(repo) {
  const icon   = repo.icon || iconForRepo(repo.name, repo.topics || []);
  const name   = repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const tags   = (repo.topics || []).slice(0, 5)
    .map(t => `<span class="tag">${t}</span>`).join('');
  const stars  = repo.stargazers_count
    ? `<div class="project-stars">${svgIcon('i-star', 'icon-fill')} ${repo.stargazers_count}</div>`
    : '';
  const lang   = repo.language ? `<span class="tag">${repo.language}</span>` : '';

  return `
    <article class="project-card reveal">
      <div class="project-header">
        <div class="project-header-glow"></div>
        <div class="project-header-icon">${svgIcon(icon)}</div>
      </div>
      <div class="project-body">
        <h3 class="project-name">${name}</h3>
        <p class="project-desc">${repo.description || 'A project by Gomezgani Chirwa — KataTech Solutions.'}</p>
        <div class="project-tags">${tags}${lang}</div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link primary">
            View on GitHub ${svgIcon('i-arrow')}
          </a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="project-link secondary">Live Demo ${svgIcon('i-external')}</a>` : ''}
        </div>
        ${stars}
      </div>
    </article>
  `;
}

async function loadGithubRepos() {
  const grid   = document.getElementById('projects-grid');
  const loader = document.getElementById('github-loader');

  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`);
    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) throw new Error('No repos');

    const filtered = repos
      .filter(r => !r.fork && r.name !== `${GITHUB_USER}`)
      .slice(0, 6);

    // Merge manual featured projects if not already present
    const allProjects = [...filtered];
    manualProjects.forEach(mp => {
      if (!filtered.find(r => r.name.toLowerCase() === mp.name.toLowerCase())) {
        allProjects.unshift(mp);
      }
    });

    // Ensure the spotlight always has featured slides available
    const spotlightFeed = [...manualProjects, ...allProjects];

    loader.style.display = 'none';
    grid.innerHTML = allProjects.slice(0, 6).map(buildProjectCard).join('');

    // Re-observe new cards
    const newCards = grid.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
    }, { threshold: 0.1 });
    newCards.forEach(c => obs.observe(c));

    // Populate the featured spotlight carousel
    if (window.initSpotlight) window.initSpotlight(spotlightFeed);

  } catch (err) {
    // Fallback to manual projects
    loader.style.display = 'none';
    grid.innerHTML = manualProjects.map(buildProjectCard).join('');

    const fallbackCards = grid.querySelectorAll('.reveal');
    fallbackCards.forEach(c => c.classList.add('visible'));

    if (window.initSpotlight) window.initSpotlight(manualProjects);
  }
}

document.addEventListener('DOMContentLoaded', loadGithubRepos);
