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
  top: 0; left: 0;
  width: 100%; height: 100%;
}

.custom-cursor {
  position: fixed;
  width: 10px;
  height: 10px;
  background-color: var(--md-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10002;
  transition: width 0.25s var(--md-ease-spring),
              height 0.25s var(--md-ease-spring),
              background-color 0.25s,
              transform 0.1s;
  box-shadow: 0 0 8px rgba(187, 134, 252, 0.4);
}

.custom-cursor.hovering {
  width: 36px;
  height: 36px;
  background-color: rgba(187, 134, 252, 0.15);
  border: 1.5px solid var(--md-primary);
  box-shadow: 0 0 16px rgba(187, 134, 252, 0.25);
}

.custom-cursor.clicking {
  transform: translate(-50%, -50%) scale(0.7);
}

.cursor-trail {
  position: fixed;
  width: 4px;
  height: 4px;
  background-color: var(--md-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10001;
  transition: opacity 0.1s;
  opacity: 0.4;
}
</style>
