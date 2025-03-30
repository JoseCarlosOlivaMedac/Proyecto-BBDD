import { initializeApp, getApp } from "firebase/app";
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


// Intentar obtener la instancia de la app
let firebaseApp;

try {
  // Si ya existe una app inicializada, obtenla
  firebaseApp = getApp();
} catch (error) {
  // Si no existe, inicialízala
  firebaseApp = initializeApp(firebaseConfig);
}
// Servicio de Firebase Realtime Database
const db = getDatabase(firebaseApp);

// Exportaciones
export { db };
