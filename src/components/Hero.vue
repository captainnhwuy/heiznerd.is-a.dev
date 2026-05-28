<template>
  <section id="home" class="hero">
    <!-- Blueprint grid scanning lines overlay -->
    <div class="blueprint-overlay"></div>

    <div class="hero-inner container dashboard-grid">
      <!-- CELL 1: BRAND HEADER PANEL (Top-Left) -->
      <div class="db-cell cell-header drift from-left">
        <span class="db-tag">SYS_NAME_DECK</span>
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
      </div>

      <!-- CELL 2: BIOMETRIC SCANNER (Top-Right) -->
      <div class="db-cell cell-scanner drift from-right">
        <span class="db-tag">SYS_VISUAL_SCANNER</span>
        <div class="scanner-frame">
          <!-- Cyber crosshair decorations -->
          <div class="crosshair-tl"></div>
          <div class="crosshair-tr"></div>
          <div class="crosshair-bl"></div>
          <div class="crosshair-br"></div>
          
          <div class="scanner-radar"></div>
          
          <!-- Orbit system -->
          <div class="orbit-system" ref="orbitRef">
            <div class="avatar-frame">
              <div class="avatar-frame-inner">
                <img src="/stickers/misc/evernight-dancing.gif" alt="Heiznerd" class="avatar-img" />
              </div>
            </div>

            <!-- Orbital icons -->
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
        </div>
      </div>

      <!-- CELL 3: SPEC SHEET (Bottom-Left) -->
      <div class="db-cell cell-specs drift from-left" style="transition-delay: 100ms">
        <span class="db-tag">SYS_SPECIFICATIONS</span>
        
        <div class="specs-content">
          <!-- Availability Badge -->
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>{{ t.available }}</span>
          </div>

          <p class="hero-greeting">// {{ t.greeting }}</p>
          
          <h2 class="hero-role">
            <span class="typed-text"></span>
            <span class="cursor-blink">|</span>
          </h2>

          <p class="hero-desc">{{ t.description }}</p>

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
        </div>
      </div>

      <!-- CELL 4: SYSTEM KERNEL CONSOLE (Bottom-Right) -->
      <div class="db-cell cell-console drift from-right" style="transition-delay: 150ms">
        <span class="db-tag">SYS_KERNEL_CONSOLE</span>
        
        <div class="console-content">
          <!-- Quote card as terminal output -->
          <div class="quote-card" v-if="quote.content">
            <div class="console-header">
              <span class="console-dot red"></span>
              <span class="console-dot yellow"></span>
              <span class="console-dot green"></span>
              <span class="console-title">motd.sh</span>
            </div>
            <pre class="console-body"><code><span class="c-prompt">$</span> cat quote.txt
<span class="c-text">"{{ quote.content }}"</span>
<span class="c-author">— {{ quote.author }}</span></code></pre>
          </div>

          <div class="console-bottom">
            <!-- GitHub meta card -->
            <div class="avatar-meta" v-if="githubData.name">
              <img :src="githubData.avatar" :alt="githubData.name" class="gh-avatar" />
              <div>
                <p class="gh-name">{{ githubData.name }}</p>
                <p class="gh-handle">@captainnhwuy</p>
              </div>
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
  { family: "'Bricolage Grotesk', sans-serif",   label: 'Bricolage' },
  { family: "'Bebas Neue', sans-serif",          label: 'Bebas Neue' },
  { family: "'Unbounded', sans-serif",           label: 'Unbounded' },
  { family: "'Josefin Sans', sans-serif",        label: 'Josefin Sans' },
  { family: "'Righteous', cursive",              label: 'Righteous' },
  { family: "'JetBrains Mono', monospace",       label: 'JetBrains Mono' },
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
  padding: 40px 0 80px;
  position: relative;
  overflow: hidden;
  background-color: transparent;
}

/* Blueprint grids overlay */
.blueprint-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: 
    linear-gradient(rgba(187, 134, 252, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(187, 134, 252, 0.02) 1px, transparent 1px);
  background-size: 32px 32px;
  background-position: center;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%);
  opacity: 0.8;
  z-index: 0;
}

