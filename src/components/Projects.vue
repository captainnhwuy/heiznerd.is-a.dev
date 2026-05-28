<template>
  <section id="projects" class="projects">
    <div class="container">
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <p class="section-subtitle" v-if="t.headerSubtitle || t.description">{{ t.headerSubtitle || t.description }}</p>
      </div>

      <!-- Asymmetric layout: Featured Hero Project -->
      <div v-if="projectsList.length > 0" class="project-hero-wrap">
        <div class="project-hero-card md-card drift from-bottom">
          <!-- Left side: details -->
          <div class="hero-card-details">
            <div class="card-accent" :style="{ background: projectsList[0].accentColor }"></div>
            
            <div class="card-head">
              <div class="card-icon" :style="{ color: projectsList[0].iconColor }">
                <i :class="projectsList[0].icon"></i>
              </div>
              <div class="card-titles">
                <span class="featured-badge">{{ t.featured || 'FEATURED PROJECT' }}</span>
                <h3 class="project-name">{{ t[projectsList[0].key].name }}</h3>
              </div>
              <div class="status-chip status-live">
                <span class="status-dot"></span>
                LIVE
              </div>
            </div>

            <p class="project-desc">{{ t[projectsList[0].key].desc }}</p>

            <div class="tech-ribbon">
              <span v-for="tech in projectsList[0].tech" :key="tech" class="tech-tag">{{ tech }}</span>
            </div>

            <!-- GitHub stats -->
            <div class="gh-stats" v-if="ghStats[projectsList[0].repoName]">
              <span class="gh-stat">
                <i class="fas fa-star"></i>
                {{ ghStats[projectsList[0].repoName].stars ?? 0 }}
              </span>
              <span class="gh-stat">
                <i class="fas fa-code-branch"></i>
                {{ ghStats[projectsList[0].repoName].forks ?? 0 }}
              </span>
              <span class="gh-stat gh-lang" v-if="ghStats[projectsList[0].repoName].language">
                <i class="fas fa-circle" style="font-size:0.5rem"></i>
                {{ ghStats[projectsList[0].repoName].language }}
              </span>
            </div>

            <a :href="projectsList[0].link" target="_blank" rel="noopener" class="md-btn md-btn-filled project-btn">
              <i class="fas fa-external-link-alt"></i>
              <span>{{ t.visit }}</span>
            </a>
          </div>

          <!-- Right side: abstract/mockup visualizer -->
          <div class="hero-card-visual">
            <div class="mockup-browser">
              <div class="browser-bar">
                <span class="browser-dot red"></span>
                <span class="browser-dot yellow"></span>
                <span class="browser-dot green"></span>
                <span class="browser-url">nekocomics.xyz</span>
              </div>
              <div class="browser-content">
                <i class="fas fa-book-open browser-mock-icon"></i>
                <div class="browser-mock-skeleton">
                  <div class="skeleton-line title"></div>
                  <div class="skeleton-line text"></div>
                  <div class="skeleton-line text short"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Projects Grid -->
      <div class="projects-secondary-grid">
        <div
          v-for="(project, index) in projectsList.slice(1)"
          :key="project.key"
          class="project-card md-card drift from-bottom"
          :style="{ transitionDelay: `${index * 120}ms` }"
        >
          <div class="card-accent" :style="{ background: project.accentColor }"></div>

          <div class="card-head">
            <div class="card-icon" :style="{ color: project.iconColor }">
              <i :class="project.icon"></i>
            </div>
            <div class="card-titles">
              <h3 class="project-name">{{ t[project.key].name }}</h3>
            </div>
            <div class="status-chip status-beta">
              <span class="status-dot"></span>
              {{ project.status.toUpperCase() }}
            </div>
          </div>

          <p class="project-desc">{{ t[project.key].desc }}</p>

          <div class="tech-ribbon">
            <span v-for="tech in project.tech" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>

          <a :href="project.link" target="_blank" rel="noopener" class="md-btn md-btn-outlined project-btn">
            <i class="fab fa-discord"></i>
            <span>{{ t.invite }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].projects;

const ghStats = ref({});

const projectsList = [
  {
    key: 'nekocomics',
    repoName: 'NekoComics',
    icon: 'fas fa-book-open',
    iconColor: '#BB86FC',
    accentColor: 'linear-gradient(90deg, #BB86FC, #9965D8)',
    status: 'live',
    tech: ['Vue.js', 'Ruby on Rails', 'PostgreSQL', 'Redis'],
    link: 'https://nekocomics.xyz/',
  },
  {
    key: 'mugi',
    repoName: null,
    icon: 'fas fa-robot',
    iconColor: '#5865f2',
    accentColor: 'linear-gradient(90deg, #5865f2, #3a4bc4)',
    status: 'beta',
    tech: ['JavaScript', 'Discord.js', 'Node.js'],
    link: 'https://discord.com/oauth2/authorize?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot',
  },
  {
    key: 'truycap',
    repoName: null,
    icon: 'fas fa-link',
    iconColor: '#03DAC6',
    accentColor: 'linear-gradient(90deg, #03DAC6, #00897B)',
    status: 'live',
    tech: ['Vue.js', 'DNS', 'Web'],
    link: 'https://truycapnekocomics.site/',
  },
];

