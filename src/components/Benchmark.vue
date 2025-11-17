<template>
  <div class="relative w-full h-screen bg-gray-950 overflow-hidden">
    <!-- Canvas -->
    <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>

    <!-- Control Panel -->
    <div class="absolute top-4 left-4 right-4 max-w-4xl mx-auto">
      <div class="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-800">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <h2 class="text-xl font-bold text-white">Star Trails Benchmark</h2>
          </div>
          <button
            @click="toggleRunning"
            :class="isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
            class="px-4 py-2 rounded-lg font-semibold transition-colors text-white"
          >
            {{ isRunning ? 'Tạm dừng' : 'Tiếp tục' }}
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-gray-800">
          <div class="bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span class="text-sm text-gray-400">FPS</span>
            </div>
            <div :class="getFpsColor()" class="text-2xl font-bold">{{ fps }}</div>
          </div>

          <div class="bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span class="text-sm text-gray-400">FPS Trung bình</span>
            </div>
            <div class="text-2xl font-bold text-blue-400">{{ avgFps }}</div>
          </div>

          <div class="bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm text-gray-400">Frame Time</span>
            </div>
            <div class="text-2xl font-bold text-purple-400">{{ frameTime }}ms</div>
          </div>

          <div class="bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
              <span class="text-sm text-gray-400">Bộ nhớ</span>
            </div>
            <div class="text-2xl font-bold text-pink-400">
              {{ memoryUsage > 0 ? `${memoryUsage}MB` : 'N/A' }}
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="p-4 space-y-4">
          <div>
            <label class="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Số lượng sao: {{ config.starCount }}</span>
              <span class="text-gray-500">50-1000</span>
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              v-model.number="config.starCount"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label class="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Tốc độ: {{ config.speed.toFixed(1) }}x</span>
              <span class="text-gray-500">0.5-10.0</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              v-model.number="config.speed"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <div>
            <label class="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Độ dài vệt: {{ (config.trailLength * 100).toFixed(0) }}%</span>
              <span class="text-gray-500">0-100%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              v-model.number="config.trailLength"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <label class="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Điểm vệt tối đa: {{ config.maxTrailPoints }}</span>
              <span class="text-gray-500">10-100</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              v-model.number="config.maxTrailPoints"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <button
            @click="resetConfig"
            class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Đặt lại cấu hình
          </button>
        </div>

        <!-- Performance Tips -->
        <div class="p-4 bg-gray-800/30 border-t border-gray-800">
          <h3 class="text-sm font-semibold text-gray-300 mb-2">💡 Gợi ý tối ưu hiệu suất:</h3>
          <ul class="text-xs text-gray-400 space-y-1">
            <li>• Giảm số lượng sao nếu FPS < 30</li>
            <li>• Giảm điểm vệt tối đa để cải thiện hiệu suất</li>
            <li>• Độ dài vệt thấp hơn = hiệu suất tốt hơn</li>
            <li>• FPS tối ưu: 55-60 FPS</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StarTrailsBenchmark',
  data() {
    return {
      config: {
        speed: 3.0,
        starCount: 230,
        trailLength: 0.85,
        maxTrailPoints: 40
      },
      isRunning: true,
      fps: 0,
      avgFps: 0,
      frameTime: 0,
      memoryUsage: 0,
      stars: [],
      fpsHistory: [],
      lastTime: 0,
      frameCount: 0,
      lastFpsUpdate: 0,
      animationId: null,
      ctx: null,
      canvas: null,
      colorScheme: [
        '#7f1d1d', '#dc2626', '#f97316', '#fbbf24', '#fef3c7',
        '#ec4899', '#f472b6', '#fbbf24', '#fb7185',
        '#9333ea', '#a855f7', '#c084fc', '#d8b4fe',
        '#3b82f6', '#60a5fa', '#0ea5e9', '#22d3ee', '#67e8f9',
        '#14b8a6', '#2dd4bf', '#5eead4', '#10b981',
        '#ea580c', '#fb923c', '#fdba74'
      ]
    };
  },
  mounted() {
    this.initCanvas();
    this.initStars();
    this.animationId = requestAnimationFrame(this.animate);
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
  watch: {
    'config.starCount'() {
      this.initStars();
    }
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d', {
        alpha: false,
        desynchronized: true
      });

      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;

      this.ctx.fillStyle = '#0a0a0a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    initStars() {
      this.stars = [];
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const maxDistance = Math.sqrt(
        Math.pow(this.canvas.width / 2, 2) + Math.pow(this.canvas.height / 2, 2)
      );

      for (let i = 0; i < this.config.starCount; i++) {
        const distance = Math.random() * maxDistance;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.7;
        const size = 0.5 + Math.random() * 2;
        const colorIndex = Math.floor(Math.random() * this.colorScheme.length);

        this.stars.push({
          distance,
          angle,
          speed,
          size,
          color: this.colorScheme[colorIndex],
          trail: [],
          x: 0,
          y: 0
        });
      }
    },
    animate(currentTime) {
      if (!this.isRunning) {
        this.animationId = requestAnimationFrame(this.animate);
        return;
      }

      const deltaTime = currentTime - this.lastTime;
      const frameStartTime = performance.now();

      // Calculate FPS
      this.frameCount++;
      if (currentTime - this.lastFpsUpdate >= 1000) {
        const currentFps = Math.round(this.frameCount * 1000 / (currentTime - this.lastFpsUpdate));
        this.fps = currentFps;

        this.fpsHistory.push(currentFps);
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }

        this.avgFps = Math.round(
          this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
        );

        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;

        // Memory usage
        if (performance.memory) {
          this.memoryUsage = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        }
      }

      this.lastTime = currentTime;

      // Draw background with trail effect
      this.ctx.fillStyle = `rgba(10, 10, 10, ${1 - this.config.trailLength})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Update and draw stars
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.stars.forEach(star => {
        // Update angle
        star.angle += this.config.speed * star.speed * 0.002;

        // Calculate position
        star.x = centerX + Math.cos(star.angle) * star.distance;
        star.y = centerY + Math.sin(star.angle) * star.distance;

        // Add to trail
        star.trail.push({ x: star.x, y: star.y });
        if (star.trail.length > this.config.maxTrailPoints) {
          star.trail.shift();
        }

        // Draw trail
        if (star.trail.length > 1) {
          this.ctx.strokeStyle = star.color;
          this.ctx.lineWidth = star.size;
          this.ctx.beginPath();
          this.ctx.moveTo(star.trail[0].x, star.trail[0].y);

          const step = Math.max(2, Math.floor(star.trail.length / 20));
          for (let i = step; i < star.trail.length; i += step) {
            const alpha = i / star.trail.length;
            this.ctx.globalAlpha = alpha * 0.7;
            this.ctx.lineTo(star.trail[i].x, star.trail[i].y);
          }

          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }

        // Draw star point
        this.ctx.fillStyle = star.color;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // Calculate frame time
      const frameEndTime = performance.now();
      this.frameTime = (frameEndTime - frameStartTime).toFixed(2);

      this.animationId = requestAnimationFrame(this.animate);
    },
    toggleRunning() {
      this.isRunning = !this.isRunning;
    },
    resetConfig() {
      this.config = {
        speed: 3.0,
        starCount: 230,
        trailLength: 0.85,
        maxTrailPoints: 40
      };
      this.fpsHistory = [];
    },
    getFpsColor() {
      if (this.fps >= 55) return 'text-green-400';
      if (this.fps >= 30) return 'text-yellow-400';
      return 'text-red-400';
    }
  }
};
</script>

<style scoped>
.relative {
  position: relative;
}

.w-full {
  width: 100%;
}

.h-screen {
  height: 100vh;
}

.bg-gray-950 {
  background-color: #030712;
}

.overflow-hidden {
  overflow: hidden;
}

.absolute {
  position: absolute;
}

.inset-0 {
  inset: 0;
}

.top-4 {
  top: 1rem;
}

.left-4 {
  left: 1rem;
}

.right-4 {
  right: 1rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.bg-gray-900\/95 {
  background-color: rgba(17, 24, 39, 0.95);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.border {
  border-width: 1px;
}

.border-gray-800 {
  border-color: #1f2937;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-2 {
  gap: 0.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.border-b {
  border-bottom-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.h-2 {
  height: 0.5rem;
}

.text-blue-400 {
  color: #60a5fa;
}

.text-yellow-400 {
  color: #facc15;
}

.text-purple-400 {
  color: #c084fc;
}

.text-pink-400 {
  color: #f472b6;
}

.text-green-400 {
  color: #4ade80;
}

.text-red-400 {
  color: #f87171;
}

.text-white {
  color: #fff;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-green-500 {
  background-color: #22c55e;
}

.bg-gray-700 {
  background-color: #374151;
}

.bg-gray-800\/50 {
  background-color: rgba(31, 41, 55, 0.5);
}

.bg-gray-800\/30 {
  background-color: rgba(31, 41, 55, 0.3);
}

.hover\:bg-red-600:hover {
  background-color: #dc2626;
}

.hover\:bg-green-600:hover {
  background-color: #16a34a;
}

.hover\:bg-gray-600:hover {
  background-color: #4b5563;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

.appearance-none {
  appearance: none;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
  border: none;
}

.accent-blue-500 {
  accent-color: #3b82f6;
}

.accent-green-500 {
  accent-color: #22c55e;
}

.accent-purple-500 {
  accent-color: #a855f7;
}

.accent-pink-500 {
  accent-color: #ec4899;
}

@media (min-width: 768px) {
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>