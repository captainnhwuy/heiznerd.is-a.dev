<template>
  <section id="about" class="about">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-label">{{ t.label }}</span>
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="section-subtitle-text" v-if="t.headerSubtitle">{{ t.headerSubtitle }}</div>
      </div>
      <div class="about-content">
        <div class="about-text" data-aos="fade-right" data-aos-delay="100">
          <div class="glass-card about-card">
            <div class="card-icon">
              <i class="fas fa-user-astronaut"></i>
            </div>
            <p class="about-paragraph">
              <span class="highlight">{{ t.intro }}</span> {{ t.paragraph1 }}
            </p>
            <p class="about-paragraph">
              {{ t.paragraph2 }}
            </p>
            <p class="about-paragraph">
              {{ t.paragraph3 }}
            </p>
            <div class="about-interests">
              <h4 class="interests-title">{{ t.interests }}</h4>
              <div class="interests-tags">
                <span class="interest-tag"><i class="fas fa-code"></i> {{ t.coding }}</span>
                <span class="interest-tag"><i class="fas fa-film"></i> {{ t.anime }}</span>
                <span class="interest-tag"><i class="fas fa-heart"></i> {{ t.romcom }}</span>
                <span class="interest-tag"><i class="fas fa-gamepad"></i> {{ t.gaming }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="about-image" data-aos="fade-left" data-aos-delay="200">
          <div class="glass-card code-window">
            <div class="window-header">
              <div class="window-controls">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="window-title">whoami.js</div>
            </div>
            <pre class="code-content"><code class="language-javascript"><span class="code-keyword">const</span> <span class="code-var">developer</span> = {
  <span class="code-property">name</span>: <span class="code-string">"Heiznerd"</span>,
  <span class="code-property">aka</span>: <span class="code-string">"Capta1nHwuy"</span>,
  <span class="code-property">age</span>: <span class="code-number">14</span>,
  <span class="code-property">location</span>: <span class="code-string">"Vietnam 🇻🇳"</span>,
  <span class="code-property">passion</span>: [
    <span class="code-string">"Vue.js"</span>,
    <span class="code-string">"JavaScript"</span>,
    <span class="code-string">"Anime"</span>,
    <span class="code-string">"Building Cool Stuff"</span>
  ],
  <span class="code-property">currentStatus</span>: <span class="code-string">"Learning & Creating"</span>,
  <span class="code-property">motto</span>: <span class="code-function">() =></span> {
    <span class="code-keyword">return</span> <span class="code-string">"Dream big, code bigger"</span>;
  }
};</code></pre>
          </div>
          <div class="floating-elements">
            <div class="float-item" data-aos="fade" data-aos-delay="300">
              <i class="fab fa-vuejs"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="350">
              <i class="fab fa-js"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="400">
              <i class="fab fa-node"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="450">
              <i class="fab fa-react"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="500">
              <i class="fab fa-python"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="550">
              <i class="fab fa-html5"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="600">
              <i class="fab fa-css3-alt"></i>
            </div>
            <div class="float-item" data-aos="fade" data-aos-delay="650">
              <i class="fab fa-git-alt"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].about;
</script>
