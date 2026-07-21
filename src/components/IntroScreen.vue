<template>
  <Transition name="intro-fade" @after-leave="onDone">
    <div
      v-if="visible"
      ref="overlay"
      class="intro-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-wordmark"
      tabindex="-1"
      @click="dismiss"
    >
      <h1 id="intro-wordmark" class="wordmark">HEIZNERD</h1>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const AUTO_CLOSE_MS = 1200;
const emit = defineEmits(['done']);

const overlay = ref(null);
const visible = ref(true);

let autoCloseTimer;
let dismissed = false;
let completed = false;
let overflowRestored = false;
let previousBodyOverflow = '';

const removeInteractions = () => {
  window.clearTimeout(autoCloseTimer);
  window.removeEventListener('keydown', dismiss);
};

const restoreBodyOverflow = () => {
  if (overflowRestored) return;

  document.body.style.overflow = previousBodyOverflow;
  overflowRestored = true;
};

const dismiss = () => {
  if (dismissed) return;

  dismissed = true;
  removeInteractions();
  visible.value = false;
};

const onDone = () => {
  if (completed) return;

  completed = true;
  restoreBodyOverflow();
  emit('done');
};

onMounted(() => {
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', dismiss);
  autoCloseTimer = window.setTimeout(dismiss, AUTO_CLOSE_MS);
  nextTick(() => overlay.value?.focus({ preventScroll: true }));
});

onUnmounted(() => {
  removeInteractions();
  restoreBodyOverflow();
});
</script>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: grid;
  place-items: center;
  padding: max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));
  overflow: hidden;
  background: var(--md-bg, #0f0f11);
  outline: none;
}

.wordmark {
  color: var(--md-on-surface, #f0edf2);
  font-family: var(--font-display, system-ui, sans-serif);
  font-size: clamp(1.75rem, 5vw, 3.5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.04em;
}

.intro-fade-leave-active {
  transition: opacity 200ms var(--md-ease-accel, ease-in);
}

.intro-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .intro-fade-leave-active {
    transition: none;
  }
}
</style>
