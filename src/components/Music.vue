<template>
  <!-- Floating Music Player -->
  <div class="fixed bottom-6 right-6 z-50">
    <div class="glass-card backdrop-blur-sm p-4 flex items-center gap-3 min-w-[300px] shadow-2xl">
      <!-- Album Cover -->
      <div class="relative flex-shrink-0">
        <img
          :src="musicData.coverImage"
          alt="Album cover"
          class="w-16 h-16 rounded-xl object-cover shadow-lg"
        />
      </div>

      <!-- Song Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-white truncate">
          {{ musicData.songName }}
        </h3>
        <p class="text-sm text-gray-400 truncate">
          {{ musicData.artist }}
        </p>
      </div>

      <!-- Play/Pause Button -->
      <button
        @click="togglePlayPause"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <!-- Pause Icon -->
        <svg 
          v-if="isPlaying"
          xmlns="http://www.w3.org/2000/svg" 
          class="w-5 h-5 text-white" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
        <!-- Play Icon -->
        <svg 
          v-else
          xmlns="http://www.w3.org/2000/svg" 
          class="w-5 h-5 text-white ml-0.5" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const musicData = {
  coverImage: "https://cdn.imgchest.com/files/ee9763215f67.jpg",
  songName: "Vết Thương",
  artist: "fishy",
  audioUrl: "/music/vết thương.mp3" // Đường dẫn tới file trong thư mục public
};

const isPlaying = ref(false);
const audio = ref(null);

const togglePlayPause = () => {
  if (!audio.value) return;

  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

onMounted(async () => {
  const audioElement = new Audio(musicData.audioUrl);
  audioElement.loop = true;
  audioElement.volume = 0.1; // Giảm âm lượng xuống 30% (0.0 - 1.0)
  audio.value = audioElement;

  try {
    await audioElement.play();
    isPlaying.value = true;
  } catch (error) {
    console.log("Autoplay was prevented by browser:", error);
  }
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.remove();
  }
});
</script>

<style scoped>
/* Sử dụng các class từ style.css có sẵn */
</style>