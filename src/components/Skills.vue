<template>
  <section id="skills" class="skills">
    <div class="container">
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
      </div>

      <div class="skills-layout">
        <!-- Left: Progress bars -->
        <div class="skills-left drift from-left">
          <h3 class="col-heading">{{ t.languages }}</h3>
          <div class="skill-bars" ref="barsRef">
            <div class="skill-bar-item" v-for="skill in languages" :key="skill.name">
              <div class="skill-meta">
                <span class="skill-name">
                  <i :class="skill.icon" :style="{ color: skill.color }"></i>
                  {{ skill.name }}
                </span>
                <span class="skill-pct" :ref="el => pctRefs[skill.name] = el">0%</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :ref="el => barRefs[skill.name] = el"
                  :data-level="skill.level"
                  :style="{ '--bar-color': skill.color }"
                ></div>
                <div class="progress-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Creative Bento Tech Board -->
        <div class="skills-right">
          <h3 class="col-heading drift from-right">{{ t.tools }}</h3>
          <div class="bento-board drift-stagger">
            <!-- Category cards -->
            <div
              v-for="(cat, ci) in techCategories"
              :key="cat.label"
              class="bento-cat drift from-bottom"
              :class="cat.size"
              :style="{ '--cat-color': cat.color }"
            >
              <!-- Category header -->
              <div class="bcat-head">
                <span class="bcat-icon"><i :class="cat.headIcon"></i></span>
                <span class="bcat-label">{{ cat.label }}</span>
              </div>

              <!-- Tech items inside this category -->
              <div class="bcat-items">
                <div
                  v-for="tech in cat.items"
                  :key="tech.name"
                  class="bcat-item"
                  :title="tech.name"
                  :style="{ '--tc': tech.color }"
                >
                  <i :class="tech.icon"></i>
                  <span>{{ tech.name }}</span>
                </div>
              </div>
            </div>

            <!-- Experience bar at bottom -->
            <div class="bento-exp drift from-bottom" style="transition-delay:400ms">
              <div class="exp-line" v-for="y in expYears" :key="y.label" :style="{ '--ec': y.color }">
                <span class="exp-num">{{ y.val }}</span>
                <span class="exp-bar-wrap"><span class="exp-bar" :style="{ width: y.pct }"></span></span>
                <span class="exp-label">{{ y.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].skills;

const barsRef = ref(null);
const barRefs = ref({});
const pctRefs = ref({});
let barsAnimated = false;

const languages = [
  { name: 'Vue.js',      level: 70, icon: 'fab fa-vuejs',   color: '#42b883' },
  { name: 'JavaScript',  level: 65, icon: 'fab fa-js',       color: '#f7df1e' },
  { name: 'Node.js',     level: 55, icon: 'fab fa-node-js',  color: '#68a063' },
  { name: 'Discord.js',  level: 50, icon: 'fab fa-discord',  color: '#5865f2' },
  { name: 'C++',         level: 30, icon: 'fas fa-code',     color: '#00599c' },
  { name: 'Rust',        level: 10, icon: 'fas fa-cog',      color: '#ce422b' },
];

// Tech grouped into categories for bento board
const techCategories = [
  {
    label: 'Frontend',
    headIcon: 'fas fa-layer-group',
    color: '#42b883',
    size: 'bcat-md',
    items: [
      { name: 'Vue.js',  icon: 'fab fa-vuejs',    color: '#42b883' },
      { name: 'React',   icon: 'fab fa-react',    color: '#61dafb' },
      { name: 'HTML5',   icon: 'fab fa-html5',    color: '#e34f26' },
      { name: 'CSS3',    icon: 'fab fa-css3-alt', color: '#1572B6' },
      { name: 'Vite',    icon: 'fas fa-bolt',     color: '#646cff' },
    ],
  },
  {
    label: 'Backend',
    headIcon: 'fas fa-server',
    color: '#CC0000',
    size: 'bcat-md',
    items: [
      { name: 'Node.js',       icon: 'fab fa-node-js', color: '#68a063' },
      { name: 'Ruby on Rails', icon: 'fas fa-gem',     color: '#CC0000' },
      { name: 'Python',        icon: 'fab fa-python',  color: '#3776AB' },
    ],
  },
  {
    label: 'Database',
    headIcon: 'fas fa-database',
    color: '#336791',
    size: 'bcat-sm',
    items: [
      { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791' },
      { name: 'Redis',      icon: 'fas fa-server',   color: '#D82C20' },
    ],
  },
  {
    label: 'DevOps & Tools',
    headIcon: 'fab fa-git-alt',
    color: '#f05032',
    size: 'bcat-md',
    items: [
      { name: 'Git',    icon: 'fab fa-git-alt', color: '#f05032' },
      { name: 'GitHub', icon: 'fab fa-github',  color: '#a0a0a0' },
      { name: 'Linux',  icon: 'fab fa-linux',   color: '#fcc624' },
    ],
  },
  {
    label: 'Community',
    headIcon: 'fab fa-discord',
    color: '#5865f2',
    size: 'bcat-sm',
    items: [
      { name: 'Discord.js', icon: 'fab fa-discord', color: '#5865f2' },
    ],
  },
];

// Experience indicators for the bottom bar
const expYears = [
  { val: '2y+', label: 'Web Dev',     pct: '70%', color: '#BB86FC' },
  { val: '1y+', label: 'Backend',     pct: '45%', color: '#42b883' },
  { val: '6m',  label: 'DevOps',      pct: '25%', color: '#f05032' },
];

const animateBars = () => {
  if (barsAnimated) return;
  barsAnimated = true;
  languages.forEach((skill, idx) => {
    setTimeout(() => {
      const bar = barRefs.value[skill.name];
      const pct = pctRefs.value[skill.name];
      if (bar) bar.style.width = skill.level + '%';
      if (pct) {
        let count = 0;
        const target = skill.level;
        const step = () => {
          count = Math.min(count + 2, target);
          pct.textContent = count + '%';
          if (count < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, idx * 120);
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateBars();
      // Also animate experience bars
      document.querySelectorAll('.exp-bar').forEach(el => {
        const target = el.dataset.pct;
        if (target) el.style.width = target;
      });
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  if (barsRef.value) observer.observe(barsRef.value);
});
</script>

<style scoped>
.skills { background: transparent; }

.skills-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 48px;
  margin-top: 52px;
  align-items: start;
}

.col-heading {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--md-on-surface-var);
  margin-bottom: 28px;
}

/* ===============================
   Progress Bars
   =============================== */
.skill-bars {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skill-bar-item { display: flex; flex-direction: column; gap: 8px; }

.skill-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--md-on-surface);
}

.skill-name i { font-size: 1rem; }

.skill-pct {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--md-primary);
  min-width: 36px;
  text-align: right;
}

.progress-track {
  height: 5px;
  background: var(--md-surface-container);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  width: 0%;
  border-radius: 6px;
  background: var(--bar-color, var(--md-primary));
  transition: width 1s var(--md-ease-decel);
}

.progress-shimmer {
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  animation: shimmer 2.5s ease-in-out infinite 1.2s;
}

@keyframes shimmer {
  0%   { left: -60%; }
  100% { left: 120%; }
}

/* ===============================
   Bento Board
   =============================== */
/* ===============================
   Bento Board
   =============================== */
.bento-board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 0;
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--md-shadow-2);
}

/* Category cards */
.bento-cat {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 20px 24px;
  transition: background 0.3s var(--md-ease-standard);
  position: relative;
  overflow: hidden;
  box-shadow: none;
}

.bento-cat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 2.5px;
  height: 100%;
  background: var(--cat-color, var(--md-primary));
  opacity: 0.35;
}

