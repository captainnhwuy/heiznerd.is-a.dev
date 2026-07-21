<template>
  <section class="tech-marquee" aria-labelledby="tech-marquee-title">
    <div class="container marquee-heading">
      <span class="marquee-index">STACK / CONTINUOUS</span>
      <h2 id="tech-marquee-title">Technologies in motion</h2>
    </div>

    <div v-for="(lane, laneIndex) in lanes" :key="laneIndex" class="marquee-lane" :class="`lane-${laneIndex + 1}`">
      <div class="marquee-track">
        <div class="marquee-sequence">
          <div v-for="tech in lane" :key="tech.name" class="tech-item">
            <span class="tech-icon" :style="{ '--tone': tech.color }" aria-hidden="true">
              <i v-if="tech.icon" :class="tech.icon"></i>
              <b v-else>{{ tech.mark }}</b>
            </span>
            <span>{{ tech.name }}</span>
          </div>
        </div>
        <div class="marquee-sequence" aria-hidden="true">
          <div v-for="tech in lane" :key="`copy-${tech.name}`" class="tech-item">
            <span class="tech-icon" :style="{ '--tone': tech.color }">
              <i v-if="tech.icon" :class="tech.icon"></i>
              <b v-else>{{ tech.mark }}</b>
            </span>
            <span>{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const tech = (name, icon, mark, color) => ({ name, icon, mark, color });

const lanes = [
  [
    tech('Vue', 'fab fa-vuejs', '', '#42b883'),
    tech('Vite', '', 'V', '#a987e8'),
    tech('CSS3', 'fab fa-css3-alt', '', '#5b9ee8'),
    tech('HTML5', 'fab fa-html5', '', '#e47758'),
    tech('NuxtJS', '', 'N', '#65c99a'),
    tech('ReactJS', 'fab fa-react', '', '#61dafb'),
    tech('JavaScript', 'fab fa-js', '', '#e7d052'),
    tech('TypeScript', '', 'TS', '#5995d4'),
    tech('C++', '', 'C++', '#7d91cc'),
  ],
  [
    tech('NodeJS', 'fab fa-node-js', '', '#68a063'),
    tech('Fastify', '', 'F', '#c8b7df'),
    tech('ExpressJS', '', 'Ex', '#b5aec2'),
    tech('Ruby on Rails', 'fas fa-gem', '', '#c96875'),
    tech('Rust', 'fab fa-rust', '', '#d09972'),
    tech('Java', 'fab fa-java', '', '#d58464'),
    tech('MySQL', 'fas fa-database', '', '#72a6cb'),
    tech('SQLite', '', 'SQ', '#7eb2c8'),
    tech('PostgreSQL', '', 'PG', '#668fbf'),
    tech('Redis', '', 'R', '#d06666'),
    tech('Git', 'fab fa-git-alt', '', '#e17859'),
    tech('GitHub', 'fab fa-github', '', '#d4cedc'),
    tech('Linux', 'fab fa-linux', '', '#e1c263'),
    tech('WSL', '', '>_', '#9b8fb1'),
  ],
];
</script>

<style scoped>
.tech-marquee {
  padding: 18px 0 34px;
  overflow: hidden;
  background: transparent;
}

.marquee-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.marquee-index {
  color: var(--md-primary);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
}

.marquee-heading h2 {
  color: var(--md-on-surface-var);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.marquee-lane {
  width: 100%;
  overflow: hidden;
  border-block: 1px solid var(--md-outline-var);
  background: rgba(12, 12, 15, 0.46);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee-lane + .marquee-lane { border-top: 0; }
.marquee-track { display: flex; width: max-content; animation: marqueeLeft 36s linear infinite; }
.lane-2 .marquee-track { animation-name: marqueeRight; animation-duration: 44s; }
.marquee-lane:hover .marquee-track { animation-play-state: paused; }
.marquee-sequence { display: flex; flex: 0 0 auto; }

.tech-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: max-content;
  padding: 13px 22px;
  border-right: 1px solid var(--md-outline-var);
  color: var(--md-on-surface-var);
  font-size: 0.78rem;
  transition: color 220ms ease, background 220ms ease;
}

.tech-item:hover { color: var(--md-on-surface); background: rgba(255, 255, 255, 0.025); }
.tech-icon { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid color-mix(in srgb, var(--tone) 35%, transparent); border-radius: 9px; color: var(--tone); background: color-mix(in srgb, var(--tone) 8%, transparent); }
.tech-icon b { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: -0.06em; }

@keyframes marqueeLeft { to { transform: translate3d(-50%, 0, 0); } }
@keyframes marqueeRight { from { transform: translate3d(-50%, 0, 0); } to { transform: translate3d(0, 0, 0); } }

@media (max-width: 600px) {
  .tech-marquee { padding-top: 8px; }
  .marquee-heading { align-items: flex-start; flex-direction: column; gap: 6px; }
  .tech-item { padding: 11px 16px; }
  .tech-icon { width: 28px; height: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-lane { overflow: visible; mask-image: none; -webkit-mask-image: none; }
  .marquee-track { width: auto; animation: none; }
  .marquee-sequence { flex-wrap: wrap; justify-content: center; }
  .marquee-sequence[aria-hidden='true'] { display: none; }
}
</style>
