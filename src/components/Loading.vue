<template>
  <Transition name="fade">
    <div
      v-if="!hide"
      class="loading-screen flex bg-[#0C0C0C] w-screen h-screen fixed break-all left-0 top-0 z-10 overflow-auto"
    >
      <!-- Terminal header bar -->
      <div class="terminal-header fixed top-0 left-0 right-0 bg-[#2D2D30] h-8 flex items-center px-3 border-b border-[#3E3E42] z-20">
        <div class="flex gap-2">
          <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div class="flex-1 text-center text-[#CCCCCC] text-xs font-mono">
          heiznerd@ubuntu: ~
        </div>
      </div>

      <!-- Terminal content -->
      <div
        ref="typeit"
        class="terminal-content font-mono text-[#CCCCCC] text-sm whitespace-pre-wrap mt-8 pl-2 pr-2 pt-2 pb-20 w-full leading-relaxed"
      ></div>
      
      <!-- Skip Button with animation -->
      <Transition name="slide-up">
        <button
          v-if="showSkipButton && !hide && !isTypingComplete"
          @click="handleSkipLoading"
          class="skip-button text-sm absolute bottom-[10%] left-[50%] translate-x-[-50%] bg-[#1E1E1E] text-[#4EC9B0] border border-[#4EC9B0] px-5 py-2 rounded cursor-pointer font-mono hover:bg-[#4EC9B0] hover:text-[#1E1E1E] transition-all duration-300 shadow-lg"
        >
          [ Press SHIFT to skip ]
        </button>
      </Transition>

      <!-- System info indicator -->
      <div class="system-info absolute top-10 right-3 text-[#6A9955] font-mono text-xs flex flex-col items-end gap-1">
        <span class="opacity-70">{{ progressText }}</span>
        <span class="opacity-50">Ubuntu 22.04 LTS</span>
      </div>

      <!-- Cursor blink -->
      <div v-if="!isTypingComplete" class="cursor-blink"></div>
    </div>
  </Transition>

  <Transition name="fade">
    <div
      v-if="!hide"
      class="backdrop z-[-9998] bg-black w-full h-full fixed overflow-hidden m-0 p-0 left-0 top-0"
    >
      &nbsp;
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import TypeIt from 'typeit';

const props = defineProps({
  showSkipButton: {
    type: Boolean,
    default: true
  },
  hide: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['hide-loading']);

const typeit = ref(null);
const currentStep = ref(0);
const totalSteps = ref(15);
const isTypingComplete = ref(false);
let instance = null;

const progressText = computed(() => {
  const percentage = Math.round((currentStep.value / totalSteps.value) * 100);
  return `${percentage}%`;
});

const handleSkipLoading = () => {
  try {
    document.removeEventListener('keydown', handleKeyPress);
    if (instance) {
      instance.destroy(true);
      instance = null;
    }
    isTypingComplete.value = true;
  } catch (error) {
    console.error('Error in handleSkipLoading:', error);
  } finally {
    emit('hide-loading');
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Shift') {
    handleSkipLoading();
  }
};

// Auto scroll to bottom with smooth behavior
const scrollToBottom = () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.scrollTo({
      top: loadingScreen.scrollHeight,
      behavior: 'auto'
    });
  }
};

// Update progress
const updateProgress = () => {
  currentStep.value = Math.min(currentStep.value + 1, totalSteps.value);
};

