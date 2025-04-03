import admin from "firebase-admin";
import fs from "fs";

// Importar la clave privada de Firebase
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Función para exportar una colección de Firestore a un archivo JSON
 * @param {string} camisetas - Nombre de la colección de Firestore
 */
async function exportCollectionToJSON(camisetas) {
  try {
    const snapshot = await db.collection(camisetas).get();
    const data = [];

    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Guardar los datos en un archivo JSON
    fs.writeFileSync(`${camisetas}.json`, JSON.stringify(data, null, 2));
    console.log(`✅ Colección "${camisetas}" exportada correctamente a ${camisetas}.json`);
  } catch (error) {
    console.error("❌ Error al exportar la colección:", error);
  }
}

// Ejecutar la exportación con el nombre de la colección (ejemplo: 'productos')
exportCollectionToJSON("camisetas");