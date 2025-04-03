
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
    "id": "7qURuPyv7gaCt2gmRG6f",
    "categoria": "camiseta",
    "nombre": "Lacoste",
    "precio": 41.95,
    "stock": 40,
    "descripcion": "camiseta basica - white",
    "imagen": "https://img01.ztat.net/article/spp-media-p1/79a5e9e054894b3ca28a7a6b9e5e1ed7/32a86fbdcf2e414c8dcb35580fb438ad.jpg?imwidth=1800&filter=packshot.net/article/spp-media-p1/79a5e9e054894b3ca28a7a6b9e5e1ed7/32a86fbdcf2e414c\"h8dcb35580fb438ad.jpg?imwidth=1800&filter=packshot"
  },
  {
    "id": "DtFmWK4B4TTxZ7cht3YT",
    "categoria": "camiseta",
    "nombre": "Levi's",
    "imagen": "https://img01.ztat.net/article/spp-media-p1/2188fc9e749c49acb34b9ca228e9b5c3/170e03c25ad94d5b969741ce0aef335c.jpg?imwidth=1800&filter=packshot",
    "precio": 19.95,
    "stock": 28,
    "descripcion": "camiseta estampada - dress blues"
  },
  {
    "id": "Jcbkwx5D2ekjoRVgB6vB",
    "categoria": "camiseta",
    "descripcion": "camiseta basica",
    "imagen": "https://img01.ztat.net/article/spp-media-p1/ce7a376fdcb34128b1de816eca1f4cb9/bf487940e1214cd3be485312ed033a39.jpg?imwidth=1800&filter=packshot",
    "nombre": "jordan",
    "precio": 33.85,
    "stock": 18
  },
  {
    "id": "JlsADTQcgcQwkMR6bAiC",
    "categoria": "camiseta",
    "descripcion": "camiseta estampada - anthracite",
    "imagen": "https://img01.ztat.net/article/spp-media-p1/82f23b9721f642c880cf7d392df9d5c9/94e1d0590e104a25ac089525169330ee.jpg?imwidth=1800&filter=packshot",
    "nombre": "scalpers",
    "precio": 29.9,
    "stock": 2
  },
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
