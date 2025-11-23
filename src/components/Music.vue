<template>
  <div v-if="!isHidden" class="fixed bottom-6 right-6 z-50">
    <div class="glass-card backdrop-blur-sm p-4 flex items-center gap-3 min-w-[340px] shadow-2xl">
      <div class="relative flex-shrink-0 group">
        <img
          :src="currentSong.coverImage"
          alt="Album cover"
          class="w-16 h-16 rounded-xl object-cover shadow-lg transition-transform duration-500"
        />
        <!-- Mini equalizer overlay when playing -->
        <div v-if="isPlaying" class="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center gap-1">
          <div class="w-1 h-3 bg-white rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-1 h-5 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-1 h-3 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <div class="flex-1 min-w-0 mr-2">
        <h3 class="font-semibold text-white truncate text-base">
          {{ currentSong.songName }}
        </h3>
        <p class="text-xs text-gray-300 truncate">
          {{ currentSong.artist }}
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2">
        <!-- Prev Button -->
        <button 
          @click="prevSong"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 text-white/80 hover:text-white"
          title="Previous Song"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 19V5l-7 7 7 7zm8-14h-2v14h2V5z"/>
          </svg>
        </button>

        <!-- Play/Pause Button -->
        <button
          @click="togglePlayPause"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg shadow-orange-500/20"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
        >
          <svg 
            v-if="isPlaying"
            xmlns="http://www.w3.org/2000/svg" 
            class="w-5 h-5 text-white" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
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

        <!-- Next Button -->
        <button 
          @click="nextSong"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 text-white/80 hover:text-white"
          title="Next Song"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5v14l7-7-7-7zm8 14h2V5h-2v14z"/>
          </svg>
        </button>
      </div>

      <!-- Extra Controls (Vertical) -->
      <div class="flex flex-col gap-1 ml-1 border-l border-white/10 pl-2">
        <button 
          @click="scrollToTop"
          class="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white"
          title="Scroll to Top"
        >
          <i class="fas fa-arrow-up text-[10px]"></i>
        </button>
        <button 
          @click="handleChangeWallpaper"
          class="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white"
          title="Change Wallpaper"
        >
          <i class="fas fa-image text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const changeWallpaper = inject('changeWallpaper');

const isHidden = computed(() => {
  return route.path.includes('/pomodoro');
});

const playlist = [
  {
    songName: "Vết Thương",
    artist: "fishy",
    audioUrl: "/music/vết thương.mp3",
    coverImage: "/VETTHUONG.jpg"
  },
  {
    songName: "Em Còn Nhớ Anh Không",
    artist: "Hoang Ton (Remix)",
    audioUrl: "/music/Em Còn Nhớ Anh Không (feat. Koo) (Htingale X Ryuuko Remix) - Hoang Ton.mp3",
    coverImage: "/EMCONNHOANHKHONG.jpg"
  },
  {
    songName: "Life Is Good",
    artist: "Seachains ft. Lê Tích Kỳ",
    audioUrl: "/music/Life Is Good (feat. Lê Tích Kỳ) - Seachains.mp3",
    coverImage: "/LIFEISGOOD.jpg"
  },
  {
    songName: "Mờ Phai",
    artist: "Xoxad",
    audioUrl: "/music/MOPHAI - Xoxad.mp3",
    coverImage: "/MOPHAI.jpg"
  },
  {
    songName: "Ngày Đêm",
    artist: "NOEN",
    audioUrl: "/music/NGÀY ĐÊM - NOEN.mp3",
    coverImage: "/NGÀY ĐÊM THUMBNAIL.jpg"
  },
  {
    songName: "Sao Soi Đường Đêm",
    artist: "Trung Trần",
    audioUrl: "/music/SAO SOI DUONG DEM - Trung Trần.mp3",
    coverImage: "/SAOSOIDUONGDEN.jpg"
  },
  {
    songName: "Kẻ Vẽ Em",
    artist: "Unknown",
    audioUrl: "/music/keveem.mp3",
    coverImage: "/preview.jpg"
  }
];

const currentSongIndex = ref(0);
const currentSong = computed(() => playlist[currentSongIndex.value]);
const isPlaying = ref(false);
const audio = ref(null);

const loadSong = () => {
  if (audio.value) {
    audio.value.pause();
    audio.value.src = currentSong.value.audioUrl;
    audio.value.load();
    if (isPlaying.value) {
      audio.value.play().catch(e => console.log("Play error:", e));
    }
  }
};

const togglePlayPause = () => {
  if (!audio.value) return;

  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play().catch(e => console.log("Play error:", e));
  }
  isPlaying.value = !isPlaying.value;
};

const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % playlist.length;
  loadSong();
  isPlaying.value = true; // Auto play next song
  audio.value.play();
};

const prevSong = () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + playlist.length) % playlist.length;
  loadSong();
  isPlaying.value = true;
  audio.value.play();
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleChangeWallpaper = () => {
  if (changeWallpaper) {
    changeWallpaper();
  }
};

onMounted(async () => {
  const audioElement = new Audio();
  audioElement.loop = false; // Handle loop manually for playlist
  audioElement.volume = 0.1;
  
  // Auto next song when ended
  audioElement.addEventListener('ended', nextSong);
  
  audio.value = audioElement;
  loadSong(); // Load initial song

  if (!isHidden.value) {
    try {
      await audioElement.play();
      isPlaying.value = true;
    } catch (error) {
      console.log("Autoplay was prevented by browser:", error);
    }
  }
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.removeEventListener('ended', nextSong);
    audio.value.remove();
  }
});
</script>

<style scoped>
.glass-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
</style>