<template>
  <section class="productos" v-if="isVisible">
    <button class="btn-close" @click="closeView">X</button>
    <h2>PRODUCTOS</h2>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else class="productos-grid">
      <div v-for="(producto, index) in productos" :key="index" class="producto">
        <img :src="producto.imagen" :alt="`Imagen de ${producto.nombre}`" />
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <span class="precio">${{ producto.precio }}</span>
        <button class="btn-secundary" @click="agregarAlCarrito(producto)">
          Agregar al Carrito
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const isVisible = ref(true);
const productos = ref([]);
const error = ref(null);
const API_URL =
  "https://api.unsplash.com/search/photos?query=t-shirt&client_id=4Qf3YPiBHlSk0tCpYdgMHIfdrB6HXwsc7Sq0zClBttI";

const fetchImages = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al cargar los productos");
    const data = await response.json();
    
    // Extraemos solo los resultados de la búsqueda
    productos.value = data.results.filter(isShirt).map((image, index) => ({
      nombre: `Producto ${index + 1}`,
      descripcion: `Descripción del producto ${index + 1}`,
      precio: (index + 1) * 10,
      imagen: image.urls.small,
    }));

    console.log("Productos cargados:", productos.value);
  } catch (err) {
    error.value = "No se pudieron cargar los productos. Inténtalo de nuevo más tarde.";
    console.error("Error fetching images:", err);
  }
};

const isShirt = (image) => {
  const description = image.description?.toLowerCase() || "";
  const altDescription = image.alt_description?.toLowerCase() || "";
  return (
    description.includes("shirt") ||
    description.includes("t-shirt") ||
    altDescription.includes("shirt") ||
    altDescription.includes("t-shirt")
  );
};

const agregarAlCarrito = (producto) => {
  console.log("Producto agregado:", producto);
};

const router = useRouter();
const closeView = () => {
  router.push("/");
};

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
.productos {
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column; /* Organiza los elementos en columna */
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  min-height: 100vh;
  position: relative;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.error-message {
  color: red;
  font-weight: bold;
}

.productos-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  padding: 1rem;
}

.producto {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  width: 250px;
}

.producto:hover {
  transform: scale(1.05);
}

.producto img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.producto h3 {
  font-size: 1.2rem;
  margin: 1rem 0;
}

.producto p {
  font-size: 1rem;
  color: #666;
  flex-grow: 1; /* Hace que la descripción ocupe el espacio disponible */
}

.precio {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0.5rem 0;
  display: flex;
  justify-content: center;
}

.btn-secundary {
  background-color: #5c36f2;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.btn-secundary:hover {
  background-color: #e67d00;
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-close:hover {
  color: #e67d00;
}
</style>
