<script setup>
defineProps({
  text: String,
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
  bottom: String
});
</script>

<template>
  <div 
    class="sticker" 
    :style="{ 
      top, left, right, bottom, 
      transform: `rotate(${rotation})`,
      backgroundColor: color,
      borderColor: color
    }"
  >
    <div class="sticker-content">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.sticker {
  position: absolute;
  z-index: 5;
  padding: 0.5rem 1rem;
  border: 2px solid;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  pointer-events: auto;
}

.sticker:hover {
  transform: scale(1.1) rotate(0deg) !important;
  z-index: 20;
}

.sticker-content {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  color: black;
  font-size: 0.9rem;
  white-space: nowrap;
}
</style>
