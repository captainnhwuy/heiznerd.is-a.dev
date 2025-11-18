<template>
  <div class="pomodoro-container">
    <div class="pomodoro-wrapper">
      <div class="glass-card">
        
        <div class="main-grid">
          
          <div class="timer-section">
            <div class="badge-container">
              <span :class="['mode-badge', mode === 'work' ? 'mode-work' : 'mode-break']">
                {{ mode === 'work' ? '🎯 Focus' : '☕ Break' }}
              </span>
            </div>

            <div class="timer-circle">
              <svg class="circle-svg" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.1)" stroke-width="12" fill="none" />
                <circle 
                  cx="128" 
                  cy="128" 
                  r="120" 
                  :stroke="mode === 'work' ? '#ef4444' : '#22c55e'" 
                  stroke-width="12" 
                  fill="none" 
                  :stroke-dasharray="circumference" 
                  :stroke-dashoffset="strokeDashoffset" 
                  stroke-linecap="round" 
                  class="progress-circle" 
                />
              </svg>
              
              <div class="timer-display">
                <div class="timer-text">
                  {{ formattedMinutes }}:{{ formattedSeconds }}
                </div>
              </div>
            </div>
          </div>

          <div class="controls-section">
            <div class="control-buttons">
              <button @click="toggleTimer" class="control-btn big-btn">
                <svg v-if="isActive" class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <svg v-else class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <button @click="resetTimer" class="control-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            </div>

            <div v-if="!isActive" class="time-settings-compact">
              <div class="setting-row">
                <span class="label">Work</span>
                <div class="stepper">
                  <button @click="decreaseWorkTime" class="step-btn">-</button>
                  <input 
                    type="number" 
                    v-model.number="workMinutes" 
                    @change="validateInput('work')" 
                    class="time-input"
                  />
                  <button @click="increaseWorkTime" class="step-btn">+</button>
                </div>
              </div>

              <div class="setting-row">
                <span class="label">Break</span>
                <div class="stepper">
                  <button @click="decreaseBreakTime" class="step-btn">-</button>
                  <input 
                    type="number" 
                    v-model.number="breakMinutes" 
                    @change="validateInput('break')" 
                    class="time-input"
                  />
                  <button @click="increaseBreakTime" class="step-btn">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="music-controls-compact">
          <div class="music-info">
            <div class="station-select">
              <svg class="music-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span class="station-name">{{ lofiStations[currentStation].name }}</span>
            </div>
            <button @click="switchStation" class="text-btn">Switch Station</button>
          </div>

          <div class="music-actions">
             <div class="volume-mini">
              <input type="range" min="0" max="100" v-model="volume" @input="updateVolume" class="volume-slider-mini" />
            </div>

            <button @click="toggleMusic" class="icon-btn">
              <svg v-if="!isPlaying" class="btn-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else class="btn-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>
            
            <button @click="toggleMute" class="icon-btn">
               <svg v-if="isMuted" class="btn-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
               <svg v-else class="btn-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </button>
          </div>
        </div>

        <audio ref="audioPlayer" :src="lofiStations[currentStation].url" preload="none"></audio>
      </div>

      <div class="blur-effect blur-purple"></div>
      <div class="blur-effect blur-pink"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PomodoroTimer',
  data() {
    return {
      minutes: 25,
      seconds: 0,
      workMinutes: 25,
      breakMinutes: 5,
      isActive: false,
      mode: 'work',
      isPlaying: false,
      isMuted: false,
      volume: 50,
      currentStation: 0,
      lofiStations: [
        { name: 'Lofi Girl', url: 'https://play.streamafrica.net/lofiradio' },
        { name: 'Chillhop', url: 'https://streams.fluxfm.de/Chillhop/mp3-320' },
      ],
      interval: null,
      circumference: 2 * Math.PI * 120
    }
  },
  computed: {
    formattedMinutes() {
      return String(this.minutes).padStart(2, '0');
    },
    formattedSeconds() {
      return String(this.seconds).padStart(2, '0');
    },
    progress() {
      const totalSeconds = this.mode === 'work' ? this.workMinutes * 60 : this.breakMinutes * 60;
      const currentSeconds = this.minutes * 60 + this.seconds;
      if (totalSeconds === 0) return 0;
      return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
    },
    strokeDashoffset() {
      return this.circumference * (1 - this.progress / 100);
    }
  },
  methods: {
    validateInput(type) {
      let value;
      if (type === 'work') {
        value = parseInt(this.workMinutes);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 120) value = 120;
        this.workMinutes = value;
        
        if (this.mode === 'work' && !this.isActive) {
          this.minutes = this.workMinutes;
          this.seconds = 0;
        }
      } else {
        value = parseInt(this.breakMinutes);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 60) value = 60;
        this.breakMinutes = value;

        if (this.mode === 'break' && !this.isActive) {
          this.minutes = this.breakMinutes;
          this.seconds = 0;
        }
      }
    },
    increaseWorkTime() {
      if (this.workMinutes < 120) {
        this.workMinutes++;
        if (this.mode === 'work') {
          this.minutes = this.workMinutes;
          this.seconds = 0;
        }
      }
    },
    decreaseWorkTime() {
      if (this.workMinutes > 1) {
        this.workMinutes--;
        if (this.mode === 'work') {
          this.minutes = this.workMinutes;
          this.seconds = 0;
        }
      }
    },
    increaseBreakTime() {
      if (this.breakMinutes < 60) {
        this.breakMinutes++;
        if (this.mode === 'break') {
          this.minutes = this.breakMinutes;
          this.seconds = 0;
        }
      }
    },
    decreaseBreakTime() {
      if (this.breakMinutes > 1) {
        this.breakMinutes--;
        if (this.mode === 'break') {
          this.minutes = this.breakMinutes;
          this.seconds = 0;
        }
      }
    },
    updateVolume() {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        audio.volume = this.volume / 100;
      }
    },
    toggleTimer() {
      this.isActive = !this.isActive;
      if (this.isActive) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    },
    startTimer() {
      this.interval = setInterval(() => {
        if (this.seconds === 0) {
          if (this.minutes === 0) {
            this.playNotification();
            
            if (this.mode === 'work') {
              this.mode = 'break';
              this.minutes = this.breakMinutes;
            } else {
              this.mode = 'work';
              this.minutes = this.workMinutes;
            }
            this.seconds = 0;
            this.isActive = false;
            this.stopTimer();
          } else {
            this.minutes--;
            this.seconds = 59;
          }
        } else {
          this.seconds--;
        }
      }, 1000);
    },
    stopTimer() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    resetTimer() {
      this.stopTimer();
      this.isActive = false;
      if (this.mode === 'work') {
        this.minutes = this.workMinutes;
      } else {
        this.minutes = this.breakMinutes;
      }
      this.seconds = 0;
    },
    toggleMusic() {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        if (this.isPlaying) {
          audio.pause();
        } else {
          audio.volume = this.volume / 100;
          audio.play();
        }
        this.isPlaying = !this.isPlaying;
      }
    },
    toggleMute() {
      const audio = this.$refs.audioPlayer;
      if (audio) {
        audio.muted = !this.isMuted;
        this.isMuted = !this.isMuted;
      }
    },
    switchStation() {
      this.currentStation = (this.currentStation + 1) % this.lofiStations.length;
      if (this.isPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audioPlayer;
          if (audio) {
            audio.load();
            audio.volume = this.volume / 100;
            audio.play();
          }
        });
      }
    },
    playNotification() {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2W77O6fUwwSUKvi77dlHAU7k9n0ynUkBB9z');
      audio.play();
    }
  },
  mounted() {
    const audio = this.$refs.audioPlayer;
    if (audio) {
      audio.volume = this.volume / 100;
    }
  },
  beforeUnmount() {
    this.stopTimer();
  }
}
</script>

