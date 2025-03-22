<template>
  <section class="productos" v-if="isVisible">
    <button class="btn-close" @click="closeView">X</button>
    <h2>PRODUCTOS</h2>
  
    <div class="productos-grid">
      <div v-for="(producto, index) in productos" :key="index" class="producto">
        <img :src="producto.imagen" :alt="producto.nombre" />
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <span class="precio">${{ producto.precio }}</span>
        <button class="btn-secundary">Agregar al Carrito</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importar el enrutador de Vue

// Estado para controlar la visibilidad de los productos
const isVisible = ref(true);

// Lista de productos
const productos = ref([
  {
    nombre: "Producto 1",
    descripcion: "Descripción del producto 1",
    precio: 20.0,
    imagen: "/imagenes/producto1.jpg",
  },
  {
    nombre: "Producto 2",
    descripcion: "Descripción del producto 2",
    precio: 25.0,
    imagen: "/imagenes/producto2.jpg",
  },
  {
    nombre: "Producto 3",
    descripcion: "Descripción del producto 3",
    precio: 30.0,
    imagen: "/imagenes/producto3.jpg",
  },
  {
    nombre: "Producto 4",
    descripcion: "Descripción del producto 4",
    precio: 18.0,
    imagen: "/imagenes/producto4.jpg",
  },
]);

// Obtener el enrutador
const router = useRouter();

// Función para cerrar la vista y redirigir al home
const closeView = () => {
  isVisible.value = false;  // Ocultar la vista de productos
  router.push("/");         // Redirigir al home
};
</script>

<style scoped>
.productos {
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.productos-grid {
  display: flex;
  justify-content: center;
  gap: 45px;
  flex-wrap: wrap;
}

.producto {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
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
