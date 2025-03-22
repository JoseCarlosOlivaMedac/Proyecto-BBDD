import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importamos el archivo del router

createApp(App)
  .use(router) // Usamos Vue Router
  .mount('#app');