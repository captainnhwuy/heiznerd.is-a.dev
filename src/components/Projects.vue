<template>
  <section id="projects" class="projects">
    <div class="container">
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <p class="section-subtitle" v-if="t.headerSubtitle || t.description">{{ t.headerSubtitle || t.description }}</p>
      </div>

      <div class="projects-grid">
        <div
          v-for="(project, index) in projectsList"
          :key="project.key"
          class="project-card md-card drift from-bottom"
          :style="{ transitionDelay: `${index * 120}ms` }"
        >
          <!-- Color accent strip -->
          <div class="card-accent" :style="{ background: project.accentColor }"></div>

          <!-- Header -->
          <div class="card-head">
            <div class="card-icon" :style="{ color: project.iconColor }">
              <i :class="project.icon"></i>
            </div>
            <div class="card-titles">
              <h3 class="project-name">{{ t[project.key].name }}</h3>
            </div>
            <div class="status-chip" :class="project.status === 'live' ? 'status-live' : 'status-beta'">
              <span class="status-dot"></span>
              {{ project.status === 'live' ? 'LIVE' : 'BETA' }}
            </div>
          </div>

          <!-- Description -->
          <p class="project-desc">{{ t[project.key].desc }}</p>

          <!-- Tech stack -->
          <div class="tech-ribbon">
            <span v-for="tech in project.tech" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>

          <!-- GitHub stats (if fetched) -->
          <div class="gh-stats" v-if="ghStats[project.repoName]">
            <span class="gh-stat">
              <i class="fas fa-star"></i>
              {{ ghStats[project.repoName].stars ?? 0 }}
            </span>
            <span class="gh-stat">
              <i class="fas fa-code-branch"></i>
              {{ ghStats[project.repoName].forks ?? 0 }}
            </span>
            <span class="gh-stat gh-lang" v-if="ghStats[project.repoName].language">
              <i class="fas fa-circle" style="font-size:0.5rem"></i>
              {{ ghStats[project.repoName].language }}
            </span>
          </div>

          <!-- Action button -->
          <a :href="project.link" target="_blank" rel="noopener" class="md-btn md-btn-outlined project-btn">
            <i :class="project.status === 'live' ? 'fas fa-external-link-alt' : 'fab fa-discord'"></i>
            <span>{{ project.status === 'live' ? t.visit : t.invite }}</span>
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  overflow: hidden;
}

/* Accent strip at top */
.card-accent {
  height: 4px;
  width: 100%;
  opacity: 0.8;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 0;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--md-radius-md);
  background: var(--md-surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.card-titles { flex: 1; }

.project-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--md-on-surface);
}

/* Status chip */
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--md-radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.status-live {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.12);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-beta {
  color: #ffc107;
  background: rgba(255, 193, 7, 0.12);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.project-desc {
  font-size: 0.9rem;
  color: var(--md-on-surface-var);
  line-height: 1.65;
  padding: 0 20px;
  flex: 1;
}

/* Tech ribbon */
.tech-ribbon {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 20px;
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

/* GitHub stats */
.gh-stats {
  display: flex;
  gap: 16px;
  padding: 0 20px;
  border-top: 1px solid var(--md-outline-var);
  padding-top: 12px;
}

.gh-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--md-on-surface-var);
  font-family: var(--font-mono);
}

.gh-stat i { color: var(--md-primary); font-size: 0.75rem; }
.gh-lang i { color: #61dafb; }

/* Action button */
.project-btn {
  margin: 0 20px 20px;
  justify-content: center;
}

@media (max-width: 640px) {
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
