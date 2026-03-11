<template>
  <section id="home" class="hero">

    <!-- Background geometric blocks (Material style) -->
    <div class="geo-block geo-1"></div>
    <div class="geo-block geo-2"></div>
    <div class="geo-block geo-3"></div>

    <div class="hero-inner container">
      <!-- Left: Text content -->
      <div class="hero-content drift from-left">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>{{ t.available }}</span>
        </div>

        <p class="hero-greeting">{{ t.greeting }}</p>

        <!-- Font cycling hero name -->
        <div class="hero-name-wrap">
          <h1
            class="hero-name"
            :class="namePhase"
            :style="{ fontFamily: currentFont.family }"
            aria-label="Heiznerd"
          >Heiznerd</h1>
          <!-- Font label pill -->
          <transition name="pill-fade">
            <span class="font-pill" :key="fontIndex">
              <i class="fas fa-font"></i> {{ currentFont.label }}
            </span>
          </transition>
        </div>

        <h2 class="hero-role">
          <span class="typed-text"></span>
          <span class="cursor-blink">|</span>
        </h2>

        <p class="hero-desc">{{ t.description }}</p>

        <!-- Stats row -->
        <div class="hero-stats drift-stagger">
          <div class="stat-chip drift burst">
            <span class="stat-val">{{ githubData.repos ?? t.stats.projectsVal }}</span>
            <span class="stat-lbl">{{ t.projects }}</span>
          </div>
          <div class="stat-chip drift burst">
            <span class="stat-val">{{ t.stats.ageVal }}</span>
            <span class="stat-lbl">{{ t.age }}</span>
          </div>
          <div class="stat-chip drift burst">
            <span class="stat-val">{{ githubData.followers ?? t.stats.techVal }}</span>
            <span class="stat-lbl">{{ githubData.followers != null ? 'Followers' : t.technologies }}</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="hero-actions">
          <a href="#projects" class="md-btn md-btn-filled">
            <i class="fas fa-rocket"></i>
            <span>{{ t.viewWork }}</span>
          </a>
          <a href="#contact" class="md-btn md-btn-outlined">
            <i class="fas fa-paper-plane"></i>
            <span>{{ t.contact }}</span>
          </a>
        </div>

        <!-- Quote card -->
        <div class="quote-card" v-if="quote.content">
          <i class="fas fa-quote-left quote-icon"></i>
          <p class="quote-text">{{ quote.content }}</p>
          <span class="quote-author">— {{ quote.author }}</span>
        </div>

        <!-- Social links -->
        <div class="social-row">
          <a href="https://github.com/captainnhwuy" target="_blank" class="social-btn" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://discord.com/users/1316287191634149377" target="_blank" class="social-btn" title="Discord">
            <i class="fab fa-discord"></i>
          </a>
          <a href="https://www.facebook.com/nguyen.huu.quy.906170" target="_blank" class="social-btn" title="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
        </div>
      </div>

      <!-- Right: Avatar + orbit -->
      <div class="hero-avatar-wrap drift from-right">
        <!-- Orbit system -->
        <div class="orbit-system" ref="orbitRef">
          <!-- Clean geometric avatar frame: square rotated 45° = diamond -->
          <div class="avatar-frame">
            <div class="avatar-frame-inner">
              <img src="/stickers/misc/evernight-dancing.gif" alt="Heiznerd" class="avatar-img" />
            </div>
          </div>

          <!-- Orbital icons rendered via JS into absolute positions -->
          <div
            v-for="(tech, i) in orbitalTechs"
            :key="tech.name"
            class="orbit-pill"
            :style="orbitStyles[i]"
            :title="tech.name"
          >
            <i :class="tech.icon" :style="{ color: tech.color }"></i>
          </div>
        </div>

        <!-- GitHub meta card -->
        <div class="avatar-meta" v-if="githubData.name">
          <img :src="githubData.avatar" :alt="githubData.name" class="gh-avatar" />
          <div>
            <p class="gh-name">{{ githubData.name }}</p>
            <p class="gh-handle">@captainnhwuy</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-hint">
      <div class="mouse">
        <div class="mouse-wheel"></div>
      </div>
      <span>{{ t.scroll }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].hero;

