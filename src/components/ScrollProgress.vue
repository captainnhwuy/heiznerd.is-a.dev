<template>
  <div class="scroll-progress" :style="{ color: scrollColor }">
    {{ formattedProgress }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const progress = ref(0);
const scrollColor = ref('var(--text-muted)');

const formattedProgress = computed(() => {
  return Math.round(progress.value).toString().padStart(3, '0') + '%';
});

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progress.value = Math.min(100, Math.max(0, scrollPercent));

  // Change color based on thresholds
  if (progress.value > 90) scrollColor.value = 'var(--primary)';
  else if (progress.value > 50) scrollColor.value = 'var(--text-primary)';
  else scrollColor.value = 'var(--text-muted)';
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  font-family: 'Outfit', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  z-index: 9990;
  pointer-events: none;
  mix-blend-mode: difference;
  transition: color 0.3s;
  line-height: 1;
}
</style>
