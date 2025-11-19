<template>
  <Transition name="fade">
    <div
      v-if="!hide"
      class="loading-screen flex bg-[#0a0014] w-screen h-screen fixed break-all left-0 top-0 z-[9999] overflow-hidden font-ubuntu"
      @click="focusInput"
    >
      <div class="terminal-header fixed top-0 left-0 right-0 bg-[#1a0a1a] h-9 flex items-center px-4 border-b border-[#E95420] z-20 select-none shadow-[0_4px_12px_rgba(233,84,32,0.3)]">
        <div class="flex gap-2 absolute left-4">
          <div class="w-3.5 h-3.5 rounded-full bg-[#E95420] hover:bg-[#ff6633] transition-colors shadow-[0_0_8px_rgba(233,84,32,0.5)]"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#772953] hover:bg-[#993366] transition-colors"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#AEA79F] hover:bg-[#ccc5bd] transition-colors"></div>
        </div>
        <div class="flex-1 text-center text-[#E95420] text-sm font-bold font-mono flex justify-center items-center gap-2">
          <span class="opacity-70"></span> heiznerd <span class="opacity-70">@</span> terminal <span class="opacity-70"></span>
        </div>
        <div class="absolute right-4 text-xs text-[#E95420] font-mono opacity-70">tty1 — 120x40</div>
      </div>

      <div class="w-full h-full overflow-y-auto p-4 pt-14 scroll-smooth custom-scrollbar" ref="terminalContainer">
        <div
          ref="typeit"
          class="terminal-content font-mono text-[#f0f0f0] text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap"
        ></div>
        <div class="h-32"></div>
      </div>
      
      <Transition name="slide-up">
        <button
          v-if="showSkipButton && !hide && !isTypingComplete"
          @click="handleSkipLoading"
          class="skip-button fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E95420] to-[#ff6633] text-white px-8 py-3 rounded-md font-mono text-xs tracking-widest hover:shadow-[0_0_20px_rgba(233,84,32,0.6)] transition-all duration-300 z-50 uppercase border border-[#ff8855] animate-pulse-subtle"
        >
          <span class="flex items-center gap-2">
            <span></span>
            [ SHIFT ] SKIP BOOT SEQUENCE
            <span></span>
          </span>
        </button>
      </Transition>

      <div class="fixed top-12 right-4 bg-[#1a0a1a] border border-[#E95420] rounded px-3 py-2 text-[#E95420] font-mono text-[10px] md:text-xs flex flex-col gap-1 opacity-90 select-none pointer-events-none shadow-[0_0_15px_rgba(233,84,32,0.3)]">
        <div class="flex justify-between gap-4">
          <span class="opacity-70">TASK:</span>
          <span class="font-bold">{{ currentTask }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="opacity-70">PROC:</span>
          <span class="text-[10px]">{{ progressText }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="opacity-70">MEM:</span>
          <span>{{ memoryUsage }}MB</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="opacity-70">CPU:</span>
          <span>{{ cpuUsage }}%</span>
        </div>
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
const currentTask = ref('BIOS_INIT');
const isTypingComplete = ref(false);
const memoryUsage = ref(256);
const cpuUsage = ref(12);
let instance = null;
let memInterval = null;
let cpuInterval = null;

// --- ENHANCED COLOR PALETTE ---
const C_RESET = '</span>';
const C_USER = '<span class="text-[#00ff9f] font-bold drop-shadow-[0_0_8px_rgba(0,255,159,0.5)]">'; 
const C_HOST = '<span class="text-[#00ff9f] font-bold">';
const C_DIR = '<span class="text-[#00d4ff] font-bold drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">';
const C_ROOT = '<span class="text-[#ff6633] font-bold drop-shadow-[0_0_10px_rgba(255,102,51,0.5)]">';
const C_TIME = '<span class="text-[#888888]">';
const C_GREEN = '<span class="text-[#00ff00] font-bold">';
const C_RED = '<span class="text-[#ff3366] font-bold">';
const C_CYAN = '<span class="text-[#00ffff] font-bold">';
const C_YELLOW = '<span class="text-[#ffff00] font-bold">';
const C_WHITE = '<span class="text-[#ffffff]">';
const C_GRAY = '<span class="text-[#555555]">';
const C_PURPLE = '<span class="text-[#cc99ff] font-bold">';
const C_ORANGE = '<span class="text-[#ff9933] font-bold">';
const C_PINK = '<span class="text-[#ff66cc]">';

// --- HELPERS ---
const getTimestamp = (val) => `${C_TIME}[${val.toFixed(6).padStart(12, ' ')}]${C_RESET}`;
const getOkLine = (msg) => `${C_GREEN}[  OK  ]${C_RESET} ${C_WHITE}${msg}${C_RESET}`;
const getInfoLine = (msg) => `${C_CYAN}[ INFO ]${C_RESET} ${C_WHITE}${msg}${C_RESET}`;
const getWarnLine = (msg) => `${C_YELLOW}[ WARN ]${C_RESET} ${C_WHITE}${msg}${C_RESET}`;
const getPrompt = (path = '~') => `${C_USER}heiznerd${C_RESET}@${C_HOST}ubuntu${C_RESET}:${C_DIR}${path}${C_RESET}$ `;

const progressText = computed(() => {
  const bars = Math.floor(currentStep.value / 5);
  const filled = '█'.repeat(bars);
  const empty = '░'.repeat(20 - bars);
  return `[${filled}${empty}] ${currentStep.value}%`;
});

const handleSkipLoading = () => {
  try {
    document.removeEventListener('keydown', handleKeyPress);
    clearInterval(memInterval);
    clearInterval(cpuInterval);
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

const focusInput = () => {
  if (terminalContainer.value) {
    terminalContainer.value.focus();
  }
};

// Enhanced system monitoring
const startSystemMonitoring = () => {
  memInterval = setInterval(() => {
    const change = Math.floor(Math.random() * 30) - 10;
    memoryUsage.value = Math.min(Math.max(memoryUsage.value + change, 200), 8192);
  }, 400);

  cpuInterval = setInterval(() => {
    const change = Math.floor(Math.random() * 20) - 8;
    cpuUsage.value = Math.min(Math.max(cpuUsage.value + change, 5), 95);
  }, 600);
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
    .exec(() => setTask('BIOS_POST', 0))
    .type(`${C_CYAN}╔═══════════════════════════════════════════════════════════════════════╗${C_RESET}`, { instant: true }).break()
    .type(`${C_CYAN}║${C_RESET}                  ${C_ORANGE}UEFI BIOS v2.85 - POST Screen${C_RESET}                       ${C_CYAN}║${C_RESET}`, { instant: true }).break()
    .type(`${C_CYAN}╚═══════════════════════════════════════════════════════════════════════╝${C_RESET}`, { instant: true }).break()
    .break()
    .type(`${C_WHITE}Initializing Hardware...${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} CPU: AMD Ryzen 9 5950X (32 Threads) @ 3.4GHz - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} RAM: 32GB DDR4-3600 Dual Channel - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} GPU: NVIDIA GeForce RTX 3080 10GB - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} NVMe: Samsung 980 PRO 2TB - ${C_GREEN}OK${C_RESET}`, { instant: true }).break()
    .type(`${C_GREEN}✓${C_RESET} Network: Intel I225-V 2.5Gb Ethernet - ${C_GREEN}LINK UP${C_RESET}`, { instant: true }).break()
    .break()

    .exec(() => setTask('KERNEL_LOAD', 3))
    .type(`${C_YELLOW}⚡ Loading GRUB Bootloader...${C_RESET}`, { instant: true }).break()
    .type(`${C_GRAY}Booting Ubuntu 22.04.3 LTS (GNU/Linux 6.5.0-14-generic x86_64)${C_RESET}`, { instant: true }).break()
    .break()

    .type(`${getTimestamp(0.000000)} ${C_PURPLE}Linux version 6.5.0-14-generic${C_RESET} (buildd@lcy02-amd64-032)`, { instant: true }).break()
    .type(`${getTimestamp(0.000124)} Command line: BOOT_IMAGE=/vmlinuz root=UUID=a8b9c0d1-e2f3 ro quiet splash`, { instant: true }).break()
    .type(`${getTimestamp(0.001245)} x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point'`, { instant: true }).break()
    .type(`${getTimestamp(0.001876)} x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'`, { instant: true }).break()
    .type(`${getTimestamp(0.002543)} x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'`, { instant: true }).break()
    .type(`${getTimestamp(0.003221)} x86/fpu: xstate_offset[2]: 576, xstate_sizes[2]: 256`, { instant: true }).break()
    .type(`${getTimestamp(0.004567)} Memory: 32829440K/33554432K available (16384K kernel, 3456K rwdata, 8912K rodata, 2048K init)`, { instant: true }).break()
    .type(`${getTimestamp(0.005892)} SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=32, Nodes=1`, { instant: true }).break()
    .type(`${getTimestamp(0.007234)} Dentry cache hash table entries: 4194304 (order: 13, 33554432 bytes)`, { instant: true }).break()
    .type(`${getTimestamp(0.009876)} Inode-cache hash table entries: 2097152 (order: 12, 16777216 bytes)`, { instant: true }).break()
    
    .exec(() => setTask('HW_DETECT', 8))
    .type(`${getTimestamp(0.125000)} ${C_CYAN}Calibrating delay loop...${C_RESET} 6789.23 BogoMIPS (lpj=13578460)`, { instant: true }).break()
    .type(`${getTimestamp(0.234567)} ACPI: Core revision 20240321`, { instant: true }).break()
    .type(`${getTimestamp(0.235123)} ACPI: 16 ACPI AML tables successfully acquired and loaded`, { instant: true }).break()
    .type(`${getTimestamp(0.345678)} pci 0000:00:00.0: [1022:1480] AMD Starship/Matisse Root Complex`, { instant: true }).break()
    .type(`${getTimestamp(0.346234)} pci 0000:01:00.0: [10de:2206] NVIDIA GA102 [GeForce RTX 3080]`, { instant: true }).break()
    .type(`${getTimestamp(0.347890)} pci 0000:02:00.0: [144d:a809] Samsung NVMe SSD Controller`, { instant: true }).break()
    .type(`${getTimestamp(0.456789)} usb 1-1: new high-speed USB device number 2 using xhci_hcd`, { instant: true }).break()
    .type(`${getTimestamp(0.567890)} usb 1-1: Product: Logitech G Pro X Superlight`, { instant: true }).break()
    .type(`${getTimestamp(0.678901)} usb 2-1: new full-speed USB device number 3 using xhci_hcd`, { instant: true }).break()
    .type(`${getTimestamp(0.789012)} usb 2-1: Product: Keychron K2 Mechanical Keyboard`, { instant: true }).break()
    
    .exec(() => setTask('STORAGE_INIT', 12))
    .type(`${getTimestamp(0.890123)} scsi 0:0:0:0: Direct-Access NVMe Samsung 980 PRO 2TB 5B2Q PQ: 0 ANSI: 5`, { instant: true }).break()
    .type(`${getTimestamp(0.901234)} sd 0:0:0:0: [nvme0n1] 3907029168 512-byte logical blocks (2.00 TB)`, { instant: true }).break()
    .type(`${getTimestamp(0.912345)} sd 0:0:0:0: [nvme0n1] Write Protect is off`, { instant: true }).break()
    .type(`${getTimestamp(1.023456)} EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode`, { instant: true }).break()
    
    .exec(() => setTask('SYSTEMD', 18))
    .type(getOkLine("Started Forward Password Requests to Wall Directory Watch"), { instant: true }).break()
    .type(getOkLine("Created slice Slice /system/modprobe"), { instant: true }).break()
    .type(getOkLine("Created slice User and Session Slice"), { instant: true }).break()
    .type(getOkLine("Reached target Local File Systems (Pre)"), { instant: true }).break()
    .type(getOkLine("Reached target Local Encrypted Volumes"), { instant: true }).break()
    .type(getOkLine("Mounted /boot/efi"), { instant: true }).break()
    .type(getOkLine("Mounted /dev/hugepages"), { instant: true }).break()
    .type(getOkLine("Started systemd-journald.service - Journal Service"), { instant: true }).break()
    .type(getOkLine("Started systemd-udevd.service - Rule-based Manager for Device Events"), { instant: true }).break()
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
    .exec(() => setTask('USER_AUTH', 22))
    .type('ubuntu login: ', { delay: 200 }).type('heiznerd').break()
    .type('Password: ', { delay: 200 }).type('**************').break()
    .type(`${C_GREEN}✓ Authentication successful${C_RESET}`, { instant: true }).break()
    .type(`Last login: Wed Nov 18 09:15:32 2025 from 192.168.1.105`, { instant: true }).break()
    .break()

    .exec(() => setTask('LOAD_SHELL', 25))
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
    .exec(() => setTask('SYS_DIAG', 30))
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

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("cat /proc/meminfo | grep -E '(MemTotal|MemAvailable|SwapTotal)'", { delay: 40 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`MemTotal:       33554432 kB`, {instant: true}).break()
    .type(`MemAvailable:   25706988 kB`, {instant: true}).break()
    .type(`SwapTotal:       2097152 kB`, {instant: true}).break()

    .exec(() => setTask('NETWORK_CHK', 35))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("ip -br addr show | grep UP", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`lo                UNKNOWN        127.0.0.1/8 ::1/128`, {instant: true}).break()
    .type(`enp5s0            UP             192.168.1.105/24 fe80::a8b9:c0d1:e2f3:4567/64`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("ping -c 3 8.8.8.8 | tail -n 2", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`3 packets transmitted, 3 received, ${C_GREEN}0% packet loss${C_RESET}, time 2003ms`, {instant: true}).break()
    .type(`rtt min/avg/max/mdev = 8.234/9.156/10.789/1.023 ms`, {instant: true}).break()

    // PHASE 4: DOCKER
    .exec(() => setTask('DOCKER_MGMT', 42))
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

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}'", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`NAME                CPU %      MEM USAGE`, {instant: true}).break()
    .type(`mongodb             ${C_CYAN}2.45%${C_RESET}      ${C_CYAN}512MiB / 32GiB${C_RESET}`, {instant: true}).break()
    .type(`redis               ${C_CYAN}0.89%${C_RESET}      ${C_CYAN}45MiB / 32GiB${C_RESET}`, {instant: true}).break()
    .type(`postgres            ${C_CYAN}1.23%${C_RESET}      ${C_CYAN}256MiB / 32GiB${C_RESET}`, {instant: true}).break()
    .type(`nginx_proxy         ${C_CYAN}0.12%${C_RESET}      ${C_CYAN}12MiB / 32GiB${C_RESET}`, {instant: true}).break()
    .type(`portfolio_api       ${C_CYAN}3.67%${C_RESET}      ${C_CYAN}128MiB / 32GiB${C_RESET}`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~'), { instant: true, delay: 200 })
    .type("systemctl is-active nginx docker", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN}active${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}active${C_RESET}`, {instant: true}).break()

    // PHASE 5: GIT WORKFLOW
    .exec(() => setTask('GIT_OPS', 50))
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
    .type(`${C_YELLOW}*${C_RESET} ${C_YELLOW}e5b1d7c${C_RESET} docs: update installation guide`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("git diff --stat HEAD~1", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(` src/components/Loading.vue      | 245 ${C_GREEN}++++++++++++++++++++++${C_RESET}${C_RED}----------------${C_RESET}`, {instant: true}).break()
    .type(` src/assets/styles/terminal.css  |  89 ${C_GREEN}+++++++++${C_RESET}${C_RED}------${C_RESET}`, {instant: true}).break()
    .type(` package.json                    |   3 ${C_GREEN}+${C_RESET}${C_RED}-${C_RESET}`, {instant: true}).break()
    .type(` 3 files changed, 198 insertions(+), 139 deletions(-)`, {instant: true}).break()

    // PHASE 6: NPM
    .exec(() => setTask('PKG_MGMT', 58))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 300 })
    .type("node --version && npm --version", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`v20.10.0`, {instant: true}).break()
    .type(`10.2.5`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm outdated | head -n 5", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Package          Current  Wanted  Latest  Location`, {instant: true}).break()
    .type(`vite             5.0.8    5.0.11  5.0.11  portfolio`, {instant: true}).break()
    .type(`vue              3.3.13   3.4.0   3.4.0   portfolio`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm install --silent", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`added 12 packages, removed 5 packages, changed 34 packages in 3.2s`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}42 packages${C_RESET} are looking for funding`, {instant: true}).break()
    .type(`  run ${C_CYAN}npm fund${C_RESET} for details`, {instant: true}).break()

    .exec(() => setTask('CODE_QUALITY', 63))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run lint -- --max-warnings=0", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`> portfolio@1.0.0 lint`, {instant: true}).break()
    .type(`> eslint . --ext .vue,.js,.jsx,.cjs,.mjs --max-warnings=0`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} No ESLint warnings or errors`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run format:check", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Checking formatting...`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} All files formatted correctly`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run type-check", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`> vue-tsc --noEmit --skipLibCheck`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Type checking complete - no errors`, {instant: true}).break()

    // PHASE 7: TESTING
    .exec(() => setTask('TESTING', 68))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("npm run test:unit -- --coverage", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}RUN${C_RESET}  v1.0.0 ${C_GRAY}/home/heiznerd/projects/portfolio${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN} ✓ ${C_RESET}${C_GRAY}src/components/Navbar.test.ts${C_RESET} ${C_GRAY}(4 tests)${C_RESET} ${C_GREEN}128ms${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN} ✓ ${C_RESET}${C_GRAY}src/components/Loading.test.ts${C_RESET} ${C_GRAY}(6 tests)${C_RESET} ${C_GREEN}234ms${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN} ✓ ${C_RESET}${C_GRAY}src/utils/helpers.test.ts${C_RESET} ${C_GRAY}(12 tests)${C_RESET} ${C_GREEN}89ms${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN} ✓ ${C_RESET}${C_GRAY}src/composables/useTheme.test.ts${C_RESET} ${C_GRAY}(3 tests)${C_RESET} ${C_GREEN}56ms${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN} Test Files ${C_RESET} ${C_GREEN}4 passed${C_RESET} ${C_GRAY}(4)${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}      Tests ${C_RESET} ${C_GREEN}25 passed${C_RESET} ${C_GRAY}(25)${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}   Duration ${C_RESET} ${C_GREEN}507ms${C_RESET} ${C_GRAY}(transform 89ms, setup 0ms, collect 156ms, tests 262ms)${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}% Coverage report from v8${C_RESET}`, {instant: true}).break()
    .type(`────────────────────|─────────|──────────|─────────|─────────|─────────────────`, {instant: true}).break()
    .type(`File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines`, {instant: true}).break()
    .type(`────────────────────|─────────|──────────|─────────|─────────|─────────────────`, {instant: true}).break()
    .type(`All files           |   ${C_GREEN}98.45${C_RESET} |    ${C_GREEN}96.23${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}98.45${C_RESET} |                 `, {instant: true}).break()
    .type(` components/        |   ${C_GREEN}100.0${C_RESET} |    ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |                 `, {instant: true}).break()
    .type(`  Loading.vue       |   ${C_GREEN}100.0${C_RESET} |    ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |                 `, {instant: true}).break()
    .type(`  Navbar.vue        |   ${C_GREEN}100.0${C_RESET} |    ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}100.0${C_RESET} |                 `, {instant: true}).break()
    .type(` utils/             |   ${C_GREEN}95.67${C_RESET} |    ${C_GREEN}89.47${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}95.67${C_RESET} | 23,45           `, {instant: true}).break()
    .type(`  helpers.ts        |   ${C_GREEN}95.67${C_RESET} |    ${C_GREEN}89.47${C_RESET} |   ${C_GREEN}100.0${C_RESET} |   ${C_GREEN}95.67${C_RESET} | 23,45           `, {instant: true}).break()
    .type(`────────────────────|─────────|──────────|─────────|─────────|─────────────────`, {instant: true}).break()

    // PHASE 8: BUILD
    .exec(() => setTask('BUILD_START', 75))
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

    .exec(() => setTask('BUNDLE_ANALYZE', 80))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("du -sh dist/", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_CYAN}184K${C_RESET}     dist/`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("tree dist/ -L 2", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`dist/`, {instant: true}).break()
    .type(`├── assets`, {instant: true}).break()
    .type(`│   ├── index-9f7a3b2e.css`, {instant: true}).break()
    .type(`│   ├── index-a2b9c7f3.js`, {instant: true}).break()
    .type(`│   ├── logo-c7f2d8a9.svg`, {instant: true}).break()
    .type(`│   └── vendor-d4e8f1c5.js`, {instant: true}).break()
    .type(`├── favicon.ico`, {instant: true}).break()
    .type(`├── index.html`, {instant: true}).break()
    .type(`└── robots.txt`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`1 directory, 7 files`, {instant: true}).break()

    // PHASE 9: DEPLOY
    .exec(() => setTask('PRE_DEPLOY', 85))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("echo 'Validating build artifacts...' && npm run preview &", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`Validating build artifacts...`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`> portfolio@1.0.0 preview`, {instant: true}).break()
    .type(`> vite preview --port 4173`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`  ${C_CYAN}➜${C_RESET}  ${C_WHITE}Local${C_RESET}:   ${C_CYAN}http://localhost:4173/${C_RESET}`, {instant: true}).break()
    .type(`  ${C_CYAN}➜${C_RESET}  ${C_WHITE}Network${C_RESET}: ${C_CYAN}http://192.168.1.105:4173/${C_RESET}`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 300 })
    .type("curl -s -o /dev/null -w '%{http_code}' http://localhost:4173", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN}200${C_RESET}`, {instant: true}).break()

    .exec(() => setTask('NETLIFY_DEPLOY', 88))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("netlify deploy --prod --dir=dist", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}Deploying to production site...${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`Deploy path:        ${C_GRAY}/home/heiznerd/projects/portfolio/dist${C_RESET}`, {instant: true}).break()
    .type(`Functions path:     ${C_GRAY}/home/heiznerd/projects/portfolio/netlify/functions${C_RESET}`, {instant: true}).break()
    .type(`Configuration path: ${C_GRAY}/home/heiznerd/projects/portfolio/netlify.toml${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}Starting post processing${C_RESET}`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Finished hashing 7 files`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} CDN requesting 7 files`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Finished uploading 7 assets`, {instant: true}).break()
    .type(`${C_GREEN}✔${C_RESET} Deploy is live!`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_GREEN}Unique Deploy URL:${C_RESET} https://a8f9d2e3--heiznerd.netlify.app`, {instant: true}).break()
    .type(`${C_CYAN}Website URL:      ${C_RESET} ${C_GREEN}https://heiznerd.is-a.dev${C_RESET}`, {instant: true}).break()

    // PHASE 10: POST-DEPLOY VALIDATION
    .exec(() => setTask('HEALTH_CHECK', 92))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("curl -sI https://heiznerd.is-a.dev | head -n 10", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`HTTP/2 ${C_GREEN}200${C_RESET}`, {instant: true}).break()
    .type(`server: Netlify`, {instant: true}).break()
    .type(`content-type: text/html; charset=UTF-8`, {instant: true}).break()
    .type(`cache-control: public, max-age=0, must-revalidate`, {instant: true}).break()
    .type(`content-security-policy: default-src 'self'`, {instant: true}).break()
    .type(`x-content-type-options: nosniff`, {instant: true}).break()
    .type(`x-frame-options: DENY`, {instant: true}).break()
    .type(`x-xss-protection: 1; mode=block`, {instant: true}).break()

    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("curl -s -w '\\n%{time_total}s' https://heiznerd.is-a.dev > /dev/null", { delay: 50 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN}0.234s${C_RESET} ${C_GRAY}(TTFB: Fast)${C_RESET}`, {instant: true}).break()

    .exec(() => setTask('LIGHTHOUSE_AUDIT', 96))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("lighthouse https://heiznerd.is-a.dev --quiet --chrome-flags='--headless'", { delay: 40 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}Running Lighthouse audit...${C_RESET}`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`┌──────────────────────────────────────────────────────────────┐`, {instant: true}).break()
    .type(`│  ${C_YELLOW}Lighthouse Score Report${C_RESET}                                     │`, {instant: true}).break()
    .type(`├──────────────────────────────────────────────────────────────┤`, {instant: true}).break()
    .type(`│  Performance:        ${C_GREEN}██████████${C_RESET} ${C_GREEN}100${C_RESET} 🟢                    │`, {instant: true}).break()
    .type(`│  Accessibility:      ${C_GREEN}██████████${C_RESET} ${C_GREEN}100${C_RESET} 🟢                    │`, {instant: true}).break()
    .type(`│  Best Practices:     ${C_GREEN}██████████${C_RESET} ${C_GREEN}100${C_RESET} 🟢                    │`, {instant: true}).break()
    .type(`│  SEO:                ${C_GREEN}██████████${C_RESET} ${C_GREEN}100${C_RESET} 🟢                    │`, {instant: true}).break()
    .type(`│  PWA:                ${C_YELLOW}████████░░${C_RESET} ${C_YELLOW} 89${C_RESET} 🟡                    │`, {instant: true}).break()
    .type(`└──────────────────────────────────────────────────────────────┘`, {instant: true}).break()
    .type(``, {instant: true}).break()
    .type(`${C_CYAN}Key Metrics:${C_RESET}`, {instant: true}).break()
    .type(`  First Contentful Paint:  ${C_GREEN}0.8s${C_RESET}`, {instant: true}).break()
    .type(`  Largest Contentful Paint: ${C_GREEN}1.2s${C_RESET}`, {instant: true}).break()
    .type(`  Total Blocking Time:      ${C_GREEN}0ms${C_RESET}`, {instant: true}).break()
    .type(`  Cumulative Layout Shift:  ${C_GREEN}0.001${C_RESET}`, {instant: true}).break()
    .type(`  Speed Index:              ${C_GREEN}1.3s${C_RESET}`, {instant: true}).break()

    // PHASE 11: FINALIZING
    .exec(() => setTask('FINALIZING', 98))
    .options({ speed: 35, lifeLike: true })
    .type(getPrompt('~/projects/portfolio'), { instant: true, delay: 200 })
    .type("echo 'System Ready. Initialization complete.'", { delay: 30 }).break()
    .options({ speed: 1, lifeLike: false })
    .type(`${C_GREEN}System Ready.${C_RESET}`, { instant: true }).break()
    
    .exec(() => setTask('READY', 100))
    .pause(800)
    .exec(handleSkipLoading)
    .go();
};

onMounted(() => {
  startSystemMonitoring();
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
  clearInterval(memInterval);
  clearInterval(cpuInterval);
  if (instance) {
    instance.destroy();
  }
});
</script>

<style>
/* CSS cho con trỏ nhấp nháy kiểu khối (Block Cursor) */
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

/* Tùy chỉnh thanh cuộn cho giống Terminal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #0a0014;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #E95420; 
}

/* Hiệu ứng nhấp nháy nhẹ cho nút Skip */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(233,84,32,0.6); }
  50% { opacity: 0.8; box-shadow: 0 0 10px rgba(233,84,32,0.3); }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>