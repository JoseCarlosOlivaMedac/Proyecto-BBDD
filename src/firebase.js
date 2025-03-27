import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6uVX0Aa8Aom6zX_Nolo8RFYqcg627-cs",
  authDomain: "proyecto-tienda-13c2d.firebaseapp.com",
  projectId: "proyecto-tienda-13c2d",
  storageBucket: "proyecto-tienda-13c2d.firebasestorage.app",
  messagingSenderId: "1097886581259",
  appId: "1:1097886581259:web:36fb249f216cdb5df1fd0e"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtén las instancias de Firebase Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc, getDoc };
