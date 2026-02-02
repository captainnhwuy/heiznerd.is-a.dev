<template>
  <div class="marquee-container">
    <div 
      class="marquee-content" 
      ref="marqueeContent"
      :style="{ transform: `translateX(${offset}px)` }"
    >
      <span v-for="n in 20" :key="n" class="marquee-item">
        FRONTEND <span class="separator">•</span> 
        BACKEND <span class="separator">•</span> 
        VUE.JS <span class="separator">•</span> 
        ANIME <span class="separator">•</span> 
        DESIGN <span class="separator">•</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const marqueeContent = ref(null);
const offset = ref(0);
const baseSpeed = 1;
let lastScrollY = 0;
let scrollVelocity = 0;
let animationFrameId = null;

const animate = () => {
  scrollVelocity *= 0.95;
  if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;

  const currentSpeed = baseSpeed + scrollVelocity;
  offset.value -= currentSpeed;

  const contentWidth = marqueeContent.value ? marqueeContent.value.scrollWidth / 2 : 2000;
  
  if (Math.abs(offset.value) >= contentWidth) {
    offset.value = 0;
  }

  animationFrameId = requestAnimationFrame(animate);
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const delta = Math.abs(currentScrollY - lastScrollY);
  scrollVelocity += Math.min(delta * 0.1, 15); 
  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.marquee-container {
  width: 100%;
  background: var(--primary);
  color: black;
  padding: 1rem 0;
  overflow: hidden;
  position: relative;
  border-bottom: 2px solid var(--text-primary);
  transform: rotate(-1deg) scale(1.02);
  z-index: 10;
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
}

.marquee-content {
  display: flex;
  white-space: nowrap;
  /* Removed CSS Animation */
  will-change: transform;
}

.marquee-item {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  margin-right: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.separator {
  color: white;
}
</style>
