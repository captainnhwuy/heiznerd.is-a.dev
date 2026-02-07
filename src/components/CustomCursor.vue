<template>
  <div class="cursor-wrapper">
    <!-- Main Cursor -->
    <div 
      class="custom-cursor" 
      :style="{ left: x + 'px', top: y + 'px' }"
      :class="{ 'hovering': isHovering, 'clicking': isClicking }"
    ></div>
    
    <!-- Trail Effect -->
    <div 
      v-for="(point, index) in trail" 
      :key="index"
      class="cursor-trail"
      :style="{ 
        left: point.x + 'px', 
        top: point.y + 'px',
        opacity: (1 - index / trailLength) * 0.5,
        transform: `translate(-50%, -50%) scale(${1 - index / trailLength})`
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const x = ref(-100);
const y = ref(-100);
const isHovering = ref(false);
const isClicking = ref(false);
const trail = ref([]);
const trailLength = 12;

const moveCursor = (e) => {
  x.value = e.clientX;
  y.value = e.clientY;
  
  // Add point to trail
  trail.value.unshift({ x: e.clientX, y: e.clientY });
  if (trail.value.length > trailLength) {
    trail.value.pop();
  }
};

const checkHover = (e) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button') || e.target.classList.contains('sticker')) {
    isHovering.value = true;
  } else {
    isHovering.value = false;
  }
};

const mouseDown = () => {
  isClicking.value = true;
};

const mouseUp = () => {
  isClicking.value = false;
};

onMounted(() => {
  window.addEventListener('mousemove', moveCursor);
  window.addEventListener('mouseover', checkHover);
  window.addEventListener('mousedown', mouseDown);
  window.addEventListener('mouseup', mouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', moveCursor);
  window.removeEventListener('mouseover', checkHover);
  window.removeEventListener('mousedown', mouseDown);
  window.removeEventListener('mouseup', mouseUp);
});
</script>

<style scoped>
.cursor-wrapper {
  pointer-events: none;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.custom-cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  background-color: white; /* Inverts to black on dark bg */
  border-radius: 0; /* Square for brutalism */
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10002;
  mix-blend-mode: difference;
  transition: width 0.2s, height 0.2s, background-color 0.2s, transform 0.1s;
}

.custom-cursor.hovering {
  width: 80px;
  height: 80px;
  background-color: white;
  mix-blend-mode: difference;
  border-radius: 50%; /* Circle on hover */
}

.custom-cursor.clicking {
  transform: translate(-50%, -50%) scale(0.5);
}

.cursor-trail {
  position: fixed;
  width: 15px;
  height: 15px;
  background-color: var(--primary);
  border-radius: 0;
  pointer-events: none;
  z-index: 10001;
  transition: opacity 0.1s;
}
</style>
