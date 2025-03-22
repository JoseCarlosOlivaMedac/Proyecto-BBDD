
<template>
<!--Componentes del home-->
<Header />
<router-view /> <!-- Aquí se renderizarán las vistas -->
<Hero />
<ProductosDestacados />
<Footer />


</template>


<script setup>
/*Componentes del home */
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import ProductosDestacados from './components/ProductosDestacados.vue';
import Footer from './components/Footer.vue';


</script>

<style scoped>
*{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
