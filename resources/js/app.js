import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './src/style.css'
import App from './src/App.vue'
import router from './src/router'

const pinia = createPinia()
import piniaPersist from "pinia-plugin-persistedstate";
pinia.use(piniaPersist);

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
