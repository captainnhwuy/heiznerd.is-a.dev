<template>
  <Transition name="intro-fade" @after-leave="onDone">
    <div v-if="visible" class="intro-overlay">

      <!-- ========== NAVBAR REPLICA ========== -->
      <nav class="i-nav" :class="{ show: vis.nav }">
        <div class="i-nav-inner">
          <div class="i-logo">
            <div class="i-logo-icon"><span>HN</span></div>
            <span class="i-logo-text">Heiznerd</span>
          </div>
          <ul class="i-nav-links">
            <li>Trang chủ</li><li>Giới thiệu</li><li>Kỹ năng</li>
            <li>Hành trình</li><li>Dự án</li><li>Liên hệ</li>
          </ul>
          <div class="i-lang-chip">🇻🇳 VI</div>
        </div>
      </nav>

      <!-- ========== HERO BODY ========== -->
      <div class="i-hero">
        <div class="i-container">

          <!-- LEFT COLUMN -->
          <div class="i-left">

            <!-- Available badge -->
            <div class="i-badge" :class="{ show: vis.badge }">
              <span class="i-badge-dot"></span>
              <span>Sẵn sàng làm việc</span>
            </div>

            <!-- Greeting — typed -->
            <p class="i-greeting" :class="{ show: display.greeting.length > 0 }">
              {{ display.greeting }}<span v-if="activeLine === 0" class="i-caret">|</span>
            </p>

            <!-- Name — typed, big -->
            <h1 class="i-name" :class="{ show: display.name.length > 0 }">
              {{ display.name }}<span v-if="activeLine === 1" class="i-caret">|</span>
            </h1>

            <!-- Subtitle role — typed -->
            <p class="i-role" :class="{ show: display.role.length > 0 }">
              {{ display.role }}<span v-if="activeLine === 2" class="i-caret">|</span>
            </p>

            <!-- Description -->
            <p class="i-desc" :class="{ show: vis.desc }">
              Frontend Developer đam mê xây dựng ứng dụng web với Vue.js, React.js và Node.js
            </p>

            <!-- Stats chips -->
            <div class="i-stats" :class="{ show: vis.stats }">
              <div class="i-chip"><span class="i-val">10+</span><span class="i-lbl">Dự án</span></div>
              <div class="i-chip"><span class="i-val">14</span><span class="i-lbl">Tuổi</span></div>
              <div class="i-chip"><span class="i-val">5+</span><span class="i-lbl">Công nghệ</span></div>
            </div>

            <!-- Action buttons -->
            <div class="i-actions" :class="{ show: vis.actions }">
              <div class="i-btn-filled"><i class="fas fa-rocket"></i> Xem dự án</div>
              <div class="i-btn-outline"><i class="fas fa-paper-plane"></i> Liên hệ</div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Avatar + Orbits -->
          <div class="i-right" :class="{ show: vis.avatar }">
            <div class="i-orbit-system">

              <!-- Orbit icon pills -->
              <div
                v-for="(ic, idx) in orbitIcons"
                :key="idx"
                class="i-orbit-pill"
                :style="orbitStyleFor(idx)"
              >
                <i :class="ic.icon" :style="{ color: ic.color }"></i>
              </div>

              <!-- Avatar frame -->
              <div class="i-avatar-frame">
                <img src="/stickers/misc/evernight-dancing.gif" alt="Heiznerd" />
              </div>

            </div>
          </div>

        </div>
      </div>

      <!-- Skip hint -->
      <div class="i-skip-hint">Press SPACE to skip</div>

    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['done']);

const visible    = ref(true);
const activeLine = ref(-1);
const display    = reactive({ greeting: '', name: '', role: '' });

// Visibility flags — each triggers a fade-up transition via CSS
const vis = reactive({
  nav: false, badge: false,
  desc: false, stats: false, actions: false, avatar: false,
});

const orbitIcons = [
  { icon: 'fab fa-vuejs',    color: '#42b883' },
  { icon: 'fab fa-js',       color: '#f7df1e' },
  { icon: 'fab fa-node-js',  color: '#68a063' },
  { icon: 'fab fa-react',    color: '#61dafb' },
  { icon: 'fab fa-git-alt',  color: '#f05032' },
  { icon: 'fab fa-github',   color: '#aaa' },
];

const ORBIT_R = 185;
const orbitStyleFor = (i) => {
  const angle = (360 / orbitIcons.length) * i - 90;
  const rad   = (angle * Math.PI) / 180;
  return {
    left: `calc(50% + ${Math.cos(rad) * ORBIT_R}px - 22px)`,
    top:  `calc(50% + ${Math.sin(rad) * ORBIT_R}px - 22px)`,
  };
};

// Helpers
const isSkipping = ref(false);

const wait = ms => new Promise(r => {
  if (isSkipping.value) return; // Suspend if skipping
  setTimeout(r, ms);
});

const show   = key => { vis[key] = true; };
const typeIn = async (key, text, delay) => {
  for (let i = 0; i <= text.length; i++) {
    display[key] = text.slice(0, i);
    await wait(delay);
  }
};

// ─── Main intro sequence ─────────────────────────────
const runIntro = async () => {
  document.body.style.overflow = 'hidden';

  // 1. Navbar fades up
  await wait(200);
  show('nav');
  await wait(350);

  // 2. Badge fades up, then start typing greeting
  show('badge');
  await wait(300);

  activeLine.value = 0;
  await typeIn('greeting', 'Xin chào, tớ là', 50);

  await wait(160);

  // 3. Name types
  activeLine.value = 1;
  await typeIn('name', 'Heiznerd', 88);

  await wait(240);

  // 4. Role types
  activeLine.value = 2;
  await typeIn('role', 'Frontend Developer · Vue.js · Builder of Cool Stuff', 36);

  await wait(450);
  activeLine.value = -1;

  // 5. Reveal remaining elements — fade up in sequence
  await wait(200);
  show('desc');    await wait(280);
  show('stats');   await wait(280);
  show('actions'); await wait(280);
  show('avatar');  await wait(600);

  // 6. Fade out overlay → real page
  visible.value = false;
};

