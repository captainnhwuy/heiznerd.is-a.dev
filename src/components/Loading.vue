<template>
  <Transition name="fade">
    <div
      v-if="!hide"
      class="loading-screen flex bg-base-300 w-screen h-screen fixed break-all left-0 top-0 z-10 overflow-auto"
    >
      <div
        ref="typeit"
        class="font-mono text-base-content text-base whitespace-pre-wrap mt-[5px] pl-[5px] pb-20 w-full"
      ></div>
      
      <!-- Skip Button with animation -->
      <Transition name="slide-up">
        <button
          v-if="showSkipButton && !hide && !isTypingComplete"
          @click="handleSkipLoading"
          class="skip-button text-lg absolute bottom-[10%] left-[50%] translate-x-[-50%] bg-transparent text-success border-2 border-success px-6 py-3 rounded-md cursor-pointer font-mono hover:bg-success hover:text-base-300 transition-all duration-300"
        >
          &lt; Skip Animation (Shift) &gt;
        </button>
      </Transition>

      <!-- Progress indicator -->
      <div class="progress-container absolute top-4 right-4 text-success font-mono text-sm">
        <span>{{ progressText }}</span>
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div
      v-if="!hide"
      class="backdrop z-[-9998] bg-base-200 w-full h-full fixed overflow-scroll break-all backdrop-blur-[3px] m-0 p-0 left-0 top-0"
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
  return `Loading... ${percentage}%`;
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
      behavior: 'smooth'
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
      speed: 10,
      afterStep: scrollToBottom,
    })
    // Step 1: Welcome message
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 500 },
    )
    .exec(updateProgress)
    .type(
      "echo \"Press 'Skip Animation' button or Shift key to skip\"",
      { delay: 200 },
    )
    .options({ speed: 100 })
    .break({ instant: true })
    .type("Press 'Skip Animation' button or Shift key to skip", { instant: true })
    .break({ instant: true })
    
    // Step 2: Clear screen
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 2000 },
    )
    .exec(updateProgress)
    .type("clear", { delay: 100 })
    .break({ instant: true })
    .delete(null, { instant: true })
    
    // Step 3: Search for love (humor)
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 500 },
    )
    .exec(updateProgress)
    .type("whereis love")
    .break({ instant: true })
    .type("love:", { instant: true })
    .break({ instant: true })
    
    // Step 4: Cat command fails
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 2000 },
    )
    .exec(updateProgress)
    .type("cat love")
    .break({ instant: true })
    .type("cat: love: No such file or directory", { instant: true })
    .break({ instant: true })
    
    // Step 5: Sad moment then cancellation
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 3000 },
    )
    .exec(updateProgress)
    .type(":(", { delay: 1000 })
    .options({ speed: 1000 })
    .delete(2, { delay: 500 })
    .options({ speed: 50 })
    .type("sudo rm -rf --no-preserve-root /")
    .break({ instant: true })
    .type("[sudo] password for heiznerd: ", { instant: true, delay: 800 })
    .break({ instant: true })
    .type("^C", { instant: true, delay: 200 })
    .type("^C", { instant: true })
    .pause(1500)
    .type("sudo: a password is required", { instant: true })
    .break({ instant: true, delay: 300 })
    
    // Step 6: SSH Connection
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 500 },
    )
    .exec(updateProgress)
    .type("ssh website@heiznerd.com")
    .break({ instant: true })
    .type(
      "The authenticity of host 'heiznerd.com (173.208.244.6)' can't be established.",
      { instant: true },
    )
    .break({ instant: true })
    .type("ECDSA key fingerprint is SHA256:Bhvy0+Nafdu90JBR2OzKySye7vmFcgqPPnDo4ywMDV9.", { instant: true })
    .break({ instant: true })
    .type("Are you sure you want to continue connecting (yes/no)? ", { instant: true, delay: 500 })
    .type("yes", { delay: 200 })
    .break({ instant: true })
    .type("Warning: Permanently added 'heiznerd.com' to the list of known hosts.", { instant: true })
    .break({ instant: true })
    
    // Step 7: Password entry
    .type("website@heiznerd.com's password: ", { instant: true, delay: 500 })
    .exec(updateProgress)
    .type("****", { delay: 150 })
    .type("***", { delay: 500 })
    .delete(2)
    .type("***", { delay: 400 })
    .type("*****")
    .break({ instant: true })
    
    // Step 8: Deploy website
    .type("website@heiznerd.com: ~/ $ ", { instant: true, delay: 500 })
    .exec(updateProgress)
    .type("sudo apt install heiznerd-website -y", { delay: 300 })
    .options({ speed: 50 })
    .delete(32)
    .type("pt install heiznerd-website -y --production")
    .options({ speed: 50 })
    .break({ instant: true, delay: 80 })
    
    // Step 9: Deployment progress
    .exec(updateProgress)
    .type("Deploying...", { instant: true, delay: 100 })
    .type(" [--------------------] 0%", { instant: true, delay: 400 })
    .delete(24, { instant: true })
    .type("===-----------------] 15%", { instant: true, delay: 450 })
    .delete(25, { instant: true })
    .type("=====---------------] 25%", { instant: true, delay: 550 })
    .delete(25, { instant: true })
    .type("========------------] 40%", { instant: true, delay: 520 })
    .delete(25, { instant: true })
    .type("=============-------] 65%", { instant: true, delay: 270 })
    .delete(25, { instant: true })
    .type("==============------] 70%", { instant: true, delay: 520 })
    .delete(25, { instant: true })
    .type("=================---] 85%", { instant: true, delay: 260 })
    .delete(25, { instant: true })
    .type("==================--] 90%", { instant: true, delay: 400 })
    .delete(25, { instant: true })
    .type("====================] 100%", { instant: true, delay: 150 })
    .delete(40, { instant: true })
    .type('✓ Successfully deployed the website!', { instant: true })
    .pause(1000)
    .break({ instant: true })
    
    // Step 10: Update packages
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 500 },
    )
    .exec(updateProgress)
    .type("sudo apt update", { delay: 200 })
    .break({ instant: true })
    .type("Hit:1 http://deb.debian.org/debian bookworm InRelease", { instant: true })
    .break({ instant: true })
    .type("Hit:2 http://deb.debian.org/debian bookworm-updates InRelease", { instant: true })
    .break({ instant: true })
    .type("Hit:3 http://deb.debian.org/debian-security bookworm-security InRelease", { instant: true })
    .break({ instant: true })
    .type("Reading package lists... Done", { instant: true })
    .break({ instant: true })
    
    // Step 11: NPM install
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 1000 },
    )
    .exec(updateProgress)
    .type("npm install", { delay: 200 })
    .break({ instant: true })
    .type("✓ Dependencies installed successfully", { instant: true })
    .break({ instant: true })
    
    // Step 12: Build project
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 1000 },
    )
    .exec(updateProgress)
    .type("npm run build", { delay: 200 })
    .break({ instant: true })
    .type("> heiznerd-bio@0.0.0 build", { instant: true })
    .break({ instant: true })
    .type("> vite build", { instant: true })
    .break({ instant: true })
    .type("vite v4.5.0 building for production...", { instant: true })
    .break({ instant: true })
    .type("✓ 100 modules transformed.", { instant: true })
    .break({ instant: true })
    .type("✓ built in 2.5s", { instant: true })
    .break({ instant: true })
    
    // Step 13: Git status
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 500 },
    )
    .exec(updateProgress)
    .type("git status", { delay: 200 })
    .break({ instant: true })
    .type("On branch main", { instant: true })
    .break({ instant: true })
    .type("Your branch is up to date with 'origin/main'.", { instant: true })
    .break({ instant: true })
    .type("nothing to commit, working tree clean", { instant: true })
    .break({ instant: true })
    
    // Step 14: List files
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 1000 },
    )
    .exec(updateProgress)
    .type("ls -la", { delay: 200 })
    .break({ instant: true })
    .type("total 100", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  1 heiznerd  heiznerd   4096 Nov 16 10:00 .", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  1 heiznerd  heiznerd   4096 Nov 16 09:00 ..", { instant: true })
    .break({ instant: true })
    .type("-rw-r--r--  1 heiznerd  heiznerd    123 Nov 15 18:30 .gitignore", { instant: true })
    .break({ instant: true })
    .type("-rw-r--r--  1 heiznerd  heiznerd   2048 Nov 16 10:05 README.md", { instant: true })
    .break({ instant: true })
    .type("drwxr-xr-x  1 heiznerd  heiznerd   4096 Nov 16 10:10 src", { instant: true })
    .break({ instant: true })
    
    // Step 15: Final - Read README
    .type(
      '<span class="text-success">heiznerd@Ubuntu</span>: <span class="text-secondary">/</span> $ ',
      { instant: true, delay: 1000 },
    )
    .exec(updateProgress)
    .type("cat README.md", { delay: 200 })
    .break({ instant: true })
    .type("# heiznerd-bio", { instant: true })
    .break({ instant: true })
    .type("This is a personal portfolio website.", { instant: true })
    .break({ instant: true })
    .type("Built with Vue 3, Vite, and Tailwind CSS.", { instant: true })
    .break({ instant: true })
    .type("🚀 Ready to launch!", { instant: true })
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
.text-success {
  color: var(--next-primary);
}
.text-secondary {
  color: var(--next-secondary);
}

.skip-button {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
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

/* Custom scrollbar */
.loading-screen::-webkit-scrollbar {
  width: 8px;
}

.loading-screen::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.loading-screen::-webkit-scrollbar-thumb {
  background: var(--next-primary);
  border-radius: 4px;
}

.loading-screen::-webkit-scrollbar-thumb:hover {
  background: var(--next-secondary);
}
</style>