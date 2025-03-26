import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importamos el archivo del router
import { firebaseApp } from './firebase'; // Importa firebaseApp explícitamente desde firebase.js

const app = createApp(App); // Crear la instancia de la aplicación Vue

app.use(router); // Usamos Vue Router
app.provide("firebase", firebaseApp); // 🔥 Lo hacemos accesible en todo el proyecto
app.mount('#app'); // Montamos la app en el contenedor #app
