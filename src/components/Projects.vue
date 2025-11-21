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
        <div 
          v-for="(project, index) in projectsList" 
          :key="index"
          class="glass-card project-card" 
          data-aos="fade-up" 
          :data-aos-delay="100 + (index * 100)"
        >
          <div class="project-image">
            <div class="project-icon">
              <i :class="project.icon"></i>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">{{ t[project.key].name }}</h3>
              <div class="project-status">
                <span :class="['status-badge', project.statusClass]">{{ project.status === 'live' ? t.live : t.beta }}</span>
              </div>
            </div>
            <p class="project-description">
              {{ t[project.key].desc }}
            </p>
            <div class="project-tech">
              <span v-for="(tech, tIndex) in project.tech" :key="tIndex" class="tech-badge">
                <i :class="tech.icon"></i> {{ tech.name }}
              </span>
            </div>
            <div class="project-links">
              <a :href="project.link" target="_blank" class="btn btn-project">
                <span>{{ project.linkText === 'visit' ? t.visit : t.invite }}</span>
                <i :class="project.linkIcon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Dots Indicator -->
      <div class="carousel-dots">
        <span 
          v-for="(project, index) in projectsList" 
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          @click="scrollToSlide(index)"
        ></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from 'vue';

const lang = inject('lang');
const t = inject('translations')[lang.value].projects;

const projectsList = [
  {
    key: 'nekocomics',
    icon: 'fas fa-book-open',
    status: 'live',
    statusClass: 'active',
    tech: [
      { icon: 'fab fa-react', name: 'React.js' },
      { icon: 'fas fa-database', name: 'MongoDB' },
      { icon: 'fab fa-node', name: 'Node.js' }
    ],
    link: 'https://nekocomics.xyz/',
    linkText: 'visit',
    linkIcon: 'fas fa-external-link-alt'
  },
  {
    key: 'mugi',
    icon: 'fas fa-robot',
    status: 'beta',
    statusClass: 'beta',
    tech: [
      { icon: 'fab fa-js', name: 'JavaScript' },
      { icon: 'fab fa-discord', name: 'Discord.js' },
      { icon: 'fas fa-gamepad', name: 'Games' }
    ],
    link: 'https://discord.com/oauth2/authorize?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot',
    linkText: 'invite',
    linkIcon: 'fas fa-plus-circle'
  },
  {
    key: 'truycap',
    icon: 'fas fa-link',
    status: 'live',
    statusClass: 'active',
    tech: [
      { icon: 'fab fa-vuejs', name: 'Vue.js' },
      { icon: 'fas fa-server', name: 'DNS' },
      { icon: 'fas fa-globe', name: 'Web' }
    ],
    link: 'https://truycapnekocomics.site/',
    linkText: 'visit',
    linkIcon: 'fas fa-external-link-alt'
  },
  {
    key: 'nekotech',
    icon: 'fas fa-music',
    status: 'live',
    statusClass: 'active',
    tech: [
      { icon: 'fab fa-js', name: 'JavaScript' },
      { icon: 'fab fa-discord', name: 'Discord.js' },
      { icon: 'fab fa-spotify', name: 'Spotify' }
    ],
    link: 'https://discord.com/oauth2/authorize?client_id=1427516379912994816&permissions=8&integration_type=0&scope=bot',
    linkText: 'invite',
    linkIcon: 'fas fa-plus-circle'
  }
];

const carousel = ref(null);
const currentSlide = ref(0);
const totalSlides = projectsList.length;
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
