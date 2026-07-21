<template>
  <section id="projects" class="projects">
    <div class="container">
      <header class="projects-heading drift from-top">
        <div>
          <span class="section-eyebrow">{{ t.label }}</span>
          <h2 class="section-title">{{ t.title }}</h2>
          <p class="section-subtitle">{{ t.headerSubtitle }}</p>
        </div>
        <span class="projects-index" aria-hidden="true">04 — SELECTED WORK</span>
      </header>

      <div class="featured-grid">
        <article
          v-for="(project, index) in projects"
          :key="project.key"
          class="project-card drift from-bottom"
          :style="{ '--accent': project.color, transitionDelay: `${index * 120}ms` }"
        >
          <header class="project-head">
            <span class="project-number">0{{ index + 1 }}</span>
            <span class="project-icon" aria-hidden="true"><i :class="project.icon"></i></span>
            <div>
              <span class="project-kicker">{{ t.featured }}</span>
              <h3>{{ t[project.key].name }}</h3>
            </div>
            <span class="project-status">{{ t[project.key].status }}</span>
          </header>

          <p class="project-description">{{ t[project.key].description }}</p>

          <div class="project-stack">
            <span>{{ t.stackLabel }}</span>
            <ul>
              <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
            </ul>
          </div>

          <div v-if="project.command" class="install-command">
            <span>{{ t.install }}</span>
            <code>{{ project.command }}</code>
          </div>

          <footer class="project-footer">
            <span>{{ t[project.key].meta }}</span>
            <a :href="project.link" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github" aria-hidden="true"></i>
              <span>{{ t.source }}</span>
              <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </footer>
        </article>
      </div>

      <section class="current-work drift from-bottom" :aria-labelledby="`${t.currentWorkTitle}-title`">
        <header class="work-heading">
          <div>
            <span class="work-kicker">05 — CURRENT WORK</span>
            <h3 :id="`${t.currentWorkTitle}-title`">{{ t.currentWorkTitle }}</h3>
          </div>
          <p>{{ t.currentWorkSubtitle }}</p>
        </header>

        <div class="work-list drift-stagger">
          <article v-for="(role, index) in workRoles" :key="role.key" class="work-role drift from-bottom">
            <span class="work-number">0{{ index + 1 }}</span>
            <span class="work-icon" aria-hidden="true"><i :class="role.icon"></i></span>
            <div class="work-copy">
              <span>{{ t.active }}</span>
              <h4>{{ t[role.key].name }}</h4>
              <p>{{ t[role.key].description }}</p>
            </div>
            <a v-if="role.link" :href="role.link" target="_blank" rel="noopener noreferrer" :aria-label="`${t.visit} ${t[role.key].name}`">
              <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, inject } from 'vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].projects);

const projects = [
  {
    key: 'nekocomics',
    icon: 'fas fa-book-open',
    color: '#b58ce8',
    stack: ['Vue', 'Vite', 'Rails', 'PostgreSQL', 'Redis', 'Node'],
    link: 'https://github.com/nekoo-moe/NekoComics-Rework',
  },
  {
    key: 'nekostream',
    icon: 'fas fa-terminal',
    color: '#79c8b5',
    stack: ['Node'],
    command: 'npm install -g nekostream',
    link: 'https://github.com/nekoo-moe/NekoStream-CLI',
  },
];

const workRoles = [
  { key: 'nekotech', icon: 'fas fa-building', link: null },
  { key: 'langbang', icon: 'fas fa-cube', link: 'https://langbangvn.net' },
];
</script>

