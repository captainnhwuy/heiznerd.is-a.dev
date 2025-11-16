import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaDiscord, FaGithub, FaFacebook } from "oh-vue-icons/icons/fa";

addIcons(FaDiscord, FaGithub, FaFacebook);

const app = createApp(App)

app.component("v-icon", OhVueIcon);

app.mount('#app')
