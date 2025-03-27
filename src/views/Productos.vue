<template>
    <section class="productos" v-if="isVisible">
      <button class="btn-close" @click="closeView">✖</button>
      <h2>PRODUCTOS</h2>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-else class="productos-grid">
        <div v-for="(producto, index) in productos" :key="producto.id" class="producto">
          <img :src="producto.imagen" :alt="`Imagen de ${producto.nombre}`" />
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <span class="precio">${{ producto.precio }}</span>
          <button class="btn-secundary" @click="agregarAlCarrito(producto)">
            Agregar al Carrito
          </button>
          <button class="btn-edit" @click="actualizarProducto(producto.id, { precio: producto.precio + 5 })">
            Subir Precio
          </button>
          <button class="btn-delete" @click="eliminarProducto(producto.id)">
            Eliminar
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
  import { db } from "../firebase";
  
  const productos = ref([]);
  const error = ref(null);
  const isVisible = ref(true);
  
  const obtenerProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "camisetas"));
      productos.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      error.value = "Error al cargar los productos.";
      console.error(err);
    }
  };
  
  const actualizarProducto = async (id, nuevosDatos) => {
    try {
      await updateDoc(doc(db, "camisetas", id), nuevosDatos);
      obtenerProductos(); // Refrescar lista
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };
  
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "camisetas", id));
      obtenerProductos(); // Refrescar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };
  
  onMounted(() => {
    obtenerProductos();
  });
  
  const closeView = () => {
    isVisible.value = false;
  };
  </script>
  <style scoped>
  .productos {
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column; 
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
    transition: transform 0.3s ease, width 0.3s ease;
  }
  
  .producto img:hover {
    cursor: pointer;
    width: 105%;
    transform: scale(1.1); 
  }
  .producto h3 {
    font-size: 1.2rem;
    margin: 1rem 0;
  }
  
  .producto p {
    font-size: 1rem;
    color: #666;
    flex-grow: 1; 
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
    margin-right: 150px;
    margin-top: 50px;
    border: none;
    color: #333;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  @media screen and (max-width: 768px) {
    .btn-close {
      margin: auto;
    }
  
    .producto {
      width: 100%;
    }
    
  }
  
  .btn-close:hover {
    color: #e60505;
  }
  </style>
  