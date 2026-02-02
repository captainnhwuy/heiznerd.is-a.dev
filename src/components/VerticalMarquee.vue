<template>
  <div class="vertical-marquee">
    <div 
      class="vm-content" 
      ref="marqueeContent"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <!-- Duplicated content for seamless scrolling -->
      <span v-for="n in 40" :key="n" class="vm-item">
        SCROLL &nbsp;•&nbsp; EXPLORE &nbsp;•&nbsp; CREATE &nbsp;•&nbsp;
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const marqueeContent = ref(null);
const offset = ref(0);
const baseSpeed = 0.5;
let lastScrollY = 0;
let scrollVelocity = 0;
let animationFrameId = null;

const animate = () => {
  // Friction to slowly reduce velocity back to 0
  scrollVelocity *= 0.95;
  if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;

  // Move content
  // Direction depends on preference, here we move UP
  const currentSpeed = baseSpeed + scrollVelocity;
  offset.value -= currentSpeed;

  // Seamless Check
  // We assume the content is duplicated or long enough. 
  // Ideally we should measure height. For now, let's reset efficiently.
  const contentHeight = marqueeContent.value ? marqueeContent.value.scrollHeight / 2 : 1000;
  
  if (Math.abs(offset.value) >= contentHeight) {
    offset.value = 0;
  }

  animationFrameId = requestAnimationFrame(animate);
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  // Increase velocity based on scroll delta
  // Limiting max velocity to avoid chaos
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
.vertical-marquee {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 40px;
  background: var(--bg-dark);
  border-left: 2px solid var(--text-primary);
  z-index: 900;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.vm-content {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  white-space: nowrap;
  /* Removed CSS Animation */
  display: flex;
  align-items: center;
  will-change: transform;
}

.vm-item {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-muted);
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .vertical-marquee {
    display: none;
  }
}
</style>
