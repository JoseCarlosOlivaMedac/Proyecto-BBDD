<template>
  <div class="wrapper">
    <h1>Productos</h1>
    <div class="productos-container">
      <div v-if="loading" class="loading-message">Cargando productos...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="productos.length === 0" class="empty-message">No hay productos disponibles</div>
      <div v-else class="productos-grid">
        <div v-for="producto in productos" :key="producto.id" class="producto">
          <div class="producto-imagen-container">
            <img 
              :src="producto.imagenUrl || placeholderImage" 
              :alt="'Imagen de ' + producto.nombre"
              class="producto-imagen"
              @error="handleImageError"
            >
          </div>
          <div class="producto-info">
            <h2 class="producto-nombre">{{ producto.nombre }}</h2>
            <p class="producto-descripcion">{{ producto.descripcion }}</p>
            <p class="producto-precio">${{ formatPrice(producto.precio) }}</p>
            <ButtonCarrito class="buttonCarrito"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase'; // Importamos desde el archivo centralizado
import { ref as dbRef, get } from "firebase/database";
import ButtonCarrito from "../components/ButtonCarrito.vue";

export default {
  components: {
    ButtonCarrito
  },
  
  name: "Productos",
  data() {
    return {
      productos: [],
      loading: true,
      error: null,
      placeholderImage: '/imagenes/placeholder.jpg'
    };
  },
  methods: {
    async fetchProductos() {
      try {
        this.loading = true;
        this.error = null;

        const snapshot = await get(dbRef(db, "productos"));

        if (snapshot.exists()) {
          this.productos = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
            // Usamos getImageUrl para generar la URL de la imagen
            imagenUrl: this.getImageUrl(id)
          }));
        } else {
          this.productos = [];
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
        this.error = "Error al cargar los productos. Por favor, intente nuevamente.";
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return Number(price).toLocaleString("es-ES");
    },
    handleImageError(event) {
      console.log('Error cargando imagen', event.target.src);
      event.target.src = this.placeholderImage;
      event.target.onerror = null;
      event.target.style.objectFit = 'contain';
    },
    getImageUrl(productId) {
  // Extrae el número del ID (ej: "producto1" -> 1)
  const num = parseInt(productId.replace(/\D/g, '')) || 1;  // Asegura que siempre se extrae un número
  return `/imagenes/producto(${Math.min(num, 20)}).jpg`;  // Usa la URL correcta con el número en el paréntesis
}
  },
  async mounted() {
    await this.fetchProductos();
  }
};
</script>

<style scoped>

h1{ 
  text-align: center;
  margin: 2rem 0;
  font-size: 2.5rem;
  color: #333;
}
.wrapper {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.productos-container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.producto {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.producto-imagen-container {
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
}

.producto-imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}


.producto-info {
  padding: 1.2rem;
}

.producto-nombre {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.producto-descripcion {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.producto-precio {
  margin: 0;
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  .wrapper {
    padding: 1rem;
  }
}

.buttonCarrito{
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
