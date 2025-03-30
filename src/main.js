import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importamos el archivo del router

const app = createApp(App); // Crear la instancia de la aplicación Vue

app.use(router); // Usamos Vue Router
app.mount('#app'); // Montamos la app en el contenedor #app
