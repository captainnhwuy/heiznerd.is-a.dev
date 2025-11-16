<template>
  <div class="max-w-4xl mx-auto p-4 text-white">
    <div class="grid grid-cols-1 gap-8">

      <!-- Back Button -->
      <RouterLink to="/" class="text-blue-400 hover:underline mb-4">&larr; Back to Home</RouterLink>

      <!-- About Me -->
      <div class="bg-gray-900/70 border border-gray-800 p-6">
        <h2 class="text-3xl font-bold mb-4">🎯 About Me</h2>
        <p class="text-gray-300">
          I'm a 14-year-old developer from Vietnam, passionate about coding, gaming, and anime. I love building Minecraft plugins and exploring new technologies.
        </p>
        <ul class="mt-4 space-y-2">
            <li><strong>🎮 Games:</strong> Minecraft, Honkai: Star Rail, Umamusume.</li>
            <li><strong>🎬 Anime:</strong> Big fan of the Rom-Com genre.</li>
        </ul>
      </div>

      <!-- Languages -->
      <div class="bg-gray-900/70 border border-gray-800 p-6">
        <Languages />
      </div>

      <!-- Setup -->
      <div class="bg-gray-900/70 border border-gray-800 p-6">
        <h2 class="text-3xl font-bold mb-4">💻 My Setup</h2>
        <p><strong>PC:</strong> Dell OptiPlex 3050 (i5-7500, 16GB RAM, 256GB SSD)</p>
        <p><strong>OS:</strong> Windows 11 Pro with a custom macOS theme via SeelenUI.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import Languages from '../components/Languages.vue';
</script>