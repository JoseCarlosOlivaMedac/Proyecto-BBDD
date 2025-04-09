import { initializeApp, getApp } from "firebase/app";  // Importa las funciones necesarias para inicializar y obtener la app de Firebase
import { getDatabase } from "firebase/database";  // Importa la función para obtener la referencia a la base de datos en tiempo real de Firebase
import { getAuth } from "firebase/auth";  // Importa la función para obtener la referencia a la autenticación de Firebase
import { getMessaging, getToken, onMessage } from "firebase/messaging"; //Importa la función para obtener la referencia al servicio de mensajería de Firebase

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // Clave API de Firebase (tomada de variables de entorno)
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,  // Dominio de autenticación (tomado de variables de entorno)
  databaseURL: "https://bd-bbdd-default-rtdb.europe-west1.firebasedatabase.app",  // URL de la base de datos en tiempo real de Firebase
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,  // ID del proyecto Firebase (tomado de variables de entorno)
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,  // ID del remitente de mensajes de Firebase (tomado de variables de entorno)
  appId: import.meta.env.VITE_FIREBASE_APP_ID  // ID de la app de Firebase (tomado de variables de entorno)
};

// Intentar obtener la instancia de la app de Firebase
let firebaseApp;

try {
  // Si ya existe una app inicializada con la configuración proporcionada, obtenla
  firebaseApp = getApp();
} catch (error) {
  // Si no existe una app inicializada, entonces inicializa una nueva
  firebaseApp = initializeApp(firebaseConfig);
}

// Obtiene el servicio de la base de datos en tiempo real de Firebase usando la instancia de la app
const db = getDatabase(firebaseApp);

// Inicializa el servicio de autenticación de Firebase
const auth = getAuth(firebaseApp);


// Inicializar el servicio de mensajería
const messaging = getMessaging(firebaseApp);



// Exporta la referencia a la base de datos, autenticación y mensajería para que otros módulos puedan utilizarlas
export { db, auth, messaging, getToken, onMessage };