<template>
  <section 
    id="alone" 
    class="alone-page" 
    :class="{ 'with-her': relationshipStatus === 'relationship' }"
  >
    <div class="container">
      <!-- Single Day Page -->
      <div v-if="relationshipStatus === 'single'">
        <!-- Quote at top -->
        <div class="quote">
          <p>"{{ quote }}"</p>
        </div>

        <!-- Single line counter -->
        <div class="counter-line">
          <p>
            Since April 21, 2024 - 
            <strong>{{ timeElapsed.days }}</strong> days 
            <strong>{{ timeElapsed.hours }}</strong> hours 
            <strong>{{ timeElapsed.minutes }}</strong> minutes 
            <strong>{{ timeElapsed.seconds }}</strong> seconds 
          </p>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-emoji">💔</div>
            <div class="stat-value">{{ formatNumber(totalHours) }}</div>
            <div class="stat-label">giờ không có ai</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">😢</div>
            <div class="stat-value">{{ formatNumber(totalMinutes) }}</div>
            <div class="stat-label">phút cô đơn</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">🎵</div>
            <div class="stat-value">∞</div>
            <div class="stat-label">bài hát buồn</div>
          </div>
        </div>
      </div>

      <!-- With Her Page -->
      <div v-else>
        <!-- Quote at top -->
        <div class="quote love-quote">
          <p>"{{ loveQuote }}"</p>
          <span class="quote-author">- Antoine de Saint-Exupéry</span>
        </div>

        <div class="header">
          <div class="heart-icon">💕</div>
          <h1>With Her</h1>
          <p>Hành trình tình yêu của tớ đã sang hành trình mới!</p>
        </div>

        <div class="celebration-box">
          <div class="celebration-emojis">💫 ❤️ 👑</div>
          
          <div class="celebration-text">
            <p class="congrats">Này,tớ đã dừng lại chuỗi</p>
            <h2 class="days-count">{{ timeElapsed.days }} ngày cô đơn</h2>
            <p class="new-chapter">Và bắt đầu một chương mới đầy hạnh phúc! 🎉</p>
          </div>

          <div class="love-stats">
            <div class="love-card love-card-1">
              <div>💫</div>
              <p>Yêu nhau</p>
            </div>
            <div class="love-card love-card-2">
              <div>🌹</div>
              <p>Lãng mạn</p>
            </div>
            <div class="love-card love-card-3">
              <div>👑</div>
              <p>Hạnh phúc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// ==================== CONFIG ====================
const CONFIG = {
  relationshipStatus: 'relationship', // 'single' hoặc 'relationship'
  startDate: '2024-04-21',
  singleQuote: 'Đôi khi cô đơn là cách tốt nhất để tìm lại chính mình. Nhưng đừng quên, sau cơn mưa sẽ có cầu vồng. 🌈',
  loveQuote: 'Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.'
};
// ================================================

const relationshipStatus = ref(CONFIG.relationshipStatus);
const quote = ref(CONFIG.singleQuote);
const loveQuote = ref(CONFIG.loveQuote);

// Initialize with calculated values immediately
const getInitialTime = () => {
  const start = new Date('2024-04-21T00:00:00');
  const now = new Date();
  const diffMs = now - start;
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  return {
    days: totalDays,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60
  };
};

const timeElapsed = ref(getInitialTime());

// Computed values
const totalHours = computed(() => {
  return timeElapsed.value.days * 24 + timeElapsed.value.hours;
});

const totalMinutes = computed(() => {
  return timeElapsed.value.days * 1440 + timeElapsed.value.hours * 60 + timeElapsed.value.minutes;
});

const formatNumber = (num) => {
  return num.toLocaleString('vi-VN');
};

// Calculate time elapsed - Fixed logic
const calculateTimeElapsed = () => {
  const start = new Date('2024-04-21T00:00:00');
  const now = new Date();
  
  const diffMs = now - start;
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  
  timeElapsed.value = { days, hours, minutes, seconds };
};

let interval = null;

