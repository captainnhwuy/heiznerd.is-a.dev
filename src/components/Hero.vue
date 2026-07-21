<template>
  <section id="home" class="hero">
    <div class="hero-inner container">
      <header class="hero-meta hero-reveal hero-reveal--one">
        <span class="hero-kicker">HEIZNERD / 2026—PRESENT</span>
        <span class="hero-availability">
          <span class="availability-dot"></span>
          {{ t.available }}
        </span>
      </header>

      <div class="hero-main">
        <div class="hero-copy">
          <p class="hero-greeting hero-reveal hero-reveal--two">{{ t.greeting }}</p>
          <h1 class="hero-name hero-reveal hero-reveal--three">
            <span class="hero-name-text">Heiznerd<span class="hero-name-mark">.</span></span>
            <svg class="hero-wordmark" viewBox="0 0 760 210" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false">
              <text class="wordmark-fill" x="8" y="150">Heiznerd.</text>
              <text class="wordmark-outline" x="8" y="150">Heiznerd.</text>
              <path class="wordmark-flourish" pathLength="1" d="M44 174C146 190 288 186 390 166 486 148 580 150 710 176" />
              <path class="wordmark-accent" pathLength="1" d="M585 166C638 144 690 142 738 156" />
            </svg>
          </h1>
          <div class="hero-rule hero-reveal hero-reveal--four" aria-hidden="true">
            <span></span>
            <span></span>
          </div>
          <h2 class="hero-role hero-reveal hero-reveal--four">
            {{ typedRole }}<span class="cursor-blink" aria-hidden="true">_</span>
          </h2>
          <p class="hero-description hero-reveal hero-reveal--five">{{ t.description }}</p>
          <div class="hero-actions hero-reveal hero-reveal--six">
            <a href="#projects" class="md-btn md-btn-filled">
              <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
              <span>{{ t.viewWork }}</span>
            </a>
            <a href="#contact" class="md-btn md-btn-outlined">
              <i class="fas fa-paper-plane" aria-hidden="true"></i>
              <span>{{ t.contact }}</span>
            </a>
          </div>
        </div>

        <div class="hero-visual hero-reveal hero-reveal--three">
          <div class="portrait-wrap">
            <div class="portrait-index" aria-hidden="true">01</div>
            <div class="portrait-frame">
              <div class="portrait-wash" aria-hidden="true"></div>
              <img src="/stickers/misc/evernight-dancing.gif" alt="Heiznerd" class="portrait" />
            </div>
            <span class="portrait-caption">MADE WITH CURIOSITY<br />FROM VIETNAM <span aria-hidden="true">↗</span></span>
          </div>
          <div class="visual-note" aria-hidden="true">
            <span>VUE</span><span>NODE</span><span>DESIGN</span>
          </div>
          <div class="hero-tech-orbit" aria-hidden="true">
            <span class="hero-tech hero-tech--vue"><i class="fab fa-vuejs"></i></span>
            <span class="hero-tech hero-tech--node"><i class="fab fa-node-js"></i></span>
            <span class="hero-tech hero-tech--ts">TS</span>
            <span class="hero-tech hero-tech--git"><i class="fab fa-git-alt"></i></span>
          </div>
        </div>
      </div>

      <footer class="hero-footer hero-reveal hero-reveal--six">
        <blockquote v-if="quote.content" class="hero-quote">
          <p>“{{ quote.content }}”</p>
          <cite>— {{ quote.author }}</cite>
        </blockquote>
        <div class="hero-footer-side">
          <a v-if="githubData.name" href="https://github.com/captainnhwuy" target="_blank" rel="noopener noreferrer" class="github-chip">
            <img :src="githubData.avatar" :alt="githubData.name" />
            <span><strong>{{ githubData.name }}</strong><small>@captainnhwuy</small></span>
          </a>
          <nav class="social-row" aria-label="Social links">
            <a href="https://github.com/captainnhwuy" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
              <i class="fab fa-github" aria-hidden="true"></i>
            </a>
            <a href="https://discord.com/users/1316287191634149377" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Discord">
              <i class="fab fa-discord" aria-hidden="true"></i>
            </a>
            <a href="https://www.facebook.com/nguyen.huu.quy.906170" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook">
              <i class="fab fa-facebook" aria-hidden="true"></i>
            </a>
          </nav>
        </div>
      </footer>
    </div>

    <div class="hero-marquee" aria-hidden="true">
      <span>BUILD WITH INTENTION · LEARN IN PUBLIC · SHIP SOMETHING KIND · </span>
      <span>BUILD WITH INTENTION · LEARN IN PUBLIC · SHIP SOMETHING KIND · </span>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';

