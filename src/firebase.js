import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: "https://bd-bbdd-default-rtdb.europe-west1.firebasedatabase.app" // Aquí va tu URL de la base de datos en tiempo real
};

// Inicializamos Firebase
const firebaseApp = initializeApp(firebaseConfig); // Guarda la instancia de Firebase

// Inicializamos las bases de datos
const firestoreDb = getFirestore(firebaseApp);  // Firestore
const realTimeDb = getDatabase(firebaseApp);   // Realtime Database

export { firebaseApp, firestoreDb, realTimeDb, get, ref }; // Exportamos la instancia firebaseApp junto con las funciones
