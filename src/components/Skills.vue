<template>
  <section id="skills" class="skills">
    <div class="container">
      <div class="section-header" data-aos="fade-right">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="section-subtitle-text" v-if="t.headerSubtitle">{{ t.headerSubtitle }}</div>
      </div>
      <div class="skills-grid">
        <!-- Languages Column -->
        <div class="skill-category" data-aos="fade-up">
          <div class="category-header">
            <i class="fas fa-code category-icon"></i>
            <h3 class="category-title">{{ t.languages }}</h3>
          </div>
          <div class="skill-list">
            <div class="skill-item" v-for="skill in languages" :key="skill.name">
              <div class="skill-meta">
                <span class="skill-name">
                  <i :class="skill.icon"></i> {{ skill.name }}
                </span>
                <span class="skill-pct">{{ skill.level }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: skill.level + '%', background: skill.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tools Column -->
        <div class="skill-category" data-aos="fade-up" data-aos-delay="200">
          <div class="category-header">
            <i class="fas fa-tools category-icon"></i>
            <h3 class="category-title">{{ t.tools }}</h3>
          </div>
          <div class="tools-grid">
            <div class="tool-card" v-for="tech in technologies" :key="tech.name" :style="{ transform: `rotate(${Math.random() * 6 - 3}deg)` }">
              <div class="tool-icon" :style="{ color: tech.color }">
                <i :class="tech.icon"></i>
              </div>
              <div class="tool-name">{{ tech.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-top: 3rem;
}

@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 4px solid var(--text-primary);
  padding-bottom: 0.5rem;
}

.category-icon {
  font-size: 2rem;
  color: var(--primary);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  transition: color 0.2s;
}

.category-title:hover {
  color: var(--primary);
  animation: twitch 0.3s infinite;
  text-shadow: 2px 2px 0px var(--secondary);
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.progress-track {
  height: 20px;
  background: #111;
  border: 1px solid var(--text-secondary);
  position: relative;
}

.progress-fill {
  height: 100%;
  position: relative;
}

/* Tools Grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.tool-card {
  aspect-ratio: 1;
  background: black;
  border: 2px solid var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  cursor: crosshair;
}

.tool-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 var(--primary);
  border-color: var(--primary);
}

.tool-icon {
  font-size: 2rem;
}

.tool-name {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}
</style>


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
  { name: 'Ruby on Rails', icon: 'fas fa-gem', color: '#CC0000', delay: 75 },
  { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791', delay: 100 },
  { name: 'Redis', icon: 'fas fa-server', color: '#D82C20', delay: 125 },
  { name: 'React', icon: 'fab fa-react', color: '#61dafb', delay: 100 },
  { name: 'Git', icon: 'fab fa-git-alt', color: '#f05032', delay: 150 },
  { name: 'GitHub', icon: 'fab fa-github', color: '#fff', delay: 200 },
  { name: 'Linux', icon: 'fab fa-linux', color: '#fcc624', delay: 250 },
  { name: 'Vite', icon: 'fas fa-bolt', color: '#646cff', delay: 300 },
]);
</script>
