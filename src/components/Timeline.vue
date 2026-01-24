<template>
  <section id="timeline" class="timeline">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
      </div>
      
      <div class="timeline-container">
        <div 
          v-for="(item, index) in t.items" 
          :key="index" 
          class="timeline-item"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-date">{{ item.year }}</div>
          <div class="glass-card timeline-content">
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].timeline;
</script>
