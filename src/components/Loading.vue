<template>
  <Transition name="fade">
    <div
      v-if="!hide"
      class="loading-screen flex bg-[#2c001e] w-screen h-screen fixed break-all left-0 top-0 z-[9999] overflow-hidden font-ubuntu"
      @click="focusInput"
    >
      <div class="terminal-header fixed top-0 left-0 right-0 bg-[#1e1e1e] h-9 flex items-center px-4 border-b border-[#000] z-20 select-none shadow-md">
        <div class="flex gap-2 absolute left-4">
          <div class="w-3.5 h-3.5 rounded-full bg-[#E95420] hover:bg-[#d64215] transition-colors"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#772953] hover:bg-[#602143] transition-colors"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#AEA79F] hover:bg-[#948e87] transition-colors"></div>
        </div>
        <div class="flex-1 text-center text-[#d3d3d3] text-sm font-bold font-mono flex justify-center items-center gap-2">
          <span class="opacity-50">User:</span> heiznerd <span class="opacity-50">@</span> ubuntu
        </div>
        <div class="absolute right-4 text-xs text-gray-500 font-mono">bash — 80x24</div>
      </div>

      <div class="w-full h-full overflow-y-auto p-4 pt-14 scroll-smooth custom-scrollbar" ref="terminalContainer">
        <div
          ref="typeit"
          class="terminal-content font-mono text-[#f0f0f0] text-[13px] md:text-[14px] leading-snug whitespace-pre-wrap"
        ></div>
        <div class="h-32"></div>
      </div>
      
      <Transition name="slide-up">
        <button
          v-if="showSkipButton && !hide && !isTypingComplete"
          @click="handleSkipLoading"
          class="skip-button fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#E95420] text-white px-6 py-2.5 rounded-sm font-mono text-xs tracking-widest hover:bg-[#c74418] transition-all duration-200 shadow-xl z-50 uppercase border-b-2 border-[#9a3312] active:border-b-0 active:translate-y-[2px]"
        >
          [ Shift ] to Skip Initialization
        </button>
      </Transition>

      <div class="fixed top-12 right-4 text-[#E95420] font-mono text-[10px] md:text-xs flex flex-col items-end gap-0.5 opacity-70 select-none pointer-events-none">
        <span>TASK: {{ currentTask }}</span>
        <span>PROC: {{ progressText }}</span>
        <span>MEM: {{ memoryUsage }}MB</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import TypeIt from 'typeit';

const props = defineProps({
  showSkipButton: { type: Boolean, default: true },
  hide: { type: Boolean, default: false },
});

const emit = defineEmits(['hide-loading']);

const typeit = ref(null);
const terminalContainer = ref(null);
const currentStep = ref(0);
const currentTask = ref('BIOS_POST');
const isTypingComplete = ref(false);
const memoryUsage = ref(124);
let instance = null;
let memInterval = null;

// --- UBUNTU COLOR PALETTE ---
const C_RESET = '</span>';
const C_USER = '<span class="text-[#87FF00] font-bold">'; // Bright Green
const C_HOST = '<span class="text-[#87FF00] font-bold">';
const C_DIR = '<span class="text-[#5E5EFF] font-bold">';  // Blue
const C_ROOT = '<span class="text-[#E95420] font-bold">';  // Orange (Ubuntu)
const C_TIME = '<span class="text-[#aaaaaa]">';
const C_GREEN = '<span class="text-[#00FF00]">';
const C_RED = '<span class="text-[#FF5555]">';
const C_CYAN = '<span class="text-[#00FFFF]">';
const C_YELLOW = '<span class="text-[#FFFF55]">';
const C_WHITE = '<span class="text-[#ffffff]">';
const C_GRAY = '<span class="text-[#666666]">';
const C_PURPLE = '<span class="text-[#bd93f9]">';

// --- HELPERS ---
const getTimestamp = (val) => `${C_TIME}[    ${val.toFixed(6)}]${C_RESET}`;
const getOkLine = (msg) => `${C_GREEN}[  OK  ]${C_RESET} ${C_WHITE}${msg}${C_RESET}`;
const getPrompt = (path = '~') => `${C_USER}heiznerd@ubuntu${C_RESET}:${C_WHITE}:${C_RESET}${C_DIR}${path}${C_RESET}$ `;

