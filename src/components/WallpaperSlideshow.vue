<template>
  <div class="wallpaper-slideshow">
    <Transition name="fade">
      <img 
        :key="currentImage" 
        :src="`/Wallpaper/${currentImage}`" 
        alt="Background Wallpaper" 
        class="wallpaper-image"
      />
    </Transition>
    <div class="overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const wallpapers = [
  "1293442.jpg", "1293921.png", "1296323.jpg", "1311994.jpeg", "1319293.jpeg",
  "1320321.jpeg", "1324943.png", "1329400.jpeg", "1330710.png", "1336072.png",
  "1337168.png", "1337367.png", "1338293.jpeg", "1340472.png", "1341233.jpeg",
  "1344447.png", "1351629.png", "1354199.jpeg", "1354206.jpeg", "1354394.jpeg",
  "1356519.jpeg", "1358125.png", "1360433.png", "1363709.png", "1369866.png",
  "1371030.png", "1378665.png", "596630.jpg", "737474.png", "896653.jpg",
  "901101.png", "909769.png", "926968.png", "934905.jpg", "937353.png",
  "973967.jpg"
];

const currentIndex = ref(0);
const currentImage = ref(wallpapers[0]);
let timer = null;

const nextWallpaper = () => {
  currentIndex.value = (currentIndex.value + 1) % wallpapers.length;
  currentImage.value = wallpapers[currentIndex.value];
};

onMounted(() => {
  // Shuffle wallpapers initially for variety
  // wallpapers.sort(() => Math.random() - 0.5);
  currentImage.value = wallpapers[currentIndex.value];

  // Change wallpaper every 20 minutes (20 * 60 * 1000 ms)
  timer = setInterval(nextWallpaper, 20 * 60 * 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.wallpaper-slideshow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-color: #0a0a0a;
  overflow: hidden;
}

.wallpaper-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Dark overlay for text readability */
  z-index: 1;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
