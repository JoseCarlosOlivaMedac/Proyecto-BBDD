//Inicializa la aplicacion de firebase.
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";  
import { getFirestore, setDoc, getDoc } from 'firebase/firestore';

//Configura firebase.
const firebaseConfig = {
    apiKey: "AIzaSyBl8quhTwR9wpTSg7JVjog2ChmaHp5sTO8",
    authDomain: "bbddliveshop.firebaseapp.com",
    projectId: "bbddliveshop",
    storageBucket: "bbddliveshop.firebasestorage.app",
    messagingSenderId: "1009343313310",
    appId: "1:1009343313310:web:ac1a8b84c6b6ffdd3c928f",
    measurementId: "G-Q0J09NVHD7"
  };

  //Inicializa las instancias de firebase.
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  //Permite interactuar con la base de datos.
  const db = getFirestore(app); 
  
  //Se exporta para usarla en el resto de archivos.
  export {db, setDoc, getDoc};