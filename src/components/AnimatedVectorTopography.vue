<template>
  <div ref="container" class="vector-topography" aria-hidden="true">
    <div class="topography-fallback"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';

const container = ref(null);

let renderer;
let scene;
let camera;
let geometry;
let material;
let resizeObserver;
let motionPreference;
let animationFrame;
let running = false;
let contextLost = false;

const vertexShader = /* glsl */`
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);

    for (int octave = 0; octave < 5; octave++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.02 + vec2(17.7, 9.2);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 point = uv - 0.5;
    point.x *= uResolution.x / uResolution.y;

    float time = uTime * 0.035;
    vec2 domain = point * 2.35;
    vec2 warp = vec2(
      fbm(domain + vec2(time, -time * 0.6)),
      fbm(domain + vec2(5.2 - time * 0.5, 1.3 + time * 0.8))
    );
    float field = fbm(domain + (warp - 0.5) * 2.15 + vec2(time * 0.3, -time * 0.22));

    float levels = 13.0;
    float scaled = field * levels;
    float edge = min(fract(scaled), 1.0 - fract(scaled));
    float minorLine = 1.0 - smoothstep(0.014, 0.035, edge);

    float majorScaled = field * (levels / 4.0);
    float majorEdge = min(fract(majorScaled), 1.0 - fract(majorScaled));
    float majorLine = 1.0 - smoothstep(0.012, 0.03, majorEdge);

    float vignette = smoothstep(0.95, 0.18, length(point * vec2(0.78, 0.9)));
    float breathe = 0.92 + sin(uTime * 0.22) * 0.08;
    vec3 minorColor = vec3(0.57, 0.49, 0.72);
    vec3 majorColor = vec3(0.76, 0.65, 0.94);
    vec3 color = mix(minorColor, majorColor, majorLine * 0.72);
    float alpha = (minorLine * 0.105 + majorLine * 0.075) * vignette * breathe;

    gl_FragColor = vec4(color, alpha);
  }
`;

const resize = () => {
  if (!container.value || !renderer || !material) return;
  const width = Math.max(container.value.clientWidth, 1);
  const height = Math.max(container.value.clientHeight, 1);
  const dprCap = width < 640 ? 1.2 : 1.5;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setSize(width, height, false);
  material.uniforms.uResolution.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
  renderer.render(scene, camera);
};

const renderFrame = timestamp => {
  if (!running || contextLost || document.hidden) return;
  material.uniforms.uTime.value = timestamp * 0.001;
  renderer.render(scene, camera);
  animationFrame = requestAnimationFrame(renderFrame);
};

const stop = () => {
  running = false;
  cancelAnimationFrame(animationFrame);
};

const start = () => {
  if (running || contextLost || document.hidden || motionPreference?.matches) return;
  running = true;
  animationFrame = requestAnimationFrame(renderFrame);
};

const renderStatic = () => {
  if (!renderer || contextLost) return;
  material.uniforms.uTime.value = 0;
  renderer.render(scene, camera);
};

const handleVisibility = () => {
  if (document.hidden) stop();
  else if (motionPreference?.matches) renderStatic();
  else start();
};

const handleMotionChange = event => {
  stop();
  if (event.matches) renderStatic();
  else start();
};

const handleContextLost = event => {
  event.preventDefault();
  contextLost = true;
  stop();
  container.value?.classList.add('is-fallback');
};

const handleContextRestored = () => {
  contextLost = false;
  container.value?.classList.remove('is-fallback');
  resize();
  start();
};

const init = () => {
  if (!container.value) return;

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    container.value.classList.add('is-fallback');
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'topography-canvas';
  container.value.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.Camera();
  geometry = new THREE.PlaneGeometry(2, 2);
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
    },
  });
  scene.add(new THREE.Mesh(geometry, material));

  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionPreference.addEventListener('change', handleMotionChange);
  document.addEventListener('visibilitychange', handleVisibility);
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container.value);
  resize();

  if (!motionPreference.matches) start();
};

const destroy = () => {
  stop();
  resizeObserver?.disconnect();
  motionPreference?.removeEventListener('change', handleMotionChange);
  document.removeEventListener('visibilitychange', handleVisibility);
  renderer?.domElement.removeEventListener('webglcontextlost', handleContextLost);
  renderer?.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
  geometry?.dispose();
  material?.dispose();
  renderer?.dispose();
  renderer?.domElement.remove();
};

onMounted(init);
onBeforeUnmount(destroy);
</script>

<style scoped>
.vector-topography {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(ellipse 72% 68% at 18% 16%, rgba(96, 68, 136, 0.09), transparent 68%),
    radial-gradient(ellipse 64% 58% at 84% 78%, rgba(75, 58, 108, 0.08), transparent 72%);
}

:deep(.topography-canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.topography-fallback {
  position: absolute;
  inset: 0;
  display: none;
  opacity: 0.32;
  background:
    repeating-radial-gradient(ellipse at 27% 34%, transparent 0 24px, rgba(205, 184, 244, 0.11) 25px 26px, transparent 27px 45px),
    repeating-radial-gradient(ellipse at 73% 68%, transparent 0 32px, rgba(187, 134, 252, 0.08) 33px 34px, transparent 35px 58px);
}

.is-fallback .topography-fallback { display: block; }

@media (max-width: 640px) {
  :deep(.topography-canvas) { opacity: 0.78; }
}
</style>
