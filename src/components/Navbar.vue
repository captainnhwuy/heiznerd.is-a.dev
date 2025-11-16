<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-content">
      <a href="#home" class="nav-logo">
        <div class="logo-icon">
          <i class="fas fa-code"></i>
        </div>
        <span class="logo-text">Heiznerd</span>
      </a>
      <ul class="nav-menu">
        <li><a href="#home" class="nav-link">{{ t.home }}</a></li>
        <li><a href="#about" class="nav-link">{{ t.about }}</a></li>
        <li><a href="#skills" class="nav-link">{{ t.skills }}</a></li>
        <li><a href="#projects" class="nav-link">{{ t.projects }}</a></li>
        <li><a href="#contact" class="nav-link">{{ t.contact }}</a></li>
      </ul>
      <div class="nav-actions">
        <button class="lang-toggle" @click="toggleLanguage" :title="t.switchLang">
          <span class="lang-icon">{{ currentLang === 'vi' ? '🇻🇳' : '🇺🇸' }}</span>
          <span class="lang-text">{{ currentLang === 'vi' ? 'EN' : 'VI' }}</span>
        </button>
        <button class="mobile-toggle" @click="toggleMobile">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';

const isScrolled = ref(false);
const lang = inject('lang');
const currentLang = inject('currentLang');
const t = inject('translations')[lang.value].navbar;

const toggleLanguage = () => {
  const newLang = lang.value === 'vi' ? 'en' : 'vi';
  localStorage.setItem('preferred-lang', newLang);
  window.location.reload();
};

const toggleMobile = () => {
  const navMenu = document.querySelector('.nav-menu');
  navMenu.classList.toggle('active');
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
