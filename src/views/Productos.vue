<template>
  <div class="wrapper">
    <h1>Productos</h1>
    <div class="productos-container">
      <div v-if="loading" class="loading-message">Cargando productos...</div>
      <div v-else-if="productos.length === 0" class="empty-message">No hay productos disponibles</div>
      <div v-else class="productos-grid">
        <div v-for="producto in productos" :key="producto.id" class="producto">
          <div class="producto-imagen-container">
            <img 
              :src="getImageUrl(producto.id)" 
              :alt="'Imagen de ' + producto.nombre"
              class="producto-imagen"
              @error="handleImageError"
            >
          </div>
          <div class="producto-info">
            <h2 class="producto-nombre">{{ producto.nombre }}</h2>
            <p class="producto-descripcion">{{ producto.descripcion }}</p>
            <p class="producto-precio">${{ formatPrice(producto.precio) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://bd-bbdd-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default {
  name: "Productos",
  data() {
    return {
      productos: [],
      loading: true,
      error: null,
      // Mapeo de IDs de producto a nombres de imagen
      imageMap: (() => {
        const map = {};
        // Generamos el mapeo automático para los productos, ajustando a las claves de producto (producto1, producto2...)
        for (let i = 1; i <= 20; i++) {
          map[`producto${i}`] = `producto (${i}).jpg`;
        }
        return map;
      })()
    };
  },
  methods: {
    async fetchProductos() {
      try {
        this.loading = true;
        this.error = null;

        const snapshot = await get(dbRef(db, "productos"));

        this.productos = snapshot.exists() 
          ? Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }))
          : [];
          
      } catch (error) {
        console.error("Error al obtener productos:", error);
        this.error = "Error al cargar los productos";
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return Number(price).toLocaleString("es-ES");
    },
    getImageUrl(productId) {
      const imageName = this.imageMap[productId];
      console.log(`ID: ${productId}, Imagen: ${imageName}`); // Debugging
      // Asegúrate de usar la ruta correcta para acceder a la carpeta 'public'
      return imageName ? `/imagenes/${imageName}` : '/imagenes/placeholder.jpg';
    },
    handleImageError(event) {
      console.log('Error cargando imagen', event.target.src); // Debugging
      event.target.src = '/imagenes/placeholder.jpg';
      event.target.onerror = null;
      event.target.style.objectFit = 'contain';
    }
  },
  async mounted() {
    await this.fetchProductos();
  }
};
</script>


<style scoped>
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

.producto:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

.producto:hover .producto-imagen {
  transform: scale(1.05);
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
</style>
