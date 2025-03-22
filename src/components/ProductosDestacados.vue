
<template>
    <section class="productos-destacados">
      <h2>Productos Destacados</h2>
  
      <div class="productos-grid">
        <div v-for="(producto, index) in productos" :key="index" class="producto">
          <img :src="producto.imagen" :alt="producto.nombre">
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <span class="precio">${{ producto.precio }}</span>
          <a href="#" class="btn-secundary">Agregar al Carrito</a>
        </div>
      </div>
    </section>
  </template>
  

  <script setup>
  import { ref } from 'vue';
  
  const productos = ref([
    {
      nombre: "Producto 1",
      descripcion: "Descripción del producto 1",
      precio: 20.00,
      imagen: "/public/imagenes/producto1.jpg"
    },
    {
      nombre: "Producto 2",
      descripcion: "Descripción del producto 2",
      precio: 25.00,
      imagen: "/public/imagenes/producto2.jpg"
    },
    {
      nombre: "Producto 3",
      descripcion: "Descripción del producto 3",
      precio: 30.00,
      imagen: "/public/imagenes/producto3.jpg"
    },
    {
      nombre: "Producto 4",
      descripcion: "Descripción del producto 4",
      precio: 18.00,
      imagen: "/public/imagenes/producto4.jpg"
    }
  ]);
  </script>
  
<style scoped>
.productos-destacados {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background-color: #333;
    margin: 1rem 0;
    padding: 2rem 0;
}

h2 {
    margin-bottom: 2rem;
    font-size: 2.2rem;
    color: #fff;
}

.productos-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 80px;
    justify-content: center; 
    align-items: center;
    margin: 0 auto; 
}
.producto {
  width: 300px;
  height: 420px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.producto:hover {
    transform: translateY(-8px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.producto img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.producto:hover img {
    transform: scale(1.05);
}

.producto h3 {
    font-size: 1.4rem;
    margin: 1rem 0 0.5rem;
    color: #222;
}

.producto p {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.8rem;
}

.precio {
    font-size: 1.5rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 1rem;
}

.btn-secundary {
    background-color:#5c36f2;
    color: white;
    text-decoration: none;
    padding: 0.7rem 1.5rem;
    border-radius: 6px;
    font-weight: bold;
    transition: background 0.3s ease;
}

.btn-secundary:hover {
    background-color: rgb(230, 125, 0);
}

@media (max-width: 768px) {
    .productos-grid {
        grid-template-columns: 1fr;
    }
}
</style>
