import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
import piniaPersist from "pinia-plugin-persistedstate";
pinia.use(piniaPersist);

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
