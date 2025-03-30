<template>
  <section class="productos-destacados">
    <h2>Productos Destacados</h2>
    
    <div v-if="loading" class="loading-message">Cargando productos destacados...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="productos-grid">
      <div 
        v-for="producto in productos.slice(0, 4)" 
        :key="producto.id" 
        class="producto"
      >
        <div class="producto-imagen-container">
          <img 
            :src="producto.imagenUrl || placeholderImage" 
            :alt="producto.nombre"
            @error="handleImageError"
          />
        </div>
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <span class="precio">${{ formatPrice(producto.precio) }}</span>
        <ButtonCarrito :productoId="producto.id" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { ref as dbRef, get } from 'firebase/database';
import ButtonCarrito from './ButtonCarrito.vue';

const productos = ref([]);
const loading = ref(true);
const error = ref(null);
const placeholderImage = '/imagenes/placeholder.jpg';

const fetchProductos = async () => {
  try {
    loading.value = true;
    error.value = null;

    const snapshot = await get(dbRef(db, 'productos'));

    if (snapshot.exists()) {
      productos.value = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
        imagenUrl: getImageUrl(id) // Usamos la función getImageUrl para generar la URL
      }));
    } else {
      console.log("No hay productos disponibles.");
      productos.value = [];
    }
  } catch (err) {
    console.error("Error al obtener productos:", err);
    error.value = "Error al cargar productos destacados";
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (productId) => {
  // Extrae el número del ID (ej: "producto1" -> 1)
  const num = parseInt(productId.replace(/\D/g, '')) || 1; // Asegura que siempre se extrae un número
  return `/imagenes/producto(${Math.min(num, 20)}).jpg`; // Usa la URL correcta con el número en el paréntesis
};

const formatPrice = (price) => {
  return Number(price).toLocaleString("es-ES");
};

const handleImageError = (event) => {
  event.target.src = placeholderImage;
  event.target.onerror = null;
  event.target.style.objectFit = 'contain';
};

onMounted(() => {
  fetchProductos();
});
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

.producto-imagen-container {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 10px;
}

.producto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.precio {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 1rem;
}

.loading-message,
.error-message {
  color: #fff;
  padding: 2rem;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .productos-grid {
    gap: 30px;
  }
  
  .producto {
    width: 250px;
    height: 380px;
  }
  
  .producto-imagen-container {
    height: 180px;
  }
}

@media (max-width: 576px) {
  .productos-grid {
    flex-direction: column;
    gap: 20px;
  }
  
  .producto {
    width: 90%;
    max-width: 300px;
  }
}
</style>