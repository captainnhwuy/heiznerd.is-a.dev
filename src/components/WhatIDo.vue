<template>
  <section id="what-i-do" class="what-i-do">
    <div class="container">
      <!-- Section header -->
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <p class="section-subtitle">{{ t.intro }}</p>
      </div>

      <!-- Specs Grid Panel -->
      <div class="what-grid">
        <!-- Service 1: Discord Bot -->
        <div class="service-cell drift from-left">
          <div class="cell-head">
            <span class="cell-icon"><i class="fab fa-discord"></i></span>
            <h3 class="cell-title">{{ t.botName }}</h3>
          </div>
          <p class="cell-desc">{{ t.botDesc }}</p>
        </div>

        <!-- Service 2: Discord Template -->
        <div class="service-cell drift from-right">
          <div class="cell-head">
            <span class="cell-icon"><i class="fas fa-cubes"></i></span>
            <h3 class="cell-title">{{ t.templateName }}</h3>
          </div>
          <p class="cell-desc">{{ t.templateDesc }}</p>
        </div>

        <!-- FAQ: Price, Safety & Free status -->
        <div class="faq-cell span-2 drift from-bottom">
          <div class="faq-item">
            <h4 class="faq-question">// {{ t.qPrice }}</h4>
            <p class="faq-answer">{{ t.aPrice }}</p>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">// {{ t.qSafety }}</h4>
            <p class="faq-answer" v-html="formattedSafetyAnswer"></p>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">// {{ t.qFree }}</h4>
            <p class="faq-answer">
              {{ t.aFree }}
              <a href="https://github.com/NekoTech-Foundation" target="_blank" rel="noopener" class="faq-link">
                NekoTech-Foundation <i class="fab fa-github"></i>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, computed } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].whatIDo;

const formattedSafetyAnswer = computed(() => {
  // Convert markdown link [này](link) to HTML anchor to enable styling and routing
  const text = t.aSafety;
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener" class="faq-link">$1 <i class="fas fa-external-link-alt" style="font-size:0.6rem"></i></a>'
  );
});
</script>

<style scoped>
.what-i-do {
  background: transparent;
  position: relative;
}

.what-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 48px;
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--md-shadow-2);
}

/* Service Cells */
.service-cell {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid var(--md-outline-var);
  background: transparent;
}

.service-cell:first-child {
  border-right: 1px solid var(--md-outline-var);
}

.cell-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cell-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--md-radius-md);
  background: rgba(187, 134, 252, 0.08);
  border: 1.5px solid rgba(187, 134, 252, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--md-primary);
}

.cell-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--md-on-surface);
}

.cell-desc {
  font-size: 0.95rem;
  color: var(--md-on-surface-var);
  line-height: 1.65;
}

/* FAQ Cell */
.faq-cell {
  grid-column: span 2;
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  background: rgba(255, 255, 255, 0.005);
}

.faq-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item:not(:last-child) {
  border-right: 1px solid var(--md-outline-var);
  padding-right: 28px;
}

.faq-question {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--md-secondary);
  line-height: 1.4;
}

.faq-answer {
  font-size: 0.9rem;
  color: var(--md-on-surface-var);
  line-height: 1.65;
}

.faq-link {
  color: var(--md-primary);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.faq-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}

/* Responsive */
@media (max-width: 900px) {
  .faq-cell {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .faq-item:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid var(--md-outline-var);
    padding-right: 0;
    padding-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .what-grid {
    grid-template-columns: 1fr;
  }
  .service-cell {
    border-right: none !important;
  }
}
</style>