const progressText = computed(() => {
  const bars = Math.floor(currentStep.value / 5);
  return `[${'|'.repeat(bars)}${'.'.repeat(20 - bars)}] ${currentStep.value}%`;
});

const handleSkipLoading = () => {
  try {
    document.removeEventListener('keydown', handleKeyPress);
    clearInterval(memInterval);
    if (instance) { instance.destroy(true); instance = null; }
    isTypingComplete.value = true;
  } catch (error) { console.error(error); } 
  finally { emit('hide-loading'); }
};

const handleKeyPress = (event) => {
  if (event.key === 'Shift') handleSkipLoading();
};

const scrollToBottom = () => {
  if (terminalContainer.value) {
    terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
  }
};

const setTask = (name, progress) => {
  currentTask.value = name;
  currentStep.value = progress;
};

// Random memory fluctuation
const startMemSimulation = () => {
  memInterval = setInterval(() => {
    const change = Math.floor(Math.random() * 20) - 5;
    memoryUsage.value = Math.min(Math.max(memoryUsage.value + change, 120), 8192);
  }, 500);
};

const handleTyping = (instance) => {
  instance
    .options({
      speed: 1, 
      lifeLike: false,
      cursorChar: '<span class="block-cursor">█</span>',
      html: true,
      afterStep: scrollToBottom,
    })

    // ==========================================
    // PHASE 1: EXTENDED BOOT SEQUENCE
    // ==========================================
    .exec(() => setTask('KERNEL_INIT', 0))
    .type(`${getTimestamp(0.000000)} Linux version 6.5.0-14-generic (buildd@lcy02-amd64-032) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, GNU ld (GNU Binutils for Ubuntu) 2.38)`, { instant: true }).break()
    .type(`${getTimestamp(0.000000)} Command line: BOOT_IMAGE=/boot/vmlinuz-6.5.0-14-generic root=UUID=1234-5678 ro quiet splash vt.handoff=7`, { instant: true }).break()
    .type(`${getTimestamp(0.004231)} Dentry cache hash table entries: 4194304 (order: 13, 33554432 bytes, linear)`, { instant: true }).break()
    .type(`${getTimestamp(0.005110)} Inode-cache hash table entries: 2097152 (order: 12, 16777216 bytes, linear)`, { instant: true }).break()
    .type(`${getTimestamp(0.006022)} AGP: No AGP bridge found`, { instant: true }).break()
    .type(`${getTimestamp(0.007450)} Calibrating delay loop... 6789.12 BogoMIPS (lpj=3394560)`, { instant: true }).break()
    .type(`${getTimestamp(0.112340)} ACPI: Core revision 20240321`, { instant: true }).break()
    .type(`${getTimestamp(0.115600)} ACPI: 14 ACPI AML tables successfully acquired and loaded`, { instant: true }).break()
    
    // Hardware Detection
    .exec(() => setTask('HARDWARE_DET', 5))
    .type(`${getTimestamp(0.240123)} pci 0000:00:00.0: [8086:4660] type 00 class 0x060000`, { instant: true }).break()
    .type(`${getTimestamp(0.240567)} pci 0000:00:02.0: [8086:46a6] type 00 class 0x030000`, { instant: true }).break()
    .type(`${getTimestamp(0.350000)} usb 1-1: new high-speed USB device number 2 using xhci_hcd`, { instant: true }).break()
    .type(`${getTimestamp(0.362000)} input: Logitech USB Receiver as /devices/pci0000:00/0000:00:14.0/usb1/1-1/1-1:1.0/0003:046D:C52B.0001/input/input4`, { instant: true }).break()
    .type(`${getTimestamp(0.410000)} scsi 0:0:0:0: Direct-Access     NVMe     Samsung SSD 980 1TB     2B2Q    PQ: 0 ANSI: 5`, { instant: true }).break()
    
    // Systemd Services
    .exec(() => setTask('SYSTEMD', 10))
    .type(getOkLine("Started Forward Password Requests to Wall Directory Watch."), { instant: true }).break()
    .type(getOkLine("Created slice Slice /system/getty."), { instant: true }).break()
    .type(getOkLine("Reached target Local Integrity."), { instant: true }).break()
    .type(getOkLine("Mounted /boot/efi."), { instant: true }).break()
    .type(getOkLine("Started D-Bus System Message Bus."), { instant: true }).break()
    .type(getOkLine("Started Network Manager."), { instant: true }).break()
    .type(getOkLine("Started Docker Application Container Engine."), { instant: true }).break()
    .type(getOkLine("Started GNOME Display Manager."), { instant: true }).break()
    .type(getOkLine("Reached target Graphical Interface."), { instant: true }).break()
    .type(`${C_WHITE}Welcome to Ubuntu 22.04.3 LTS!${C_RESET}`, { instant: true }).break()
    .break()

    // ==========================================
    // PHASE 2: LOGIN & FASTFETCH (Eye Candy)
    // ==========================================
    .options({ speed: 30, lifeLike: true }) 
    .exec(() => setTask('AUTH_LOGIN', 15))
    .type('heiznerd login: ', { delay: 200 }).type('heiznerd').break()
    .type('Password: ', { delay: 200 }).type('*********').break().break()

    .exec(() => setTask('SYS_INFO', 20))
    .type(getPrompt('~'), { instant: true, delay: 400 })
    .type("fastfetch", { delay: 100 }).break()
    .options({ speed: 1, lifeLike: false })
    
    // UBUNTU ASCII ART & INFO (Aligned)
    .type(`${C_ROOT}            .-.             ${C_ROOT}heiznerd${C_RESET}@${C_ROOT}ubuntu${C_RESET}`, {instant: true}).break()
    .type(`${C_ROOT}           .'   '.          ${C_WHITE}---------------${C_RESET}`, {instant: true}).break()
    .type(`${C_ROOT}          /       \\         ${C_ROOT}OS${C_RESET}: Ubuntu 22.04.3 LTS x86_64`, {instant: true}).break()
    .type(`${C_ROOT}         |         |        ${C_ROOT}Host${C_RESET}: Heiznerd Portfolio Server v1.0`, {instant: true}).break()
    .type(`${C_ROOT}         |         |        ${C_ROOT}Kernel${C_RESET}: 6.5.0-14-generic`, {instant: true}).break()
    .type(`${C_ROOT}          \\       /         ${C_ROOT}Uptime${C_RESET}: 23 mins`, {instant: true}).break()
    .type(`${C_ROOT}           '.   .'          ${C_ROOT}Packages${C_RESET}: 1842 (dpkg), 12 (snap)`, {instant: true}).break()
    .type(`${C_ROOT}             '-'            ${C_ROOT}Shell${C_RESET}: bash 5.1.16`, {instant: true}).break()
    .type(`                            ${C_ROOT}Resolution${C_RESET}: 1920x1080`, {instant: true}).break()
    .type(`                            ${C_ROOT}DE${C_RESET}: GNOME 42.9`, {instant: true}).break()
    .type(`                            ${C_ROOT}WM${C_RESET}: Mutter`, {instant: true}).break()
    .type(`                            ${C_ROOT}Theme${C_RESET}: Yaru-dark [GTK2/3]`, {instant: true}).break()
    .type(`                            ${C_ROOT}Icons${C_RESET}: Yaru [GTK2/3]`, {instant: true}).break()
    .type(`                            ${C_ROOT}Terminal${C_RESET}: gnome-terminal`, {instant: true}).break()
    .type(`                            ${C_ROOT}CPU${C_RESET}: AMD Ryzen 9 5950X (32) @ 3.4GHz`, {instant: true}).break()
    .type(`                            ${C_ROOT}GPU${C_RESET}: NVIDIA GeForce RTX 3080`, {instant: true}).break()
    .type(`                            ${C_ROOT}Memory${C_RESET}: 4.20GiB / 32.00GiB`, {instant: true}).break()
    .type(`                            ${C_ROOT}Disk${C_RESET}: 456G / 1.8T (25%)`, {instant: true}).break()
    .type(`                            ${C_ROOT}Local IP${C_RESET}: 192.168.1.105`, {instant: true}).break()
    .break()
    // Color palette
    .type(`                            ${C_GRAY}███${C_RED}███${C_GREEN}███${C_YELLOW}███${C_DIR}███${C_PURPLE}███${C_CYAN}███${C_WHITE}███${C_RESET}`, {instant: true}).break()
    .break()

    // ==========================================
    // PHASE 3: DEVELOPER WORKFLOW (Resource Check)
    // ==========================================
    .exec(() => setTask('RES_CHECK', 25))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 300 })
    .type("lscpu | grep 'Thread'", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Thread(s) per core:  2`, {instant: true}).break()
    
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("free -h", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`               total        used        free      shared  buff/cache   available`, { instant: true }).break()
    .type(`Mem:            31Gi       4.2Gi        18Gi       256Mi       9.0Gi        26Gi`, { instant: true }).break()
    .type(`Swap:          2.0Gi          0B       2.0Gi`, { instant: true }).break()

    .exec(() => setTask('DOCKER_CHK', 30))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`NAMES           STATUS          PORTS`, {instant: true}).break()
    .type(`mongo_db        Up 13 minutes   0.0.0.0:27017->27017/tcp`, {instant: true}).break()
    .type(`redis_cache     Up 13 minutes   0.0.0.0:6379->6379/tcp`, {instant: true}).break()
    .type(`portfolio_api   Up 2 minutes    0.0.0.0:3000->3000/tcp`, {instant: true}).break()

    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("systemctl status nginx | grep Active", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`     Active: ${C_GREEN}active (running)${C_RESET} since Tue 2025-11-18 14:00:00 UTC; 23min ago`, {instant: true}).break()

    // ==========================================
    // PHASE 4: GIT OPERATIONS
    // ==========================================
    .exec(() => setTask('GIT_FLOW', 40))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 300 })
    .type("cd projects/portfolio", { delay: 50 }).break()
    
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git fetch origin", { delay: 50 }).break()
    
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git diff --stat origin/main", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(` src/components/Navbar.vue | 12 ${C_GREEN}+++++++${C_RESET}${C_RED}-----${C_RESET}`, {instant: true}).break()
    .type(` src/style.css             |  5 ${C_GREEN}+++${C_RESET}${C_RED}--${C_RESET}`, {instant: true}).break()
    .type(` 2 files changed, 10 insertions(+), 7 deletions(-)`, {instant: true}).break()
    
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git log --oneline -n 3", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_YELLOW}8f2a1d${C_RESET} feat: add terminal loading screen`, {instant: true}).break()
    .type(`${C_YELLOW}2b4c9e${C_RESET} fix: responsive layout for mobile`, {instant: true}).break()
    .type(`${C_YELLOW}1a9d3f${C_RESET} docs: update README.md`, {instant: true}).break()

    // ==========================================
    // PHASE 5: NODE/NPM WORKFLOW (Build & Test)
    // ==========================================
    .exec(() => setTask('NPM_INSTALL', 50))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 300 })
    .type("npm install", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`added 24 packages, removed 12, changed 58 in 2s`, {instant: true}).break()
    .type(`${C_GREEN}23 packages are looking for funding${C_RESET}`, {instant: true}).break()
    
    .exec(() => setTask('LINT_CHECK', 55))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run lint", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`> portfolio@1.0.0 lint`, {instant: true}).break()
    .type(`> eslint . --ext .vue,.js,.jsx,.cjs,.mjs`, {instant: true}).break()
    .type(`${C_GREEN}✓ No problems found${C_RESET}`, {instant: true}).break()
    
    .exec(() => setTask('TYPE_CHECK', 60))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run type-check", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`> vue-tsc --noEmit`, {instant: true}).break()
    .type(`${C_GREEN}✓ All systems go${C_RESET}`, {instant: true}).break()

    .exec(() => setTask('UNIT_TEST', 65))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run test:coverage", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN} PASS ${C_RESET} src/components/Navbar.test.ts`, {instant: true}).break()
    .type(`${C_GREEN} PASS ${C_RESET} src/utils/helpers.test.ts`, {instant: true}).break()
    .type(`-------------------|---------|----------|---------|---------|`, {instant: true}).break()
    .type(`File               | % Stmts | % Branch | % Funcs | % Lines |`, {instant: true}).break()
    .type(`-------------------|---------|----------|---------|---------|`, {instant: true}).break()
    .type(`All files          |   ${C_GREEN}100.0${C_RESET} |    ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |`, {instant: true}).break()
    .type(`-------------------|---------|----------|---------|---------|`, {instant: true}).break()

    // ==========================================
    // PHASE 6: BUILD PROCESS (Vite)
    // ==========================================
    .exec(() => setTask('BUILDING', 75))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run build", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`> portfolio@1.0.0 build`, {instant: true}).break()
    .type(`> vite build`, {instant: true}).break()
    .type(`${C_CYAN}vite v5.0.8 ${C_GREEN}building for production...${C_RESET}`, {instant: true}).break()
    .type(`transforming...`, {instant: true}).break()
    .type(`${C_GREEN}✓${C_RESET} 68 modules transformed.`, {instant: true}).break()
    .type(`rendering chunks...`, {instant: true}).break()
    .type(`${C_GRAY}dist/index.html                  0.48 kB │ gzip:  0.30 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_GRAY}dist/assets/logo-XyZ123.svg      1.20 kB │ gzip:  0.65 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_GRAY}dist/assets/index-AbC987.css     8.40 kB │ gzip:  2.10 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_GRAY}dist/assets/index-Def456.js    142.50 kB │ gzip: 44.12 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}✓ built in 1.45s${C_RESET}`, {instant: true}).break()

    // ==========================================
    // PHASE 7: DEPLOYMENT & AUDIT
    // ==========================================
    .exec(() => setTask('VERIFY_BUILD', 80))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("ls -lh dist/", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`total 164K`, {instant: true}).break()
    .type(`drwxr-xr-x 2 heiznerd heiznerd 4.0K Nov 18 14:23 assets`, {instant: true}).break()
    .type(`-rw-r--r-- 1 heiznerd heiznerd  485 Nov 18 14:23 index.html`, {instant: true}).break()
    .type(`-rw-r--r-- 1 heiznerd heiznerd   24 Nov 18 14:23 _redirects`, {instant: true}).break()

    .exec(() => setTask('NETLIFY_DEP', 85))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("netlify deploy --prod", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Deploy path:        /home/heiznerd/projects/portfolio/dist`, {instant: true}).break()
    .type(`Deploying to main site URL...`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Finished hashing`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} CDN diffing files`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Uploading 4 files`, {instant: true}).break()
    .type(`${C_GREEN}Website Draft URL: https://heiznerd.is-a.dev${C_RESET}`, {instant: true}).break()

    .exec(() => setTask('HEALTH_CHK', 90))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("curl -I https://heiznerd.is-a.dev", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`HTTP/2 200`, {instant: true}).break()
    .type(`server: Netlify`, {instant: true}).break()
    .type(`content-type: text/html; charset=UTF-8`, {instant: true}).break()
    
    .exec(() => setTask('LIGHTHOUSE', 95))
    .type(`${C_YELLOW}Running Lighthouse Audit...${C_RESET}`, {instant: true}).break()
    .type(`Performance:   ${C_GREEN}100${C_RESET} 🟢`, {instant: true}).break()
    .type(`Accessibility: ${C_GREEN}100${C_RESET} 🟢`, {instant: true}).break()
    .type(`Best Practices:${C_GREEN}100${C_RESET} 🟢`, {instant: true}).break()
    .type(`SEO:           ${C_GREEN}100${C_RESET} 🟢`, {instant: true}).break()

    // ==========================================
    // PHASE 8: LAUNCH
    // ==========================================
    .exec(() => setTask('LAUNCHING', 100))
    .options({ speed: 40, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 300 })
    .type("./start.sh", { delay: 100 }).break()
    .type(`${C_GREEN}>> System Ready. Launching Portfolio GUI...${C_RESET}`, { instant: true })
    .pause(1000)
    .exec(() => {
      isTypingComplete.value = true;
      if (instance) instance.destroy(true);
      setTimeout(handleSkipLoading, 500);
    })
    .go();
};

onMounted(() => {
  if (typeit.value) {
    instance = new TypeIt(typeit.value, {});
    handleTyping(instance);
  }
  startMemSimulation();
  if (props.showSkipButton) document.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
  clearInterval(memInterval);
  if (instance) instance.destroy(true);
});
</script>

<style scoped>
/* Ubuntu Font Import */
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

.font-ubuntu { font-family: 'Ubuntu Mono', monospace; }

/* Minimal Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 10px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #2c001e; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: #5c5c5c; 
  border-radius: 2px; 
  border: 2px solid #2c001e;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E95420; }

/* Block Cursor Animation */
.block-cursor {
  display: inline-block;
  width: 8px;
  height: 1.2em;
  background-color: #ffffff;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: all 0.5s ease; }
.slide-up-enter-from { transform: translate(-50%, 100%); opacity: 0; }
</style>