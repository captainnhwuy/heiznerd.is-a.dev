<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  text: String,
  image: String, // New prop for image path
  color: {
    type: String,
    default: 'var(--primary)'
  },
  rotation: {
    type: String,
    default: '10deg'
  },
  top: String,
  left: String,
  right: String,
  bottom: String,
  scale: {
    type: [Number, String],
    default: 1
  }
});

const stickerRef = ref(null);
const isDragging = ref(false);
const position = ref({ x: 0, y: 0 });
const startPos = ref({ x: 0, y: 0 });
const currentZ = ref(5);
const velocity = ref({ x: 0, y: 0 });
const lastMousePos = ref({ x: 0, y: 0 });
const animationFrame = ref(null);

// Initialize random rotation offset for organic feel
const currentRotation = ref(parseFloat(props.rotation));

const handleMouseDown = (e) => {
  e.preventDefault(); // Prevent text selection
  isDragging.value = true;
  startPos.value = { x: e.clientX - position.value.x, y: e.clientY - position.value.y };
  lastMousePos.value = { x: e.clientX, y: e.clientY };
  
  // Bring to front
  currentZ.value = 999; // Force high z-index immediately
  
  // Stop any existing physics
  if (animationFrame.value) cancelAnimationFrame(animationFrame.value);
  velocity.value = { x: 0, y: 0 };
  
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  e.preventDefault();
  
  const newX = e.clientX - startPos.value.x;
  const newY = e.clientY - startPos.value.y;
  
  // Calculate velocity for throw
  velocity.value = {
    x: e.clientX - lastMousePos.value.x,
    y: e.clientY - lastMousePos.value.y
  };
  
  lastMousePos.value = { x: e.clientX, y: e.clientY };
  position.value = { x: newX, y: newY };
};

const handleMouseUp = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  
  // Start physics decay
  applyPhysics();
};

const applyPhysics = () => {
  if (Math.abs(velocity.value.x) < 0.1 && Math.abs(velocity.value.y) < 0.1) {
    return;
  }
  
  position.value.x += velocity.value.x;
  position.value.y += velocity.value.y;
  
  // Friction
  velocity.value.x *= 0.9;
  velocity.value.y *= 0.9;
  
  animationFrame.value = requestAnimationFrame(applyPhysics);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  if (animationFrame.value) cancelAnimationFrame(animationFrame.value);
});
</script>

<template>
  <div 
    ref="stickerRef"
    class="sticker-wrapper"
    :style="{ 
      top: top, 
      left: left, 
      right: right, 
      bottom: bottom,
      transform: `translate(${position.x}px, ${position.y}px)`,
      zIndex: currentZ
    }"
    @mousedown="handleMouseDown"
  >
    <div 
      class="sticker-inner" 
      :class="{ 'dragging': isDragging, 'is-image': !!image }"
      :style="{ 
        transform: `rotate(${currentRotation}deg) scale(${scale * (isDragging ? 1.05 : 1)})`,
        backgroundColor: image ? 'transparent' : color,
        borderColor: image ? 'transparent' : color,
        boxShadow: image ? 'none' : undefined
      }"
    >
      <div class="sticker-content">
        <img v-if="image" :src="image" draggable="false" class="sticker-img" />
        <span v-else>{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-wrapper {
  position: absolute;
  cursor: grab;
  user-select: none;
  touch-action: none;
  will-change: transform;
  /* crucial: no transition on the wrapper to ensure 1:1 drag movement */
}

.sticker-wrapper:active {
  cursor: grabbing;
}

.sticker-inner {
  padding: 0.5rem 1rem;
  border: 2px solid;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
  transform-origin: center center;
  /* Separate transform context for rotation/scale */
}

.sticker-inner.is-image {
  border: none;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.sticker-inner.dragging {
  box-shadow: 10px 10px 0px rgba(0,0,0,0.3);
}

.sticker-inner.is-image.dragging {
  box-shadow: none;
  filter: drop-shadow(5px 5px 5px rgba(0,0,0,0.5));
}

.sticker-content {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  color: black;
  font-size: 0.9rem;
  white-space: nowrap;
  pointer-events: none;
}

.sticker-img {
  max-width: 150px;
  height: auto;
  display: block;
  pointer-events: none;
  filter: drop-shadow(5px 5px 0px rgba(0,0,0,0.2));
  transition: filter 0.2s ease;
}
</style>
