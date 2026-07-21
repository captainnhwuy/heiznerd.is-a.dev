<template>
  <section class="nekotech-banner drift">
    <button
      type="button"
      class="banner-button"
      :class="{ 'is-open': isOpen }"
      :aria-expanded="isOpen"
      aria-controls="nekotech-thanks"
      @click="isOpen = !isOpen"
    >
      <img src="/heiznerd_backgroundv2.png" alt="Banner cộng đồng NekoTech" class="banner-img" />
      <span class="banner-shade" aria-hidden="true"></span>

      <span id="nekotech-thanks" class="banner-box">
        <span class="banner-tag">✦ NekoTech Community</span>
        <span class="banner-message">
          Cảm ơn tất cả người bạn thân của tôi tại <strong>NekoTech</strong> đã giúp tôi có được như ngày hôm nay,
          cảm ơn <em>@maiminhdung</em>, <em>@ssdarealest</em> đã giúp tôi rất nhiều.
          Dù sao cũng cảm ơn <em>@ssdarealest</em> vì tấm banner tuyệt đẹp này nhoa!
        </span>
      </span>
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<style scoped>
.nekotech-banner {
  width: 100%;
  height: clamp(250px, 30vw, 390px);
  padding: 0;
  overflow: hidden;
}

.banner-button {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.banner-button:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: -4px;
}

.banner-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 700ms var(--md-ease-spring), filter 500ms ease;
}

.banner-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(9, 8, 12, 0.88), rgba(9, 8, 12, 0.3) 60%, rgba(9, 8, 12, 0.08));
  opacity: 0;
  transition: opacity 420ms ease;
}

.banner-box {
  position: absolute;
  z-index: 1;
  bottom: clamp(22px, 4vw, 48px);
  left: max(22px, calc((100vw - var(--max-width)) / 2));
  display: flex;
  width: min(620px, calc(100% - 44px));
  flex-direction: column;
  gap: 12px;
  padding: 22px 24px;
  border: 1px solid rgba(187, 134, 252, 0.22);
  border-radius: var(--md-radius-lg);
  color: var(--md-on-surface);
  background: rgba(13, 12, 16, 0.76);
  box-shadow: var(--md-shadow-3);
  backdrop-filter: blur(16px);
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  transition: opacity 380ms ease, transform 500ms var(--md-ease-spring);
  pointer-events: none;
}

.banner-button:hover .banner-img,
.banner-button:focus-visible .banner-img,
.banner-button.is-open .banner-img { transform: scale(1.025); filter: saturate(0.88) brightness(0.72); }
.banner-button:hover .banner-shade,
.banner-button:focus-visible .banner-shade,
.banner-button.is-open .banner-shade { opacity: 1; }
.banner-button:hover .banner-box,
.banner-button:focus-visible .banner-box,
.banner-button.is-open .banner-box { opacity: 1; transform: none; }

.banner-tag { color: var(--md-primary); font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; }
.banner-message { color: rgba(255,255,255,.84); font-size: clamp(.88rem, 1.35vw, 1.02rem); line-height: 1.72; }
.banner-message strong,
.banner-message em { color: var(--md-primary); font-style: normal; font-weight: 600; }

@media (max-width: 600px) {
  .nekotech-banner { height: 340px; }
  .banner-img { object-position: center; }
  .banner-box { bottom: 18px; left: 16px; width: calc(100% - 32px); padding: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .banner-img,
  .banner-shade,
  .banner-box { transition: none; }
  .banner-button:hover .banner-img,
  .banner-button:focus-visible .banner-img,
  .banner-button.is-open .banner-img { transform: none; }
}
</style>