const lang = inject('lang');
const translations = inject('translations');
const t = computed(() => translations[lang.value].hero);

const githubData = ref({});
const quote = ref({});
const typedRole = ref('');
const QUOTES = [
  { content: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { content: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { content: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { content: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
];

let typedTimer;
let githubController;
let reducedMotion = false;

const typeNextRole = (roles, roleIndex = 0, charIndex = 0, deleting = false) => {
  const role = roles[roleIndex];
  typedRole.value = deleting ? role.slice(0, charIndex) : role.slice(0, charIndex + 1);
  const nextCharIndex = deleting ? charIndex - 1 : charIndex + 1;
  let delay = deleting ? 42 : 78;

  if (!deleting && nextCharIndex >= role.length) {
    delay = 1500;
    deleting = true;
  } else if (deleting && nextCharIndex < 0) {
    delay = 280;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
    deleting = false;
  } else {
    charIndex = nextCharIndex;
  }

  typedTimer = window.setTimeout(() => typeNextRole(roles, roleIndex, charIndex, deleting), delay);
};

const fetchGitHub = async () => {
  githubController = new AbortController();
  try {
    const res = await fetch('https://api.github.com/users/captainnhwuy', { signal: githubController.signal });
    if (!res.ok) return;
    const data = await res.json();
    githubData.value = { name: data.name || 'Heiznerd', avatar: data.avatar_url };
  } catch (error) {
    if (error.name !== 'AbortError') githubData.value = {};
  }
};

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  quote.value = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const roles = t.value.roles;
  typedRole.value = roles[0];
  if (!reducedMotion) typeNextRole(roles);
  fetchGitHub();
});

onUnmounted(() => {
  window.clearTimeout(typedTimer);
  githubController?.abort();
});
</script>

<style scoped>
.hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  padding: clamp(76px, 8vh, 104px) 0 128px;
  background: transparent;
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero-meta,
.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero-kicker,
.portrait-caption,
.visual-note,
.hero-availability {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-kicker { color: var(--md-on-surface-var); }

.hero-availability {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--md-primary);
}

.availability-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--md-secondary);
  box-shadow: 0 0 0 5px rgba(3, 218, 198, 0.08);
  animation: availabilityPulse 2.4s ease-in-out infinite;
}

.hero-main {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  align-items: center;
  gap: clamp(44px, 9vw, 140px);
  padding: clamp(48px, 7vh, 82px) 5vw clamp(48px, 6vh, 72px);
}

