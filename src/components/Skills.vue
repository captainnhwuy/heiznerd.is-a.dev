<template>
  <section id="skills" class="skills">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
      </div>
      <div class="skills-grid">
        <div class="glass-card skill-category" data-aos="fade-up" data-aos-delay="100">
          <div class="category-header">
            <div class="category-icon">
              <i class="fas fa-code"></i>
            </div>
            <h3 class="category-title">{{ t.languages }}</h3>
          </div>
          <div class="skill-bars">
            <div class="skill-bar" v-for="skill in languages" :key="skill.name">
              <div class="skill-info">
                <div class="skill-name">
                  <i :class="skill.icon"></i>
                  <span>{{ skill.name }}</span>
                </div>
                <span class="skill-percent">{{ skill.level }}%</span>
              </div>
              <div class="skill-progress">
                <div class="skill-fill" :data-percent="skill.level" :style="{ '--fill-color': skill.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card skill-category" data-aos="fade-up" data-aos-delay="200">
          <div class="category-header">
            <div class="category-icon">
              <i class="fas fa-tools"></i>
            </div>
            <h3 class="category-title">{{ t.tools }}</h3>
          </div>
          <div class="tech-grid">
            <div class="tech-card" v-for="tech in technologies" :key="tech.name" data-aos="zoom-in" :data-aos-delay="tech.delay">
              <div class="tech-icon" :style="{ color: tech.color }">
                <i :class="tech.icon"></i>
              </div>
              <div class="tech-name">{{ tech.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].skills;

const languages = ref([
  { name: 'Vue.js', level: 30, icon: 'fab fa-vuejs', color: '#42b883' },
  { name: 'JavaScript', level: 49, icon: 'fab fa-js', color: '#f7df1e' },
  { name: 'Discord.js', level: 20, icon: 'fab fa-discord', color: '#5865f2' },
  { name: 'C++', level: 17, icon: 'fas fa-code', color: '#00599c' },
  { name: 'Rust', level: 2, icon: 'fas fa-cog', color: '#ce422b' },
]);

const technologies = ref([
  { name: 'Node.js', icon: 'fab fa-node-js', color: '#68a063', delay: 50 },
  { name: 'React', icon: 'fab fa-react', color: '#61dafb', delay: 100 },
  { name: 'Git', icon: 'fab fa-git-alt', color: '#f05032', delay: 150 },
  { name: 'GitHub', icon: 'fab fa-github', color: '#fff', delay: 200 },
  { name: 'Linux', icon: 'fab fa-linux', color: '#fcc624', delay: 250 },
  { name: 'Vite', icon: 'fas fa-bolt', color: '#646cff', delay: 300 },
]);
</script>
