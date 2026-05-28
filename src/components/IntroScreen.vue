<template>
  <Transition name="intro-fade" @after-leave="onDone">
    <div v-if="visible" class="intro-overlay" :class="{ 'portal-zoom': zoomOut }">
      <div class="scanner-container">
        <!-- System Boot logs (Storytelling narrative) -->
        <div class="system-logs">
          <div v-for="(log, i) in activeLogs" :key="i" class="log-line">
            <span class="log-prompt">></span> {{ log }}
          </div>
          <div v-if="loadingProgress < 100" class="log-line">
            <span class="log-prompt">></span> LOADING_CORE: {{ loadingProgress }}%
          </div>
        </div>

        <!-- Geometric Motion Scanner (SVG Wireframes) -->
        <div class="scanner-graphic" :class="{ scan: loadingProgress >= 30, complete: loadingProgress === 100 }">
          <!-- Concentric target rings -->
          <svg class="scanner-svg" viewBox="0 0 200 200">
            <!-- Center target crosshair -->
            <line x1="100" y1="90" x2="100" y2="110" stroke="rgba(187, 134, 252, 0.4)" stroke-width="0.5" />
            <line x1="90" y1="100" x2="110" y2="100" stroke="rgba(187, 134, 252, 0.4)" stroke-width="0.5" />

            <!-- Core rotating hexagon -->
            <polygon 
              points="100,60 135,80 135,120 100,140 65,120 65,80" 
              class="svg-shape hex-inner"
            />
            
            <!-- Outer rotating square -->
            <rect 
              x="55" y="55" width="90" height="90" rx="12"
              class="svg-shape square-outer"
            />

            <!-- Outer dashed orbit ring -->
            <circle 
              cx="100" cy="100" r="75" 
              class="svg-shape circle-dashed"
            />

            <!-- Scanning laser beam -->
            <line 
              x1="20" y1="100" x2="180" y2="100" 
              class="laser-beam"
            />
          </svg>

          <!-- Core pulsing dot -->
          <div class="scanner-core"></div>
        </div>

        <!-- Title / Brand identifier -->
        <div class="brand-reveal" :class="{ show: loadingProgress >= 50 }">
          <h1 class="brand-name">HEIZNERD</h1>
          <p class="brand-sub">PORTFOLIO_SYSTEM_V3</p>
        </div>
      </div>

      <!-- Skip hint -->
      <div class="skip-hint">Press SPACE to skip</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['done']);

const visible = ref(true);
const zoomOut = ref(false);
const loadingProgress = ref(0);
const activeLogs = ref([]);

const logsSequence = [
  'INITIALIZING SYSTEM DECK...',
  'CONNECTING GITHUB_API_PIPE...',
  'LOADING TRANSLATION_MATRIX...',
  'ESTABLISHING CYBER_SPEC_CORE: OK',
  'BOOTING USER_INTERFACE...',
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const runIntroSequence = async () => {
  document.body.style.overflow = 'hidden';

  // Step 1: Sequential log typing
  for (let i = 0; i < logsSequence.length; i++) {
    await sleep(250);
    activeLogs.value.push(logsSequence[i]);
  }

  // Step 2: Progress counter
  while (loadingProgress.value < 100) {
    await sleep(20);
    loadingProgress.value += 5;
  }

  // Step 3: Trigger zoom portal transition
  await sleep(400);
  zoomOut.value = true;
  
  // Step 4: Fade overlay out
  await sleep(600);
  visible.value = false;
};

const onDone = () => {
  document.body.style.overflow = '';
  emit('done');
};

const skipIntro = () => {
  visible.value = false;
};

const handleKeyDown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    skipIntro();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  runIntroSequence();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* =============================================
   INTRO CANVASES
   ============================================= */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: var(--md-bg, #0F0F11);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  pointer-events: all;
  transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1), 
              filter 1.2s cubic-bezier(0.85, 0, 0.15, 1);
}

/* Zoom portal effect: scales up to feel like entering a portal */
.portal-zoom {
  transform: scale(2.8);
  filter: blur(8px);
}

.intro-fade-leave-active { 
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1); 
}
.intro-fade-leave-to { 
  opacity: 0; 
}

.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  position: relative;
}

/* =============================================
   SYSTEM LOGS (Storytelling console)
   ============================================= */
.system-logs {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--md-secondary);
  opacity: 0.65;
  width: 280px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
}

.log-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-prompt {
  color: var(--md-primary);
  font-weight: 700;
}

/* =============================================
   MOTION SCANNER GRAPHIC
   ============================================= */
.scanner-graphic {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(187, 134, 252, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s var(--md-ease-spring);
}

.scanner-svg {
  width: 100%;
  height: 100%;
}

/* SVG shapes animation definitions */
.svg-shape {
  fill: none;
  stroke: rgba(187, 134, 252, 0.25);
  stroke-width: 0.8px;
  transform-origin: center;
  transition: stroke 0.5s ease;
}

.hex-inner {
  animation: rotateCw 18s linear infinite;
  stroke: rgba(3, 218, 198, 0.25);
}

.square-outer {
  animation: rotateCcw 24s linear infinite;
}

.circle-dashed {
  stroke-dasharray: 4, 8;
  animation: rotateCw 45s linear infinite;
}

/* Laser Scanning Beam */
.laser-beam {
  stroke: var(--md-secondary);
  stroke-width: 1px;
  opacity: 0;
  transition: opacity 0.3s;
}

.scanner-graphic.scan .laser-beam {
  opacity: 0.7;
  animation: laserScan 2s ease-in-out infinite;
}

/* Central core dot */
.scanner-core {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--md-primary);
  border-radius: 50%;
  box-shadow: 0 0 16px var(--md-primary);
  animation: corePulse 1.2s infinite ease-in-out;
}

/* State changes when boot complete */
.complete .svg-shape {
  stroke: var(--md-primary);
  stroke-width: 1.5px;
}

.complete .laser-beam {
  opacity: 0;
}

/* Keyframe animations */
@keyframes rotateCw {
  to { transform: rotate(360deg); }
}

@keyframes rotateCcw {
  to { transform: rotate(-360deg); }
}

@keyframes laserScan {
  0%, 100% { transform: translateY(-70px); opacity: 0.2; }
  50%       { transform: translateY(70px); opacity: 0.8; }
}

@keyframes corePulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%       { transform: scale(1.6); opacity: 1; }
}

/* =============================================
   BRAND REVEAL
   ============================================= */
.brand-reveal {
  text-align: center;
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.6s var(--md-ease-spring);
}

.brand-reveal.show {
  opacity: 1;
  transform: translateY(0);
}

.brand-name {
  font-family: 'Unbounded', var(--font-display);
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--md-on-surface);
  line-height: 1;
}

.brand-sub {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--md-on-surface-var);
  letter-spacing: 0.2em;
  margin-top: 6px;
}

/* Skip hint styling */
.skip-hint {
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--md-on-surface-var);
  opacity: 0.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .scanner-graphic {
    width: 200px;
    height: 200px;
  }
}
</style>
