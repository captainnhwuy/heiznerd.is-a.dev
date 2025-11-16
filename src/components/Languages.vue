<template>
  <section>
    <h2 class="text-xl font-bold mb-2">Languages</h2>
    <div class="space-y-2">
      <div v-for="lang in languages" :key="lang.name">
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium text-gray-300">{{ lang.name }}</span>
          <span class="text-xs font-medium text-gray-400">{{ lang.level }}%</span>
        </div>
        <div class="w-full bg-gray-700 h-1.5">
          <div class="bg-blue-500 h-1.5" :style="{ width: lang.level + '%' }"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const languages = ref([
  { name: 'C++', level: 17 },
  { name: 'JavaScript', level: 49 },
  { name: 'Discord.js', level: 20 },
  { name: 'Vue', level: 30 },
  { name: 'Rust', level: 2 },
]);
</script>