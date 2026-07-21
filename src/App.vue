<template>
  <div id="app" :class="{ 'intro-done': !showIntro }">
    <!-- Cinematic intro — once per session -->
    <IntroScreen v-if="showIntro" @done="onIntroDone" />

    <AnimatedVectorTopography />

    <CustomCursor />
    <ScrollProgress />
    <Navbar :intro-complete="!showIntro" />

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
import AnimatedVectorTopography from './components/AnimatedVectorTopography.vue';
import { ref, provide, reactive, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { translations } from './translations.js';

const Footer = defineAsyncComponent(() => import('./components/Footer.vue'));

// Show intro on every load
const showIntro = ref(true);
const onIntroDone = () => {
  showIntro.value = false;
  window.setTimeout(setupDriftObserver, 80);
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

const refreshDrift = () => {
  if (!showIntro.value) window.setTimeout(setupDriftObserver, 120);
};

onMounted(() => {
  setupNavObserver();
  window.addEventListener('drift-refresh', refreshDrift);
});

onUnmounted(() => {
  navObserver?.disconnect();
  driftObserver?.disconnect();
  window.removeEventListener('drift-refresh', refreshDrift);
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

</style>