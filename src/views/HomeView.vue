<template>
  <div class="home-view">
    <Hero />
    <About />
    <Skills />
    <Timeline />
    <Projects />
    <Contact />
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import Hero from '../components/Hero.vue';
import About from '../components/About.vue';
import Skills from '../components/Skills.vue';
import Timeline from '../components/Timeline.vue';
import Projects from '../components/Projects.vue';
import Contact from '../components/Contact.vue';

onMounted(async () => {
  await nextTick();
  // Re-trigger drift observer for freshly mounted elements
  window.dispatchEvent(new Event('drift-refresh'));
});
</script>
