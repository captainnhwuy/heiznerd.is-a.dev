<template>
  <section id="about" class="about">
    <div class="container">
      <header class="about-heading drift from-top">
        <div>
          <span class="section-eyebrow">{{ t.label }}</span>
          <h2 class="section-title">{{ t.title }}</h2>
        </div>
        <span class="about-index" aria-hidden="true">01 — PROFILE</span>
      </header>

      <div class="about-layout">
        <article class="profile-panel drift from-left">
          <div class="profile-topline">
            <div class="profile-avatar" aria-hidden="true">H</div>
            <div>
              <h3>Heiznerd</h3>
              <p>@captainnhwuy · Vietnam 🇻🇳</p>
            </div>
            <span class="profile-status"><i></i>{{ t.learning }}</span>
          </div>

          <div class="profile-copy">
            <p class="profile-lead">{{ t.intro }} {{ t.paragraph1 }}</p>
            <p>{{ t.paragraph2 }}</p>
            <p>{{ t.paragraph3 }}</p>
          </div>

          <div class="profile-interests">
            <span>{{ t.interests }}</span>
            <ul>
              <li><i class="fas fa-code" aria-hidden="true"></i>{{ t.coding }}</li>
              <li><i class="fas fa-film" aria-hidden="true"></i>{{ t.anime }}</li>
              <li><i class="fas fa-heart" aria-hidden="true"></i>{{ t.romcom }}</li>
              <li><i class="fas fa-gamepad" aria-hidden="true"></i>{{ t.gaming }}</li>
            </ul>
          </div>

          <p class="profile-signature" aria-hidden="true">build · learn · refine</p>
        </article>

        <div class="stack-panel drift from-right">
          <div class="stack-heading">
            <div>
              <span class="stack-kicker">02 — {{ t.stackLabel }}</span>
              <h3>{{ t.stackTitle }}</h3>
            </div>
            <p>{{ t.stackDescription }}</p>
          </div>

          <div class="stack-grid drift-stagger">
            <article
              v-for="category in techCategories"
              :key="category.key"
              class="stack-category drift from-bottom"
              :class="`stack-category--${category.key}`"
              :style="{ '--category-color': category.color }"
            >
              <header>
                <span class="category-icon"><i :class="category.icon" aria-hidden="true"></i></span>
                <h4>{{ category.label }}</h4>
                <span class="category-count">{{ String(category.items.length).padStart(2, '0') }}</span>
              </header>
              <ul>
                <li v-for="item in category.items" :key="item.name">
                  <i :class="item.icon" aria-hidden="true"></i>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>

      <div class="experience-panel drift from-bottom">
        <header class="experience-heading">
          <div>
            <span class="stack-kicker">03 — EXPERIENCE</span>
            <h3>{{ t.experienceTitle }}</h3>
          </div>
          <span>{{ t.experienceSubtitle }}</span>
        </header>

        <ol class="experience-list drift-stagger">
          <li v-for="(item, index) in t.experience" :key="item.years" class="experience-item drift from-bottom">
            <span class="experience-number">0{{ index + 1 }}</span>
            <strong>{{ item.years }}</strong>
            <p>{{ item.description }}</p>
            <span class="experience-line" aria-hidden="true"></span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject } from 'vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].about);

