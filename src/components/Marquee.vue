<template>
  <div class="marquee-container">
    <div class="marquee-content">
      <span v-for="n in 10" :key="n" class="marquee-item">
        FRONTEND <span class="separator">•</span> 
        BACKEND <span class="separator">•</span> 
        VUE.JS <span class="separator">•</span> 
        ANIME <span class="separator">•</span> 
        DESIGN <span class="separator">•</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  width: 100%;
  background: var(--primary);
  color: black;
  padding: 1rem 0;
  overflow: hidden;
  position: relative;
  border-bottom: 2px solid var(--text-primary);
  transform: rotate(-1deg) scale(1.02);
  z-index: 10;
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
}

.marquee-content {
  display: flex;
  white-space: nowrap;
  animation: scroll 20s linear infinite;
}

.marquee-item {
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  margin-right: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.separator {
  color: white;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
