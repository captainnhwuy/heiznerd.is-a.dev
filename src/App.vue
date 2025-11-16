<template>
  <div id="app">
    <StarTrails />
    <Navbar />
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import StarTrails from './components/StarTrails.vue';
import Hero from './components/Hero.vue';
import About from './components/About.vue';
import Skills from './components/Skills.vue';
import Projects from './components/Projects.vue';
import Contact from './components/Contact.vue';

import { onMounted, ref, provide, reactive } from 'vue';
import { translations } from './translations.js';

const lang = ref(localStorage.getItem('preferred-lang') || 'vi');
const currentLang = ref(lang.value);

provide('lang', lang);
provide('currentLang', currentLang);
provide('translations', reactive(translations));

onMounted(() => {
  // Typed.js
  if (typeof Typed !== 'undefined') {
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
  }

  // AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }

  // Navbar scroll effect & Active nav link on scroll
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-link');
  // Throttle scroll event for better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      // Scrolled class for navbar
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Active class for nav links
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
      
      scrollTimeout = null;
    }, 50);
  });

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
});

</script>