importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

let firebaseConfig;

// Escuchar mensajes desde la aplicación principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.payload;

    // Inicializar Firebase con la configuración recibida
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    // Manejar notificaciones en segundo plano
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Recibió un mensaje en segundo plano:', payload);

      const notificationTitle = payload.notification.title || 'Notificación';
      const notificationOptions = {
        body: payload.notification.body || 'Tienes una nueva notificación.',
        icon: payload.notification.icon || '/icon.png'
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});