<style scoped>
.projects { background: transparent; }
.projects-heading,
.project-head,
.project-footer,
.work-heading,
.work-role { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.projects-index,
.project-number,
.project-kicker,
.work-kicker,
.work-number,
.work-copy > span,
.project-stack > span,
.install-command > span { color: var(--md-on-surface-var); font-family: var(--font-mono); font-size: 0.61rem; letter-spacing: 0.13em; text-transform: uppercase; }

.featured-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 52px; }
.project-card { position: relative; display: flex; min-width: 0; min-height: 470px; flex-direction: column; gap: 26px; padding: clamp(26px, 3.5vw, 38px); overflow: hidden; border: 1px solid var(--md-outline-var); border-radius: var(--md-radius-xl); background: rgba(15, 15, 18, 0.67); box-shadow: var(--md-shadow-2); backdrop-filter: blur(14px); transition: transform 300ms var(--md-ease-spring), border-color 300ms ease, background 300ms ease; }
.project-card::before { content: ''; position: absolute; inset: 0 0 auto; height: 2px; background: linear-gradient(90deg, var(--accent), transparent 72%); }
.project-card::after { content: ''; position: absolute; width: 220px; height: 220px; top: -150px; right: -110px; border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent); border-radius: 50%; box-shadow: 0 0 0 28px color-mix(in srgb, var(--accent) 3%, transparent); pointer-events: none; }
.project-card:hover { border-color: color-mix(in srgb, var(--accent) 38%, transparent); background: rgba(23, 20, 28, 0.78); transform: translateY(-5px); }
.project-head { justify-content: flex-start; }
.project-head > div { flex: 1; min-width: 0; }
.project-number { align-self: flex-start; color: color-mix(in srgb, var(--accent) 62%, transparent); }
.project-icon { display: grid; width: 46px; height: 46px; flex: 0 0 auto; place-items: center; border: 1px solid color-mix(in srgb, var(--accent) 34%, transparent); border-radius: 13px; color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent); }
.project-kicker { display: block; margin-bottom: 4px; color: var(--accent); }
.project-head h3 { color: var(--md-on-surface); font-size: 1.32rem; letter-spacing: -0.025em; }
.project-status { align-self: flex-start; flex: 0 0 auto; padding: 5px 10px; border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); border-radius: 100px; color: var(--accent); background: color-mix(in srgb, var(--accent) 7%, transparent); font-size: 0.62rem; }
.project-description { color: var(--md-on-surface-var); font-size: 0.91rem; line-height: 1.75; }
.project-stack > span { display: block; margin-bottom: 11px; }
.project-stack ul { display: flex; flex-wrap: wrap; gap: 7px; padding: 0; list-style: none; }
.project-stack li { padding: 6px 10px; border: 1px solid var(--md-outline-var); border-radius: 9px; color: var(--md-on-surface-var); background: rgba(255,255,255,.018); font-family: var(--font-mono); font-size: 0.66rem; }
.install-command { display: grid; gap: 9px; padding: 13px 15px; border: 1px solid var(--md-outline-var); border-radius: var(--md-radius-md); background: rgba(0,0,0,.18); }
.install-command code { color: var(--md-secondary); font-family: var(--font-mono); font-size: 0.75rem; user-select: all; }
.project-footer { margin-top: auto; padding-top: 19px; border-top: 1px solid var(--md-outline-var); }
.project-footer > span { color: var(--md-on-surface-var); font-size: 0.7rem; }
.project-footer a { display: inline-flex; align-items: center; gap: 8px; min-height: 38px; padding: 8px 12px; border: 1px solid color-mix(in srgb, var(--accent) 36%, transparent); border-radius: 100px; color: var(--accent); text-decoration: none; font-size: 0.7rem; transition: transform 220ms var(--md-ease-spring), background 220ms ease; }
.project-footer a:hover,
.project-footer a:focus-visible { background: color-mix(in srgb, var(--accent) 8%, transparent); outline: none; transform: translateY(-2px); }

.current-work { margin-top: 18px; padding: clamp(28px, 4vw, 42px); border: 1px solid var(--md-outline-var); border-radius: var(--md-radius-xl); background: rgba(15,15,18,.6); backdrop-filter: blur(14px); }
.work-heading { align-items: flex-end; }
.work-heading h3 { margin-top: 6px; color: var(--md-on-surface); font-size: clamp(1.5rem, 3vw, 2.2rem); letter-spacing: -.04em; }
.work-heading > p { max-width: 330px; color: var(--md-on-surface-var); font-size: .8rem; line-height: 1.6; text-align: right; }
.work-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); margin-top: 30px; border-top: 1px solid var(--md-outline-var); }
.work-role { position: relative; justify-content: flex-start; min-width: 0; padding: 24px 22px; }
.work-role + .work-role { border-left: 1px solid var(--md-outline-var); }
.work-number { color: rgba(187,134,252,.38); }
.work-icon { display: grid; width: 38px; height: 38px; flex: 0 0 auto; place-items: center; border: 1px solid rgba(187,134,252,.2); border-radius: 50%; color: var(--md-primary); background: rgba(187,134,252,.055); }
.work-copy { flex: 1; min-width: 0; }
.work-copy > span { color: var(--md-secondary); }
.work-copy h4 { margin-top: 4px; color: var(--md-on-surface); font-size: .98rem; }
.work-copy p { margin-top: 5px; color: var(--md-on-surface-var); font-size: .78rem; line-height: 1.55; }
.work-role > a { display: grid; width: 36px; height: 36px; flex: 0 0 auto; place-items: center; border: 1px solid var(--md-outline-var); border-radius: 50%; color: var(--md-on-surface-var); text-decoration: none; transition: color 220ms ease, border-color 220ms ease, transform 220ms var(--md-ease-spring); }
.work-role > a:hover,
.work-role > a:focus-visible { border-color: var(--md-primary); color: var(--md-primary); outline: none; transform: translate(2px,-2px); }

@media (max-width: 820px) {
  .featured-grid,
  .work-list { grid-template-columns: 1fr; }
  .project-card { min-height: 0; }
  .work-role + .work-role { border-top: 1px solid var(--md-outline-var); border-left: 0; }
}
@media (max-width: 560px) {
  .projects-heading,
  .project-head,
  .project-footer,
  .work-heading { align-items: flex-start; flex-wrap: wrap; }
  .projects-index { display: none; }
  .project-status { order: 4; margin-left: 66px; }
  .project-footer { flex-direction: column; }
  .work-heading > p { max-width: none; text-align: left; }
  .work-role { align-items: flex-start; padding-inline: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-footer a,
  .work-role > a { transition: none; }
  .project-card:hover,
  .project-footer a:hover,
  .work-role > a:hover { transform: none; }
}
</style>
