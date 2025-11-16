<template>
  <div
    :class="['loading-screen', { hidden: hide }]"
    class="flex bg-base-300 w-screen h-screen fixed break-all left-0 top-0 z-10 overflow-auto"
  >
    <div
      ref="typeit"
      class="font-mono text-base-content text-base whitespace-pre-wrap mt-[5px] pl-[5px] pb-20"
    ></div>
    <button
      v-if="showSkipButton"
      @click="handleHideLoading"
      class="text-[large] absolute bottom-[10%] left-[50%] translate-x-[-50%] bg-transparent text-success border-none cursor-pointer font-mono"
    >
      Skip Loading
    </button>
  </div>
  <div
    :class="['backdrop', { hidden: hide }]"
    class="z-[-9998] bg-base-200 w-full h-full fixed overflow-scroll break-all backdrop-blur-[3px] m-0 p-0 left-0 top-0"
  >
    &nbsp;
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TypeIt from 'typeit';

const props = defineProps({
  showSkipButton: Boolean,
  hide: Boolean,
});

const emit = defineEmits(['hide-loading']);

const typeit = ref(null);
let instance = null;

const handleHideLoading = () => {
  document.removeEventListener('keydown', handleKeyPress);
  emit('hide-loading');
};

const handleKeyPress = (event) => {
  if (event.key === 'Shift') {
    handleHideLoading();
  }
};

// Hàm tự động scroll xuống cuối
const scrollToBottom = () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.scrollTop = loadingScreen.scrollHeight;
  }
};

const handleTyping = (instance, hideLoading) => {
	instance
		.options({
			lifeLike: true,
			speed: 10,
		})
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 500 },
		)
		.type(
			"echo \"Press Shift or the 'Skip Animation' button to skip this animation\"",
			{ delay: 200 },
		)
		.options({
			speed: 100,
		})
		.break({ instant: true })
		.type("Press Shift or the 'Skip Animation' button to skip this animation", {
			instant: true,
		})
		.break({ instant: true })
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 2000 },
		)
		.type("clear", { delay: 100 })
		.break({ instant: true })
		.delete(null, { instant: true })
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 500 },
		)
		.type("whereis love")
		.break({ instant: true })
		.type("love:", { instant: true })
		.break({ instant: true })
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 2000 },
		)
		.type("cat love")
		.break({ instant: true })
		.type("cat: love: No such file or directory", { instant: true })
		.break({ instant: true })
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 4000 },
		)
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
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ^C',
			{ instant: true, delay: 300 },
		)
		.break({ instant: true })
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 500 },
		)
		.type("ssh website@heiznerd.com")
		.break({ instant: true })
		.type(
			"The authenticity of host 'heiznerd.com (173.208.244.6)' can't be established.",
			{ instant: true },
		)
		.type(
			"ECDSA key fingerprint is SHA256:Bhvy0+Nafdu90JBR2OzKySye7vmFcgqPPnDo4ywMDV9.",
			{ instant: true },
		)
		.break({ instant: true })
		.type(
			"Are you sure you want to continue connecting (yes/no/[fingerprint])? ",
			{ instant: true, delay: 500 },
		)
		.type("yes", { delay: 200 })
		.break({ instant: true })
		.type(
			"Warning: Permanently added 'heiznerd.com,173.208.244.6' (ECDSA) to the list of known hosts.",
			{ instant: true },
		)
		.break({ instant: true })
		.type("website@heiznerd.com's password: ", { instant: true, delay: 500 })
		.type("****", { delay: 150 })
		.type("***", { delay: 500 })
		.delete(2)
		.type("***", { delay: 400 })
		.type("*****")
		.break({ instant: true })
		.type("website@heiznerd.com: ~/ $ ", { instant: true, delay: 500 })
		.type("sudo atp install heiznerd-website -y", { delay: 300 })
		.options({ speed: 50 })
		.delete(30) // Xóa từ cuối về "atp install..."
		.type("pt install heiznerd-website -y --production") // Gõ lại đúng
		.options({ speed: 50 })
		.break({ instant: true, delay: 80 })
		.exec(scrollToBottom)
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
		.type(
			'<span style="cursor: pointer;" @click="hideLoading">Successfully deployed the website, available at <u>http://localhost:3000</u>.</span>',
			{ instant: true },
		)
		.pause(1000)
		.break({ instant: true })
		.exec(scrollToBottom)
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 500 },
		)
		.type("sudo apt update", { delay: 200 })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("Hit:1 http://deb.debian.org/debian bookworm InRelease", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("Hit:2 http://deb.debian.org/debian bookworm-updates InRelease", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("Hit:3 http://deb.debian.org/debian-security bookworm-security InRelease", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("Reading package lists... Done", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 1000 },
		)
		.type("npm install", { delay: 200 })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("added 1000 packages in 5s", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 1000 },
		)
		.type("npm run build", { delay: 200 })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("> heiznerd-bio@0.0.0 build", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("> vite build", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("vite v4.5.0 building for production...", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("✓ 100 modules transformed.", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("dist/index.html                   0.47 kB", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("dist/assets/index-xxxxxxxx.js   144.37 kB", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("dist/assets/index-xxxxxxxx.css    24.51 kB", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("✓ built in 2.5s", { instant: true })
		.pause(2000)
		.break({ instant: true })
		.exec(scrollToBottom)
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 500 },
		)
		.type("git status", { delay: 200 })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("On branch main", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("Your branch is up to date with 'origin/main'.", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("nothing to commit, working tree clean", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 1000 },
		)
		.type("ls -la", { delay: 200 })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("total 100", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("drwxr-xr-x  1 heiznerd  heiznerd   4096 Nov 16 10:00 .", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("drwxr-xr-x  1 heiznerd  heiznerd   4096 Nov 16 09:00 ..", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("-rw-r--r--  1 heiznerd  heiznerd    123 Nov 15 18:30 .gitignore", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("-rw-r--r--  1 heiznerd  heiznerd   2048 Nov 16 10:05 README.md", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("drwxr-xr-x  1 heiznerd  heiznerd   4096 Nov 16 10:10 src", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type(
			'<span class="text-success">heiznerd@Life</span>: <span class="text-secondary">/</span> $ ',
			{ instant: true, delay: 1000 },
		)
		.type("cat README.md", { delay: 200 })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("# heiznerd-bio", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("This is a personal portfolio website.", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("Built with Vue 3, Vite, and Tailwind CSS.", { instant: true })
		.break({ instant: true })
		.exec(scrollToBottom)
		.type("More details coming soon...", { instant: true })
		.pause(2000)
		.exec(() => {
      if (instance) {
        instance.destroy(true);
      }
			hideLoading();
		})
		.go();
};

onMounted(() => {
  if (typeit.value) {
    instance = new TypeIt(typeit.value, {});
    handleTyping(instance, handleHideLoading);
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
.hidden {
  display: none;
  overflow: hidden;
}
.text-success {
  color: var(--next-primary);
}
.text-secondary {
  color: var(--next-secondary);
}
</style>