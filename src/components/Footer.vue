<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <!-- Logo + tagline -->
        <div class="footer-brand">
          <div class="logo-icon">
            <i class="fas fa-code"></i>
          </div>
          <div>
            <p class="footer-name">Heiznerd</p>
            <p class="footer-sub">{{ t.designedBy }} Heiznerd · 2025</p>
          </div>
        </div>

        <!-- Social icons -->
        <div class="footer-socials">
          <a href="https://github.com/captainnhwuy" target="_blank" class="footer-icon" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://discord.com/users/1316287191634149377" target="_blank" class="footer-icon" title="Discord">
            <i class="fab fa-discord"></i>
          </a>
          <a href="https://www.facebook.com/nguyen.huu.quy.906170" target="_blank" class="footer-icon" title="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
        </div>
      </div>

      <!-- Built with -->
      <div class="footer-bottom">
        <span>Built with</span>
        <i class="fab fa-vuejs" style="color:#42b883"></i>
        <span>Vue.js · {{ t.rights }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].footer;
</script>

<style scoped>
.footer {
  padding: 40px 0 28px;
  border-top: 1px solid var(--md-outline-var);
  background: var(--md-surface);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--md-primary), var(--md-primary-dim));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-primary);
  font-size: 0.9rem;
}

.footer-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--md-on-surface);
}

.footer-sub {
  font-size: 0.75rem;
  color: var(--md-on-surface-var);
  margin-top: 2px;
}

.footer-socials {
  display: flex;
  gap: 8px;
}

.footer-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--md-radius-md);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-var);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-on-surface-var);
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s var(--md-ease-spring);
}

.footer-icon:hover {
  background: rgba(187,134,252,0.1);
  border-color: var(--md-primary);
  color: var(--md-primary);
  transform: translateY(-3px);
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--md-on-surface-var);
  border-top: 1px solid var(--md-outline-var);
  padding-top: 20px;
}
</style>
