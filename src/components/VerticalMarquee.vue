<template>
  <div class="vertical-marquee">
    <div class="vm-content">
      <span v-for="n in 20" :key="n" class="vm-item">
        SCROLL &nbsp;•&nbsp; EXPLORE &nbsp;•&nbsp; CREATE &nbsp;•&nbsp;
      </span>
    </div>
  </div>
</template>

<style scoped>
.vertical-marquee {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 40px;
  background: var(--bg-dark);
  border-left: 2px solid var(--text-primary);
  z-index: 900;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.vm-content {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  white-space: nowrap;
  animation: scrollVertical 20s linear infinite;
  display: flex;
  align-items: center;
}

.vm-item {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-muted);
  padding: 1rem 0;
}

@keyframes scrollVertical {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

@media (max-width: 768px) {
  .vertical-marquee {
    display: none;
  }
}
</style>
