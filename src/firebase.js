// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics"; 
import { getAuth } from "firebase/auth";

// Configuración de Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyAviwRWYNFmHFys-CLHJEckqFxlqkGv1Ho",
  authDomain: "medac-proyectobbdd.firebaseapp.com",
  projectId: "medac-proyectobbdd",
  storageBucket: "medac-proyectobbdd.firebasestorage.app",
  messagingSenderId: "512777032126",
  appId: "1:512777032126:web:1d37292c815db8ef99a9ef",
  measurementId: "G-1J8TPMP0QN"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
export { auth };