const githubData = ref({});
const orbitRef = ref(null);

const orbitalTechs = [
  { name: 'Vue.js',    icon: 'fab fa-vuejs',   color: '#42b883' },
  { name: 'JavaScript',icon: 'fab fa-js',       color: '#f7df1e' },
  { name: 'Node.js',   icon: 'fab fa-node-js',  color: '#68a063' },
  { name: 'React',     icon: 'fab fa-react',    color: '#61dafb' },
  { name: 'Git',       icon: 'fab fa-git-alt',  color: '#f05032' },
  { name: 'GitHub',    icon: 'fab fa-github',   color: '#a0a0a0' },
];

// Pre-compute orbit positions (6 icons evenly on circle r=190px)
// Starts from top (270deg), goes clockwise
const ORBIT_R = 190;
const orbitStyles = orbitalTechs.map((_, i) => {
  const angleDeg = (360 / orbitalTechs.length) * i - 90; // -90 = start from top
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = Math.cos(angleRad) * ORBIT_R; // relative to center
  const y = Math.sin(angleRad) * ORBIT_R;
  return {
    left: `calc(50% + ${x}px - 20px)`,
    top: `calc(50% + ${y}px - 20px)`,
    animationDelay: `${i * 0.5}s`,
  };
});

const fetchGitHub = async () => {
  try {
    const res = await fetch('https://api.github.com/users/captainnhwuy');
    if (!res.ok) return;
    const data = await res.json();
    githubData.value = {
      name: data.name || 'Heiznerd',
      avatar: data.avatar_url,
      repos: data.public_repos,
      followers: data.followers,
    };
  } catch { /* silent fail */ }
};

const initTyped = () => {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const strings = ['Frontend Developer', 'Vue.js Enthusiast', 'Builder of Cool Stuff'];
  let strIdx = 0, charIdx = 0, deleting = false;

  const tick = () => {
    const cur = strings[strIdx];
    el.textContent = deleting ? cur.substring(0, charIdx--) : cur.substring(0, charIdx++);
    let delay = deleting ? 50 : 90;
    if (!deleting && charIdx > cur.length) { delay = 1800; deleting = true; }
    else if (deleting && charIdx < 0) { deleting = false; strIdx = (strIdx + 1) % strings.length; charIdx = 0; delay = 300; }
    setTimeout(tick, delay);
  };
  tick();
};

const quote = ref({});

// Curated tech/dev quotes — no API call needed (eliminates DNS errors)
const QUOTES = [
  { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { content: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { content: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging.", author: "Dan Salomon" },
  { content: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { content: "Make it work, make it right, make it fast.", author: "Kent Beck" },
];

const fetchQuote = () => {
  quote.value = QUOTES[Math.floor(Math.random() * QUOTES.length)];
};

// =====================
// Font Cycle System
// =====================
const fontIndex = ref(0);
const namePhase = ref(''); // '' | 'phase-exit' | 'phase-swap' | 'phase-enter'

const FONTS = [
  { family: "'Google Sans Display', sans-serif", label: 'Google Sans' },
  { family: "'Playfair Display', serif",          label: 'Playfair Display' },
  { family: "'Bebas Neue', sans-serif",            label: 'Bebas Neue' },
  { family: "'Space Grotesk', sans-serif",         label: 'Space Grotesk' },
  { family: "'Josefin Sans', sans-serif",          label: 'Josefin Sans' },
  { family: "'Righteous', cursive",                label: 'Righteous' },
];

const currentFont = computed(() => FONTS[fontIndex.value]);

let fontTimer;
const startFontCycle = () => {
  fontTimer = setInterval(() => {
    // 1. EXIT: drift up + blur out
    namePhase.value = 'phase-exit';

    setTimeout(() => {
      // 2. SWAP: change font while invisible (peak of exit)
      fontIndex.value = (fontIndex.value + 1) % FONTS.length;
      namePhase.value = 'phase-enter';
    }, 480); // wait for exit to finish

    setTimeout(() => {
      // 3. SETTLE: remove phase class, CSS snaps to resting state
      namePhase.value = '';
    }, 1200);
  }, 4200);
};

onMounted(() => {
  fetchGitHub();
  initTyped();
  fetchQuote();
  // Wait 15s so intro completes and Google Sans is visible for a while first
  setTimeout(startFontCycle, 15000);
});

onUnmounted(() => { clearInterval(fontTimer); });

</script>

<style scoped>
/* =============================================
   HERO SECTION
   ============================================= */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

/* ---- Geometric background blocks ---- */
/* These are the Material-inspired rotating geometric shapes */
.geo-block {
  position: absolute;
  border-radius: 24px;
  pointer-events: none;
  opacity: 0.04;
  border: 1.5px solid var(--md-primary);
  background: transparent;
}

.geo-1 {
  width: 320px;
  height: 320px;
  top: -60px;
  right: 8%;
  transform: rotate(20deg);
  animation: geoSpin1 40s linear infinite;
}

.geo-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: 5%;
  transform: rotate(-30deg);
  animation: geoSpin2 55s linear infinite reverse;
  opacity: 0.035;
}

.geo-3 {
  width: 140px;
  height: 140px;
  top: 35%;
  left: 18%;
  transform: rotate(45deg);
  animation: geoSpin1 70s linear infinite;
  opacity: 0.025;
  border-radius: 12px;
}

@keyframes geoSpin1 {
  to { transform: rotate(380deg); }
}
@keyframes geoSpin2 {
  to { transform: rotate(-390deg); }
}

/* ---- Layout ---- */
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
  position: relative;
  z-index: 1;
}

/* ---- Left content ---- */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(187, 134, 252, 0.07);
  border: 1px solid rgba(187, 134, 252, 0.2);
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--md-primary);
  margin-bottom: 20px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--md-primary);
  animation: pulseDot 2.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}