const fetchGhStats = async (repoName) => {
  if (!repoName) return;
  try {
    const res = await fetch(`https://api.github.com/repos/captainnhwuy/${repoName}`);
    if (!res.ok) return;
    const data = await res.json();
    ghStats.value[repoName] = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
    };
  } catch { /* silent fallback */ }
};

onMounted(() => {
  projectsList.forEach(p => { if (p.repoName) fetchGhStats(p.repoName); });
});
</script>

<style scoped>
.projects { background: transparent; }

.projects-grid,
.project-hero-wrap {
  margin-top: 48px;
}

/* Asymmetric Hero Card */
.project-hero-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  padding: 0;
  overflow: hidden;
  box-shadow: var(--md-shadow-2);
}

.hero-card-details {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

/* Accent strip top */
.card-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  opacity: 0.9;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 46px;
  height: 46px;
  border-radius: var(--md-radius-md);
  background: var(--md-surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.05);
}

.card-titles {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.featured-badge {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--md-primary);
  letter-spacing: 0.08em;
}

.project-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--md-on-surface);
}

/* Status badge */
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--md-radius-full);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: statusPulse 2.2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}

.status-live {
  color: oklch(78% 0.12 140);
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.22);
}

.status-beta {
  color: oklch(80% 0.12 80);
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.22);
}

.project-desc {
  font-size: 0.92rem;
  color: var(--md-on-surface-var);
  line-height: 1.65;
}

/* Tech tag ribbon */
.tech-ribbon {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  padding: 4px 10px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-full);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--md-on-surface-var);
}

/* Github stats */
.gh-stats {
  display: flex;
  gap: 16px;
  border-top: 1px solid var(--md-outline-var);
  padding-top: 14px;
}

.gh-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--md-on-surface-var);
  font-family: var(--font-mono);
}

.gh-stat i { color: var(--md-primary); font-size: 0.75rem; }
.gh-lang i { color: var(--md-secondary); }

.project-btn {
  justify-content: center;
  align-self: flex-start;
  margin-top: 8px;
}

/* Visualizer Mockup Panel */
.hero-card-visual {
  background: linear-gradient(135deg, rgba(187, 134, 252, 0.04), rgba(3, 218, 198, 0.04));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border-left: 1px solid var(--md-outline-var);
  position: relative;
}

.mockup-browser {
  width: 100%;
  max-width: 280px;
  background: var(--md-surface);
  border: 1px solid var(--md-outline);
  border-radius: 12px;
  box-shadow: var(--md-shadow-3);
  overflow: hidden;
}

.browser-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--md-surface-container);
  border-bottom: 1px solid var(--md-outline-var);
}

.browser-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.browser-dot.red { background: #ff5f56; }
.browser-dot.yellow { background: #ffbd2e; }
.browser-dot.green { background: #27c93f; }

.browser-url {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--md-on-surface-var);
  margin-left: 8px;
  opacity: 0.8;
}

.browser-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 120px;
  justify-content: center;
}

.browser-mock-icon {
  font-size: 2.2rem;
  color: var(--md-primary);
  animation: mockPulse 3s ease-in-out infinite;
}

@keyframes mockPulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px transparent); }
  50%       { transform: scale(1.08); filter: drop-shadow(0 0 8px rgba(187, 134, 252, 0.25)); }
}

.browser-mock-skeleton {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.skeleton-line {
  height: 6px;
  background: var(--md-surface-container);
  border-radius: 4px;
}

.skeleton-line.title {
  width: 60%;
  height: 8px;
  background: var(--md-outline);
}

.skeleton-line.text {
  width: 80%;
}

.skeleton-line.text.short {
  width: 45%;
}

/* Secondary Grid layout */
.projects-secondary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.projects-secondary-grid .project-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.projects-secondary-grid .project-btn {
  margin-top: auto;
  width: 100%;
}

@media (max-width: 768px) {
  .project-hero-card {
    grid-template-columns: 1fr;
  }
  .hero-card-visual {
    border-left: none;
    border-top: 1px solid var(--md-outline-var);
    padding: 24px;
  }
  .projects-secondary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