/* =============================================
   DASHBOARD GRID SYSTEM
   ============================================= */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  grid-template-rows: auto auto;
  gap: 0;
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  overflow: hidden;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  position: relative;
  z-index: 1;
}

/* Standard Spec Cell */
.db-cell {
  padding: 36px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Tag labels on top-right of cells */
.db-tag {
  position: absolute;
  top: 12px;
  right: 16px;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--md-primary);
  opacity: 0.35;
  letter-spacing: 0.1em;
}

/* Grid Dividers */
.cell-header,
.cell-specs {
  border-right: 1px solid var(--md-outline-var);
}

.cell-header,
.cell-scanner {
  border-bottom: 1px solid var(--md-outline-var);
}

/* =============================================
   CELL 1: BRAND HEADER
   ============================================= */
.cell-header {
  min-height: 180px;
}

.hero-name-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: clamp(3rem, 7.5vw, 5.5rem);
  min-height: 70px;
}

.hero-name {
  font-size: clamp(2rem, 6.5vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  color: var(--md-on-surface);
  letter-spacing: -0.04em;
  text-transform: uppercase;
  transition: opacity 0.4s ease, transform 0.4s ease;
  will-change: opacity, transform;
  white-space: nowrap;
}

.hero-name.phase-exit {
  opacity: 0;
  transform: translateY(-12px);
}

.hero-name.phase-enter {
  opacity: 0;
  transform: translateY(12px);
}

.font-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--md-on-surface-var);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-radius: 100px;
  padding: 3px 10px;
  position: absolute;
  bottom: -16px;
  right: 0;
  white-space: nowrap;
}

.font-pill i { font-size: 0.52rem; color: var(--md-primary); }

.pill-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.pill-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.pill-fade-enter-from { opacity: 0; transform: translateY(6px) scale(0.95); }
.pill-fade-leave-to   { opacity: 0; transform: translateY(-4px) scale(0.97); }

/* =============================================
   CELL 2: BIOMETRIC SCANNER (Avatar & radar)
   ============================================= */
.cell-scanner {
  align-items: center;
}

.scanner-frame {
  position: relative;
  width: 100%;
  max-width: 290px;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.005);
  border: 1px dashed rgba(187, 134, 252, 0.15);
  border-radius: var(--md-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Biometric corners */
.crosshair-tl, .crosshair-tr, .crosshair-bl, .crosshair-br {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1.5px solid var(--md-primary);
  opacity: 0.5;
  z-index: 2;
}
.crosshair-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.crosshair-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.crosshair-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.crosshair-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.scanner-radar {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform-origin: center center;
  background: conic-gradient(from 0deg at 50% 50%, rgba(3, 218, 198, 0.12) 0deg, transparent 90deg);
  pointer-events: none;
  z-index: 1;
}

.orbit-system {
  position: relative;
  width: 260px;
  height: 260px;
  z-index: 2;
}

/* Dashed inner circle */
.orbit-system::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 230px;
  height: 230px;
  border-radius: 50%;
  border: 1px dashed rgba(187, 134, 252, 0.12);
  pointer-events: none;
}

.avatar-frame {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--md-surface-container);
  border: 1px solid rgba(187, 134, 252, 0.2);
  padding: 4px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.5);
  animation: frameFloat 6s ease-in-out infinite;
}

@keyframes frameFloat {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50%       { transform: translate(-50%, -50%) translateY(-6px); }
}

.avatar-frame-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--md-surface);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.orbit-pill {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: transform 0.2s;
  animation: orbitFloat 4s ease-in-out infinite;
}

.orbit-pill:hover {
  transform: scale(1.15) !important;
  border-color: var(--md-primary);
}

/* =============================================
   CELL 3: SPEC SHEET (Role & Description)
   ============================================= */
