<template>

    <Header />
    <router-view /> <!-- Aquí se cargarán las vistas dinámicas -->
    
    
    <Footer />
  </template>
  
  <script setup>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';
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
  