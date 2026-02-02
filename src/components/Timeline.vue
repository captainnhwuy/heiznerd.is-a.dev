<template>
  <section id="timeline" class="timeline">
    <div class="container">
      <div class="section-header" data-aos="fade-right">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="section-subtitle-text" v-if="t.headerSubtitle">{{ t.headerSubtitle }}</div>
      </div>
      
      <div class="timeline-container">
        <div 
          v-for="(item, index) in t.items" 
          :key="index" 
          class="timeline-item"
          data-aos="fade-left"
          :data-aos-delay="index * 100"
        >
          <div class="timeline-marker"></div>
          <div class="timeline-date">{{ item.year }}</div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-container {
  position: relative;
  max-width: 800px;
  margin: 4rem auto 0;
  padding-left: 2rem;
  border-left: 4px solid var(--text-primary);
}

.timeline-item {
  position: relative;
  margin-bottom: 4rem;
  padding-left: 3rem;
}

.timeline-marker {
  position: absolute;
  left: -2.6rem; 
  top: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  background: black;
  border: 4px solid var(--primary);
  transition: all 0.2s;
}

.timeline-item:hover .timeline-marker {
  background: var(--primary);
  box-shadow: 0 0 15px var(--primary);
  transform: scale(1.2) rotate(45deg);
}

.timeline-date {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.timeline-content {
  background: black;
  border: 2px solid var(--text-primary);
  padding: 1.5rem;
  position: relative;
  transition: all 0.2s;
}

.timeline-item:hover .timeline-content {
  transform: translate(10px, -5px);
  box-shadow: -8px 8px 0 var(--text-secondary);
  border-color: var(--primary);
}

.timeline-title {
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  color: white;
}

.timeline-desc {
  font-size: 1rem;
  color: var(--text-secondary);
}
</style>


<script setup>
import { inject } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].timeline;
</script>
