<template>
    <Header/>
    <router-view /> <!-- Aquí se cargarán las vistas dinámicas -->
    <Footer />
  </template>
  
  <script setup>
import { ref, provide, onMounted, watch } from "vue";
import Header from "./components/Header.vue"; //
import Footer from "./components/Footer.vue"; //

const carrito = ref([]);

// Cargar carrito desde localStorage al iniciar
onMounted(() => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito.value = JSON.parse(carritoGuardado);
  }
});

// Guardar carrito en localStorage cada vez que cambie
watch(carrito, (nuevoCarrito) => {
  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
}, { deep: true });


// Función para agregar productos al carrito
const addToCart = (producto) => {
  const index = carrito.value.findIndex((item) => item.id === producto.id);
  
  if (index !== -1) {
    carrito.value[index].cantidad += 1;
  } else {
    carrito.value.push({ ...producto, cantidad: 1 });
  }
};

// Función para eliminar un producto del carrito
const removeFromCart = (productoId) => {
  carrito.value = carrito.value.filter((item) => item.id !== productoId);
};

// Hacer que el carrito sea reactivo en todos los componentes
watch(carrito, () => {
  console.log("Carrito actualizado:", carrito.value);
}, { deep: true });

provide("carrito", carrito);
provide("addToCart", addToCart);
provide("removeFromCart", removeFromCart);
</script>

  <style scoped>
  * {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
 
  </style>
  