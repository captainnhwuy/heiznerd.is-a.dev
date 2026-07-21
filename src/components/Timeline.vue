<template>
  <section id="timeline" ref="section" class="timeline">
    <div ref="sticky" class="timeline-sticky">
      <div class="container">
        <header class="timeline-heading drift from-top">
          <div>
            <span class="section-eyebrow">{{ t.label }}</span>
            <h2 class="section-title">{{ t.title }}</h2>
            <p class="section-subtitle">{{ t.headerSubtitle }}</p>
          </div>
          <span class="timeline-range" aria-hidden="true">2011 — 2026 · SCROLL TO EXPLORE</span>
        </header>
      </div>

      <div
        ref="viewport"
        class="timeline-viewport"
        tabindex="0"
        :aria-label="t.scrollLabel"
        @keydown="handleKeydown"
      >
        <ol ref="rail" class="timeline-track drift-stagger">
          <li
            v-for="(item, index) in t.items"
            :key="item.id"
            class="timeline-item drift from-right"
            :class="{ 'is-current': item.current }"
            :style="{ transitionDelay: `${Math.min(index * 70, 420)}ms` }"
          >
            <div class="timeline-meta">
              <time :datetime="item.datetime">{{ item.date }}</time>
              <span class="timeline-node" aria-hidden="true"><i></i></span>
              <span class="timeline-index">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>

            <article class="timeline-card">
              <p class="timeline-kicker">{{ item.kicker }}</p>
              <h3>{{ item.title }}</h3>
              <p class="timeline-description">{{ item.description }}</p>

              <ul v-if="item.links?.length" class="timeline-links" :aria-label="t.linksLabel">
                <li v-for="link in item.links" :key="link.href">
                  <a :href="link.href" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github" aria-hidden="true"></i>
                    <span>{{ link.label }}</span>
                    <i class="fas fa-arrow-up-right-from-square external-icon" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </article>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].timeline);
const section = ref(null);
const sticky = ref(null);
const viewport = ref(null);
const rail = ref(null);

let resizeObserver;
let animationFrame;
let distance = 0;
let pinned = false;
let reduced = false;
let desktopQuery;
let motionQuery;

const updateRail = () => {
  animationFrame = 0;
  if (!pinned || !section.value || !sticky.value || !rail.value || !distance) return;
  const travel = Math.max(section.value.offsetHeight - sticky.value.offsetHeight, 1);
  const progress = Math.min(1, Math.max(0, -section.value.getBoundingClientRect().top / travel));
  rail.value.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
};

const requestUpdate = () => {
  if (!animationFrame) animationFrame = requestAnimationFrame(updateRail);
};

const measure = () => {
  if (!section.value || !viewport.value || !rail.value) return;
  pinned = desktopQuery.matches && !motionQuery.matches;
  reduced = motionQuery.matches;
  const viewportStyle = getComputedStyle(viewport.value);
  const inlinePadding = parseFloat(viewportStyle.paddingLeft) + parseFloat(viewportStyle.paddingRight);
  distance = Math.max(0, rail.value.scrollWidth - viewport.value.clientWidth + inlinePadding);

  if (pinned && distance > 0) {
    section.value.style.setProperty('--timeline-distance', `${distance}px`);
    rail.value.style.transform = '';
    requestUpdate();
  } else {
    section.value.style.removeProperty('--timeline-distance');
    rail.value.style.transform = 'none';
  }
};

const scrollToOffset = offset => {
  if (!section.value || !sticky.value || !viewport.value) return;
  const target = Math.min(distance, Math.max(0, offset));
  if (!pinned) {
    viewport.value.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
    return;
  }

  const travel = Math.max(section.value.offsetHeight - sticky.value.offsetHeight, 1);
  const sectionTop = window.scrollY + section.value.getBoundingClientRect().top;
  window.scrollTo({ top: sectionTop + (target / Math.max(distance, 1)) * travel, behavior: reduced ? 'auto' : 'smooth' });
};

