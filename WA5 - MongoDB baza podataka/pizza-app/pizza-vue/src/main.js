import { createApp } from 'vue'
import App from './App.vue'

import { OhVueIcon } from 'oh-vue-icons'

import './assets/tailwind.css'

const app = createApp(App)

app.component('v-icon', OhVueIcon)

app.mount('#app')
