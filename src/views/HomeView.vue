<template>
  <div class="home-view">
    <Hero />
    <About />
    <TechMarquee />
    <Timeline />
    <Projects />
    <ThanksNekoTech />
    <Marquee :items="topTech" label="Frontend and backend technologies" />
    <Contact />
    <Marquee :items="bottomTech" direction="right" :duration="40" label="Tools and platform technologies" />
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import Hero from '../components/Hero.vue';
import About from '../components/About.vue';
import TechMarquee from '../components/TechMarquee.vue';
import Timeline from '../components/Timeline.vue';
import Projects from '../components/Projects.vue';
import ThanksNekoTech from '../components/ThanksNekoTech.vue';
import Marquee from '../components/Marquee.vue';
import Contact from '../components/Contact.vue';

const tech = (name, icon, mark, color) => ({ name, icon, mark, color });
const topTech = [
  tech('Vue', 'fab fa-vuejs', '', '#42b883'),
  tech('Vite', '', 'V', '#a987e8'),
  tech('ReactJS', 'fab fa-react', '', '#61dafb'),
  tech('NodeJS', 'fab fa-node-js', '', '#68a063'),
  tech('TypeScript', '', 'TS', '#5995d4'),
  tech('Ruby on Rails', 'fas fa-gem', '', '#c96875'),
  tech('Fastify', '', 'F', '#c8b7df'),
  tech('ExpressJS', '', 'Ex', '#b5aec2'),
];
const bottomTech = [
  tech('PostgreSQL', '', 'PG', '#668fbf'),
  tech('Redis', '', 'R', '#d06666'),
  tech('Git', 'fab fa-git-alt', '', '#e17859'),
  tech('GitHub', 'fab fa-github', '', '#d4cedc'),
  tech('Linux', 'fab fa-linux', '', '#e1c263'),
  tech('WSL', '', '>_', '#9b8fb1'),
  tech('JavaScript', 'fab fa-js', '', '#e7d052'),
  tech('C++', '', 'C++', '#7d91cc'),
];

onMounted(async () => {
  await nextTick();
  // Re-trigger drift observer for freshly mounted elements
  window.dispatchEvent(new Event('drift-refresh'));
});
</script>
