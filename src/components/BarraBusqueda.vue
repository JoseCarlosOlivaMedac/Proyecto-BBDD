<template>
    <div class="search-container">
    <div class="search-bar">
      <input
        type="text"
        v-model="queryText"
        @input="onSearch"
        placeholder="Buscar..."
      />
      <svg class="search-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14A4.5 4.5 0 119.5 5a4.5 4.5 0 010 9z"/>
      </svg>
    </div>
    <ul v-if="results.length" class="results">
      <li v-for="result in results" :key="result.id">
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const queryText = ref('');
const results = ref([]);

/*
// Test conexion buscador a firebase
const testFirebase = async () => {
  try {
    const q = collection(db, 'camisetas'); // Obtener todos los productos
    const querySnapshot = await getDocs(q);
    console.log("Productos en Firestore:", querySnapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error("Error al conectar con Firestore:", error);
  }
};

testFirebase();

*/
const onSearch = async () => {
    console.log("onSearch ejecutado con:", queryText.value);
  if (queryText.value.length < 2) {
    results.value = [];
    return;
  }
  
  try {
    const q = query(
      collection(db, 'camisetas'),
      where('nombre', '>=', queryText.value.toLowerCase()),
      where('nombre', '<=', queryText.value.toLowerCase() + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No se encontraron productos con ese nombre.");
      results.value = [];
    } else {
      results.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("✅ Resultados obtenidos:", results.value);
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f7;
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}
.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
}
.search-icon {
  width: 20px;
  height: 20px;
  color: #888;
}
.results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  list-style: none;
  padding: 0;
}
.results li {
  padding: 12px;
  cursor: pointer;
  transition: background 0.3s;
}
.results li:hover {
  background: #f0f0f0;
}
</style>