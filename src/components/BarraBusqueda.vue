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

    <!--RESULTADOS DE LA BÚSQUEDA -->
    <div v-if="results.length > 0" class="results">
      <div v-for="producto in results" :key="producto.id" class="result-item">
        <img :src="producto.imagen" alt="Imagen del producto" class="product-image" />
        <div class="product-info">
          <h4 class="product-name">{{ producto.nombre }}</h4>
          <p class="product-price">{{ producto.precio }} €</p>
        </div>
      </div>
    </div>
    
    <!-- Mensaje si no se encuentran resultados -->
    <p v-if="queryText.length > 0 && results.length === 0" class="no-results">
      No se encontraron productos.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase';
import { collection, query, where, orderBy, startAt, endAt, getDocs } from 'firebase/firestore';

const queryText = ref('');
const results = ref([]);
const loading = ref(false);

const onSearch = async () => {
  const texto = queryText.value.trim().toLowerCase();
  if (texto.length < 2) {
    results.value = [];
    return;
  }

  try {
    const camisetasRef = collection(db, 'camisetas');
    const querySnapshot = await getDocs(camisetasRef);

    // Filtro local por nombre o descripcion que incluyan el texto
    results.value = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(producto => {
        const nombre = producto.nombre?.toLowerCase() || "";
        const descripcion = producto.descripcion?.toLowerCase() || "";
        return nombre.includes(texto) || descripcion.includes(texto);
      });

    if (results.value.length === 0) {
      console.log("❌ No se encontraron productos con ese nombre o descripción.");
    } else {
      console.log("✅ Resultados filtrados:", results.value);
    }
  } catch (error) {
    console.error("❌ Error en la búsqueda:", error);
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #e5e5e5;
  border-radius: 12px;
  padding: 8px 10px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.search-bar input {
  flex: 1;
  border: none;;
  background: transparent;
  font-size: 14px; /* Reducido el tamaño de la fuente */
  outline: none;
  padding: 4px 8px; /* Reducido el padding */
}

.search-icon {
  width: 18px; /* Icono más pequeño */
  height: 18px;
  color: #888;
}

.results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  padding: 8px;
  max-height: 350px;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid #ddd;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
}

.result-item:hover {
  background: #d3d3d3;  /* Fondo más oscuro al hacer hover */
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.product-price {
  font-size: 14px;
  color: #555;
}

.no-results {
  font-size: 14px;
  color: #888;
  padding: 10px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 20px;
}
</style>
