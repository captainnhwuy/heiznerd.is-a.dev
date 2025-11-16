<template>
  <section ref="sectionRef" class="fade-in-section">
    <h2 class="text-3xl font-bold mb-4">📈 About my workspace</h2>
    <div class="bg-gray-800 p-6 text-gray-300">
      <pre class="font-mono text-sm whitespace-pre-wrap">
PC: Dell OptiPlex 3050 (Mini Tower,from JP)
CPU: Intel Core i5-7500 @ 3.4GHz (up to 3.8GHz) [4 Cores 4 Threads]
GPU: Integrated Intel HD Graphics 630 (support DirectX 12)
RAM: 16GB DDR4 2400MHz (up to 32GB)
SSD/HDD: 256GB SSD SATA III (and 1 HDD 255gb)
Display: Dell 1366x768 Display (1440p 60hz)
Sound: High Definition Audio (integrated)
Hubs: x1 DisplayPort 1.2, x1 HDMI 1.4, x4 USB 3.0, x4 USB 2.0, x1 RJ-45, x1 Universal Audio Jack, x1 Line-out
OS: Windows 11 Pro (integrated Professional Key)
Customization: SeelenUI + WallpaperEngine
      </pre>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sectionRef = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>