.hero-copy { max-width: 720px; }
.hero-greeting {
  margin-bottom: 18px;
  color: var(--md-secondary);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.hero-name {
  position: relative;
  width: min(100%, 760px);
  min-height: clamp(112px, 16vw, 190px);
  color: var(--md-on-surface);
  font-family: 'Marck Script', 'Segoe Script', 'Brush Script MT', cursive;
  font-size: clamp(5.4rem, 13vw, 11.5rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.035em;
}

.hero-name-text {
  position: relative;
  z-index: 1;
  display: inline-block;
  opacity: 1;
}
.hero-name-mark { color: var(--md-primary); }
.hero-wordmark {
  position: absolute;
  z-index: 2;
  inset: -14% auto auto -1%;
  width: 103%;
  height: 128%;
  overflow: visible;
  pointer-events: none;
}
.wordmark-fill,
.wordmark-outline {
  font-family: 'Marck Script', 'Segoe Script', 'Brush Script MT', cursive;
  font-size: 172px;
  letter-spacing: 0;
}
.wordmark-fill {
  fill: var(--md-on-surface);
  stroke: none;
  opacity: 0;
}
.wordmark-outline {
  fill: transparent;
  stroke: var(--md-on-surface);
  stroke-width: 1.6;
  paint-order: stroke;
  stroke-dasharray: 980;
  stroke-dashoffset: 980;
}
.wordmark-flourish,
.wordmark-accent {
  fill: none;
  stroke: var(--md-primary);
  stroke-linecap: round;
  stroke-width: 3;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.wordmark-accent { stroke-width: 1.8; opacity: 0.48; }
.intro-done .hero-name-text { visibility: hidden; }
.intro-done .wordmark-outline { animation: wordmarkOutline 1.45s var(--md-ease-decel) 140ms forwards; }
.intro-done .wordmark-fill { animation: wordmarkFill 520ms ease 1.35s forwards; }
.intro-done .wordmark-flourish { animation: wordmarkDraw 780ms var(--md-ease-decel) 1.05s forwards; }
.intro-done .wordmark-accent { animation: wordmarkDraw 620ms var(--md-ease-decel) 1.35s forwards; }

@keyframes wordmarkOutline { to { stroke-dashoffset: 0; } }
@keyframes wordmarkDraw { to { stroke-dashoffset: 0; } }
@keyframes wordmarkFill {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hero-rule {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(100%, 430px);
  margin: 38px 0 22px;
}
.hero-rule span:first-child { flex: 1; height: 1px; background: var(--md-primary); }
.hero-rule span:last-child { width: 10px; height: 10px; border: 1px solid var(--md-primary); transform: rotate(45deg); }

.hero-role {
  min-height: 1.6em;
  color: var(--md-secondary);
  font-size: clamp(1.25rem, 2.3vw, 1.8rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}
.cursor-blink { color: var(--md-primary); animation: cursorBlink 1s step-end infinite; }
.hero-description {
  max-width: 520px;
  margin-top: 14px;
  color: var(--md-on-surface-var);
  font-size: clamp(1rem, 1.35vw, 1.12rem);
  line-height: 1.75;
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

.hero-visual { justify-self: end; width: min(100%, 430px); }
.portrait-wrap { position: relative; padding: 32px 34px 62px 0; }
.portrait-frame {
  position: relative;
  aspect-ratio: 0.86;
  overflow: hidden;
  background: var(--md-surface-container);
  border-radius: 48% 48% 12px 12px;
  transform: rotate(3deg);
  box-shadow: 24px 30px 0 rgba(187, 134, 252, 0.12);
  animation: portraitFloat 7s ease-in-out infinite;
}
.portrait-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(3, 218, 198, 0.18), transparent 45%, rgba(187, 134, 252, 0.2));
  mix-blend-mode: screen;
  z-index: 1;
  pointer-events: none;
}
.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(0.9) contrast(1.04);
}
.portrait-index {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  color: var(--md-primary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
.portrait-caption {
  position: absolute;
  right: 0;
  bottom: 8px;
  color: var(--md-on-surface-var);
  line-height: 1.6;
  text-align: right;
}
.portrait-caption span { color: var(--md-primary); font-size: 1rem; }
.visual-note {
  display: flex;
  justify-content: space-between;
  color: var(--md-on-surface-var);
  border-top: 1px solid var(--md-outline-var);
  padding-top: 12px;
  opacity: 0.65;
}
.hero-tech-orbit { position: relative; height: 42px; margin-top: 12px; }
.hero-tech { position: absolute; display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid rgba(187, 134, 252, 0.28); border-radius: 50%; color: var(--md-primary); background: rgba(15, 15, 18, 0.8); font-family: var(--font-mono); font-size: 0.58rem; animation: techFloat 4.8s ease-in-out infinite; }
.hero-tech--vue { left: 12%; color: #42b883; animation-delay: -0.3s; }
.hero-tech--node { left: 38%; color: #68a063; animation-delay: -1.5s; }
.hero-tech--ts { left: 64%; color: #5995d4; animation-delay: -2.6s; }
.hero-tech--git { left: 86%; color: #e17859; animation-delay: -3.7s; }
@keyframes techFloat { 50% { transform: translateY(-5px); } }

.hero-footer {
  align-items: flex-end;
  border-top: 1px solid var(--md-outline-var);
  padding-top: 24px;
}
.hero-quote { max-width: 510px; color: var(--md-on-surface-var); }
.hero-quote p { font-family: Georgia, serif; font-size: 1rem; font-style: italic; line-height: 1.55; }
.hero-quote cite { display: block; margin-top: 8px; color: var(--md-primary); font-family: var(--font-mono); font-size: 0.67rem; font-style: normal; letter-spacing: 0.08em; text-transform: uppercase; }
.hero-footer-side { display: flex; align-items: center; gap: 22px; }
.github-chip { display: flex; align-items: center; gap: 9px; color: var(--md-on-surface); text-decoration: none; }
.github-chip img { width: 32px; height: 32px; border: 1px solid var(--md-outline); border-radius: 50%; }
.github-chip span { display: flex; flex-direction: column; gap: 1px; }
.github-chip strong { font-size: 0.75rem; }
.github-chip small { color: var(--md-on-surface-var); font-size: 0.65rem; }
.social-row { display: flex; gap: 7px; }
.social-link { display: grid; place-items: center; width: 34px; height: 34px; color: var(--md-on-surface-var); border: 1px solid var(--md-outline-var); border-radius: 50%; text-decoration: none; transition: transform 220ms var(--md-ease-spring), color 220ms ease, border-color 220ms ease; }
.social-link:hover { color: var(--md-primary); border-color: var(--md-primary); transform: translateY(-4px) rotate(-8deg); }

.hero-marquee { position: absolute; right: 0; bottom: 16px; left: 0; display: flex; overflow: hidden; color: var(--md-on-surface-var); font-family: var(--font-mono); font-size: 0.59rem; letter-spacing: 0.18em; opacity: 0.28; white-space: nowrap; }
.hero-marquee span { flex: 0 0 auto; min-width: 100%; animation: marquee 28s linear infinite; }

.hero-reveal { opacity: 0; transform: translateY(22px); }
.intro-done .hero-reveal { animation: reveal 800ms var(--md-ease-decel) forwards; }
.hero-reveal--one { animation-delay: 100ms; }
.hero-reveal--two { animation-delay: 180ms; }
.hero-reveal--three { animation-delay: 260ms; }
.hero-reveal--four { animation-delay: 360ms; }
.hero-reveal--five { animation-delay: 440ms; }
.hero-reveal--six { animation-delay: 520ms; }

@keyframes reveal { to { opacity: 1; transform: translateY(0); } }
@keyframes portraitFloat { 0%, 100% { transform: rotate(3deg) translateY(0); } 50% { transform: rotate(1deg) translateY(-10px); } }
@keyframes availabilityPulse { 50% { box-shadow: 0 0 0 8px rgba(3, 218, 198, 0.02); opacity: 0.55; } }
@keyframes cursorBlink { 50% { opacity: 0; } }
@keyframes marquee { to { transform: translateX(-100%); } }

@media (max-width: 800px) {
  .hero { padding: 88px 0 128px; }
  .hero-main { grid-template-columns: 1fr; gap: 44px; padding: 56px 0 64px; }
  .hero-visual { justify-self: center; width: min(100%, 390px); }
  .hero-footer { align-items: flex-start; flex-direction: column; }
  .hero-footer-side { width: 100%; justify-content: space-between; }
}

@media (max-width: 480px) {
  .hero { min-height: auto; padding: 92px 0 70px; }
  .hero-meta { align-items: flex-start; flex-direction: column; gap: 10px; }
  .hero-main { padding: 64px 0 68px; }
  .hero-name { font-size: clamp(3.8rem, 20vw, 6rem); }
  .portrait-wrap { padding-right: 20px; }
  .hero-footer-side { align-items: flex-start; flex-direction: column; gap: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-reveal,
  .hero-name,
  .portrait-frame,
  .availability-dot,
  .cursor-blink,
  .hero-marquee span,
  .hero-tech,
  .wordmark-outline,
  .wordmark-flourish,
  .wordmark-accent,
  .hero-name-text { animation: none; transition: none; }
  .hero-reveal { opacity: 1; transform: none; }
  .hero-name-text { visibility: visible; }
  .wordmark-fill { opacity: 0; }
  .wordmark-outline { stroke-dashoffset: 0; }
  .wordmark-flourish,
  .wordmark-accent { stroke-dashoffset: 0; }
}
</style>
