<template>
  <div v-if="!isHidden" class="music-player">
    <div class="music-card">
      <!-- Album cover -->
      <div class="album-wrap">
        <img
          :src="currentSong.coverImage"
          :alt="currentSong.songName"
          class="album-img"
          :class="{ spinning: isPlaying }"
        />
        <!-- Equalizer bars overlay when playing -->
        <div v-if="isPlaying" class="eq-overlay">
          <span class="eq-bar"></span>
          <span class="eq-bar"></span>
          <span class="eq-bar"></span>
        </div>
      </div>

      <!-- Song info -->
      <div class="song-info">
        <p class="song-name">{{ currentSong.songName }}</p>
        <p class="song-artist">{{ currentSong.artist }}</p>
        <!-- Mini progress indicator -->
        <div class="mini-progress">
          <div class="mini-progress-fill" :style="{ animationPlayState: isPlaying ? 'running' : 'paused' }"></div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button class="ctrl-btn" @click="prevSong" title="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 19V5l-7 7 7 7zm8-14h-2v14h2V5z"/>
          </svg>
        </button>
        <button class="ctrl-btn play-btn" @click="togglePlayPause" :aria-label="isPlaying ? 'Pause' : 'Play'">
          <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button class="ctrl-btn" @click="nextSong" title="Next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5v14l7-7-7-7zm8 14h2V5h-2v14z"/>
          </svg>
        </button>
      </div>

      <!-- Side actions -->
      <div class="side-actions">
        <button class="side-btn" @click="scrollToTop" title="Scroll to top">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button class="side-btn" @click="minimized = !minimized" title="Minimize">
          <i class="fas fa-minus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const minimized = ref(false);

const isHidden = computed(() => route.path.includes('/pomodoro'));

const playlist = [
  { songName: "Vết Thương",           artist: "fishy",             audioUrl: "/music/vết thương.mp3",                    coverImage: "/stickers/misc/VETTHUONG.jpg" },
  { songName: "Em Còn Nhớ Anh Không", artist: "Hoang Ton (Remix)", audioUrl: "/music/Em Còn Nhớ Anh Không (feat. Koo) (Htingale X Ryuuko Remix) - Hoang Ton.mp3", coverImage: "/stickers/misc/EMCONNHOANHKHONG.jpg" },
  { songName: "Life Is Good",          artist: "Seachains ft. Lê Tích Kỳ", audioUrl: "/music/Life Is Good (feat. Lê Tích Kỳ) - Seachains.mp3", coverImage: "/stickers/misc/LIFEISGOOD.jpg" },
  { songName: "Mờ Phai",              artist: "Xoxad",             audioUrl: "/music/MOPHAI - Xoxad.mp3",               coverImage: "/stickers/misc/MOPHAI.jpg" },
  { songName: "Ngày Đêm",             artist: "NOEN",              audioUrl: "/music/NGÀY ĐÊM - NOEN.mp3",              coverImage: "/stickers/misc/NGÀY ĐÊM THUMBNAIL.jpg" },
  { songName: "Sao Soi Đường Đêm",   artist: "Trung Trần",        audioUrl: "/music/SAO SOI DUONG DEM - Trung Trần.mp3", coverImage: "/stickers/misc/SAOSOIDUONGDEN.jpg" },
  { songName: "Kể về Em",             artist: "Unknown",           audioUrl: "/music/keveem.mp3",                        coverImage: "/stickers/misc/preview.jpg" },
];

const currentSongIndex = ref(0);
const currentSong = computed(() => playlist[currentSongIndex.value]);
const isPlaying = ref(false);
const audio = ref(null);

const loadSong = () => {
  if (!audio.value) return;
  audio.value.pause();
  audio.value.src = currentSong.value.audioUrl;
  audio.value.load();
  if (isPlaying.value) audio.value.play().catch(() => {});
};

const togglePlayPause = () => {
  if (!audio.value) return;
  if (isPlaying.value) { audio.value.pause(); }
  else { audio.value.play().catch(() => {}); }
  isPlaying.value = !isPlaying.value;
};

const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % playlist.length;
  loadSong();
  isPlaying.value = true;
  audio.value?.play().catch(() => {});
};

const prevSong = () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + playlist.length) % playlist.length;
  loadSong();
  isPlaying.value = true;
  audio.value?.play().catch(() => {});
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(async () => {
  const el = new Audio();
  el.loop = false;
  el.volume = 0.12;
  el.addEventListener('ended', nextSong);
  audio.value = el;
  loadSong();
  try {
    await el.play();
    isPlaying.value = true;
  } catch { /* autoplay blocked */ }
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.removeEventListener('ended', nextSong);
  }
});
</script>

<style scoped>
/* =============================================
   MUSIC PLAYER — Fixed bottom-right card
   ============================================= */
.music-player {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.music-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(28, 27, 31, 0.85);
  border: 1px solid rgba(187, 134, 252, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.04);
  min-width: 300px;
  max-width: 360px;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.music-card:hover {
  transform: translateY(-3px);
}

/* Album */
.album-wrap {
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

.album-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
  transition: border-radius 0.3s;
}

.album-img.spinning {
  border-radius: 50%;
  animation: spinAlbum 8s linear infinite;
}

@keyframes spinAlbum {
  to { transform: rotate(360deg); }
}

/* Equalizer overlay */
.eq-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  border-radius: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding-bottom: 8px;
}

.eq-bar {
  display: block;
  width: 3px;
  background: #fff;
  border-radius: 2px;
  animation: eqBounce 0.6s ease-in-out infinite alternate;
}
.eq-bar:nth-child(1) { height: 6px; animation-delay: 0s; }
.eq-bar:nth-child(2) { height: 12px; animation-delay: 0.15s; }
.eq-bar:nth-child(3) { height: 8px; animation-delay: 0.3s; }

@keyframes eqBounce {
  from { transform: scaleY(0.4); }
  to   { transform: scaleY(1.2); }
}

/* Song info */
.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #E6E1E5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
  font-family: var(--font-sans);
}

.song-artist {
  font-size: 0.72rem;
  color: #CAC4D0;
  font-family: var(--font-sans);
}

/* Mini progress bar */
.mini-progress {
  height: 2px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  width: 0%;
  background: var(--md-primary);
  border-radius: 2px;
  animation: progressFill 180s linear forwards;
  animation-play-state: paused;
}

@keyframes progressFill {
  from { width: 0%; }
  to   { width: 100%; }
}

/* Controls */
.controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.ctrl-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  padding: 0;
}

.ctrl-btn svg {
  width: 14px;
  height: 14px;
}

.ctrl-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.play-btn {
  width: 36px;
  height: 36px;
  background: var(--md-primary);
  color: var(--md-on-primary);
}

.play-btn svg { width: 16px; height: 16px; }

.play-btn:hover {
  background: var(--md-primary-dim);
  color: var(--md-on-primary);
  transform: scale(1.08);
}

/* Side actions */
.side-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 1px solid rgba(255,255,255,0.08);
  padding-left: 10px;
  flex-shrink: 0;
}

.side-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  transition: background 0.2s, color 0.2s;
}

.side-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

@media (max-width: 480px) {
  .music-player { bottom: 12px; right: 12px; }
  .music-card { min-width: 260px; padding: 8px 10px; }
}
</style>