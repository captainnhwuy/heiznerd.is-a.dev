<template>
  <div class="tech-strip" :class="`direction-${direction}`" role="group" :aria-label="label" :style="{ '--duration': `${duration}s` }">
    <span class="sr-only">{{ items.map(item => item.name).join(', ') }}</span>
    <div class="tech-strip-track" aria-hidden="true">
      <div v-for="copy in 2" :key="copy" class="tech-strip-sequence">
        <span v-for="item in items" :key="`${copy}-${item.name}`" class="tech-strip-item">
          <span class="tech-strip-icon" :style="{ '--tone': item.color }">
            <i v-if="item.icon" :class="item.icon"></i>
            <b v-else>{{ item.mark }}</b>
          </span>
          <span>{{ item.name }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  direction: { type: String, default: 'left' },
  duration: { type: Number, default: 34 },
  label: { type: String, default: 'Technology stack' },
});
</script>

<style scoped>
.tech-strip {
  width: 100%;
  overflow: hidden;
  border-block: 1px solid var(--md-outline-var);
  background: rgba(12, 12, 15, 0.52);
  mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
}

.tech-strip-track { display: flex; width: max-content; animation: stripLeft var(--duration) linear infinite; }
.direction-right .tech-strip-track { animation-name: stripRight; }
.tech-strip:hover .tech-strip-track,
.tech-strip:focus-within .tech-strip-track { animation-play-state: paused; }
.tech-strip-sequence { display: flex; flex: 0 0 auto; }
.tech-strip-item { display: flex; align-items: center; gap: 9px; min-width: max-content; padding: 10px 18px; border-right: 1px solid var(--md-outline-var); color: var(--md-on-surface-var); font-family: var(--font-mono); font-size: .66rem; letter-spacing: .06em; text-transform: uppercase; }
.tech-strip-icon { display: grid; width: 26px; height: 26px; place-items: center; border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent); border-radius: 8px; color: var(--tone); background: color-mix(in srgb, var(--tone) 8%, transparent); }
.tech-strip-icon b { font-size: .52rem; letter-spacing: -.05em; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

@keyframes stripLeft { to { transform: translate3d(-50%,0,0); } }
@keyframes stripRight { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }

@media (prefers-reduced-motion: reduce) {
  .tech-strip { mask-image: none; -webkit-mask-image: none; }
  .tech-strip-track { width: auto; animation: none; }
  .tech-strip-sequence { flex-wrap: wrap; justify-content: center; }
  .tech-strip-sequence + .tech-strip-sequence { display: none; }
}
</style>
