<template>
  <div id="app">
    <div class="noise-bg"></div>

    <!-- Cinematic intro — once per session -->
    <IntroScreen v-if="showIntro" @done="onIntroDone" />

    <!-- Rich background layer: multiple geometric shapes + grid -->
    <div class="bg-layer" aria-hidden="true">
      <!-- Rounded rectangles -->
      <div class="bg-shape s1"></div>
      <div class="bg-shape s2"></div>
      <!-- Circle -->
      <div class="bg-shape s-circle"></div>
      <!-- Triangle -->
      <div class="bg-shape s-triangle"></div>
      <!-- Hexagon -->
      <div class="bg-shape s-hex"></div>
      <!-- Diamond -->
      <div class="bg-shape s-diamond"></div>
      <!-- Small accent rectangles -->
      <div class="bg-shape s5"></div>
      <div class="bg-shape s6"></div>
      <!-- Dot grid -->
      <div class="bg-dots"></div>
    </div>

    <CustomCursor />
    <ScrollProgress />
    <Navbar />

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import CustomCursor from './components/CustomCursor.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import Navbar from './components/Navbar.vue';
import IntroScreen from './components/IntroScreen.vue';
import { ref, provide, reactive, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { translations } from './translations.js';

const Footer = defineAsyncComponent(() => import('./components/Footer.vue'));

// Show intro on every load
const showIntro = ref(true);
const onIntroDone = () => {
  showIntro.value = false;
};


const lang = ref(localStorage.getItem('preferred-lang') || 'vi');
const currentLang = ref(lang.value);

provide('lang', lang);
provide('currentLang', currentLang);
provide('translations', reactive(translations));

// Intersection Observer for active nav link
let navObserver;
const setupNavObserver = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href')?.slice(1) === id) link.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => navObserver.observe(s));
};

// Global drift-in observer
let driftObserver;
const setupDriftObserver = () => {
  driftObserver?.disconnect();
  driftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        driftObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.drift:not(.visible)').forEach(el => driftObserver.observe(el));
};

onMounted(() => {
  setupNavObserver();
  setTimeout(setupDriftObserver, 200);
  window.addEventListener('drift-refresh', () => {
    setTimeout(setupDriftObserver, 120);
  });
});

onUnmounted(() => {
  navObserver?.disconnect();
  driftObserver?.disconnect();
});
</script>

<style>
/* ================================================
   DRIFT ANIMATION STATES
   ================================================ */
.drift {
  opacity: 0;
  transition: opacity 0.7s var(--md-ease-spring),
              transform 0.7s var(--md-ease-spring),
              filter 0.7s var(--md-ease-spring);
}

.drift.from-left   { transform: translateX(-70px); }
.drift.from-right  { transform: translateX(70px); }
.drift.from-top    { transform: translateY(-36px); filter: blur(3px); }
.drift.from-bottom { transform: translateY(56px) scale(0.97); }
.drift.burst       { transform: scale(0.5) rotate(-8deg); opacity: 0; }

.drift.visible {
  opacity: 1 !important;
  transform: translateX(0) translateY(0) scale(1) rotate(0) !important;
  filter: blur(0) !important;
}

/* Stagger delays */
.drift-stagger > *:nth-child(1)  { transition-delay: 0ms; }
.drift-stagger > *:nth-child(2)  { transition-delay: 70ms; }
.drift-stagger > *:nth-child(3)  { transition-delay: 140ms; }
.drift-stagger > *:nth-child(4)  { transition-delay: 210ms; }
.drift-stagger > *:nth-child(5)  { transition-delay: 280ms; }
.drift-stagger > *:nth-child(6)  { transition-delay: 350ms; }
.drift-stagger > *:nth-child(7)  { transition-delay: 420ms; }
.drift-stagger > *:nth-child(8)  { transition-delay: 490ms; }
.drift-stagger > *:nth-child(n+9){ transition-delay: 560ms; }

/* ================================================
   BACKGROUND LAYER
   ================================================ */
.bg-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* Dot grid pattern */
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(187, 134, 252, 0.28) 1px,
    transparent 1px
  );
  background-size: 36px 36px;
  opacity: 0.45;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

/* Geometric shapes */
.bg-shape {
  position: absolute;
  pointer-events: none;
}

/* ---- Rounded rectangles (outline style) ---- */
.s1 {
  width: 480px; height: 480px;
  top: -160px; right: -120px;
  border: 2px solid rgba(187, 134, 252, 0.26);
  border-radius: 40px;
  transform: rotate(18deg);
  animation: bgSpin1 60s linear infinite;
}

.s2 {
  width: 360px; height: 360px;
  bottom: 5%; left: -100px;
  border: 2px solid rgba(3, 218, 198, 0.22);
  border-radius: 32px;
  transform: rotate(-22deg);
  animation: bgSpin2 80s linear infinite;
}

/* ---- Circle (outline) ---- */
.s-circle {
  width: 240px; height: 240px;
  top: 35%; left: 3%;
  border: 2px solid rgba(187, 134, 252, 0.22);
  border-radius: 50%;
  animation: bgSpin1 90s linear infinite reverse;
}

/* ---- Triangle (solid clip-path) ---- */
.s-triangle {
  width: 160px; height: 160px;
  top: 15%; right: 12%;
  background: rgba(187, 134, 252, 0.09);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 0;
  animation: bgSpin2 70s linear infinite;
}

/* ---- Hexagon (solid clip-path) ---- */
.s-hex {
  width: 130px; height: 150px;
  bottom: 20%; right: 5%;
  background: rgba(3, 218, 198, 0.08);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: bgSpin1 100s linear infinite;
}

/* ---- Diamond (square rotated 45°, outline) ---- */
.s-diamond {
  width: 120px; height: 120px;
  top: 60%; left: 18%;
  border: 2px solid rgba(187, 134, 252, 0.22);
  border-radius: 8px;
  transform: rotate(45deg);
  animation: bgSpin2 55s linear infinite reverse;
}

/* ---- Small accent rectangles ---- */
.s5 {
  width: 200px; height: 200px;
  bottom: 10%; right: 25%;
  border: 2px solid rgba(187, 134, 252, 0.18);
  border-radius: 20px;
  transform: rotate(12deg);
  animation: bgSpin1 85s linear infinite;
}

.s6 {
  width: 90px; height: 90px;
  top: 50%; left: 30%;
  border: 2px solid rgba(3, 218, 198, 0.18);
  border-radius: 8px;
  transform: rotate(60deg);
  animation: bgSpin2 50s linear infinite;
}

@keyframes bgSpin1 { to { transform: rotate(378deg); } }
@keyframes bgSpin2 { to { transform: rotate(-382deg); } }

</style>