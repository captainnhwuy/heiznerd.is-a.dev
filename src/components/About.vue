<template>
  <section id="about" class="about">
    <!-- Geometric decorators -->
    <div class="section-geo section-geo--br"></div>

    <div class="container">
      <!-- Section header -->
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
      </div>

      <div class="about-grid">
        <!-- Left: Bio card -->
        <div class="md-card bio-card drift from-left">
          <div class="bio-header">
            <div class="bio-avatar-ring">
              <i class="fas fa-user-astronaut"></i>
            </div>
            <div>
              <h3 class="bio-name">Heiznerd</h3>
              <p class="bio-handle">@captainnhwuy · Vietnam 🇻🇳</p>
            </div>
          </div>

          <div class="bio-body">
            <p><span class="bio-hi">{{ t.intro }}</span> {{ t.paragraph1 }}</p>
            <p>{{ t.paragraph2 }}</p>
            <p>{{ t.paragraph3 }}</p>
          </div>

          <div class="bio-interests">
            <p class="interests-label">{{ t.interests }}</p>
            <div class="interests-chips drift-stagger">
              <span class="md-chip drift burst"><i class="fas fa-code"></i> {{ t.coding }}</span>
              <span class="md-chip drift burst"><i class="fas fa-film"></i> {{ t.anime }}</span>
              <span class="md-chip drift burst"><i class="fas fa-heart"></i> {{ t.romcom }}</span>
              <span class="md-chip drift burst"><i class="fas fa-gamepad"></i> {{ t.gaming }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Code window -->
        <div class="drift from-right about-right-panel">
          <div class="md-card code-window">
            <div class="window-bar">
              <div class="window-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <div class="window-title">whoami.js</div>
              <div></div>
            </div>
            <pre class="code-body"><code><span class="ck">const</span> <span class="cv">developer</span> = {
  <span class="cp">name</span>:   <span class="cs">"Heiznerd"</span>,
  <span class="cp">aka</span>:    <span class="cs">"Capta1nHwuy"</span>,
  <span class="cp">age</span>:    <span class="cn">14</span>,
  <span class="cp">from</span>:   <span class="cs">"Vietnam 🇻🇳"</span>,
  <span class="cp">stack</span>: [
    <span class="cs">"Vue.js"</span>,
    <span class="cs">"JavaScript"</span>,
    <span class="cs">"Node.js"</span>,
    <span class="cs">"Ruby on Rails"</span>
  ],
  <span class="cp">status</span>: <span class="cs">"Learning &amp; Building"</span>,
  <span class="cp">motto</span>: <span class="cf">() =&gt;</span> {
    <span class="ck">return</span> <span class="cs">"Dream big, code bigger"</span>;
  }
};</code></pre>
          </div>

          <!-- Mini stats row under code window -->
          <div class="mini-stats">
            <div class="mini-stat" v-for="s in miniStats" :key="s.label">
              <span class="ms-icon"><i :class="s.icon" :style="{ color: s.color }"></i></span>
              <div class="ms-info">
                <span class="ms-val">{{ s.val }}</span>
                <span class="ms-label">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].about;

const miniStats = [
  { icon: 'fas fa-code', color: '#BB86FC', val: '2y+', label: 'Coding' },
  { icon: 'fas fa-rocket', color: '#42b883', val: '3+', label: 'Projects Live' },
  { icon: 'fas fa-star', color: '#f7df1e', val: '∞', label: 'Learning' },
];

</script>

<style scoped>
.about { background: transparent; }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  margin-top: 48px;
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--md-shadow-2);
}

/* Bio card (Left Panel) */
.bio-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: transparent;
  border: none;
  border-radius: 0;
  border-right: 1px solid var(--md-outline-var);
  box-shadow: none;
}

.bio-card:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--md-outline-var);
}

.bio-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bio-avatar-ring {
  width: 54px;
  height: 54px;
  border-radius: var(--md-radius-md);
  background: rgba(187, 134, 252, 0.08);
  border: 1.5px solid rgba(187, 134, 252, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--md-primary);
  flex-shrink: 0;
}

.bio-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--md-on-surface);
}

.bio-handle {
  font-size: 0.82rem;
  color: var(--md-on-surface-var);
  margin-top: 2px;
}

.bio-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bio-body p {
  font-size: 0.95rem;
  color: var(--md-on-surface-var);
  line-height: 1.7;
}

.bio-hi {
  color: var(--md-primary);
  font-weight: 600;
}

.interests-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--md-on-surface-var);
  margin-bottom: 12px;
}

.interests-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Right column container */
.about-right-panel {
  display: flex;
  flex-direction: column;
}

/* Code window (Top Right) */
.code-window {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid var(--md-outline-var);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.code-window:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--md-outline-var);
}

.window-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.015);
  border-bottom: 1px solid var(--md-outline-var);
}

.window-dots { display: flex; gap: 6px; }

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.window-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--md-on-surface-var);
  font-weight: 500;
}

.code-body {
  padding: 24px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.8;
  color: var(--md-on-surface-var);
  overflow-x: auto;
  background: transparent;
  margin: 0;
  flex: 1;
}

.ck  { color: #cf68e1; }
.cv  { color: #61dafb; }
.cp  { color: #9fd3c7; }
.cs  { color: #a8d8a8; }
.cn  { color: #f78c6c; }
.cf  { color: #82AAFF; }

/* Mini stats row (Bottom Right) */
.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: rgba(255, 255, 255, 0.005);
  gap: 0;
  margin-top: 0;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transition: background 0.3s var(--md-ease-standard);
}

.mini-stat:not(:last-child) {
  border-right: 1px solid var(--md-outline-var);
}

.mini-stat:hover {
  background: rgba(255, 255, 255, 0.03);
  transform: none;
}

.ms-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.ms-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ms-val {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--md-on-surface);
  line-height: 1;
}

.ms-label {
  font-size: 0.68rem;
  color: var(--md-on-surface-var);
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
  .bio-card {
    border-right: none;
    border-bottom: 1px solid var(--md-outline-var);
  }
  .mini-stat {
    padding: 16px 12px;
    justify-content: center;
  }
}
@media (max-width: 480px) {
  .mini-stats {
    grid-template-columns: 1fr;
  }
  .mini-stat:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid var(--md-outline-var);
  }
}
</style>