const icon = (name, iconClass) => ({ name, icon: iconClass });
const techCategories = computed(() => [
  {
    key: 'frontend',
    label: t.value.categories.frontend,
    icon: 'fas fa-layer-group',
    color: '#a987e8',
    items: [
      icon('Vue', 'fab fa-vuejs'),
      icon('Vite', 'fas fa-bolt'),
      icon('CSS3', 'fab fa-css3-alt'),
      icon('HTML5', 'fab fa-html5'),
      icon('NuxtJS', 'fab fa-vuejs'),
      icon('ReactJS', 'fab fa-react'),
    ],
  },
  {
    key: 'backend',
    label: t.value.categories.backend,
    icon: 'fas fa-server',
    color: '#81c7b8',
    items: [
      icon('NodeJS', 'fab fa-node-js'),
      icon('Fastify', 'fas fa-gauge-high'),
      icon('ExpressJS', 'fas fa-code-branch'),
      icon('Ruby on Rails', 'fas fa-gem'),
      icon('Rust', 'fab fa-rust'),
      icon('Java', 'fab fa-java'),
    ],
  },
  {
    key: 'database',
    label: t.value.categories.database,
    icon: 'fas fa-database',
    color: '#8ca9df',
    items: [
      icon('MySQL', 'fas fa-database'),
      icon('SQLite', 'fas fa-table'),
      icon('PostgreSQL', 'fas fa-database'),
      icon('Redis', 'fas fa-layer-group'),
    ],
  },
  {
    key: 'devops',
    label: t.value.categories.devops,
    icon: 'fas fa-terminal',
    color: '#d1a7da',
    items: [
      icon('Git', 'fab fa-git-alt'),
      icon('GitHub', 'fab fa-github'),
      icon('Linux', 'fab fa-linux'),
      icon('WSL', 'fas fa-terminal'),
    ],
  },
  {
    key: 'experimental',
    label: t.value.categories.experimental,
    icon: 'fas fa-flask',
    color: '#d8aa78',
    items: [
      icon('JavaScript', 'fab fa-js'),
      icon('Vue', 'fab fa-vuejs'),
      icon('TypeScript', 'fas fa-code'),
      icon('C++', 'fas fa-microchip'),
    ],
  },
]);
</script>

<style scoped>
.about {
  position: relative;
  background: transparent;
}

.about-heading,
.stack-heading,
.experience-heading,
.profile-topline,
.stack-category header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.about-index,
.stack-kicker,
.category-count,
.experience-number,
.profile-signature {
  color: var(--md-on-surface-var);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.about-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
  margin-top: 52px;
  overflow: hidden;
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  background: rgba(15, 15, 18, 0.58);
  box-shadow: var(--md-shadow-2);
  backdrop-filter: blur(14px);
}

.profile-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  padding: clamp(28px, 4vw, 46px);
  overflow: hidden;
  border-right: 1px solid var(--md-outline-var);
}

.profile-panel::before {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  right: -130px;
  bottom: -130px;
  border: 1px solid rgba(187, 134, 252, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(187, 134, 252, 0.025), 0 0 0 58px rgba(187, 134, 252, 0.018);
  pointer-events: none;
}

.profile-avatar {
  display: grid;
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(187, 134, 252, 0.28);
  border-radius: 50%;
  color: var(--md-primary);
  background: rgba(187, 134, 252, 0.08);
  font-family: 'Marck Script', cursive;
  font-size: 2rem;
}

.profile-topline > div:nth-child(2) { flex: 1; }
.profile-topline h3 { color: var(--md-on-surface); font-size: 1.25rem; }
.profile-topline p { margin-top: 3px; color: var(--md-on-surface-var); font-size: 0.78rem; }
.profile-status { display: inline-flex; align-items: center; gap: 7px; color: var(--md-secondary); font-size: 0.68rem; white-space: nowrap; }
.profile-status i { width: 6px; height: 6px; border-radius: 50%; background: var(--md-secondary); box-shadow: 0 0 0 5px rgba(3, 218, 198, 0.06); }

.profile-copy { display: grid; gap: 14px; }
.profile-copy p { color: var(--md-on-surface-var); font-size: 0.95rem; line-height: 1.76; }
.profile-copy .profile-lead { color: var(--md-on-surface); font-size: 1rem; }

.profile-interests > span { display: block; margin-bottom: 12px; color: var(--md-on-surface-var); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.profile-interests ul { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
.profile-interests li { display: inline-flex; align-items: center; gap: 7px; min-height: 34px; padding: 7px 11px; border: 1px solid var(--md-outline-var); border-radius: 100px; color: var(--md-on-surface-var); font-size: 0.75rem; background: rgba(255, 255, 255, 0.018); }
.profile-interests i { color: var(--md-primary); }
.profile-signature { margin-top: auto; color: rgba(187, 134, 252, 0.46); }

.stack-panel { min-width: 0; padding: clamp(28px, 4vw, 46px); }
.stack-heading { align-items: flex-end; margin-bottom: 30px; }
.stack-heading h3,
.experience-heading h3 { margin-top: 6px; color: var(--md-on-surface); font-size: clamp(1.5rem, 3vw, 2.25rem); letter-spacing: -0.04em; }
.stack-heading > p { max-width: 310px; color: var(--md-on-surface-var); font-size: 0.82rem; line-height: 1.6; text-align: right; }

.stack-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.stack-category { min-width: 0; padding: 18px; border: 1px solid var(--md-outline-var); border-radius: var(--md-radius-lg); background: rgba(255, 255, 255, 0.015); transition: transform 280ms var(--md-ease-spring), border-color 280ms ease, background 280ms ease; }
.stack-category:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--category-color) 45%, transparent); background: rgba(255, 255, 255, 0.032); }
.stack-category--experimental { grid-column: 1 / -1; }
.stack-category header { justify-content: flex-start; }
.category-icon { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; border-radius: 9px; color: var(--category-color); background: color-mix(in srgb, var(--category-color) 11%, transparent); }
.stack-category h4 { flex: 1; color: var(--md-on-surface); font-size: 0.82rem; }
.category-count { color: var(--category-color); }
.stack-category ul { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 16px; padding: 0; list-style: none; }
.stack-category li { display: inline-flex; align-items: center; gap: 6px; min-height: 31px; padding: 6px 9px; border-radius: 8px; color: var(--md-on-surface-var); background: rgba(255, 255, 255, 0.025); font-size: 0.72rem; overflow-wrap: anywhere; transition: color 200ms ease, background 200ms ease; }
.stack-category li:hover { color: var(--md-on-surface); background: color-mix(in srgb, var(--category-color) 9%, transparent); }
.stack-category li i { color: var(--category-color); font-size: 0.72rem; }

