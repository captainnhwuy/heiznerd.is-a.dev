<template>
  <section id="home" class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-badge" data-aos="fade-down">
          <span class="badge-icon">👋</span>
          <span>{{ t.greeting }}</span>
        </div>
        <h1 class="hero-name" data-aos="fade-up" data-aos-delay="100">
          <span class="name-highlight">Heiznerd</span>
        </h1>
        <h2 class="hero-title" data-aos="fade-up" data-aos-delay="200">
          <span class="typing-text"></span>
        </h2>
        <p class="hero-description" data-aos="fade-up" data-aos-delay="300">
          {{ t.description }}
        </p>
        <div class="hero-stats" data-aos="fade-up" data-aos-delay="400">
          <div class="stat-item">
            <div class="stat-number">{{ t.stats.projectsVal }}</div>
            <div class="stat-label">{{ t.projects }}</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ t.stats.ageVal }}</div>
            <div class="stat-label">{{ t.age }}</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ t.stats.techVal }}</div>
            <div class="stat-label">{{ t.technologies }}</div>
          </div>
        </div>
        <div class="hero-buttons" data-aos="fade-up" data-aos-delay="500">
          <a href="#projects" class="btn btn-primary">
            <span>{{ t.viewWork }}</span>
            <i class="fas fa-arrow-right"></i>
          </a>
          <a href="#contact" class="btn btn-secondary">
            <span>{{ t.contact }}</span>
            <i class="fas fa-paper-plane"></i>
          </a>
        </div>
        <div class="social-links" data-aos="fade-up" data-aos-delay="600">
          <a href="https://github.com/captainnhwuy" target="_blank" class="social-icon" data-tooltip="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://discord.com/users/1316287191634149377" target="_blank" class="social-icon" data-tooltip="Discord">
            <i class="fab fa-discord"></i>
          </a>
          <a href="https://www.facebook.com/nguyen.huu.quy.906170" target="_blank" class="social-icon" data-tooltip="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
        </div>
      </div>
      <div class="hero-image" data-aos="fade-left" data-aos-delay="400">
        <div 
          class="image-wrapper" 
          @mousemove="handleMouseMove" 
          @mouseleave="resetTilt"
          ref="imageWrapper"
        >
          <div class="image-glow"></div>
          <div class="image-container" :style="tiltStyle">
            <img src="/evernight-dancing.gif" alt="Heiznerd Avatar">
          </div>
          <div class="status-badge">
            <span class="status-dot pulse"></span>
            <span>{{ t.available }}</span>
          </div>
        </div>
        <DateTimeEvents data-aos="fade-left" data-aos-delay="500" />
      </div>
    </div>
    <div class="scroll-indicator" data-aos="fade-up" data-aos-delay="700">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <span>{{ t.scroll }}</span>
    </div>
  </section>
</template>

<script setup>
import { inject, ref, computed } from 'vue';
import DateTimeEvents from './DateTimeEvents.vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].hero;

const imageWrapper = ref(null);
const tiltX = ref(0);
const tiltY = ref(0);

const tiltStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) scale3d(1.05, 1.05, 1.05)`,
    transition: 'transform 0.1s ease-out'
  };
});

const handleMouseMove = (e) => {
  if (!imageWrapper.value) return;
  
  const rect = imageWrapper.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
  const rotateY = ((x - centerX) / centerX) * 10;
  
  tiltX.value = rotateX;
  tiltY.value = rotateY;
};

const resetTilt = () => {
  tiltX.value = 0;
  tiltY.value = 0;
};
</script>
