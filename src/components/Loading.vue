<template>
  <Transition name="fade">
    <div
      v-if="!hide"
      class="loading-screen fixed inset-0 bg-[#0a0014] z-[9999] overflow-hidden font-ubuntu text-[13px] md:text-[14px] leading-relaxed text-[#f0f0f0]"
      @click="focusInput"
    >
      <!-- Terminal Header -->
      <div class="terminal-header fixed top-0 left-0 right-0 bg-[#1a0a1a] h-9 flex items-center px-4 border-b border-[#333] z-20 select-none shadow-sm">
        <div class="flex gap-2 absolute left-4">
          <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div class="flex-1 text-center text-[#999] text-xs font-mono flex justify-center items-center gap-2 opacity-80">
          <span class="text-green-500">➜</span> heiznerd@ubuntu: ~
        </div>
        <div class="absolute right-4 text-[10px] text-[#666] font-mono">tty1</div>
      </div>

      <!-- Terminal Content -->
      <div class="w-full h-full overflow-y-auto p-4 pt-14 pb-12 scroll-smooth custom-scrollbar" ref="terminalContainer">
        <div
          ref="typeit"
          class="terminal-content font-mono whitespace-pre-wrap"
        ></div>
        <div class="h-16"></div>
      </div>
      
      <!-- Minimalist Skip Button -->
      <button 
        @click.stop="handleSkipLoading"
        class="fixed bottom-6 right-6 px-4 py-2 bg-[#E95420] hover:bg-[#d84315] text-white font-mono text-xs font-bold rounded transition-colors duration-200 z-50 flex items-center gap-2 shadow-lg"
      >
        <span>SKIP BOOT</span>
        <span class="text-[10px] opacity-70">[SHIFT]</span>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TypeIt from 'typeit';

const props = defineProps({
  hide: { type: Boolean, default: false },
});

const emit = defineEmits(['hide-loading']);

const typeit = ref(null);
const terminalContainer = ref(null);
let instance = null;

// --- COLOR PALETTE ---
const C_RESET = '</span>';
const C_USER = '<span class="text-[#00ff9f] font-bold">'; 
const C_HOST = '<span class="text-[#00ff9f] font-bold">';
const C_DIR = '<span class="text-[#00d4ff] font-bold">';
const C_ROOT = '<span class="text-[#ff6633] font-bold">';
const C_TIME = '<span class="text-[#666]">';
const C_GREEN = '<span class="text-[#00ff00] font-bold">';
const C_RED = '<span class="text-[#ff3366] font-bold">';
const C_CYAN = '<span class="text-[#00ffff] font-bold">';
const C_YELLOW = '<span class="text-[#ffff00] font-bold">';
const C_WHITE = '<span class="text-[#ffffff]">';
const C_GRAY = '<span class="text-[#555555]">';
const C_PURPLE = '<span class="text-[#cc99ff] font-bold">';
const C_ORANGE = '<span class="text-[#ff9933] font-bold">';

// --- HELPERS ---
const getTimestamp = (val) => `${C_TIME}[${val.toFixed(6).padStart(12, ' ')}]${C_RESET}`;
const getOkLine = (msg) => `${C_GREEN}[  OK  ]${C_RESET} ${C_WHITE}${msg}${C_RESET}`;
const getInfoLine = (msg) => `${C_CYAN}[ INFO ]${C_RESET} ${C_WHITE}${msg}${C_RESET}`;
const getPrompt = (path = '~') => `${C_USER}heiznerd${C_RESET}@${C_HOST}ubuntu${C_RESET}:${C_DIR}${path}${C_RESET}$ `;

const scrollToBottom = () => {
  if (terminalContainer.value) {
    terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
  }
};

const handleSkipLoading = () => {
  try {
    if (instance) { instance.destroy(true); instance = null; }
  } catch (error) { console.error(error); } 
  finally { emit('hide-loading'); }
};

const handleKeyPress = (event) => {
  if (event.key === 'Shift' || event.key === 'Enter') handleSkipLoading();
};

