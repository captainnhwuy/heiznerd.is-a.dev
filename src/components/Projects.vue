<template>
  <section id="projects" class="projects">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <p class="section-subtitle">{{ t.subtitle }}</p>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="carousel-controls">
        <button @click="scrollLeft" class="carousel-btn carousel-btn-prev" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="scrollRight" class="carousel-btn carousel-btn-next" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="projects-carousel" ref="carousel">
        <div class="glass-card project-card" data-aos="fade-up" data-aos-delay="100">
          <div class="project-image">
            <div class="project-icon">
              <i class="fas fa-book-open"></i>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">NekoComics</h3>
              <div class="project-status">
                <span class="status-badge active">{{ t.live }}</span>
              </div>
            </div>
            <p class="project-description">
              {{ t.nekocomics }}
            </p>
            <div class="project-tech">
              <span class="tech-badge"><i class="fab fa-react"></i> React.js</span>
              <span class="tech-badge"><i class="fas fa-database"></i> MongoDB</span>
              <span class="tech-badge"><i class="fab fa-node"></i> Node.js</span>
            </div>
            <div class="project-links">
              <a href="https://nekocomics.xyz/" target="_blank" class="btn btn-project">
                <span>{{ t.visit }}</span>
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="glass-card project-card" data-aos="fade-up" data-aos-delay="200">
          <div class="project-image">
            <div class="project-icon">
              <i class="fas fa-robot"></i>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">KentaBuckets~</h3>
              <div class="project-status">
                <span class="status-badge beta">Beta</span>
              </div>
            </div>
            <p class="project-description">
              {{ t.mugi }}
            </p>
            <div class="project-tech">
              <span class="tech-badge"><i class="fab fa-js"></i> JavaScript</span>
              <span class="tech-badge"><i class="fab fa-discord"></i> Discord.js</span>
              <span class="tech-badge"><i class="fas fa-gamepad"></i> Games</span>
            </div>
            <div class="project-links">
              <a href="https://discord.com/oauth2/authorize?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot" target="_blank" class="btn btn-project">
                <span>{{ t.invite }}</span>
                <i class="fas fa-plus-circle"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="glass-card project-card" data-aos="fade-up" data-aos-delay="300">
          <div class="project-image">
            <div class="project-icon">
              <i class="fas fa-link"></i>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">TruyCapNekoComics</h3>
              <div class="project-status">
                <span class="status-badge active">{{ t.live }}</span>
              </div>
            </div>
            <p class="project-description">
              {{ t.truycap }}
            </p>
            <div class="project-tech">
              <span class="tech-badge"><i class="fab fa-vuejs"></i> Vue.js</span>
              <span class="tech-badge"><i class="fas fa-server"></i> DNS</span>
              <span class="tech-badge"><i class="fas fa-globe"></i> Web</span>
            </div>
            <div class="project-links">
              <a href="https://truycapnekocomics.site/" target="_blank" class="btn btn-project">
                <span>{{ t.visit }}</span>
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="glass-card project-card" data-aos="fade-up" data-aos-delay="400">
          <div class="project-image">
            <div class="project-icon">
              <i class="fas fa-music"></i>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">KentaMusics</h3>
              <div class="project-status">
                <span class="status-badge active">{{ t.live }}</span>
              </div>
            </div>
            <p class="project-description">
              {{ t.nekotech }}
            </p>
            <div class="project-tech">
              <span class="tech-badge"><i class="fab fa-js"></i> JavaScript</span>
              <span class="tech-badge"><i class="fab fa-discord"></i> Discord.js</span>
              <span class="tech-badge"><i class="fab fa-spotify"></i> Spotify</span>
            </div>
            <div class="project-links">
              <a href="https://discord.com/oauth2/authorize?client_id=1427516379912994816&permissions=8&integration_type=0&scope=bot" target="_blank" class="btn btn-project">
                <span>{{ t.invite }}</span>
                <i class="fas fa-plus-circle"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Dots Indicator -->
      <div class="carousel-dots">
        <span 
          v-for="(project, index) in 4" 
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          @click="scrollToSlide(index)"
        ></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].projects;

const carousel = ref(null);
const currentSlide = ref(0);
const totalSlides = 4;
let autoScrollInterval = null;
let isAutoScrolling = true;

const scrollLeft = () => {
  if (carousel.value) {
    const cardWidth = carousel.value.querySelector('.project-card').offsetWidth;
    const gap = 24;
    carousel.value.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    updateCurrentSlide();
    pauseAutoScroll();
  }
};

const scrollRight = () => {
  if (carousel.value) {
    const cardWidth = carousel.value.querySelector('.project-card').offsetWidth;
    const gap = 24;
    carousel.value.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    updateCurrentSlide();
    pauseAutoScroll();
  }
};

const scrollToSlide = (index) => {
  if (carousel.value) {
    const cardWidth = carousel.value.querySelector('.project-card').offsetWidth;
    const gap = 24;
    carousel.value.scrollTo({ left: (cardWidth + gap) * index, behavior: 'smooth' });
    currentSlide.value = index;
    pauseAutoScroll();
  }
};

const updateCurrentSlide = () => {
  if (carousel.value) {
    const scrollLeft = carousel.value.scrollLeft;
    const cardWidth = carousel.value.querySelector('.project-card').offsetWidth;
    const gap = 24;
    currentSlide.value = Math.round(scrollLeft / (cardWidth + gap));
  }
};

const autoScroll = () => {
  if (!carousel.value || !isAutoScrolling) return;
  
  const nextSlide = (currentSlide.value + 1) % totalSlides;
  scrollToSlide(nextSlide);
};

const pauseAutoScroll = () => {
  isAutoScrolling = false;
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
  
  // Resume after 10 seconds of inactivity
  setTimeout(() => {
    isAutoScrolling = true;
    startAutoScroll();
  }, 10000);
};

const startAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
  autoScrollInterval = setInterval(autoScroll, 5000);
};

onMounted(() => {
  if (carousel.value) {
    carousel.value.addEventListener('scroll', updateCurrentSlide);
    
    // Start auto-scroll after 2 seconds
    setTimeout(() => {
      startAutoScroll();
    }, 2000);
    
    // Pause on hover
    carousel.value.addEventListener('mouseenter', () => {
      isAutoScrolling = false;
      if (autoScrollInterval) clearInterval(autoScrollInterval);
    });
    
    // Resume on mouse leave
    carousel.value.addEventListener('mouseleave', () => {
      isAutoScrolling = true;
      startAutoScroll();
    });
  }
});

onUnmounted(() => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
});

</script>
