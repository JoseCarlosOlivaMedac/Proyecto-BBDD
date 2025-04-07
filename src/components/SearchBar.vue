<template>
    <div v-for="producto in productosFiltrados" :key="producto.id" class="producto">
        <img :src="producto.imagen" :alt="`Imagen de ${producto.nombre}`" />
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <span class="precio">${{ producto.precio }}</span>
        <button class="btn-secundary" @click="agregarAlCarrito(producto)">
          Agregar al Carrito
        </button>
      </div>
</template>

<script lang="ts" setup>
//Funcion para filtrar los productos
const productosFiltrados = computed(() => {
    if (!search.value) {
        return productos.value;
    }
    return productos.value.filter((producto) =>
        producto.nombre.toLowerCase().includes(search.value.toLowerCase()) 
    );
});
</script>

<style></style>