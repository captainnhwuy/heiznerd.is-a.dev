<template>
  <div>
    <!-- Floating bottom dock navigation -->
    <nav class="nav-dock">
      <!-- Logo / Home link -->
      <a :href="isPomodoroPage ? '/' : '#home'" class="dock-logo" :title="t.home">
        <div class="logo-circle">
          <img src="/heiznerd-logo.png" alt="Heiznerd" class="logo-img" />
        </div>
      </a>

      <div class="dock-divider"></div>

      <!-- Navigation links -->
      <div class="dock-links" v-if="!isPomodoroPage">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav-link"
          :title="t[link.key]"
        >
          <i :class="link.icon" class="dock-icon"></i>
          <span class="dock-label">{{ t[link.key] }}</span>
          <span class="nav-dot"></span>
        </a>
      </div>

      <div class="dock-divider" v-if="!isPomodoroPage"></div>

      <!-- Quick actions -->
      <div class="dock-actions">
        <!-- Command palette button -->
        <button class="dock-action-btn" @click="cmdOpen = true" :title="t.commandTooltip || 'Lệnh (Ctrl+K)'">
          <i class="fas fa-terminal"></i>
          <kbd class="dock-kbd">⌘K</kbd>
        </button>

        <!-- Language toggle -->
        <button class="dock-action-btn" @click="toggleLanguage" :title="t.switchLang">
          <span>{{ currentLang === 'vi' ? '🇻🇳' : '🇺🇸' }}</span>
        </button>
      </div>

      <div class="dock-divider"></div>

      <!-- System Status Widget (Hyprland style clock & date) -->
      <div class="dock-status-widget" @click="showCalendar = !showCalendar" :title="lang === 'vi' ? 'Xem lịch' : 'Show calendar'">
        <i class="far fa-clock clock-icon-widget"></i>
        <div class="status-time-wrap">
          <span class="status-time">{{ currentTime }}</span>
          <span class="status-date">{{ currentDate }}</span>
        </div>

        <!-- Popover Calendar Sheet -->
        <transition name="cal-slide">
          <div class="calendar-popover" v-if="showCalendar" @click.stop>
            <div class="cal-header">
              <span class="cal-month">{{ currentMonthYearLabel }}</span>
            </div>
            
            <div class="cal-weekdays">
              <span v-for="d in weekdaysLabel" :key="d" class="cal-wd">{{ d }}</span>
            </div>
            
            <div class="cal-grid">
              <span 
                v-for="(dayObj, idx) in calendarDays" 
                :key="idx" 
                class="cal-day" 
                :class="{ 
                  'other-month': !dayObj.isCurrentMonth, 
                  'today': dayObj.isToday 
                }"
              >
                {{ dayObj.day }}
              </span>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Command Palette component -->
    <CommandPalette :modelValue="cmdOpen" @close="cmdOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import CommandPalette from './CommandPalette.vue';

const route = useRoute();
const isPomodoroPage = computed(() => route.path.includes('/pomodoro'));

const currentLang = inject('currentLang');
const lang = inject('lang');
const t = inject('translations')[lang.value].navbar;

const cmdOpen = ref(false);

const navLinks = [
  { id: 'home', key: 'home', icon: 'fas fa-home' },
  { id: 'about', key: 'about', icon: 'fas fa-user-astronaut' },
  { id: 'skills', key: 'skills', icon: 'fas fa-laptop-code' },
  { id: 'timeline', key: 'timeline', icon: 'fas fa-history' },
  { id: 'projects', key: 'projects', icon: 'fas fa-rocket' },
  { id: 'contact', key: 'contact', icon: 'fas fa-paper-plane' },
];

const toggleLanguage = () => {
  const newLang = lang.value === 'vi' ? 'en' : 'vi';
  localStorage.setItem('preferred-lang', newLang);
  window.location.reload();
};