const handleTyping = (instance, hideLoading) => {
  instance
    .options({
      speed: 15,
      afterStep: scrollToBottom,
    })
    // Boot sequence
    .type('[  <span class="text-[#4EC9B0]">OK</span>  ] Started Update UTMP about System Runlevel Changes.', { instant: true })
    .break({ instant: true })
    .type('[  <span class="text-[#4EC9B0]">OK</span>  ] Reached target Multi-User System.', { instant: true })
    .break({ instant: true })
    .type('[  <span class="text-[#4EC9B0]">OK</span>  ] Started OpenSSH server daemon.', { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type('Ubuntu 22.04.3 LTS heiznerd tty1', { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type('heiznerd login: ', { instant: true, delay: 800 })
    .type('heiznerd', { delay: 300 })
    .break({ instant: true })
    .type('Password: ', { instant: true, delay: 600 })
    .type('*********', { delay: 200 })
    .break({ instant: true })
    .type('Last login: Mon Nov 17 14:32:15 2025 from 192.168.1.100', { instant: true, delay: 500 })
    .break({ instant: true })
    .break({ instant: true })
    
    // Welcome message
    .type('Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)', { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type(' * Documentation:  https://help.ubuntu.com', { instant: true })
    .break({ instant: true })
    .type(' * Management:     https://landscape.canonical.com', { instant: true })
    .break({ instant: true })
    .type(' * Support:        https://ubuntu.com/advantage', { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 1: System check
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~</span>$ ',
      { instant: true, delay: 800 },
    )
    .type("uname -a", { delay: 200 })
    .break({ instant: true })
    .type("Linux ubuntu 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 2: Check system resources
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("lsblk", { delay: 200 })
    .break({ instant: true })
    .type("              total        used        free      shared", { instant: true })
    .break({ instant: true })
    .type("Mem:           15Gi       2.3Gi       11Gi       128Mi", { instant: true })
    .break({ instant: true })
    .type("Swap:         2.0Gi          0B       2.0Gi", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 3: Check disk space
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("df -h /", { delay: 200 })
    .break({ instant: true })
    .type("Filesystem      Size  Used Avail Use% Mounted on", { instant: true })
    .break({ instant: true })
    .type("/dev/sda1       100G   42G   53G  45% /", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 4: Search for something funny
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~</span>$ ',
      { instant: true, delay: 1500 },
    )
    .type("whereis girlfriend")
    .break({ instant: true })
    .type("girlfriend:", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 5: Try to find love
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~</span>$ ',
      { instant: true, delay: 1500 },
    )
    .type("find / -name love 2>/dev/null")
    .break({ instant: true })
    .pause(2000)
    .type("find: '/': No such file or directory", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 6: Create project directory
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~</span>$ ',
      { instant: true, delay: 2000 },
    )
    .type("mkdir -p ~/projects/portfolio && cd ~/projects/portfolio")
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 7: Clone repository
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 800 },
    )
    .type("git clone https://github.com/heiznerd/portfolio.git .", { delay: 200 })
    .break({ instant: true })
    .type("Cloning into '.'...", { instant: true })
    .break({ instant: true })
    .type("remote: Enumerating objects: 247, done.", { instant: true })
    .break({ instant: true })
    .type("remote: Counting objects: 100% (247/247), done.", { instant: true })
    .break({ instant: true })
    .type("remote: Compressing objects: 100% (189/189), done.", { instant: true })
    .break({ instant: true })
    .type("Receiving objects: 100% (247/247), 2.34 MiB | 5.21 MiB/s, done.", { instant: true })
    .break({ instant: true })
    .type("Resolving deltas: 100% (98/98), done.", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 8: Check git status
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("git status", { delay: 200 })
    .break({ instant: true })
    .type("On branch main", { instant: true })
    .break({ instant: true })
    .type("Your branch is up to date with 'origin/main'.", { instant: true })
    .break({ instant: true })
    .type("nothing to commit, working tree clean", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 9: Install dependencies
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("npm install", { delay: 200 })
    .break({ instant: true })
    .type("npm WARN deprecated inflight@1.0.6: This module is not supported", { instant: true })
    .break({ instant: true })
    .type("npm WARN deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported", { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type("added 247 packages, and audited 248 packages in 8s", { instant: true })
    .break({ instant: true })
    .type("73 packages are looking for funding", { instant: true })
    .break({ instant: true })
    .type("  run `npm fund` for details", { instant: true })
    .break({ instant: true })
    .type("found 0 vulnerabilities", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 10: Build project
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("npm run build", { delay: 200 })
    .break({ instant: true })
    .break({ instant: true })
    .type("> portfolio@1.0.0 build", { instant: true })
    .break({ instant: true })
    .type("> vite build", { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type('<span class="text-[#4EC9B0]">vite v5.0.8</span> building for production...', { instant: true })
    .break({ instant: true })
    .type("transforming...", { instant: true })
    .break({ instant: true })
    .pause(800)
    .type('<span class="text-[#4EC9B0]">✓</span> 127 modules transformed.', { instant: true })
    .break({ instant: true })
    .type("rendering chunks...", { instant: true })
    .break({ instant: true })
    .type("computing gzip size...", { instant: true })
    .break({ instant: true })
    .type('<span class="text-[#4EC9B0]">✓</span> built in 3.21s', { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 11: Deploy
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("npm run deploy", { delay: 200 })
    .break({ instant: true })
    .break({ instant: true })
    .type("> portfolio@1.0.0 deploy", { instant: true })
    .break({ instant: true })
    .type("> deploying to production...", { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type("📦 Preparing build artifacts...", { instant: true, delay: 600 })
    .break({ instant: true })
    .type("🔐 Authenticating with server...", { instant: true, delay: 800 })
    .break({ instant: true })
    .type("☁️  Uploading files...", { instant: true, delay: 400 })
    .type(" [████████████████████] 100%", { instant: true, delay: 1200 })
    .break({ instant: true })
    .type("🔄 Restarting services...", { instant: true, delay: 600 })
    .break({ instant: true })
    .type("✅ Cache invalidated", { instant: true, delay: 400 })
    .break({ instant: true })
    .type("✅ SSL certificates renewed", { instant: true, delay: 300 })
    .break({ instant: true })
    .type("✅ CDN purged", { instant: true, delay: 400 })
    .break({ instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 12: Health check
    .type('<span class="text-[#4EC9B0]">✓</span> Deployment successful!', { instant: true })
    .break({ instant: true })
    .type("🌐 Site URL: https://heiznerd.is-a.dev", { instant: true })
    .break({ instant: true })
    .break({ instant: true })
    .type("Running health checks...", { instant: true, delay: 800 })
    .break({ instant: true })
    .type('  <span class="text-[#4EC9B0]">✓</span> Server response: 200 OK', { instant: true, delay: 400 })
    .break({ instant: true })
    .type('  <span class="text-[#4EC9B0]">✓</span> SSL certificate: Valid', { instant: true, delay: 300 })
    .break({ instant: true })
    .type('  <span class="text-[#4EC9B0]">✓</span> Performance score: 98/100', { instant: true, delay: 400 })
    .break({ instant: true })
    .type('  <span class="text-[#4EC9B0]">✓</span> SEO score: 100/100', { instant: true, delay: 300 })
    .break({ instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 13: List files
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("ls -la", { delay: 200 })
    .break({ instant: true })
    .type("total 128K", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  8 heiznerd heiznerd 4.0K Nov 17 14:35 .", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  3 heiznerd heiznerd 4.0K Nov 17 14:30 ..", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  8 heiznerd heiznerd 4.0K Nov 17 14:33 .git", { instant: true })
    .break({ instant: true })
    .type("-rw-r--r--  1 heiznerd heiznerd  312 Nov 17 14:30 .gitignore", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  2 heiznerd heiznerd 4.0K Nov 17 14:35 dist", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x 247 heiznerd heiznerd  12K Nov 17 14:32 node_modules", { instant: true })
    .break({ instant: true })
    .type("-rw-r--r--  1 heiznerd heiznerd  842 Nov 17 14:30 package.json", { instant: true })
    .break({ instant: true })
    .type("-rw-r--r--  1 heiznerd heiznerd 2.1K Nov 17 14:30 README.md", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  4 heiznerd heiznerd 4.0K Nov 17 14:30 src", { instant: true })
    .break({ instant: true })
    .type("-rw-r--r--  1 heiznerd heiznerd  458 Nov 17 14:30 vite.config.js", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Step 14: Final message
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1500 },
    )
    .type("echo 'System ready. Welcome!'", { delay: 200 })
    .break({ instant: true })
    .type("System ready. Welcome!", { instant: true })
    .break({ instant: true })
    .exec(updateProgress)
    
    // Final
    .type(
      '<span class="text-[#4EC9B0]">heiznerd@ubuntu</span>:<span class="text-[#4FC1FF]">~/projects/portfolio</span>$ ',
      { instant: true, delay: 1000 },
    )
    .type("./launch.sh", { delay: 200 })
    .break({ instant: true })
    .break({ instant: true })
    .type("🚀 Launching portfolio website...", { instant: true, delay: 1000 })
    .break({ instant: true })
    .type("🎉 Ready!", { instant: true })
    .pause(1500)
    .exec(() => {
      isTypingComplete.value = true;
      if (instance) {
        instance.destroy(true);
        instance = null;
      }
      // Tự động ẩn màn hình loading sau khi animation xong
      setTimeout(() => {
        handleSkipLoading();
      }, 500);
    })
    .go();
};

onMounted(() => {
  if (typeit.value) {
    instance = new TypeIt(typeit.value, {});
    handleTyping(instance, handleSkipLoading);
  }
  if (props.showSkipButton) {
    document.addEventListener('keydown', handleKeyPress);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
  if (instance) {
    instance.destroy(true);
  }
});
</script>

<style scoped>
/* Terminal colors matching VS Code dark theme */
.terminal-content {
  text-shadow: 0 0 1px rgba(204, 204, 204, 0.3);
  letter-spacing: 0.5px;
}

.skip-button {
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(78, 201, 176, 0.3);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(78, 201, 176, 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 30px rgba(78, 201, 176, 0.5);
  }
}

/* Cursor blink effect */
.cursor-blink {
  position: fixed;
  width: 8px;
  height: 16px;
  background: #4EC9B0;
  animation: blink 1s step-end infinite;
  pointer-events: none;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* Transition animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.5s ease;
}

.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translate(-50%, 20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}

/* Custom scrollbar - Linux terminal style */
.loading-screen::-webkit-scrollbar {
  width: 12px;
}

.loading-screen::-webkit-scrollbar-track {
  background: #1E1E1E;
}

.loading-screen::-webkit-scrollbar-thumb {
  background: #3E3E42;
  border-radius: 6px;
  border: 2px solid #1E1E1E;
}

.loading-screen::-webkit-scrollbar-thumb:hover {
  background: #4EC9B0;
}

/* Terminal header effects */
.terminal-header {
  font-family: 'Ubuntu Mono', 'Courier New', monospace;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* System info fade in */
.system-info {
  animation: fadeInRight 0.8s ease;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>