const onDone = () => {
  document.body.style.overflow = '';
  emit('done');
};

const skipIntro = () => {
  if (isSkipping.value) return;
  isSkipping.value = true;
  visible.value = false;
  window.removeEventListener('keydown', handleKeyDown);
};

const handleKeyDown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    skipIntro();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  runIntro();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* =============================================
   INTRO OVERLAY — full black canvas
   ============================================= */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--md-bg, #0F0F11);
  overflow: hidden;
  pointer-events: all;
}

.intro-fade-leave-active { transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1); }
.intro-fade-leave-to     { opacity: 0; }

/* ========== FADE-UP BASE STATE ========== */
/* Every element starts hidden + shifted down, gains .show to fade up */
.i-nav,
.i-badge,
.i-greeting,
.i-name,
.i-role,
.i-desc,
.i-stats,
.i-actions,
.i-right {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.i-nav.show,
.i-badge.show,
.i-greeting.show,
.i-name.show,
.i-role.show,
.i-desc.show,
.i-stats.show,
.i-actions.show,
.i-right.show {
  opacity: 1;
  transform: translateY(0);
}

/* Greeting/name/role appear as text is typed — show when non-empty */
/* The `show` class handles this for typed elements too */

/* ========== NAVBAR ========== */
.i-nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 64px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  z-index: 10;
}

.i-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 40px;
}

.i-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.i-logo-icon {
  width: 36px; height: 36px;
  background: rgba(187,134,252,0.15);
  border: 1px solid rgba(187,134,252,0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.i-logo-icon span {
  font-size: 0.75rem;
  font-weight: 700;
  color: #BB86FC;
  font-family: var(--font-sans, 'Google Sans', sans-serif);
}

.i-logo-text {
  font-family: var(--font-display, 'Google Sans Display', sans-serif);
  font-size: 1.05rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
}

.i-nav-links {
  display: flex;
  list-style: none;
  gap: 28px;
  margin: 0; padding: 0;
  flex: 1;
  justify-content: center;
}

.i-nav-links li {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.88rem;
  color: rgba(255,255,255,0.5);
  cursor: default;
}

.i-lang-chip {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 100px;
  padding: 4px 12px;
  margin-left: auto;
}

/* ========== HERO BODY ========== */
.i-hero {
  position: absolute;
  inset: 64px 0 0 0;            /* below navbar */
  display: flex;
  align-items: center;
}

.i-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  gap: 60px;
}

/* ---- LEFT ---- */
.i-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Badge */
.i-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.82rem;
  color: rgba(187,134,252,0.9);
  border: 1px solid rgba(187,134,252,0.28);
  border-radius: 100px;
  padding: 5px 14px;
  width: fit-content;
}

.i-badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #BB86FC;
  animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

/* Greeting */
.i-greeting {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 1.05rem;
  color: rgba(255,255,255,0.52);
  min-height: 1.55em;
}

/* Name — mirrors .hero-name */
.i-name {
  font-family: var(--font-display, 'Google Sans Display', sans-serif);
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #fff;
  min-height: 1.1em;
}

/* Role subtitle */
.i-role {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 500;
  color: #BB86FC;
  min-height: 1.5em;
}

/* Description */
.i-desc {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.55);
  max-width: 420px;
}

/* Stats */
.i-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.i-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(255,255,255,0.025);
  gap: 2px;
  min-width: 72px;
}

.i-val {
  font-family: var(--font-display, 'Google Sans Display', sans-serif);
  font-size: 1.3rem;
  font-weight: 700;
  color: #BB86FC;
}

.i-lbl {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.68rem;
  color: rgba(255,255,255,0.4);
}

/* Action buttons */
.i-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.i-btn-filled,
.i-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: 100px;
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: default;
}

.i-btn-filled {
  background: #BB86FC;
  color: #000;
}

.i-btn-outline {
  border: 1.5px solid rgba(187,134,252,0.45);
  color: rgba(187,134,252,0.9);
}

/* ---- RIGHT: Avatar ---- */
.i-right {
  flex: 0 0 auto;
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.i-orbit-system {
  position: relative;
  width: 380px;
  height: 380px;
}

.i-avatar-frame {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 0 0 2px rgba(187,134,252,0.2), 0 24px 60px rgba(0,0,0,0.6);
}

.i-avatar-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.i-orbit-pill {
  position: absolute;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
}

/* ========== CARET ========== */
.i-caret {
  display: inline-block;
  color: #BB86FC;
  font-weight: 300;
  animation: caretBlink 0.75s step-end infinite;
  margin-left: 1px;
}
@keyframes caretBlink { 50% { opacity: 0; } }

/* ========== SKIP HINT ========== */
.i-skip-hint {
  position: absolute;
  bottom: 30px;
  right: 40px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 100;
}

/* ========== Responsive ========== */
@media (max-width: 900px) {
  .i-right { display: none; }
  .i-nav-links { display: none; }
  .i-left { padding-right: 0; }
  .i-skip-hint {
    bottom: 20px;
    right: 20px;
    font-size: 0.65rem;
  }
}
</style>
