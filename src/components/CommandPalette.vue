<template>
  <Transition name="fade">
    <div v-if="isOpen" class="cmd-overlay" @click="close" aria-modal="true" role="dialog">
      <Transition name="slide-up">
        <div v-if="isOpen" class="cmd-dialog" @click.stop>
          <!-- Search input -->
          <div class="cmd-search-wrap">
            <i class="fas fa-search cmd-search-icon"></i>
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              class="cmd-input"
              :placeholder="t.placeholder"
              @keydown.down.prevent="onArrowDown"
              @keydown.up.prevent="onArrowUp"
              @keydown.enter.prevent="onEnter"
              @keydown.esc="close"
            />
            <span class="cmd-esc-badge">ESC</span>
          </div>

          <!-- Command sections -->
          <div class="cmd-body">
            <div v-if="filteredCommands.length === 0" class="cmd-empty">
              {{ t.noResults }}
            </div>
            
            <div v-else class="cmd-list">
              <div
                v-for="(cmd, index) in filteredCommands"
                :key="index"
                class="cmd-item"
                :class="{ active: index === activeIndex }"
                @mouseenter="activeIndex = index"
                @click="runCommand(cmd)"
              >
                <div class="cmd-item-left">
                  <span class="cmd-item-icon">
                    <i :class="cmd.icon"></i>
                  </span>
                  <span class="cmd-item-label">{{ cmd.label }}</span>
                </div>
                <div class="cmd-item-right" v-if="cmd.shortcut">
                  <kbd class="cmd-kbd">{{ cmd.shortcut }}</kbd>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer/Help bar -->
          <div class="cmd-footer">
            <div class="cmd-help-item"><kbd>↑↓</kbd> <span>{{ t.navigate }}</span></div>
            <div class="cmd-help-item"><kbd>↵</kbd> <span>{{ t.select }}</span></div>
            <div class="cmd-help-item"><kbd>esc</kbd> <span>{{ t.close }}</span></div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, inject, computed, nextTick } from 'vue';

const emit = defineEmits(['close']);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const lang = inject('lang');
const translations = inject('translations');

// Handle translations
const t = computed(() => {
  return lang.value === 'vi' 
    ? {
        placeholder: 'Tìm lệnh hoặc di chuyển nhanh...',
        noResults: 'Không tìm thấy kết quả nào.',
        navigate: 'Di chuyển',
        select: 'Chọn',
        close: 'Thoát',
        gotoHome: 'Đi tới Trang chủ',
        gotoAbout: 'Đi tới Giới thiệu',
        gotoSkills: 'Đi tới Kỹ năng',
        gotoTimeline: 'Đi tới Hành trình',
        gotoProjects: 'Đi tới Dự án',
        gotoContact: 'Đi tới Liên hệ',
        switchLang: 'Chuyển sang tiếng Anh (EN)',
      }
    : {
        placeholder: 'Search commands or navigate...',
        noResults: 'No results found.',
        navigate: 'Navigate',
        select: 'Select',
        close: 'Close',
        gotoHome: 'Go to Home',
        gotoAbout: 'Go to About',
        gotoSkills: 'Go to Skills',
        gotoTimeline: 'Go to Timeline',
        gotoProjects: 'Go to Projects',
        gotoContact: 'Go to Contact',
        switchLang: 'Switch to Vietnamese (VI)',
      };
});

const isOpen = computed(() => props.modelValue);
const searchQuery = ref('');
const activeIndex = ref(0);
const inputRef = ref(null);

