<script setup>
import { onMounted, ref } from 'vue';
import Sticker from './Sticker.vue';
import { allStickerPaths, stickers } from '../stickers.js';

// Randomly select N stickers
const stickerCount = 15;
const randomStickers = ref([]);

const getRandomPath = () => {
    const randomPathIdx = Math.floor(Math.random() * allStickerPaths.length);
    return allStickerPaths[randomPathIdx];
};

const createSticker = () => ({
    id: Math.random(), // Unique ID for key
    image: getRandomPath(),
    top: Math.random() * 90 + '%',
    left: Math.random() * 90 + '%',
    rotation: (Math.random() * 60 - 30) + 'deg',
    scale: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
});

onMounted(() => {
  // Generate initial stickers
  const newStickers = [];
  for (let i = 0; i < stickerCount; i++) {
    newStickers.push(createSticker());
  }
  randomStickers.value = newStickers;

  // Rotation logic: Replace one sticker every 3 seconds
  setInterval(() => {
    const idx = Math.floor(Math.random() * stickerCount);
    // Fade out (optional, for now just hard replace effectively)
    // Vue transition-group would be nice but simple replace is okay for "twitchy" brutalist feel
    randomStickers.value[idx] = createSticker(); 
  }, 2000);
});
</script>

<template>
  <div class="background-stickers">
    <transition-group name="sticker-fade">
      <Sticker 
        v-for="s in randomStickers" 
        :key="s.id"
        :image="s.image"
        :top="s.top"
        :left="s.left"
        :rotation="s.rotation"
        :scale="s.scale"
        style="z-index: 0; opacity: 0.6; filter: grayscale(20%); pointer-events: auto;" 
      />
    </transition-group>
  </div>
</template>

<style scoped>
.background-stickers {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
  z-index: 0;
  overflow: hidden;
}

.sticker-fade-enter-active,
.sticker-fade-leave-active {
  transition: all 0.5s ease;
}

.sticker-fade-enter-from,
.sticker-fade-leave-to {
  opacity: 0 !important;
  transform: scale(0);
}
</style>