<style scoped>
.pomodoro-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.pomodoro-wrapper {
  position: relative;
  z-index: 1;
}

.glass-card {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 690px;
  max-width: 100%;
  transition: all 0.3s ease;
}

/* --- Grid Layout --- */
.main-grid {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

/* --- Left: Timer Section --- */
.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.badge-container {
  text-align: center;
  margin-bottom: 0.5rem;
}

.mode-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.mode-work { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
.mode-break { background: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3); }

.timer-circle {
  position: relative;
  width: 170px;
  height: 170px;
}

.circle-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-circle { transition: stroke-dashoffset 1s ease; }

.timer-display {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  font-variant-numeric: tabular-nums;
}

/* --- Right: Controls Section --- */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.control-btn {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.control-btn:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
.big-btn { background: rgba(255, 255, 255, 0.25); border-color: rgba(255, 255, 255, 0.4); }
.btn-icon { width: 24px; height: 24px; }

/* --- Settings Inputs --- */
.time-settings-compact {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.setting-row:last-child { margin-bottom: 0; }
.setting-row .label { font-size: 0.75rem; color: rgba(255, 255, 255, 0.7); }

.stepper {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 2px;
}

/* INPUT STYLE */
.time-input {
  width: 36px;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  outline: none;
  padding: 0;
  -moz-appearance: textfield;
}
.time-input:focus { background: rgba(255,255,255,0.1); border-radius: 4px; }
.time-input::-webkit-outer-spin-button, .time-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.step-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.step-btn:hover { color: white; background: rgba(255,255,255,0.1); border-radius: 4px; }

.divider { 
  height: 1px; 
  background: rgba(255,255,255,0.15); 
  margin-bottom: 1rem;
}

/* --- Music Section (Compact) --- */
.music-controls-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.music-info {
  flex: 1;
  min-width: 0;
}

.station-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c4b5fd;
  margin-bottom: 2px;
}

.music-icon { width: 16px; height: 16px; }
.station-name { font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.text-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 0.7rem;
  cursor: pointer;
  padding: 0;
}
.text-btn:hover { color: white; text-decoration: underline; }

.music-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-mini { width: 60px; display: flex; align-items: center; }
.volume-slider-mini { width: 100%; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.2); -webkit-appearance: none; }
.volume-slider-mini::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; border-radius: 50%; background: white; cursor: pointer; }

.icon-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}
.icon-btn:hover { background: rgba(255,255,255,0.2); }
.btn-icon-small { width: 18px; height: 18px; }

.blur-effect { position: absolute; border-radius: 50%; filter: blur(60px); z-index: 0; pointer-events: none; }
.blur-purple { top: 0; left: 0; width: 128px; height: 128px; background: rgba(168, 85, 247, 0.3); }
.blur-pink { bottom: 0; right: 0; width: 160px; height: 160px; background: rgba(236, 72, 153, 0.3); }

@media (max-width: 480px) {
  .glass-card { width: 100%; }
  .main-grid { grid-template-columns: 1fr; text-align: center; }
  .timer-section { margin-bottom: 1rem; }
  .controls-section { align-items: center; }
  .time-settings-compact { width: 100%; }
}
</style>