.hero-greeting {
  font-size: 1rem;
  color: var(--md-on-surface-var);
  margin-bottom: 6px;
  font-weight: 400;
}

/* ---- Font cycling ---- */
.hero-name-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.hero-name {
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 700;
  line-height: 1;
  color: var(--md-on-surface);
  display: block;
  letter-spacing: -0.04em;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
  will-change: opacity, transform;
}

/* EXIT: fade up slightly */
.hero-name.phase-exit {
  opacity: 0;
  transform: translateY(-14px);
  transition: opacity 0.38s ease, transform 0.38s ease;
}

/* ENTER: fade in from below */
.hero-name.phase-enter {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Font label pill */
.font-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--md-on-surface-var);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-radius: 100px;
  padding: 3px 10px 3px 8px;
  position: absolute;
  bottom: -4px;
  right: 0;
  white-space: nowrap;
  backdrop-filter: blur(6px);
}

.font-pill i { font-size: 0.52rem; color: var(--md-primary); }

/* Pill slide transition */
.pill-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.pill-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.pill-fade-enter-from { opacity: 0; transform: translateY(8px) scale(0.92); }
.pill-fade-leave-to   { opacity: 0; transform: translateY(-5px) scale(0.95); }

.hero-role {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 400;
  color: var(--md-primary);
  margin-bottom: 20px;
  min-height: 2em;
  font-family: var(--font-sans);
}

.cursor-blink {
  animation: blink 1s step-end infinite;
  color: var(--md-primary);
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--md-on-surface-var);
  max-width: 440px;
  line-height: 1.7;
  margin-bottom: 28px;
}

/* Stats */
.hero-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 18px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-lg);
  gap: 2px;
  transition: all 0.25s var(--md-ease-spring);
  min-width: 80px;
}

.stat-chip:hover {
  border-color: rgba(187, 134, 252, 0.25);
  background: var(--md-surface-high);
  transform: translateY(-3px);
}

.stat-val {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--md-primary);
  font-family: var(--font-display);
  line-height: 1;
}

.stat-lbl {
  font-size: 0.7rem;
  color: var(--md-on-surface-var);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

/* Actions */
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

/* Social */
.social-row {
  display: flex;
  gap: 8px;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--md-radius-md);
  background: transparent;
  border: 1px solid var(--md-outline-var);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-surface-var);
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s var(--md-ease-spring);
}

