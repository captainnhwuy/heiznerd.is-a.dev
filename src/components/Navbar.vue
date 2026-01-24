<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-content">
      <a :href="isPomodoroPage ? '/' : '#home'" class="nav-logo">
        <div class="logo-icon">
          <i class="fas fa-code"></i>
        </div>
        <span class="logo-text">Heiznerd</span>
      </a>

      <!-- Overlay for Mobile Menu -->
      <div class="nav-overlay" :class="{ active: isMobileMenuOpen }" @click="closeMobileMenu"></div>

      <ul class="nav-menu" :class="{ active: isMobileMenuOpen }" v-if="!isPomodoroPage">
        <li><a href="#home" class="nav-link" @click="closeMobileMenu">{{ t.home }}</a></li>
        <li><a href="#about" class="nav-link" @click="closeMobileMenu">{{ t.about }}</a></li>
        <li><a href="#skills" class="nav-link" @click="closeMobileMenu">{{ t.skills }}</a></li>
        <li><a href="#timeline" class="nav-link" @click="closeMobileMenu">{{ t.timeline }}</a></li>
        <li><a href="#projects" class="nav-link" @click="closeMobileMenu">{{ t.projects }}</a></li>
        <li><a href="#contact" class="nav-link" @click="closeMobileMenu">{{ t.contact }}</a></li>
      </ul>

      <div class="nav-actions">
        <button class="lang-toggle" @click="toggleLanguage" :title="t.switchLang">
          <span class="lang-icon">{{ currentLang === 'vi' ? '🇻🇳' : '🇺🇸' }}</span>
          <span class="lang-text">{{ currentLang === 'vi' ? 'EN' : 'VI' }}</span>
        </button>
        
        <button class="mobile-toggle" :class="{ active: isMobileMenuOpen }" @click="toggleMobile" v-if="!isPomodoroPage">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from 'vue';
import { useRoute } from 'vue-router'; 

const route = useRoute();

const isPomodoroPage = computed(() => {
  return route.path.includes('/pomodoro');
});

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const lang = inject('lang');
const currentLang = inject('currentLang');
const t = inject('translations')[lang.value].navbar;

const toggleLanguage = () => {
  const newLang = lang.value === 'vi' ? 'en' : 'vi';
  localStorage.setItem('preferred-lang', newLang);
  window.location.reload();
};

const toggleMobile = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>