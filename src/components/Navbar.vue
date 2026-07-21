<template>
  <div>
    <nav class="nav-dock" :class="{ 'is-ready': introComplete }" :aria-label="lang === 'vi' ? 'Điều hướng chính' : 'Main navigation'">
      <a :href="isPomodoroPage ? '/' : '#home'" class="dock-logo dock-control" :aria-label="t.home">
        <img src="/heiznerd-logo.png" alt="" class="logo-img" />
        <span class="dock-tooltip">{{ t.home }}</span>
      </a>

      <span class="dock-separator" aria-hidden="true"></span>

      <div v-if="!isPomodoroPage" ref="dockLinksRef" class="dock-links" role="group" :aria-label="lang === 'vi' ? 'Các mục' : 'Sections'">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav-link dock-control"
          :aria-label="t[link.key]"
        >
          <i :class="link.icon" class="dock-icon" aria-hidden="true"></i>
          <span class="dock-tooltip">{{ t[link.key] }}</span>
        </a>
        <span class="dock-active-indicator" :style="indicatorStyle" aria-hidden="true"></span>
      </div>

      <span v-if="!isPomodoroPage" class="dock-separator" aria-hidden="true"></span>

      <div class="dock-actions" role="group" :aria-label="lang === 'vi' ? 'Thao tác nhanh' : 'Quick actions'">
        <button class="dock-action-btn dock-control" type="button" @click="cmdOpen = true" :aria-label="lang === 'vi' ? 'Mở bảng lệnh' : 'Open command palette'">
          <i class="fas fa-terminal" aria-hidden="true"></i>
          <span class="dock-tooltip">{{ lang === 'vi' ? 'Lệnh' : 'Commands' }} <kbd>Ctrl K</kbd></span>
        </button>
        <button class="dock-action-btn dock-control dock-language" type="button" @click="toggleLanguage" :aria-label="t.switchLang">
          <span>{{ currentLang === 'vi' ? 'VN' : 'EN' }}</span>
          <span class="dock-tooltip">{{ t.switchLang }}</span>
        </button>
      </div>

      <span class="dock-separator" aria-hidden="true"></span>

      <div ref="statusWrapRef" class="dock-status-wrap">
        <button
          type="button"
          class="dock-status-widget dock-control"
          :aria-expanded="showCalendar"
          aria-haspopup="dialog"
          aria-controls="dock-calendar"
          :aria-label="lang === 'vi' ? 'Xem lịch' : 'Show calendar'"
          @click="showCalendar = !showCalendar"
        >
          <i class="far fa-clock clock-icon-widget" aria-hidden="true"></i>
          <span class="status-time-wrap">
            <strong class="status-time">{{ currentTime }}</strong>
            <small class="status-date">{{ currentDate }}</small>
          </span>
          <span class="dock-tooltip">{{ lang === 'vi' ? 'Lịch' : 'Calendar' }}</span>
        </button>

        <Transition name="cal-slide">
          <div v-if="showCalendar" id="dock-calendar" class="calendar-popover" role="dialog" :aria-label="currentMonthYearLabel">
            <div class="cal-header"><span class="cal-month">{{ currentMonthYearLabel }}</span></div>
            <div class="cal-weekdays"><span v-for="d in weekdaysLabel" :key="d" class="cal-wd">{{ d }}</span></div>
            <div class="cal-grid">
              <span v-for="(dayObj, idx) in calendarDays" :key="idx" class="cal-day" :class="{ 'other-month': !dayObj.isCurrentMonth, today: dayObj.isToday }">{{ dayObj.day }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </nav>

    <CommandPalette :modelValue="cmdOpen" @close="cmdOpen = false" />
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CommandPalette from './CommandPalette.vue';

const props = defineProps({ introComplete: { type: Boolean, default: false } });
const route = useRoute();
const isPomodoroPage = computed(() => route.path.includes('/pomodoro'));
const currentLang = inject('currentLang');
const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].navbar);
const cmdOpen = ref(false);
const showCalendar = ref(false);
const currentTime = ref('');
const currentDate = ref('');
const dockLinksRef = ref(null);
const statusWrapRef = ref(null);
const indicatorStyle = ref({ '--indicator-x': '20px', '--indicator-w': '18px', opacity: 0 });

