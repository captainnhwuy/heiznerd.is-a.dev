<template>
  <section id="contact" class="contact">
    <div class="container">
      <div class="drift from-top">
        <span class="section-eyebrow">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <p class="section-subtitle" v-if="t.description">{{ t.description }}</p>
      </div>

      <!-- CTA card -->
      <div class="cta-card md-card drift from-bottom">
        <div class="cta-inner">
          <div class="cta-text">
            <h3>Let's build something together</h3>
            <p>Open to collaborations, freelance work, or just a friendly chat.</p>
          </div>
          <div class="cta-icon">
            <i class="fas fa-satellite-dish"></i>
          </div>
        </div>
      </div>

      <!-- Contact links grid -->
      <div class="contact-grid drift-stagger">
        <a
          v-for="(item, i) in contacts"
          :key="item.label"
          :href="item.href"
          target="_blank"
          rel="noopener"
          class="contact-item md-card drift from-bottom"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="contact-icon" :style="{ '--ic': item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="contact-info">
            <p class="contact-platform">{{ item.label }}</p>
            <p class="contact-handle">{{ item.handle }}</p>
          </div>
          <i class="fas fa-arrow-right contact-arrow"></i>
        </a>
      </div>

      <!-- GitHub Live Activity -->
      <GithubActivity />
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';
import GithubActivity from './GithubActivity.vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].contact;

const contacts = [
  {
    label: 'Discord',
    handle: 'heiznerd_2008',
    icon: 'fab fa-discord',
    color: '#5865f2',
    href: 'https://discord.com/users/1316287191634149377',
  },
  {
    label: 'GitHub',
    handle: '@captainnhwuy',
    icon: 'fab fa-github',
    color: '#a0a0a0',
    href: 'https://github.com/captainnhwuy',
  },
  {
    label: 'Facebook',
    handle: 'Nguyễn Hữu Quý',
    icon: 'fab fa-facebook',
    color: '#1877F2',
    href: 'https://www.facebook.com/nguyen.huu.quy.906170',
  },
];
</script>

<style scoped>
.contact { background: transparent; }

/* CTA card */
.cta-card {
  margin-top: 48px;
  padding: 32px 36px;
  background: linear-gradient(135deg, rgba(187,134,252,0.08), rgba(3,218,198,0.06));
  border-color: rgba(187,134,252,0.2);
  margin-bottom: 24px;
}

.cta-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.cta-text h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--md-on-surface);
  margin-bottom: 6px;
}

.cta-text p {
  font-size: 0.95rem;
  color: var(--md-on-surface-var);
}

.cta-icon {
  font-size: 2.4rem;
  color: var(--md-primary);
  opacity: 0.6;
  flex-shrink: 0;
}

/* Contact grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  text-decoration: none;
  transition: all 0.3s var(--md-ease-spring);
  cursor: pointer;
}

.contact-item:hover {
  border-color: color-mix(in srgb, var(--ic, var(--md-primary)) 40%, transparent);
  background: var(--md-surface-container);
  transform: translateY(-4px);
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--md-radius-md);
  background: color-mix(in srgb, var(--ic, var(--md-primary)) 15%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: var(--ic, var(--md-primary));
  flex-shrink: 0;
  transition: transform 0.3s var(--md-ease-spring);
}

.contact-item:hover .contact-icon {
  transform: scale(1.1) rotate(-6deg);
}

.contact-info { flex: 1; }

.contact-platform {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--md-on-surface);
}

.contact-handle {
  font-size: 0.82rem;
  color: var(--md-on-surface-var);
  margin-top: 2px;
}

.contact-arrow {
  color: var(--md-on-surface-var);
  font-size: 0.8rem;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.25s var(--md-ease-spring);
}

.contact-item:hover .contact-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 640px) {
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-icon { display: none; }
}
</style>
