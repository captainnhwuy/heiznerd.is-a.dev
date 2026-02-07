<template>
  <section id="projects" class="projects">
    <div class="container">
      <!-- Local Stickers -->
      <Sticker text="SHIP IT" top="10%" left="5%" rotation="-8deg" color="#FF00FF" />
      <Sticker text="OPEN SOURCE" bottom="5%" right="5%" rotation="12deg" color="#FFFFFF" />
      <!-- Random Character Sticker -->
      <Sticker :image="randomSticker" top="85%" right="25%" rotation="-5deg" scale="0.8" />
      <Sticker :image="randomSticker2" top="0%" left="30%" rotation="10deg" scale="0.7" />
      <Sticker :image="randomSticker3" bottom="20%" left="5%" rotation="-15deg" scale="0.6" />
      <Sticker :image="randomSticker4" top="15%" right="35%" rotation="8deg" scale="0.75" />
      <Sticker :image="randomSticker5" bottom="10%" left="40%" rotation="-10deg" scale="0.7" />
      <Sticker :image="randomSticker6" top="50%" right="5%" rotation="5deg" scale="0.65" />

      <div class="section-header" data-aos="fade-right">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">
          <span class="bracket">[</span> {{ t.title }} <span class="bracket">]</span>
        </h2>
        <div class="section-subtitle-text" v-if="t.headerSubtitle">{{ t.headerSubtitle }}</div>
        <p class="section-subtitle" v-if="t.description">{{ t.description }}</p>
      </div>
      
      <div class="projects-grid">
        <div 
          v-for="(project, index) in projectsList" 
          :key="index"
          class="project-card" 
          data-aos="fade-up" 
          :data-aos-delay="index * 100"
          :style="{ transform: `rotate(${Math.random() * 4 - 2}deg)` }"
        >
          <div class="card-header">
            <div class="header-main">
              <i :class="['project-icon', project.icon]"></i>
              <h3 class="project-name">{{ t[project.key].name }}</h3>
            </div>
            <div :class="['status-indicator', project.status === 'live' ? 'status-live' : 'status-beta']">
              {{ project.status === 'live' ? 'LIVE' : 'BETA' }}
            </div>
          </div>

          <div class="card-body">
            <p class="project-desc">
              {{ t[project.key].desc }}
            </p>
            
            <div class="tech-stack">
              <div class="tech-label">STACK:</div>
              <div class="tech-list">
                <span v-for="(tech, tIndex) in project.tech" :key="tIndex" class="tech-item">
                  {{ tech.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <a :href="project.link" target="_blank" class="cyber-btn">
              <span>{{ project.linkText === 'visit' ? '>>> EXECUTE' : '>>> INITIATE' }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';
import Sticker from './Sticker.vue';
import { allStickerPaths } from '../stickers.js';

const lang = inject('lang');
const t = inject('translations')[lang.value].projects;

const randomSticker = allStickerPaths[Math.floor(Math.random() * allStickerPaths.length)];
const randomSticker2 = allStickerPaths[Math.floor(Math.random() * allStickerPaths.length)];
const randomSticker3 = allStickerPaths[Math.floor(Math.random() * allStickerPaths.length)];
const randomSticker4 = allStickerPaths[Math.floor(Math.random() * allStickerPaths.length)];
const randomSticker5 = allStickerPaths[Math.floor(Math.random() * allStickerPaths.length)];
const randomSticker6 = allStickerPaths[Math.floor(Math.random() * allStickerPaths.length)];

const projectsList = [
  {
    key: 'nekocomics',
    icon: 'fas fa-book-open',
    status: 'live',
    tech: [
      { name: 'Vue.js' },
      { name: 'Ruby on Rails' },
      { name: 'PostgreSQL' },
      { name: 'Redis' }
    ],
    link: 'https://nekocomics.xyz/',
    linkText: 'visit'
  },
  {
    key: 'mugi',
    icon: 'fas fa-robot',
    status: 'beta',
    tech: [
      { name: 'JavaScript' },
      { name: 'Discord.js' },
      { name: 'Games' }
    ],
    link: 'https://discord.com/oauth2/authorize?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot',
    linkText: 'invite'
  },
  {
    key: 'truycap',
    icon: 'fas fa-link',
    status: 'live',
    tech: [
      { name: 'Vue.js' },
      { name: 'DNS' },
      { name: 'Web' }
    ],
    link: 'https://truycapnekocomics.site/',
    linkText: 'visit'
  }
];
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  border: 2px solid var(--text-primary);
  background: black;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.project-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 8px 8px 0px 0px var(--primary);
  border-color: var(--primary);
  z-index: 10;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 2px solid var(--text-primary);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: rgba(255,255,255,0.05);
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-icon {
  font-size: 2rem;
  color: var(--primary);
}

.project-name {
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0;
  line-height: 1;
}

.status-indicator {
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  border: 1px solid currentColor;
}

.status-live {
  color: #00ff00;
  box-shadow: 0 0 10px rgba(0,255,0,0.2);
}

.status-beta {
  color: #ffff00;
  box-shadow: 0 0 10px rgba(255,255,0,0.2);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tech-stack {
  margin-top: auto;
  border-top: 1px dashed var(--text-muted);
  padding-top: 1rem;
}

.tech-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: inline-block;
  transition: color 0.2s;
}

.tech-label:hover {
  color: var(--primary);
  animation: twitch 0.5s infinite;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-item {
  background: var(--text-primary);
  color: black;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  text-transform: uppercase;
}

.card-footer {
  padding: 1.5rem;
  border-top: 2px solid var(--text-primary);
  background: black;
}

.cyber-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px solid var(--text-primary);
  color: var(--text-primary);
  text-align: center;
  text-decoration: none;
  font-weight: 900;
  text-transform: uppercase;
  transition: all 0.2s;
}

.cyber-btn:hover {
  background: var(--primary);
  color: black;
  border-color: var(--primary);
  box-shadow: 0 0 15px var(--primary);
}

.bracket {
  color: var(--primary);
  margin: 0 0.5rem;
}
</style>