const rawCommands = computed(() => [
  { label: t.value.gotoHome, icon: 'fas fa-home', action: () => scrollToSection('home') },
  { label: t.value.gotoAbout, icon: 'fas fa-user-astronaut', action: () => scrollToSection('about') },
  { label: t.value.gotoSkills, icon: 'fas fa-laptop-code', action: () => scrollToSection('skills') },
  { label: t.value.gotoTimeline, icon: 'fas fa-history', action: () => scrollToSection('timeline') },
  { label: t.value.gotoProjects, icon: 'fas fa-rocket', action: () => scrollToSection('projects') },
  { label: t.value.gotoContact, icon: 'fas fa-paper-plane', action: () => scrollToSection('contact') },
  { 
    label: t.value.switchLang, 
    icon: 'fas fa-globe', 
    shortcut: 'L',
    action: () => {
      const newLang = lang.value === 'vi' ? 'en' : 'vi';
      localStorage.setItem('preferred-lang', newLang);
      window.location.reload();
    }
  },
]);

const filteredCommands = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return rawCommands.value;
  return rawCommands.value.filter(cmd => cmd.label.toLowerCase().includes(query));
});

// Watch query change to reset selection index
watch(searchQuery, () => {
  activeIndex.value = 0;
});

// Focus input on open
watch(isOpen, async (newVal) => {
  if (newVal) {
    searchQuery.value = '';
    activeIndex.value = 0;
    await nextTick();
    inputRef.value?.focus();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const close = () => {
  emit('close');
};

const scrollToSection = (id) => {
  close();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const runCommand = (cmd) => {
  cmd.action();
};

const onArrowDown = () => {
  if (filteredCommands.value.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % filteredCommands.value.length;
};

const onArrowUp = () => {
  if (filteredCommands.value.length === 0) return;
  activeIndex.value = (activeIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length;
};

const onEnter = () => {
  const cmd = filteredCommands.value[activeIndex.value];
  if (cmd) runCommand(cmd);
};

// Global key listeners
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    close();
  }
  // Global hotkeys (when palette is closed)
  if (!isOpen.value) {
    if (e.key === 'l' && e.altKey) {
      e.preventDefault();
      const nextL = lang.value === 'vi' ? 'en' : 'vi';
      localStorage.setItem('preferred-lang', nextL);
      window.location.reload();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.cmd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 12, 0.75);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: clamp(60px, 12vh, 160px);
}

.cmd-dialog {
  background: var(--md-surface);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-xl);
  width: 100%;
  max-width: 580px;
  overflow: hidden;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

.cmd-search-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--md-outline-var);
}

.cmd-search-icon {
  font-size: 1.1rem;
  color: var(--md-primary);
}

.cmd-input {
  background: transparent;
  border: none;
  color: var(--md-on-surface);
  font-family: var(--font-sans);
  font-size: 1.05rem;
  outline: none;
  flex: 1;
}

.cmd-esc-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--md-on-surface-var);
  border: 1px solid var(--md-outline);
  border-radius: 4px;
  padding: 2px 6px;
  opacity: 0.7;
}

.cmd-body {
  max-height: 320px;
  overflow-y: auto;
  padding: 10px;
}

.cmd-empty {
  padding: 24px;
  text-align: center;
  color: var(--md-on-surface-var);
  font-size: 0.9rem;
}

.cmd-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cmd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: var(--md-radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
}

.cmd-item.active {
  background: var(--md-primary-container);
  color: var(--md-primary);
}

.cmd-item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cmd-item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  opacity: 0.8;
  color: var(--md-secondary);
}

.cmd-item.active .cmd-item-icon {
  color: var(--md-primary);
}

.cmd-item-label {
  font-size: 0.92rem;
  font-weight: 500;
}

.cmd-kbd {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--md-outline);
  border-radius: 4px;
  padding: 2px 6px;
  color: var(--md-on-surface-var);
}

.cmd-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-top: 1px solid var(--md-outline-var);
  background: var(--md-surface-container);
}

.cmd-help-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--md-on-surface-var);
}

.cmd-help-item kbd {
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--md-outline-var);
  border-radius: 3px;
  padding: 1px 4px;
  font-weight: 600;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: transform 0.3s var(--md-ease-spring), opacity 0.3s;
}
.slide-up-leave-active {
  transition: transform 0.2s ease, opacity 0.2s;
}
.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
