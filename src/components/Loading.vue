<template>
  <div
    :class="['loading-screen', { hidden: hide }]"
    class="flex bg-base-300 w-screen h-screen fixed break-all left-0 top-0 z-10"
  >
    <div
      ref="typeit"
      class="font-mono text-base-content text-base whitespace-pre-wrap mt-[5px] pl-[5px]"
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
		.type("sudo atp install heiznerd")
		.type("-website -y")
		.options({ speed: 25 })
		.move(-11)
		.options({ speed: 50 })
		.delete(2)
		.type("ef")
		.options({ speed: 25 })
		.move(null, { to: "END" })
		.options({ speed: 50 })
		.type("odcut")
		.options({ speed: 25 })
		.move(-12)
		.options({ speed: 50 })
		.delete(2)
		.type("epl")
		.options({ speed: 25 })
		.move(null, { to: "END" })
		.options({ speed: 50 })
		.type("ion")
		.options({ speed: 25 })
		.move(-4)
		.options({ speed: 50 })
		.delete(2)
		.type("uc")
		.options({ speed: 25 })
		.move(null, { to: "END" })
		.options({ speed: 50 })
		.break({ instant: true, delay: 80 })
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
