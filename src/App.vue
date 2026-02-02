<template>
  <div id="app">
    <div class="noise-bg"></div>
    <Loading :hide="!isLoading" @hide-loading="hideLoading" :show-skip-button="true" />
    <template v-if="!isLoading">
      <CustomCursor />
      <Navbar />
      <VerticalMarquee />
      
      <!-- Decorative Stickers -->
      <Sticker text="100% VUE.JS" top="15%" right="10%" rotation="15deg" color="var(--primary)" />
      <Sticker text="NO BUGS" top="45%" left="5%" rotation="-10deg" color="var(--secondary)" />
      <Sticker text="APPROVED" bottom="20%" right="15%" rotation="5deg" color="#00FFFF" />

      <Hero />
      <Marquee />
      <main>
        <router-view />
      </main>
      <Footer />
      <Music />
    </template>
  </div>
</template>

<script setup>
import CustomCursor from './components/CustomCursor.vue';
import Marquee from './components/Marquee.vue';
import VerticalMarquee from './components/VerticalMarquee.vue';
import Sticker from './components/Sticker.vue';
import Navbar from './components/Navbar.vue';
import Loading from './components/Loading.vue'; // Keep explicit import for LCP/First view
import { ref, provide, reactive, watch, nextTick, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { translations } from './translations.js';
import Typed from 'typed.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Lazy load heavy components that are not critical for LCP
const Footer = defineAsyncComponent(() => import('./components/Footer.vue'));
const Music = defineAsyncComponent(() => import('./components/Music.vue'));

const isLoading = ref(true);

const hideLoading = () => {
  isLoading.value = false;
};

const lang = ref(localStorage.getItem('preferred-lang') || 'vi');
const currentLang = ref(lang.value);

provide('lang', lang);
provide('currentLang', currentLang);
provide('translations', reactive(translations));

// Intersection Observer for Active Nav Link
let observer;
const setupIntersectionObserver = () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
    threshold: 0
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').slice(1) === id) {
             link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
};

const initializeContent = () => {
  // Typed.js
  new Typed('.typing-text', {
    strings: [
      'Frontend Developer',
      'Vue.js Enthusiast',
    ],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 2000,
    loop: true
  });

  // AOS
  AOS.init({
    duration: 1000,
    once: true,
  });

  // Setup Navigation Observer
  setupIntersectionObserver();

  // Skill bars animation
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillFills = entry.target.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => {
          const percent = fill.getAttribute('data-percent');
          setTimeout(() => {
            fill.style.width = percent + '%';
          }, 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const skillsSections = document.querySelectorAll('.skills');
  skillsSections.forEach(section => {
    skillObserver.observe(section);
  });
};

watch(isLoading, (newVal) => {
  if (newVal === false) {
    nextTick(() => {
      initializeContent();
    });
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

</script>