import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importamos el archivo del router
import { messaging, getToken, onMessage } from './firebase';

const app = createApp(App); // Crear la instancia de la aplicación Vue

app.use(router); // Usamos Vue Router
app.mount('#app'); // Montamos la app en el contenedor #app

// Configuración Firebase desde variables de entorno
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  // Registro del Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(async (registration) => {
        console.log('✅ Service Worker registrado:', registration);
  
        const sw = registration.active || await navigator.serviceWorker.ready.then(r => r.active);
  
        if (sw) {
          sw.postMessage({
            type: 'FIREBASE_CONFIG',
            payload: firebaseConfig
          });
          console.log('✅ Configuración de Firebase enviada al Service Worker');
        } else {
          console.error('❌ El Service Worker no está activo.');
        }
      })
      .catch(error => {
        console.error('❌ Error al registrar el Service Worker:', error);
      });
  }

  // Función para solicitar el permiso
async function solicitarPermiso() {
    console.log('🔔 Solicitando permiso para notificaciones...');
  
    const permission = await Notification.requestPermission();
  
    if (permission === 'granted') {
      console.log('✅ Permiso de notificaciones concedido.');
  
      // Obtener el token de registro
      getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
        .then((currentToken) => {
          if (currentToken) {
            console.log('🔑 Token FCM:', currentToken);
            // Aquí puedes enviar el token a tu servidor para enviar notificaciones personalizadas
          } else {
            console.warn('⚠️ No se pudo obtener el token de registro.');
          }
        })
        .catch((err) => {
          console.error('❌ Error al obtener el token:', err);
        });
  
      // Escuchar mensajes cuando la app esté en primer plano
      onMessage(messaging, (payload) => {
        console.log('📩 Mensaje recibido en foreground:', payload);
  
        // Mostrar notificación manualmente si lo deseas
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon
          });
        }
      });
  
    } else {
      console.warn('🚫 Permiso de notificaciones denegado.');
    }
  }
  
  solicitarPermiso();