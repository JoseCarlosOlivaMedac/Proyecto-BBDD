// src/firebase.js
import { initializeApp,getApps, getApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getDatabase} from "firebase/database";


// Configuración de Firebase 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializa Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Inicializa Firestore (base de datos)
const db = getFirestore(app);

// Inicializa Realtime Database (base de datos)
const database = getDatabase(app);

// Inicializa Auth
const auth = getAuth(app);

// Exporta la referencia a la DB para usarla en componentes
export { db }; 

// Exporta la referencia a la Realtime Database para usarla en componentes
export { database };

// Exporta la referencia a Auth para usarla en componentes
export { auth};

