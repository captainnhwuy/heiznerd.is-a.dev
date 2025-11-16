<template>
  <section ref="sectionRef" class="fade-in-section">
    <h2 class="text-3xl font-bold mb-4">💻 My Setup</h2>
    <div class="bg-gray-800 p-6">
      <ul class="space-y-2 text-gray-300">
        <li><strong>🖥 Daily Driver:</strong> I'm using a Dell Optiplex with 16GB of 2133MHz RAM.</li>
        <li><strong>🖼 Customization:</strong> My desktop is customized with a macOS-like theme using <strong>Seelen UI</strong> and <strong>Wallpaper Engine</strong>.</li>
      </ul>
      <img src="https://drive.google.com/uc?id=1clJLqzOw3PiX_vPpFHHBRJq_UkRCbJAv" alt="Cấu hình SeelenUI" class="mt-4 shadow-lg">
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