.cell-specs {
  gap: 16px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: rgba(187, 134, 252, 0.05);
  border: 1px solid rgba(187, 134, 252, 0.15);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--md-primary);
  width: fit-content;
  margin-bottom: 12px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--md-primary);
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.hero-greeting {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--md-on-surface-var);
  opacity: 0.8;
}

.hero-role {
  font-size: clamp(1.1rem, 2.2vw, 1.35rem);
  font-weight: 600;
  color: var(--md-secondary);
  font-family: var(--font-sans);
}

.cursor-blink {
  animation: blink 1s step-end infinite;
  color: var(--md-secondary);
}

@keyframes blink { 50% { opacity: 0; } }

.hero-desc {
  font-size: 0.95rem;
  color: var(--md-on-surface-var);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
}

/* =============================================
   CELL 4: KERNEL CONSOLE
   ============================================= */
.cell-console {
  justify-content: space-between;
  gap: 20px;
}

.console-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  gap: 16px;
}

.quote-card {
  background: var(--md-surface);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-lg);
  overflow: hidden;
  box-shadow: var(--md-shadow-1);
}

.console-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.015);
  border-bottom: 1px solid var(--md-outline-var);
}

.console-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.console-dot.red { background: #ff5f56; }
.console-dot.yellow { background: #ffbd2e; }
.console-dot.green { background: #27c93f; }

.console-title {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--md-on-surface-var);
  margin-left: 8px;
  opacity: 0.75;
}

.console-body {
  padding: 14px 18px;
  margin: 0;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.6;
}

.c-prompt {
  color: var(--md-secondary);
  font-weight: 700;
}

.c-text {
  color: var(--md-on-surface);
  display: block;
  margin: 4px 0;
  font-style: italic;
}

.c-author {
  color: var(--md-primary);
  opacity: 0.85;
  font-weight: 600;
}

.console-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

/* GitHub profile chip */
.avatar-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-md);
  padding: 8px 12px;
}

.gh-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.2px solid rgba(187, 134, 252, 0.3);
}

.gh-name {
  font-weight: 600;
  font-size: 0.78rem;
  color: var(--md-on-surface);
  line-height: 1;
}

.gh-handle {
  font-size: 0.68rem;
  color: var(--md-on-surface-var);
  margin-top: 1px;
}

/* Social links row */
.social-row {
  display: flex;
  gap: 6px;
}

.social-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--md-radius-md);
  background: transparent;
  border: 1px solid var(--md-outline-var);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-surface-var);
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.25s var(--md-ease-spring);
}

.social-btn:hover {
  border-color: var(--md-primary);
  color: var(--md-primary);
  background: rgba(187, 134, 252, 0.06);
  transform: translateY(-2px);
}

/* =============================================
   SCROLL HINTS
   ============================================= */
.scroll-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--md-on-surface-var);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  z-index: 2;
}

.mouse {
  width: 18px;
  height: 28px;
  border: 1.5px solid var(--md-outline);
  border-radius: 9px;
  display: flex;
  justify-content: center;
  padding-top: 4px;
}

.mouse-wheel {
  width: 2px;
  height: 4px;
  background: var(--md-primary);
  border-radius: 1px;
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50%       { transform: translateY(6px); opacity: 0.2; }
}

/* =============================================
   RESPONSIVE LAYOUTS
   ============================================= */
@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .db-cell {
    border-right: none !important;
    padding: 28px 24px;
  }
  
  .cell-header,
  .cell-scanner,
  .cell-specs {
    border-bottom: 1px solid var(--md-outline-var) !important;
  }
  
  .orbit-system {
    width: 220px;
    height: 220px;
  }
  .orbit-system::before {
    width: 190px;
    height: 190px;
  }
  .avatar-frame {
    width: 110px;
    height: 110px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-top: 20px;
  }
  .db-cell {
    padding: 24px 16px;
  }
  .console-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<style>
/* Unscoped styling to ensure global animation binds correctly to the radar element without hashing */
.scanner-radar {
  animation: globalRadarRotate 10s linear infinite !important;
}

@keyframes globalRadarRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
