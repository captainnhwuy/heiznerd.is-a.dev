<template>
  <section ref="sectionRef" class="fade-in-section">
    <h2 class="text-3xl font-bold mb-4">📈 My Status</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gray-800 p-6">
        <h3 class="text-xl font-bold mb-4">My Discord Status</h3>
        <a href="https://discord.com/users/1316287191634149377" target="_blank">
          <img src="https://lanyard.cnrad.dev/api/1316287191634149377?theme=dark&showDisplayName=true" alt="Discord Presence">
        </a>
      </div>
      <div class="bg-gray-800 p-6">
        <h3 class="text-xl font-bold mb-4">My Spotify Status</h3>
        <a href="https://github.com/kittinan/spotify-github-profile" target="_blank">
          <img src="https://spotify-github-profile.kittinanx.com/api/view?uid=31ritgy5zyfn2mx4pbu6bm6xteqq&cover_image=true&theme=default&show_offline=false&background_color=121212&interchange=false" alt="Spotify Profile">
        </a>
      </div>
    </div>
    <div class="mt-8 bg-gray-800 p-6">
      <h3 class="text-xl font-bold mb-4">🎶 Listen to my favourite playlist: Album 99% - MCK</h3>
      <p class="text-gray-400 mb-4">You can listen to Album 99% , written by MCK on Spotify right here.</p>
      <img src="https://drive.google.com/uc?id=1MhjZK8rUTP8_gxQBTjz3DBGgJ4oEj_Gt" alt="Album 99%">
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