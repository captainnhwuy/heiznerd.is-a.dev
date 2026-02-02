<template>
  <div 
    class="custom-cursor" 
    :style="{ left: x + 'px', top: y + 'px' }"
    :class="{ 'hovering': isHovering }"
  ></div>
  <div 
    class="cursor-dot"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const x = ref(-100);
const y = ref(-100);
const isHovering = ref(false);

const moveCursor = (e) => {
  x.value = e.clientX;
  y.value = e.clientY;
};

const checkHover = (e) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
    isHovering.value = true;
  } else {
    isHovering.value = false;
  }
};

onMounted(() => {
  window.addEventListener('mousemove', moveCursor);
  window.addEventListener('mouseover', checkHover);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', moveCursor);
  window.removeEventListener('mouseover', checkHover);
});
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 2px solid var(--primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: width 0.2s, height 0.2s, background-color 0.2s;
}

.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  background-color: var(--primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10000;
  mix-blend-mode: difference;
}

.custom-cursor.hovering {
  width: 60px;
  height: 60px;
  background-color: rgba(204, 255, 0, 0.2);
  border-color: transparent;
}
</style>