const focusInput = () => {
  // Keep focus for key events if needed
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

    // PHASE 1: BIOS & KERNEL
    .type(`${C_CYAN}╔═══════════════════════════════════════════════════════════════════════╗${C_RESET}`, { instant: true }).break()
    .type(`${C_CYAN}║${C_RESET}                  ${C_ORANGE}UEFI BIOS v2.85 - POST Screen${C_RESET}                       ${C_CYAN}║${C_RESET}`, { instant: true }).break()
    .type(`${C_CYAN}╚═══════════════════════════════════════════════════════════════════════╝${C_RESET}`, { instant: true }).break()
    .break()
    .type(`${C_WHITE}Initializing Hardware...${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} CPU: AMD Ryzen 9 5950X (32 Threads) @ 3.4GHz - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} RAM: 32GB DDR4-3600 Dual Channel - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} GPU: NVIDIA GeForce RTX 3080 10GB - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} NVMe: Samsung 980 PRO 2TB - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .break()

    .type(`${C_YELLOW}⚡ Loading GRUB Bootloader...${C_RESET}`, { instant: true }).break()
    .type(`${C_GRAY}Booting Ubuntu 22.04.3 LTS (GNU/Linux 6.5.0-14-generic x86_64)${C_RESET}`, { instant: true }).break()
    .break()

    .type(`${getTimestamp(0.000000)} ${C_PURPLE}Linux version 6.5.0-14-generic${C_RESET} (buildd@lcy02-amd64-032)`, { instant: true }).break()
    .type(`${getTimestamp(0.000124)} Command line: BOOT_IMAGE=/vmlinuz root=UUID=a8b9c0d1-e2f3 ro quiet splash`, { instant: true }).break()
    .type(`${getTimestamp(0.004567)} Memory: 32829440K/33554432K available (16384K kernel, 3456K rwdata, 8912K rodata, 2048K init)`, { instant: true }).break()
    .type(`${getTimestamp(0.005892)} SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=32, Nodes=1`, { instant: true }).break()
    
    .type(`${getTimestamp(0.125000)} ${C_CYAN}Calibrating delay loop...${C_RESET} 6789.23 BogoMIPS (lpj=13578460)`, { instant: true }).break()
    .type(`${getTimestamp(0.234567)} ACPI: Core revision 20240321`, { instant: true }).break()
    .type(`${getTimestamp(0.345678)} pci 0000:00:00.0: [1022:1480] AMD Starship/Matisse Root Complex`, { instant: true }).break()
    .type(`${getTimestamp(0.346234)} pci 0000:01:00.0: [10de:2206] NVIDIA GA102 [GeForce RTX 3080]`, { instant: true }).break()
    
    .type(`${getTimestamp(0.890123)} scsi 0:0:0:0: Direct-Access NVMe Samsung 980 PRO 2TB 5B2Q PQ: 0 ANSI: 5`, { instant: true }).break()
    .type(`${getTimestamp(1.023456)} EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode`, { instant: true }).break()
    
    .type(getOkLine("Started Forward Password Requests to Wall Directory Watch"), { instant: true }).break()
    .type(getOkLine("Created slice Slice /system/modprobe"), { instant: true }).break()
    .type(getOkLine("Created slice User and Session Slice"), { instant: true }).break()
    .type(getOkLine("Reached target Local File Systems (Pre)"), { instant: true }).break()
    .type(getOkLine("Mounted /boot/efi"), { instant: true }).break()
    .type(getOkLine("Started systemd-journald.service - Journal Service"), { instant: true }).break()
    .type(getInfoLine("Starting Network Manager..."), { instant: true }).break()
    .type(getOkLine("Started NetworkManager.service - Network Manager"), { instant: true }).break()
    .type(getInfoLine("Starting Docker Application Container Engine..."), { instant: true }).break()
    .type(getOkLine("Started docker.service - Docker Application Container Engine"), { instant: true }).break()
    .type(getOkLine("Started gdm.service - GNOME Display Manager"), { instant: true }).break()
    .type(getOkLine("Reached target graphical.target - Graphical Interface"), { instant: true }).break()
    .break()
    .type(`${C_ROOT}╔═══════════════════════════════════════════════════════════════════════╗${C_RESET}`, { instant: true }).break()
    .type(`${C_ROOT}║${C_RESET}                ${C_WHITE}Welcome to ${C_ROOT}Ubuntu 22.04.3 LTS ${C_GRAY}(Jammy Jellyfish)${C_RESET}         ${C_ROOT}║${C_RESET}`, { instant: true }).break()
    .type(`${C_ROOT}╚═══════════════════════════════════════════════════════════════════════╝${C_RESET}`, { instant: true }).break()
    .break()

    // PHASE 2: LOGIN & FASTFETCH
    .options({ speed: 30, lifeLike: true }) 
    .type('ubuntu login: ', { delay: 200 }).type('heiznerd').break()
    .type('Password: ', { delay: 200 }).type('**************').break()
    .type(`${C_GREEN}✓ Authentication successful${C_RESET}`, { instant: true }).break()
    .type(`Last login: Wed Nov 18 09:15:32 2025 from 192.168.1.105`, { instant: true }).break()
    .break()

    .type(getPrompt('~'), { instant: true, delay: 400 })
    .type("neofetch --ascii_distro ubuntu", { delay: 80 }).break()
    .options({ speed: 1, lifeLike: false })
    .break()
    
    // UBUNTU ASCII ART
    .type(`${C_ROOT}                .-/+oossssoo+/-.                ${C_USER}heiznerd${C_RESET}@${C_ROOT}ubuntu-dev-server${C_RESET}`, {instant: true}).break()
    .type(`${C_ROOT}            ':+ssssssssssssssssss+:'           ${C_GRAY}─────────────────────────────────${C_RESET}`, {instant: true}).break()
    .type(`${C_ROOT}          -+ssssssssssssssssssyyssss+-         ${C_ROOT}OS${C_RESET}:        Ubuntu 22.04.3 LTS x86_64`, {instant: true}).break()
    .type(`${C_ROOT}        .ossssssssssssssssssdMMMNysssso.       ${C_ROOT}Host${C_RESET}:      Custom Workstation v2.1`, {instant: true}).break()
    .type(`${C_ROOT}       /ssssssssssshdmmNNmmyNMMMMhssssss/      ${C_ROOT}Kernel${C_RESET}:    6.5.0-14-generic`, {instant: true}).break()
    .type(`${C_ROOT}      +ssssssssshmydMMMMMMMNddddyssssssss+     ${C_ROOT}Uptime${C_RESET}:    2 hours, 47 mins`, {instant: true}).break()
    .type(`${C_ROOT}     /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    ${C_ROOT}Packages${C_RESET}:  2104 (dpkg), 18 (snap)`, {instant: true}).break()
    .type(`${C_ROOT}    .ssssssssdMMMNhsssssssssshNMMMdssssssss.   ${C_ROOT}Shell${C_RESET}:      bash 5.1.16`, {instant: true}).break()
    .type(`${C_ROOT}    +sssshhhyNMMNyssssssssssssyNMMMysssssss+   ${C_ROOT}Resolution${C_RESET}: 2560x1440, 1920x1080`, {instant: true}).break()
    .type(`${C_ROOT}    ossyNMMMNyMMhsssssssssssssshmmmhssssssso   ${C_ROOT}DE${C_RESET}:        GNOME 42.9`, {instant: true}).break()
    .type(`${C_ROOT}    ossyNMMMNyMMhsssssssssssssshmmmhssssssso   ${C_ROOT}WM${C_RESET}:        Mutter (Wayland)`, {instant: true}).break()
    .type(`${C_ROOT}    +sssshhhyNMMNyssssssssssssyNMMMysssssss+   ${C_ROOT}Theme${C_RESET}:      Yaru-purple-dark [GTK3]`, {instant: true}).break()
    .type(`${C_ROOT}    .ssssssssdMMMNhsssssssssshNMMMdssssssss.   ${C_ROOT}Icons${C_RESET}:      Papirus-Dark [GTK3]`, {instant: true}).break()
    .type(`${C_ROOT}     /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/    ${C_ROOT}Terminal${C_RESET}:  gnome-terminal 3.44.0`, {instant: true}).break()
    .type(`${C_ROOT}      +sssssssssdmydMMMMMMMMddddyssssssss+     ${C_ROOT}CPU${C_RESET}:       AMD Ryzen 9 5950X (32) @ 4.9GHz`, {instant: true}).break()
    .type(`${C_ROOT}       /ssssssssssshdmNNNNmyNMMMMhssssss/      ${C_ROOT}GPU${C_RESET}:       NVIDIA GeForce RTX 3080 10GB`, {instant: true}).break()
    .type(`${C_ROOT}        .ossssssssssssssssssdMMMNysssso.       ${C_ROOT}Memory${C_RESET}:    6847MiB / 32768MiB`, {instant: true}).break()
    .type(`${C_ROOT}          -+sssssssssssssssssyyyssss+-         ${C_ROOT}Disk (/)${C_RESET}:  528G / 1.9T (28%)`, {instant: true}).break()
    .type(`${C_ROOT}            ':+ssssssssssssssssss+:'           ${C_ROOT}Local IP${C_RESET}:  192.168.1.105`, {instant: true}).break()
    .type(`${C_ROOT}                .-/+oossssoo+/-.               ${C_ROOT}Public IP${C_RESET}: 203.113.xxx.xxx`, {instant: true}).break()
    .break()
    .type(`                                          ${C_GRAY}████${C_RED}████${C_GREEN}████${C_YELLOW}████${C_DIR}████${C_PURPLE}████${C_CYAN}████${C_WHITE}████${C_RESET}`, {instant: true}).break()
    .break()

    // PHASE 3: SYSTEM DIAGNOSTICS
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 300 })
    .type("htop --version && echo '---' && uptime", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`htop 3.2.1`, {instant: true}).break()
    .type(`---`, {instant: true}).break()
    .type(` 14:47:32 up 2:47, 1 user, load average: 0.52, 0.58, 0.59`, {instant: true}).break()
    
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("sensors | grep -E '(Core|temp)'", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Tctl:         ${C_GREEN}+52.0°C${C_RESET}`, {instant: true}).break()
    .type(`Tccd1:        ${C_GREEN}+48.5°C${C_RESET}`, {instant: true}).break()
    .type(`Tccd2:        ${C_GREEN}+49.2°C${C_RESET}`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("nvidia-smi --query-gpu=temperature.gpu,utilization.gpu --format=csv,noheader", { delay: 40 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN}45${C_RESET}, ${C_CYAN}15 %${C_RESET}`, {instant: true}).break()

    // PHASE 4: DOCKER
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 300 })
    .type("docker --version && docker-compose --version", { delay: 40 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Docker version 24.0.7, build afdd53b`, {instant: true}).break()
    .type(`Docker Compose version v2.23.3`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`NAMES              STATUS              PORTS`, {instant: true}).break()
    .type(`${C_GREEN}mongodb${C_RESET}             Up 2 hours          0.0.0.0:27017->27017/tcp`, {instant: true}).break()
    .type(`${C_GREEN}redis${C_RESET}               Up 2 hours          0.0.0.0:6379->6379/tcp`, {instant: true}).break()
    .type(`${C_GREEN}postgres${C_RESET}            Up 2 hours          0.0.0.0:5432->5432/tcp`, {instant: true}).break()
    .type(`${C_GREEN}nginx_proxy${C_RESET}         Up 2 hours          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp`, {instant: true}).break()
    .type(`${C_GREEN}portfolio_api${C_RESET}       Up 45 minutes       0.0.0.0:3000->3000/tcp`, {instant: true}).break()

    // PHASE 5: GIT WORKFLOW
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 300 })
    .type("cd ~/projects/portfolio && pwd", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`/home/heiznerd/projects/portfolio`, {instant: true}).break()
    
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git status -sb", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_CYAN}## main...origin/main${C_RESET}`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git fetch --all --prune", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Fetching origin`, {instant: true}).break()
    .type(`From github.com:heiznerd/portfolio`, {instant: true}).break()
    .type(` * [new branch]      feature/terminal-ui -> origin/feature/terminal-ui`, {instant: true}).break()
    
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git log --graph --oneline --all -n 5", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_YELLOW}*${C_RESET} ${C_YELLOW}a8f9d2e${C_RESET} ${C_GREEN}(${C_RESET}${C_CYAN}HEAD -> ${C_RESET}${C_GREEN}main${C_RESET}${C_GREEN}, ${C_RESET}${C_RED}origin/main${C_RESET}${C_GREEN})${C_RESET} feat: enhanced terminal loading animation`, {instant: true}).break()
    .type(`${C_YELLOW}*${C_RESET} ${C_YELLOW}b7e3c1f${C_RESET} refactor: optimize component structure`, {instant: true}).break()
    .type(`${C_YELLOW}|${C_RESET}${C_PURPLE}\\${C_RESET}`, {instant: true}).break()
    .type(`${C_YELLOW}|${C_RESET} ${C_PURPLE}*${C_RESET} ${C_YELLOW}9d4a5b2${C_RESET} ${C_GREEN}(${C_RESET}${C_RED}origin/feature/terminal-ui${C_RESET}${C_GREEN})${C_RESET} wip: add terminal header`, {instant: true}).break()
    .type(`${C_YELLOW}|${C_PURPLE}/${C_RESET}`, {instant: true}).break()
    .type(`${C_YELLOW}*${C_RESET} ${C_YELLOW}c2f8e9a${C_RESET} fix: mobile responsive layout`, {instant: true}).break()

    // PHASE 6: NPM
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 300 })
    .type("node --version && npm --version", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`v20.10.0`, {instant: true}).break()
    .type(`10.2.5`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm install --silent", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`added 12 packages, removed 5 packages, changed 34 packages in 3.2s`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}42 packages${C_RESET} are looking for funding`, {instant: true}).break()
    .type(`  run ${C_CYAN}npm fund${C_RESET} for details`, {instant: true}).break()

    // PHASE 7: BUILD
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 300 })
    .type("npm run build -- --mode production", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`> portfolio@1.0.0 build`, {instant: true}).break()
    .type(`> vite build --mode production`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}vite v5.0.11${C_RESET} ${C_GREEN}building for production...${C_RESET}`, {instant: true}).break()
    .type(`${C_GRAY}transforming (1) index.html${C_RESET}`, {instant: true}).break()
    .type(`${C_GRAY}transforming (34) src/components/Loading.vue${C_RESET}`, {instant: true}).break()
    .type(`${C_GRAY}transforming (68) node_modules/vue/dist/vue.runtime.esm-bundler.js${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}✓${C_RESET} ${C_GREEN}142 modules${C_RESET} transformed.`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}rendering chunks...${C_RESET}`, {instant: true}).break()
    .type(`${C_CYAN}computing gzip size...${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN}dist/index.html                    ${C_RESET}${C_GRAY}0.52 kB │ gzip:  0.32 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}dist/assets/logo-c7f2d8a9.svg      ${C_RESET}${C_GRAY}1.23 kB │ gzip:  0.67 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_CYAN}dist/assets/index-9f7a3b2e.css     ${C_RESET}${C_GRAY}12.45 kB │ gzip:  3.21 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_CYAN}dist/assets/vendor-d4e8f1c5.js     ${C_RESET}${C_GRAY}89.67 kB │ gzip: 32.14 kB${C_RESET}`, {instant: true}).break()
    .type(`${C_CYAN}dist/assets/index-a2b9c7f3.js      ${C_RESET}${C_GRAY}67.89 kB │ gzip: 24.56 kB${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN}✓ built in 2.34s${C_RESET}`, {instant: true}).break()

    // PHASE 8: DEPLOY
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("netlify deploy --prod --dir=dist", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}Deploying to production site...${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`Deploy path:        ${C_GRAY}/home/heiznerd/projects/portfolio/dist${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Deploy is live!`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN}Unique Deploy URL:${C_RESET} https://a8f9d2e3--heiznerd.netlify.app`, {instant: true}).break()
    .type(`${C_CYAN}Website URL:      ${C_RESET} ${C_GREEN}https://heiznerd.is-a.dev${C_RESET}`, {instant: true}).break()

    // PHASE 9: FINALIZING
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("echo 'System Ready. Initialization complete.'", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN}System Ready.${C_RESET}`, { instant: true }).break()
    
    .pause(800)
    .exec(handleSkipLoading)
    .go();
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress);
  
  if (typeit.value) {
    instance = new TypeIt(typeit.value, {
      strings: [],
      cursor: true,
      html: true,
      nextStringDelay: 0,
      loop: false,
    });
    handleTyping(instance);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
  if (instance) {
    instance.destroy();
  }
});
</script>

<style>
/* Block Cursor Animation */
:deep(.block-cursor) {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background-color: #00ff9f;
  vertical-align: middle;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Minimalist Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>