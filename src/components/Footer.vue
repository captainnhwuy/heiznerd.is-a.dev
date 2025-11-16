<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-text">
        {{ t.designedBy }} <strong>Heiznerd</strong>
      </p>
      <p class="footer-copyright">
        © 2025 Heiznerd. {{ t.rights }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue';
const lang = inject('lang');
const t = inject('translations')[lang.value].footer;
</script>