const handleGlobalKeys = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    cmdOpen.value = !cmdOpen.value;
  }
};

// Clock & Calendar Widget logic
const currentTime = ref('');
const currentDate = ref('');
const showCalendar = ref(false);

const updateClock = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${hh}:${mm}`;

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  currentDate.value = now.toLocaleDateString(lang.value === 'vi' ? 'vi-VN' : 'en-US', options);
};

const weekdaysLabel = computed(() => {
  return lang.value === 'vi'
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
});

const calendarDays = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // Sunday is 0
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month fill days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthTotalDays - i, isCurrentMonth: false });
  }

  // Current month days
  const today = now.getDate();
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, isCurrentMonth: true, isToday: i === today });
  }

  // Next month fill days (pad to 42 grids for consistency)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  return days;
});

const currentMonthYearLabel = computed(() => {
  const now = new Date();
  return now.toLocaleDateString(lang.value === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' });
});

const handleWindowClick = (e) => {
  const widget = document.querySelector('.dock-status-widget');
  if (widget && !widget.contains(e.target)) {
    showCalendar.value = false;
  }
};

let clockInterval;

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeys);
  window.addEventListener('click', handleWindowClick);
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeys);
  window.removeEventListener('click', handleWindowClick);
  clearInterval(clockInterval);
});
</script>

<style scoped>
/* =============================================
   FLOATING BOTTOM DOCK NAVIGATION
   ============================================= */
.nav-dock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  
  height: 56px;
  padding: 0 16px;
  background: rgba(20, 19, 23, 0.65);
  border-radius: 100px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 90vw;
  width: max-content;
  transition: all 0.3s var(--md-ease-spring);
}

/* Subtle static gradient border (no glowing pan animation) */
.nav-dock::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 100px;
  padding: 1px;
  background: linear-gradient(90deg, rgba(187, 134, 252, 0.15), rgba(3, 218, 198, 0.15));
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  opacity: 0.8;
  transition: all 0.3s var(--md-ease-spring);
}

.nav-dock:hover {
  background: rgba(20, 19, 23, 0.75);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.7);
  transform: translateX(-50%) translateY(-2px);
}

.nav-dock:hover::before {
  background: linear-gradient(90deg, rgba(187, 134, 252, 0.3), rgba(3, 218, 198, 0.3));
}

/* Dividing line */
.dock-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
}

/* Logo */
.dock-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--md-surface-high);
  border: 1.5px solid rgba(187, 134, 252, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.3s var(--md-ease-spring), border-color 0.3s;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dock-logo:hover .logo-circle {
  transform: rotate(-10deg) scale(1.1);
  border-color: var(--md-primary);
}

/* Navigation items container */
.dock-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Individual link items */
.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border-radius: 100px;
  text-decoration: none;
  color: var(--md-on-surface-var);
  font-size: 0.82rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.25s var(--md-ease-spring);
  position: relative;
}

.dock-icon {
  font-size: 1rem;
  transition: transform 0.25s var(--md-ease-spring);
}

.dock-label {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.3s var(--md-ease-spring), opacity 0.25s ease;
}

/* Hover effects */
.nav-link:hover {
  color: var(--md-primary);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(187, 134, 252, 0.15);
  transform: translateY(-2px);
}

.nav-link:hover .dock-icon {
  transform: scale(1.1);
}

.nav-link:hover .dock-label {
  max-width: 80px;
  opacity: 1;
}

/* Active Nav State */
.nav-link.active {
  color: var(--md-primary);
  background: rgba(187, 134, 252, 0.08);
  border-color: rgba(187, 134, 252, 0.2);
}

.nav-link.active .dock-label {
  max-width: 80px;
  opacity: 1;
}

/* Tactile Active compression */
.nav-link:active {
  transform: scale(0.95) translateY(0);
}

/* Subtle Active Dot Indicator (no gradient) */
.nav-dot {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--md-primary);
  opacity: 0;
  transition: all 0.25s var(--md-ease-spring);
  pointer-events: none;
}

.nav-link.active .nav-dot {
  opacity: 1;
  width: 8px;
  background: var(--md-primary);
}

.nav-link:hover:not(.active) .nav-dot {
  opacity: 0.4;
  width: 4px;
  background: var(--md-primary);
}

/* Actions buttons */
.dock-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dock-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid transparent;
  color: var(--md-on-surface-var);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.25s var(--md-ease-spring);
  position: relative;
}

.dock-action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--md-primary);
  border-color: rgba(187, 134, 252, 0.2);
  transform: translateY(-2px);
}

.dock-action-btn:active {
  transform: scale(0.9) translateY(0);
}

/* Small KBD helper inside search/terminal button */
.dock-kbd {
  display: none; /* hidden by default, shown on large screen hover */
  position: absolute;
  bottom: 46px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--md-surface-highest);
  border: 1px solid var(--md-outline);
  color: var(--md-on-surface);
  border-radius: 4px;
  padding: 1px 4px;
  font-size: 0.6rem;
  font-family: var(--font-mono);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
}

.dock-action-btn:hover .dock-kbd {
  display: block;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Clock / Date widget */
.dock-status-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 40px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  position: relative;
  transition: all 0.25s var(--md-ease-spring);
  user-select: none;
}

.dock-status-widget:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(187, 134, 252, 0.25);
  color: var(--md-primary);
  transform: translateY(-1px);
}

.clock-icon-widget {
  font-size: 0.95rem;
  color: var(--md-primary);
}

.status-time-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.status-time {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--md-on-surface);
}

.status-date {
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--md-on-surface-var);
  line-height: 1;
  margin-top: 1px;
}

/* Calendar Popover (clean glassmorphism) */
.calendar-popover {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 250px;
  background: rgba(20, 19, 23, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-lg);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
  padding: 16px;
  z-index: 1000;
  cursor: default;
}

.cal-header {
  text-align: center;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--md-outline-var);
  padding-bottom: 8px;
}

.cal-month {
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--md-on-surface);
  text-transform: capitalize;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
  margin-bottom: 6px;
}

.cal-wd {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--md-secondary);
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--md-on-surface);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.cal-day.other-month {
  color: rgba(255, 255, 255, 0.2);
}

.cal-day.today {
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-weight: 700;
}

.cal-day:hover:not(.today) {
  background: rgba(255, 255, 255, 0.08);
  color: var(--md-primary);
  cursor: pointer;
}

/* Slide and fade transition for popover */
.cal-slide-enter-active {
  transition: transform 0.3s var(--md-ease-spring), opacity 0.25s ease;
}
.cal-slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.cal-slide-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.cal-slide-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}

/* =============================================
   RESPONSIVE LAYOUT
   ============================================= */
@media (max-width: 768px) {
  .nav-dock {
    bottom: 16px;
    height: 52px;
    gap: 8px;
    padding: 0 10px;
  }
  
  .logo-circle {
    width: 34px;
    height: 34px;
  }
  
  .nav-link {
    width: 36px;
    height: 36px;
    padding: 0;
    justify-content: center;
  }
  
  /* Show ONLY icons on mobile, no label expansion to prevent clipping */
  .dock-label,
  .nav-link:hover .dock-label,
  .nav-link.active .dock-label {
    display: none;
    max-width: 0;
    opacity: 0;
  }
  
  .dock-action-btn {
    width: 34px;
    height: 34px;
  }

  .status-date {
    display: none;
  }

  .dock-status-widget {
    padding: 0 8px;
    height: 34px;
    gap: 4px;
  }

  .status-time {
    font-size: 0.7rem;
  }

  .clock-icon-widget {
    font-size: 0.8rem;
  }

  .calendar-popover {
    bottom: 60px;
    right: -20px;
    width: 230px;
  }
}
</style>