.social-btn:hover {
  border-color: rgba(187, 134, 252, 0.35);
  color: var(--md-primary);
  background: rgba(187, 134, 252, 0.06);
  transform: translateY(-2px);
}

/* Quote card */
.quote-card {
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-left: 3px solid rgba(187, 134, 252, 0.5);
  border-radius: var(--md-radius-md);
  padding: 12px 14px 12px 16px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: quoteFadeIn 0.6s var(--md-ease-spring);
}

@keyframes quoteFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.quote-icon {
  font-size: 0.7rem;
  color: rgba(187, 134, 252, 0.5);
}

.quote-text {
  font-size: 0.82rem;
  color: var(--md-on-surface-var);
  font-style: italic;
  line-height: 1.55;
}

.quote-author {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--md-primary);
  opacity: 0.8;
}


/* ========================
   Right: Orbit System
   ======================== */
.hero-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.orbit-system {
  position: relative;
  width: 420px;
  height: 420px;
  flex-shrink: 0;
}

/* Subtle dashed orbit ring (single stroke, no rainbow) */
.orbit-system::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 390px;
  height: 390px;
  border-radius: 50%;
  border: 1px dashed rgba(187, 134, 252, 0.15);
  pointer-events: none;
}

/* ---- Avatar frame: geometric pill with corner accent ---- */
.avatar-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 240px;
  /* Geometric accent: rotated square corners */
  border-radius: 40px;
  background: var(--md-surface-container);
  border: 1px solid rgba(187, 134, 252, 0.2);
  padding: 6px;
  box-shadow:
    0 0 0 1px rgba(187, 134, 252, 0.08),
    0 24px 48px rgba(0, 0, 0, 0.5);
  animation: frameFloat 6s ease-in-out infinite;
}

/* Small square decorators at corners — Material geometric accent */
.avatar-frame::before,
.avatar-frame::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(187, 134, 252, 0.4);
  border-radius: 3px;
}
.avatar-frame::before {
  top: -6px; left: -6px;
}
.avatar-frame::after {
  bottom: -6px; right: -6px;
  border-color: rgba(187, 134, 252, 0.25);
}

@keyframes frameFloat {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50%       { transform: translate(-50%, -50%) translateY(-10px); }
}

.avatar-frame-inner {
  width: 100%;
  height: 100%;
  border-radius: 34px;
  overflow: hidden;
  background: var(--md-surface);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 34px;
}

/* ---- Orbital pills ---- */
.orbit-pill {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: var(--md-radius-md);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: default;
  transition: transform 0.25s var(--md-ease-spring), border-color 0.25s, background 0.25s;
  animation: orbitFloat 4s ease-in-out infinite;
}

.orbit-pill:hover {
  transform: scale(1.2) !important;
  border-color: rgba(187, 134, 252, 0.4);
  background: var(--md-surface-high);
  z-index: 10;
}

@keyframes orbitFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}

/* ---- GitHub meta card ---- */
.avatar-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  padding: 10px 16px;
  box-shadow: var(--md-shadow-1);
}

.gh-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(187, 134, 252, 0.3);
}

.gh-name {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--md-on-surface);
}

.gh-handle {
  font-size: 0.75rem;
  color: var(--md-on-surface-var);
}

/* ---- Scroll hint ---- */
.scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--md-on-surface-var);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}

.mouse {
  width: 20px;
  height: 32px;
  border: 1.5px solid var(--md-outline);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  padding-top: 5px;
}

.mouse-wheel {
  width: 2px;
  height: 5px;
  background: var(--md-primary);
  border-radius: 2px;
  animation: scrollWheel 2.5s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50%       { transform: translateY(8px); opacity: 0.2; }
}

/* ---- Responsive ---- */
@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  .hero-content { order: 2; }
  .hero-avatar-wrap { order: 1; }
  .hero-actions, .hero-stats, .social-row { justify-content: center; }
  .hero-badge { margin-left: auto; margin-right: auto; }
  .orbit-system { width: 300px; height: 300px; }
  .avatar-frame { width: 180px; height: 180px; }
  .orbit-system::before { width: 280px; height: 280px; }
  .geo-1, .geo-2, .geo-3 { display: none; }
}
</style>