onMounted(() => {
  calculateTimeElapsed();
  interval = setInterval(calculateTimeElapsed, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.alone-page {
  padding: 50px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  transition: background 0.5s ease;
}

.alone-page.with-her {
  background: transparent;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  color: #ffffff;
}

/* Quote */
.quote {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, 
    rgba(74, 144, 226, 0.20) 0%,
    rgba(99, 179, 237, 0.20) 50%,
    rgba(138, 180, 248, 0.20) 100%
  );
  border-radius: 10px;
  border-left: 4px solid #4a9eff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 40px;
  backdrop-filter: blur(15px);
}

.quote p {
  font-size: 1.3em;
  font-style: italic;
  line-height: 1.0;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  margin: 0;
}

/* Counter Line */
.counter-line {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, 
    rgba(74, 158, 255, 0.15) 0%,
    rgba(99, 179, 237, 0.15) 50%,
    rgba(138, 180, 248, 0.20) 100%
  );
  border-radius: 15px;
  margin-bottom: 40px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(74, 158, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.counter-line p {
  font-size: 1.5em;
  line-height: 1;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.counter-line strong {
  color: #4a9eff;
  font-size: 1.3em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(15px);
  transition: transform 0.3s, background 0.3s;
  border: 2px solid;
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, 
    rgba(74, 158, 255, 0.20) 0%,
    rgba(99, 179, 237, 0.20) 100%
  );
  border-color: rgba(74, 158, 255, 0.5);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, 
    rgba(99, 179, 237, 0.20) 0%,
    rgba(138, 180, 248, 0.25) 100%
  );
  border-color: rgba(99, 179, 237, 0.5);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, 
    rgba(138, 180, 248, 0.20) 0%,
    rgba(164, 196, 255, 0.25) 100%
  );
  border-color: rgba(138, 180, 248, 0.5);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card:nth-child(1):hover {
  background: linear-gradient(135deg, 
    rgba(74, 158, 255, 0.30) 0%,
    rgba(99, 179, 237, 0.30) 100%
  );
}

.stat-card:nth-child(2):hover {
  background: linear-gradient(135deg, 
    rgba(99, 179, 237, 0.30) 0%,
    rgba(138, 180, 248, 0.35) 100%
  );
}

.stat-card:nth-child(3):hover {
  background: linear-gradient(135deg, 
    rgba(138, 180, 248, 0.30) 0%,
    rgba(164, 196, 255, 0.35) 100%
  );
}

.stat-emoji {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #4a9eff;
  margin-bottom: 5px;
}

.stat-label {
  color: #aaa;
  font-size: 0.9em;
}

/* With Her Styles */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 3em;
  margin-bottom: 10px;
  color: #ff4757;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.5em;
  color: #ffffff;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.heart-icon {
  font-size: 4em;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.celebration-box {
  background: linear-gradient(135deg, 
    rgba(255, 182, 193, 0.15) 0%,
    rgba(255, 160, 122, 0.15) 25%,
    rgba(255, 192, 203, 0.20) 50%,
    rgba(221, 160, 221, 0.15) 100%
  );
  padding: 50px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.celebration-emojis {
  font-size: 5em;
  margin-bottom: 30px;
}

.celebration-text {
  margin-bottom: 40px;
}

.congrats {
  font-size: 1.5em;
  color: #ffffff;
  margin-bottom: 15px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.days-count {
  font-size: 3.5em;
  color: #ff4757;
  margin: 20px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.new-chapter {
  font-size: 1.8em;
  color: #ffffff;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.love-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.love-card {
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(15px);
  transition: transform 0.3s, background 0.3s;
  border: 2px solid;
}

.love-card-1 {
  background: linear-gradient(135deg, 
    rgba(255, 192, 203, 0.25) 0%,
    rgba(255, 105, 97, 0.25) 100%
  );
  border-color: rgba(255, 105, 97, 0.5);
}

.love-card-2 {
  background: linear-gradient(135deg, 
    rgba(255, 160, 122, 0.25) 0%,
    rgba(255, 192, 203, 0.25) 100%
  );
  border-color: rgba(255, 160, 122, 0.5);
}

.love-card-3 {
  background: linear-gradient(135deg, 
    rgba(255, 192, 203, 0.25) 0%,
    rgba(221, 160, 221, 0.25) 100%
  );
  border-color: rgba(221, 160, 221, 0.5);
}

.love-card:hover {
  transform: translateY(-5px);
}

.love-card-1:hover {
  background: linear-gradient(135deg, 
    rgba(255, 192, 203, 0.35) 0%,
    rgba(255, 105, 97, 0.35) 100%
  );
}

.love-card-2:hover {
  background: linear-gradient(135deg, 
    rgba(255, 160, 122, 0.35) 0%,
    rgba(255, 192, 203, 0.35) 100%
  );
}

.love-card-3:hover {
  background: linear-gradient(135deg, 
    rgba(255, 192, 203, 0.35) 0%,
    rgba(221, 160, 221, 0.35) 100%
  );
}

.love-card div {
  font-size: 3em;
  margin-bottom: 10px;
}

.love-card p {
  font-size: 1.2em;
  color: #ffffff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.love-quote {
  background: linear-gradient(135deg, 
    rgba(255, 182, 193, 0.20) 0%,
    rgba(255, 192, 203, 0.20) 50%,
    rgba(221, 160, 221, 0.20) 100%
  );
  border-left: 4px solid #ff4757;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.love-quote p {
  color: #ffffff;
  font-size: 1.5em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.quote-author {
  display: block;
  margin-top: 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1em;
  font-style: normal;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid,
  .love-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header h1 {
    font-size: 2em;
  }

  .counter-line p {
    font-size: 1.2em;
  }

  .counter-line strong {
    font-size: 1.1em;
  }
  
  .celebration-box {
    padding: 30px 20px;
  }
  
  .days-count {
    font-size: 2.5em;
  }

  .quote p,
  .love-quote p {
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .stats-grid,
  .love-stats {
    grid-template-columns: 1fr;
  }

  .alone-page {
    padding: 30px 15px;
  }

  .celebration-emojis {
    font-size: 3.5em;
  }

  .counter-line p {
    font-size: 1em;
  }
}
</style>