.experience-panel { margin-top: 18px; padding: clamp(28px, 4vw, 42px); border: 1px solid var(--md-outline-var); border-radius: var(--md-radius-xl); background: rgba(15, 15, 18, 0.58); backdrop-filter: blur(14px); }
.experience-heading > span { max-width: 300px; color: var(--md-on-surface-var); font-size: 0.8rem; line-height: 1.6; text-align: right; }
.experience-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; margin-top: 32px; padding: 0; list-style: none; }
.experience-item { position: relative; min-width: 0; padding: 8px 28px 6px; border-left: 1px solid var(--md-outline-var); }
.experience-item:first-child { padding-left: 0; border-left: 0; }
.experience-number { display: block; margin-bottom: 24px; color: rgba(187, 134, 252, 0.42); }
.experience-item strong { display: block; color: var(--md-primary); font-family: var(--font-mono); font-size: clamp(1rem, 2vw, 1.35rem); }
.experience-item p { margin-top: 10px; color: var(--md-on-surface-var); font-size: 0.86rem; line-height: 1.65; }
.experience-line { position: absolute; top: 31px; right: 28px; left: 60px; height: 1px; background: linear-gradient(90deg, rgba(187, 134, 252, 0.4), transparent); transform: scaleX(0); transform-origin: left; transition: transform 900ms var(--md-ease-decel) 300ms; }
.experience-item.visible .experience-line { transform: scaleX(1); }

@media (max-width: 900px) {
  .about-layout { grid-template-columns: 1fr; }
  .profile-panel { border-right: 0; border-bottom: 1px solid var(--md-outline-var); }
  .experience-list { grid-template-columns: 1fr; gap: 24px; }
  .experience-item,
  .experience-item:first-child { padding: 0 0 0 28px; border-left: 1px solid var(--md-outline-var); }
  .experience-number { margin-bottom: 10px; }
  .experience-line { display: none; }
}

@media (max-width: 600px) {
  .about-heading,
  .stack-heading,
  .experience-heading { align-items: flex-start; flex-direction: column; }
  .about-index { display: none; }
  .stack-heading > p,
  .experience-heading > span { max-width: none; text-align: left; }
  .stack-grid { grid-template-columns: 1fr; }
  .stack-category--experimental { grid-column: auto; }
  .profile-topline { align-items: flex-start; flex-wrap: wrap; }
  .profile-status { width: 100%; padding-left: 70px; }
}

@media (prefers-reduced-motion: reduce) {
  .stack-category,
  .experience-line { transition: none; }
  .stack-category:hover { transform: none; }
  .experience-line { transform: scaleX(1); }
}
</style>
