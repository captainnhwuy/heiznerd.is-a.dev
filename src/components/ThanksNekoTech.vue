<template>
  <section class="nekotech-banner drift">
    <!-- Background image -->
    <div class="banner-bg">
      <img src="/heiznerd-background.png" alt="NekoTech Banner" class="banner-img" />
      <div class="banner-overlay"></div>
    </div>

    <!-- Content -->
    <div class="banner-content container">
      <div class="banner-text-wrap">
        <p class="banner-tag">✦ NekoTech Community</p>
        <p class="banner-message">
          Cảm ơn tất cả người bạn thân của tôi tại <span class="highlight">NekoTech</span> đã giúp tôi có được như ngày hôm nay,
          cảm ơn <span class="mention">@khoasoma</span>,
          <span class="mention">@maiminhdung</span>,
          <span class="mention">@ssdarealest</span> đã giúp tôi rất nhiều.
           Dù sao cũng cảm ơn <span class="mention">@ssdarealest</span> vì tấm banner tuyệt đẹp này nhoa!
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.nekotech-banner {
  position: relative;
  width: 100%;
  height: 320px;           /* fixed height so bottom anchor works */
  overflow: hidden;
}

/* ---- Background image with dark overlay ---- */
.banner-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top,  rgba(10, 9, 12, 0.92) 0%, rgba(10, 9, 12, 0.2) 50%, transparent 100%),
    linear-gradient(to right, rgba(10, 9, 12, 0.7) 0%, transparent 70%);
}

/* ---- Content — pinned to bottom-left ---- */
.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 0 40px 32px;
}

.banner-text-wrap {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.banner-tag {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(187, 134, 252, 0.7);
}

.banner-message {
  font-family: var(--font-sans, 'Google Sans', sans-serif);
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.82);
}

.highlight {
  color: #BB86FC;
  font-weight: 600;
}

.mention {
  color: rgba(187, 134, 252, 0.9);
  font-weight: 500;
  background: rgba(187, 134, 252, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.93em;
}

/* Responsive */
@media (max-width: 768px) {
  .nekotech-banner { min-height: 220px; }
  .banner-overlay {
    background: linear-gradient(
      to bottom,
      rgba(10, 9, 12, 0.85) 0%,
      rgba(10, 9, 12, 0.7) 100%
    );
  }
  .banner-message { font-size: 0.9rem; }
}
</style>
