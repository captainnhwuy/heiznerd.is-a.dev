<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <!-- Logo -->
      <a :href="isPomodoroPage ? '/' : '#home'" class="nav-logo">
        <div class="logo-icon">
          <img src="/heiznerd-logo.png" alt="Heiznerd" class="logo-img" />
        </div>
        <span class="logo-text">Heiznerd</span>
      </a>

      <!-- Desktop nav links -->
      <ul class="nav-links" v-if="!isPomodoroPage">
        <li v-for="link in navLinks" :key="link.id">
          <a :href="`#${link.id}`" class="nav-link" @click="closeMobile">
            {{ t[link.key] }}
          </a>
        </li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
        <!-- Language toggle chip -->
        <button class="lang-chip" @click="toggleLanguage" :title="t.switchLang">
          <span>{{ currentLang === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN' }}</span>
        </button>

        <!-- Mobile hamburger -->
        <button
          class="hamburger"
          :class="{ active: mobileOpen }"
          @click="mobileOpen = !mobileOpen"
          v-if="!isPomodoroPage"
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div class="mobile-drawer" v-if="mobileOpen && !isPomodoroPage">
        <ul>
          <li v-for="link in navLinks" :key="link.id">
            <a :href="`#${link.id}`" class="mobile-link" @click="closeMobile">
              {{ t[link.key] }}
            </a>
          </li>
        </ul>
      </div>
    </Transition>

    <!-- Mobile overlay -->
    <div class="mobile-overlay" v-if="mobileOpen" @click="closeMobile"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isPomodoroPage = computed(() => route.path.includes('/pomodoro'));

const isScrolled = ref(false);
const mobileOpen = ref(false);
const lang = inject('lang');
const currentLang = inject('currentLang');
const t = inject('translations')[lang.value].navbar;

const navLinks = [
  { id: 'home', key: 'home' },
  { id: 'about', key: 'about' },
  { id: 'skills', key: 'skills' },
  { id: 'timeline', key: 'timeline' },
  { id: 'projects', key: 'projects' },
  { id: 'contact', key: 'contact' },
];

const toggleLanguage = () => {
  const newLang = lang.value === 'vi' ? 'en' : 'vi';
  localStorage.setItem('preferred-lang', newLang);
  window.location.reload();
};

const closeMobile = () => { mobileOpen.value = false; };

const handleScroll = () => { isScrolled.value = window.scrollY > 60; };

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 17, 0.6);
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(0px);
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
}

.navbar.scrolled {
  background: rgba(28, 27, 31, 0.85);
  backdrop-filter: blur(20px);
  border-bottom-color: var(--md-outline-var);
  box-shadow: 0 1px 24px rgba(0,0,0,0.4);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  gap: 24px;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--md-surface-high);
  border: 1px solid rgba(187, 134, 252, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s var(--md-ease-spring), border-color 0.3s;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.nav-logo:hover .logo-icon {
  transform: rotate(-8deg) scale(1.08);
  border-color: rgba(187, 134, 252, 0.5);
}

.logo-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--md-on-surface);
  letter-spacing: -0.01em;
}

/* Desktop nav links */
.nav-links {
  display: flex;
  list-style: none;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: block;
  padding: 6px 14px;
  border-radius: var(--md-radius-full);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--md-on-surface-var);
  text-decoration: none;
  position: relative;
  transition: color 0.2s, background 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 70%;
  height: 2px;
  background: var(--md-primary);
  border-radius: 2px;
  transition: transform 0.25s var(--md-ease-spring);
}

.nav-link:hover {
  color: var(--md-on-surface);
  background: rgba(255,255,255,0.06);
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.active {
  color: var(--md-primary);
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.lang-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-full);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--md-on-surface-var);
  cursor: pointer;
  transition: all 0.2s var(--md-ease-standard);
  font-family: var(--font-sans);
}

.lang-chip:hover {
  background: var(--md-surface-high);
  color: var(--md-primary);
  border-color: rgba(187,134,252,0.3);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  cursor: pointer;
  border-radius: var(--md-radius-sm);
  transition: background 0.2s;
}

.hamburger:hover { background: rgba(255,255,255,0.06); }

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--md-on-surface);
  border-radius: 2px;
  transition: transform 0.3s var(--md-ease-spring), opacity 0.3s;
}

.hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile Drawer */
.mobile-drawer {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background: var(--md-surface);
  border-bottom: 1px solid var(--md-outline-var);
  box-shadow: var(--md-shadow-3);
  padding: 12px 24px 20px;
  z-index: 999;
}

.mobile-drawer ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  display: block;
  padding: 12px 16px;
  border-radius: var(--md-radius-md);
  color: var(--md-on-surface-var);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.mobile-link:hover {
  background: rgba(187,134,252,0.08);
  color: var(--md-primary);
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 998;
}

/* Drawer transition */
.drawer-enter-active, .drawer-leave-active {
  transition: transform 0.35s var(--md-ease-spring), opacity 0.3s;
}
.drawer-enter-from, .drawer-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
}
</style>