const handleKeydown = event => {
  const current = pinned
    ? Math.min(distance, Math.max(0, -section.value.getBoundingClientRect().top / Math.max(section.value.offsetHeight - sticky.value.offsetHeight, 1) * distance))
    : viewport.value.scrollLeft;
  const step = Math.min(viewport.value.clientWidth * 0.72, 360);
  const targets = { ArrowLeft: current - step, ArrowRight: current + step, Home: 0, End: distance };
  if (!(event.key in targets)) return;
  event.preventDefault();
  scrollToOffset(targets[event.key]);
};

onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(viewport.value);
  resizeObserver.observe(rail.value);
  desktopQuery.addEventListener('change', measure);
  motionQuery.addEventListener('change', measure);
  window.addEventListener('scroll', requestUpdate, { passive: true });
  measure();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  desktopQuery?.removeEventListener('change', measure);
  motionQuery?.removeEventListener('change', measure);
  window.removeEventListener('scroll', requestUpdate);
});
</script>

<style scoped>
.timeline {
  --timeline-distance: 0px;
  min-height: calc(100svh + var(--timeline-distance));
  padding: 0;
  overflow: visible;
  background: transparent;
}

.timeline-sticky {
  position: sticky;
  top: 0;
  display: flex;
  height: 100svh;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: clamp(66px, 8vh, 92px) 0 76px;
}

.timeline-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.timeline-range {
  color: var(--md-on-surface-var);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
}

.timeline-viewport {
  width: 100%;
  margin-top: clamp(38px, 6vh, 58px);
  padding: 8px max(24px, calc((100vw - var(--max-width)) / 2)) 24px;
  overflow: hidden;
  direction: ltr;
}

.timeline-viewport:focus-visible {
  outline: 1px solid rgba(187, 134, 252, 0.34);
  outline-offset: -2px;
}

.timeline-track {
  position: relative;
  display: flex;
  gap: 20px;
  width: max-content;
  min-width: 100%;
  margin: 0;
  padding: 0 max(24px, calc((100vw - var(--max-width)) / 2)) 10px 0;
  list-style: none;
  will-change: transform;
}

.timeline-track::before {
  content: '';
  position: absolute;
  z-index: 0;
  top: 48px;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(187, 134, 252, 0.62) 2%, rgba(187, 134, 252, 0.24) 96%, transparent);
  transform: scaleX(0);
  transform-origin: left;
  animation: railDraw 1.8s var(--md-ease-decel) 220ms forwards;
}

.timeline-item {
  position: relative;
  z-index: 1;
  width: clamp(238px, 23vw, 292px);
  flex: 0 0 clamp(238px, 23vw, 292px);
  scroll-snap-align: center;
}

.timeline-meta {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  height: 70px;
  align-items: start;
}

.timeline-meta time,
.timeline-index,
.timeline-kicker {
  font-family: var(--font-mono);
  font-size: 0.59rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.timeline-meta time { color: var(--md-primary); font-size: 0.67rem; white-space: nowrap; }
.timeline-index { color: rgba(187, 134, 252, 0.34); }

.timeline-node {
  position: absolute;
  z-index: 2;
  top: 39px;
  left: 17px;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border: 1px solid rgba(187, 134, 252, 0.48);
  border-radius: 50%;
  background: var(--md-bg);
  transition: transform 260ms var(--md-ease-spring), border-color 260ms ease;
}

.timeline-node::after {
  content: '';
  position: absolute;
  top: 17px;
  left: 8px;
  width: 1px;
  height: 17px;
  background: linear-gradient(rgba(187, 134, 252, 0.48), transparent);
}

.timeline-node i { width: 6px; height: 6px; border-radius: 50%; background: var(--md-primary); opacity: 0.62; }
.timeline-item:hover .timeline-node { border-color: var(--md-primary); transform: scale(1.16); }
.timeline-item.is-current .timeline-node { border-color: var(--md-primary); box-shadow: 0 0 0 6px rgba(187, 134, 252, 0.09); }
.timeline-item.is-current .timeline-node i { opacity: 1; animation: nodePulse 2.2s ease-in-out infinite; }

.timeline-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 202px;
  padding: 19px 20px;
  overflow: hidden;
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-lg);
  background: rgba(15, 15, 18, 0.7);
  box-shadow: var(--md-shadow-1);
  backdrop-filter: blur(14px);
  transition: transform 300ms var(--md-ease-spring), border-color 300ms ease, background 300ms ease;
}