const navLinks = [
  { id: 'home', key: 'home', icon: 'fas fa-home' },
  { id: 'about', key: 'about', icon: 'fas fa-user-astronaut' },
  { id: 'timeline', key: 'timeline', icon: 'fas fa-history' },
  { id: 'projects', key: 'projects', icon: 'fas fa-rocket' },
  { id: 'contact', key: 'contact', icon: 'fas fa-paper-plane' },
];

const toggleLanguage = () => {
  localStorage.setItem('preferred-lang', lang.value === 'vi' ? 'en' : 'vi');
  window.location.reload();
};

const handleGlobalKeys = event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    cmdOpen.value = !cmdOpen.value;
  }
  if (event.key === 'Escape') showCalendar.value = false;
};

const updateClock = () => {
  const now = new Date();
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  currentDate.value = now.toLocaleDateString(lang.value === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const weekdaysLabel = computed(() => lang.value === 'vi' ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
const calendarDays = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  const days = [];
  for (let index = firstDay - 1; index >= 0; index -= 1) days.push({ day: previousDays - index, isCurrentMonth: false });
  for (let day = 1; day <= totalDays; day += 1) days.push({ day, isCurrentMonth: true, isToday: day === now.getDate() });
  for (let day = 1; days.length < 42; day += 1) days.push({ day, isCurrentMonth: false });
  return days;
});
const currentMonthYearLabel = computed(() => new Date().toLocaleDateString(lang.value === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' }));

const syncIndicator = () => {
  const root = dockLinksRef.value;
  const active = root?.querySelector('.nav-link.active');
  if (!root || !active) return;
  indicatorStyle.value = {
    '--indicator-x': `${active.offsetLeft + active.offsetWidth / 2}px`,
    '--indicator-w': `${Math.max(18, Math.min(28, active.offsetWidth * 0.5))}px`,
    opacity: 1,
  };
};

const handleOutsideClick = event => {
  if (statusWrapRef.value && !statusWrapRef.value.contains(event.target)) showCalendar.value = false;
};

let clockInterval;
let mutationObserver;
let resizeObserver;

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeys);
  window.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', syncIndicator);
  updateClock();
  clockInterval = window.setInterval(updateClock, 30000);
  await nextTick();
  if (dockLinksRef.value) {
    mutationObserver = new MutationObserver(syncIndicator);
    mutationObserver.observe(dockLinksRef.value, { attributes: true, subtree: true, attributeFilter: ['class'] });
    resizeObserver = new ResizeObserver(syncIndicator);
    resizeObserver.observe(dockLinksRef.value);
    syncIndicator();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeys);
  window.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('resize', syncIndicator);
  window.clearInterval(clockInterval);
  mutationObserver?.disconnect();
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.nav-dock {
  position: fixed;
  z-index: 999;
  bottom: calc(18px + env(safe-area-inset-bottom));
  left: 50%;
  display: flex;
  width: max-content;
  max-width: calc(100vw - 24px);
  min-height: 58px;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 20px;
  color: var(--md-on-surface-var);
  background: color-mix(in srgb, var(--md-surface) 82%, transparent);
  box-shadow: 0 18px 55px rgba(0,0,0,.52), inset 0 1px rgba(255,255,255,.035);
  backdrop-filter: blur(24px) saturate(125%);
  transform: translate3d(-50%, 28px, 0) scale(.96);
  opacity: 0;
  pointer-events: none;
  transition: opacity 500ms ease, transform 650ms var(--md-ease-spring), border-color 300ms ease, background 300ms ease;
}
.nav-dock.is-ready { opacity: 1; pointer-events: auto; transform: translate3d(-50%,0,0) scale(1); }
.nav-dock:hover { border-color: rgba(187,134,252,.2); background: color-mix(in srgb, var(--md-surface) 88%, transparent); }
.nav-dock::before { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; background:linear-gradient(105deg,rgba(187,134,252,.08),transparent 36%,rgba(3,218,198,.035)); }

.dock-separator { position:relative; z-index:1; width:1px; height:26px; flex:0 0 auto; background:var(--md-outline-var); }
.dock-logo,
.dock-control { position:relative; z-index:2; }
.dock-logo { display:grid; width:40px; height:40px; flex:0 0 auto; place-items:center; overflow:hidden; border:1px solid rgba(187,134,252,.24); border-radius:13px; background:var(--md-surface-high); text-decoration:none; transition:transform 280ms var(--md-ease-spring),border-color 220ms ease; }
.logo-img { display:block; width:100%; height:100%; object-fit:cover; }
.dock-logo:hover { border-color:var(--md-primary); transform:translateY(-3px) rotate(-4deg); }

.dock-links { position:relative; z-index:2; display:flex; min-width:0; align-items:center; gap:3px; }
.nav-link,
.dock-action-btn { display:grid; width:39px; height:39px; flex:0 0 39px; place-items:center; border:1px solid transparent; border-radius:12px; color:var(--md-on-surface-var); background:transparent; text-decoration:none; cursor:pointer; transition:color 220ms ease,background 220ms ease,border-color 220ms ease,transform 330ms var(--md-ease-spring); }
.dock-icon { font-size:.9rem; transition:transform 330ms var(--md-ease-spring); }
.nav-link:hover,
.nav-link:focus-visible,
.dock-action-btn:hover,
.dock-action-btn:focus-visible { color:var(--md-primary); border-color:rgba(187,134,252,.18); background:rgba(187,134,252,.065); outline:none; transform:translateY(-3px); }
.nav-link:hover .dock-icon,
.nav-link:focus-visible .dock-icon { transform:scale(1.12); }
.nav-link.active { color:var(--md-primary); background:rgba(187,134,252,.055); }
.dock-active-indicator { position:absolute; bottom:-5px; left:var(--indicator-x); width:var(--indicator-w); height:2px; border-radius:2px; background:linear-gradient(90deg,var(--md-primary),var(--md-secondary)); transform:translateX(-50%); box-shadow:0 0 9px rgba(187,134,252,.42); transition:left 480ms var(--md-ease-spring),width 480ms var(--md-ease-spring),opacity 200ms ease; }

.dock-actions { position:relative; z-index:2; display:flex; gap:3px; }
.dock-language { font-family:var(--font-mono); font-size:.61rem; font-weight:700; letter-spacing:.05em; }
.dock-tooltip { position:absolute; bottom:calc(100% + 12px); left:50%; width:max-content; max-width:190px; padding:6px 9px; border:1px solid var(--md-outline-var); border-radius:8px; color:var(--md-on-surface); background:rgba(20,19,23,.94); box-shadow:var(--md-shadow-2); font-family:var(--font-mono); font-size:.58rem; line-height:1.25; opacity:0; pointer-events:none; transform:translate(-50%,6px); transition:opacity 180ms ease,transform 240ms var(--md-ease-spring); }
.dock-control:hover .dock-tooltip,
.dock-control:focus-visible .dock-tooltip { opacity:1; transform:translate(-50%,0); }
.dock-tooltip kbd { margin-left:4px; color:var(--md-primary); font-size:.54rem; }

.dock-status-wrap { position:relative; z-index:3; }
.dock-status-widget { position:relative; display:flex; height:40px; align-items:center; gap:8px; padding:0 11px; border:1px solid rgba(255,255,255,.06); border-radius:12px; color:var(--md-on-surface-var); background:rgba(255,255,255,.025); cursor:pointer; transition:color 220ms ease,border-color 220ms ease,background 220ms ease,transform 300ms var(--md-ease-spring); }
.dock-status-widget:hover,
.dock-status-widget:focus-visible { color:var(--md-primary); border-color:rgba(187,134,252,.22); background:rgba(187,134,252,.06); outline:none; transform:translateY(-2px); }
.clock-icon-widget { color:var(--md-primary); font-size:.86rem; }
.status-time-wrap { display:flex; flex-direction:column; align-items:flex-start; }
.status-time { color:var(--md-on-surface); font-family:var(--font-mono); font-size:.72rem; line-height:1.05; }
.status-date { margin-top:2px; color:var(--md-on-surface-var); font-size:.55rem; line-height:1; }

.calendar-popover { position:absolute; right:0; bottom:54px; width:252px; padding:16px; border:1px solid rgba(255,255,255,.1); border-radius:16px; color:var(--md-on-surface); background:rgba(18,17,22,.94); box-shadow:0 18px 56px rgba(0,0,0,.65); backdrop-filter:blur(22px); }
.cal-header { margin-bottom:12px; padding-bottom:9px; border-bottom:1px solid var(--md-outline-var); text-align:center; }
.cal-month { font-family:var(--font-display); font-size:.86rem; font-weight:700; text-transform:capitalize; }
.cal-weekdays,
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; text-align:center; }
.cal-weekdays { margin-bottom:6px; }
.cal-wd { color:var(--md-secondary); font-size:.61rem; font-weight:700; }
.cal-day { display:grid; height:26px; place-items:center; border-radius:6px; font-family:var(--font-mono); font-size:.7rem; }
.cal-day.other-month { color:rgba(255,255,255,.2); }
.cal-day.today { color:var(--md-on-primary); background:var(--md-primary); font-weight:700; }
.cal-slide-enter-active { transition:opacity 220ms ease,transform 330ms var(--md-ease-spring); }
.cal-slide-leave-active { transition:opacity 160ms ease,transform 180ms ease; }
.cal-slide-enter-from,
.cal-slide-leave-to { opacity:0; transform:translateY(9px) scale(.97); }

@media (hover:hover) and (pointer:fine) {
  .dock-links:hover .nav-link:not(:hover) { transform:scale(.95); opacity:.72; }
}
@media (max-width:768px) {
  .nav-dock { right:12px; bottom:calc(12px + env(safe-area-inset-bottom)); left:12px; width:auto; max-width:none; min-height:54px; gap:6px; padding:7px 8px; transform:translate3d(0,24px,0) scale(.97); }
  .nav-dock.is-ready { transform:none; }
  .dock-links { flex:1; overflow-x:auto; scrollbar-width:none; }
  .dock-links::-webkit-scrollbar { display:none; }
  .nav-link,
  .dock-action-btn { width:36px; height:36px; flex-basis:36px; }
  .dock-logo { width:37px; height:37px; }
  .dock-separator { height:22px; }
  .dock-tooltip,
  .status-date { display:none; }
  .dock-status-widget { height:36px; padding:0 8px; }
  .calendar-popover { right:-2px; bottom:48px; width:min(244px,calc(100vw - 28px)); }
}
@media (max-width:390px) {
  .nav-dock { gap:4px; padding-inline:6px; }
  .dock-actions { gap:1px; }
  .dock-separator { display:none; }
  .dock-status-widget { gap:5px; padding-inline:7px; }
  .status-time { font-size:.66rem; }
}
@media (prefers-reduced-motion:reduce) {
  .nav-dock,
  .nav-link,
  .dock-action-btn,
  .dock-logo,
  .dock-icon,
  .dock-active-indicator,
  .dock-status-widget,
  .dock-tooltip,
  .cal-slide-enter-active,
  .cal-slide-leave-active { transition:none; }
  .nav-dock.is-ready { opacity:1; }
  .nav-link:hover,
  .dock-action-btn:hover,
  .dock-logo:hover,
  .dock-status-widget:hover,
  .dock-links:hover .nav-link:not(:hover) { transform:none; }
}
</style>
