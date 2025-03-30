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
  :root {
  --color-primary: #5c36f2;
  --color-secondary: #e67d00;
  --color-background: #f4f7f6;
  --color-text: #333;
}
  * {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  </style>
  