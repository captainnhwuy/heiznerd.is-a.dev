<template>
  <section id="timeline" class="timeline">
    <div class="container">
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
      </div>

      <div class="timeline-track">
        <div
          v-for="(item, index) in t.items"
          :key="index"
          class="timeline-item drift"
          :class="index % 2 === 0 ? 'from-left' : 'from-right'"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <!-- Connector line + dot -->
          <div class="tl-connector">
            <div class="tl-dot" :class="{ 'dot-active': index === 0 }"></div>
          </div>

          <!-- Card -->
          <div class="tl-card md-card">
            <span class="tl-year">{{ item.year }}</span>
            <h3 class="tl-title">{{ item.title }}</h3>
            <p class="tl-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].timeline;
</script>

<style scoped>
.timeline { background: transparent; }

.timeline-track {
  position: relative;
  max-width: 680px;
  margin: 52px auto 0;
  padding-left: 28px;
}

/* Vertical line */
.timeline-track::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--md-primary), transparent);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
}

/* Connector dot */
.tl-connector {
  position: relative;
  padding-top: 22px;
  flex-shrink: 0;
}

.tl-dot {
  position: absolute;
  /* Line is at left:9px of .timeline-track.
     Track padding-left is 28px, so relative to item:
     line_x = 9px - 28px = -19px. Center dot: -19px - 8px = -27px */
  left: -27px;
  top: 20px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--md-surface);
  border: 2px solid var(--md-outline);
  transition: all 0.3s var(--md-ease-spring);
  z-index: 1;
}

.tl-dot.dot-active {
  background: var(--md-primary);
  border-color: var(--md-primary);
  box-shadow: 0 0 0 4px rgba(187,134,252,0.2);
}

.timeline-item:hover .tl-dot {
  background: var(--md-primary);
  border-color: var(--md-primary);
  transform: scale(1.2);
}

/* Card */
.tl-card {
  padding: 20px 24px;
  flex: 1;
  transition: all 0.3s var(--md-ease-spring);
}

.timeline-item:hover .tl-card {
  border-color: rgba(187,134,252,0.25);
  background: var(--md-surface-container);
}

.tl-year {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--md-primary);
  background: rgba(187,134,252,0.1);
  border: 1px solid rgba(187,134,252,0.25);
  border-radius: var(--md-radius-full);
  padding: 3px 10px;
  margin-bottom: 10px;
}

.tl-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--md-on-surface);
  margin-bottom: 6px;
}

.tl-desc {
  font-size: 0.9rem;
  color: var(--md-on-surface-var);
  line-height: 1.6;
}
</style>
