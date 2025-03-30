import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://bd-bbdd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicialización de Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Servicio de Firebase Realtime Database
const db = getDatabase(firebaseApp);

// Exportaciones
export { db };  // Eliminamos la exportación de `storage` ya que ya no se usa