.timeline-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: linear-gradient(var(--md-primary), transparent 70%);
  opacity: 0.52;
}

.timeline-item:nth-child(even) .timeline-card { transform: translateY(12px); }
.timeline-item:hover .timeline-card { border-color: rgba(187, 134, 252, 0.27); background: rgba(24, 21, 29, 0.82); transform: translateY(-3px); }
.timeline-item:nth-child(even):hover .timeline-card { transform: translateY(8px); }
.timeline-kicker { margin-bottom: 8px; color: var(--md-primary); }
.timeline-card h3 { max-width: 95%; color: var(--md-on-surface); font-size: 0.96rem; line-height: 1.35; }
.timeline-description { margin-top: 8px; color: var(--md-on-surface-var); font-size: 0.78rem; line-height: 1.6; }

.timeline-links { display: flex; flex-wrap: wrap; gap: 7px; margin-top: auto; padding: 13px 0 0; list-style: none; }
.timeline-links a { display: inline-flex; align-items: center; gap: 7px; min-height: 32px; padding: 6px 9px; border: 1px solid rgba(187, 134, 252, 0.2); border-radius: 100px; color: var(--md-on-surface-var); background: rgba(187, 134, 252, 0.045); font-size: 0.62rem; text-decoration: none; transition: color 220ms ease, border-color 220ms ease, transform 220ms var(--md-ease-spring); }
.timeline-links a:hover,
.timeline-links a:focus-visible { border-color: rgba(187, 134, 252, 0.46); color: var(--md-primary); outline: none; transform: translateY(-2px); }
.external-icon { font-size: 0.54rem; transition: transform 220ms ease; }
.timeline-links a:hover .external-icon { transform: translate(2px, -2px); }

@keyframes railDraw { to { transform: scaleX(1); } }
@keyframes nodePulse { 50% { transform: scale(0.5); opacity: 0.35; } }

@media (max-width: 768px), (hover: none), (pointer: coarse) {
  .timeline { min-height: 0; padding: var(--section-pad); overflow: hidden; }
  .timeline-sticky { position: static; height: auto; overflow: visible; padding: 0; }
  .timeline-heading { align-items: flex-start; flex-direction: column; }
  .timeline-range { display: none; }
  .timeline-viewport {
    margin-top: 42px;
    padding-inline: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    touch-action: pan-x;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
    mask-image: linear-gradient(90deg, transparent, #000 16px, #000 calc(100% - 16px), transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 16px, #000 calc(100% - 16px), transparent);
  }
  .timeline-track { gap: 15px; transform: none !important; }
  .timeline-item { width: min(78vw, 286px); flex-basis: min(78vw, 286px); }
  .timeline-card { min-height: 220px; }
}

@media (prefers-reduced-motion: reduce) {
  .timeline { min-height: 0; padding: var(--section-pad); overflow: hidden; }
  .timeline-sticky { position: static; height: auto; overflow: visible; padding: 0; }
  .timeline-viewport { overflow-x: auto; scroll-snap-type: x proximity; }
  .timeline-track { transform: none !important; }
  .timeline-track::before { animation: none; transform: scaleX(1); }
  .timeline-card,
  .timeline-node,
  .timeline-links a,
  .external-icon { transition: none; }
  .timeline-item:nth-child(even) .timeline-card,
  .timeline-item:hover .timeline-card,
  .timeline-item:nth-child(even):hover .timeline-card,
  .timeline-links a:hover { transform: none; }
  .timeline-item.is-current .timeline-node i { animation: none; }
}
</style>
