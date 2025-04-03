<template>

    <Header/>
    <router-view /> <!-- Aquí se cargarán las vistas dinámicas -->
    <Footer />
  </template>
  
  <script setup>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';
  import { ref, onMounted, provide} from "vue";
  import { auth } from "./firebase.js";
  import { onAuthStateChanged, signOut } from "firebase/auth"; // Importar el componente de búsqueda


  const carrito = ref([]);

  const addToCart = (product) => {
  const existingProduct = carrito.value.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    carrito.value.push({ ...product, quantity: 1 });
  }
};

  provide("carrito", carrito);
  provide("addToCart", addToCart);

 

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
  