.bento-cat:hover {
  background: rgba(255, 255, 255, 0.02);
  transform: none;
}

/* Inside grid borders */
/* Vertical divider between left and right column */
.bento-cat:nth-child(2),
.bento-cat:nth-child(4) {
  border-right: 1px solid var(--md-outline-var);
}

/* Horizontal dividers */
.bento-cat:nth-child(1),
.bento-cat:nth-child(2),
.bento-cat:nth-child(3),
.bento-cat:nth-child(4),
.bento-cat:nth-child(5) {
  border-bottom: 1px solid var(--md-outline-var);
}

/* Sizes */
.bcat-md { grid-column: span 1; }
.bcat-sm { grid-column: span 1; }

/* Frontend spans 2 cols to be featured */
.bento-cat:first-child { grid-column: span 2; }

/* Category header */
.bcat-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.bcat-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--cat-color, var(--md-primary));
}

.bcat-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--md-on-surface);
}

/* Items row */
.bcat-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bcat-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--md-outline-var);
  border-radius: 100px;
  font-size: 0.77rem;
  font-weight: 500;
  color: var(--md-on-surface-var);
  transition: all 0.22s var(--md-ease-spring);
  cursor: default;
}

.bcat-item i {
  font-size: 0.85rem;
  color: var(--tc, var(--md-primary));
}

.bcat-item:hover {
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--md-on-surface);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

/* ===============================
   Experience bar block (spans full width)
   =============================== */
.bento-exp {
  grid-column: span 2;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: none;
}

.exp-line {
  display: grid;
  grid-template-columns: 40px 1fr 90px;
  align-items: center;
  gap: 16px;
}

.exp-num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ec, var(--md-primary));
  white-space: nowrap;
}

.exp-bar-wrap {
  height: 5px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  overflow: hidden;
}

.exp-bar {
  display: block;
  height: 100%;
  background: var(--ec, var(--md-primary));
  border-radius: 4px;
  opacity: 0.75;
  width: 0;
  transition: width 1.4s var(--md-ease-decel) 0.5s;
}

.exp-label {
  font-size: 0.75rem;
  color: var(--md-on-surface-var);
  text-align: right;
  white-space: nowrap;
}

/* ===============================
   Responsive
   =============================== */
@media (max-width: 900px) {
  .skills-layout { grid-template-columns: 1fr; }
  .bento-board { grid-template-columns: 1fr 1fr; }
  .bento-cat:first-child { grid-column: span 2; }
}

@media (max-width: 480px) {
  .bento-board { grid-template-columns: 1fr; }
  .bento-cat:first-child { grid-column: span 1; }
  .bento-exp { grid-column: span 1; }
  .bento-cat {
    border-right: none !important;
    border-bottom: 1px solid var(--md-outline-var) !important;
  }
}
</style>
