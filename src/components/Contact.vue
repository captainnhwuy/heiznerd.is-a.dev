<template>
  <section id="contact" class="contact">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="section-subtitle-text" v-if="t.headerSubtitle">{{ t.headerSubtitle }}</div>
        <p class="section-subtitle" v-if="t.description">{{ t.description }}</p>
      </div>
      <div class="contact-content">
        <div class="contact-grid">
          <div class="glass-card contact-card" data-aos="fade-up" data-aos-delay="100">
            <div class="contact-icon">
              <i class="fab fa-discord"></i>
            </div>
            <h3 class="contact-title">Discord</h3>
            <p class="contact-info">heiznerd_2008</p>
            <a href="https://discord.com/users/1316287191634149377" target="_blank" class="contact-btn">
              <span>{{ t.message }}</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
          
          <div class="glass-card contact-card" data-aos="fade-up" data-aos-delay="200">
            <div class="contact-icon">
              <i class="fab fa-github"></i>
            </div>
            <h3 class="contact-title">GitHub</h3>
            <p class="contact-info">@captainnhwuy</p>
            <a href="https://github.com/captainnhwuy" target="_blank" class="contact-btn">
              <span>{{ t.viewProfile }}</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="glass-card contact-card" data-aos="fade-up" data-aos-delay="300">
            <div class="contact-icon">
              <i class="fab fa-facebook"></i>
            </div>
            <h3 class="contact-title">Facebook</h3>
            <p class="contact-info">Nguyễn Hữu Quý</p>
            <a href="https://www.facebook.com/nguyen.huu.quy.906170" target="_blank" class="contact-btn">
              <span>{{ t.connect }}</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].contact;
</script>
