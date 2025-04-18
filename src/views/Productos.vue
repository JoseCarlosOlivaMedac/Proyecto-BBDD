<template>
  <div class="wrapper">
    <h1>PRODUCTOS</h1>
    
    <!-- Notificación de producto agregado -->
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>
    
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
            <ButtonCarrito 
              :productoId="producto.id" 
              @producto-agregado="handleProductoAgregado"
              @error-carrito="handleErrorCarrito"
              class="buttonCarrito"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
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
      placeholderImage: '/imagenes/placeholder.jpg',
      showNotification: false,
      notificationMessage: '',
      notificationTimeout: null
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
      const num = parseInt(productId.replace(/\D/g, '')) || 1;
      return `/imagenes/producto(${Math.min(num, 20)}).jpg`;
    },
    
    handleProductoAgregado(producto) {
      console.log('Producto agregado:', producto);
      this.showNotificationMessage(`${producto.nombre} añadido al carrito`);
    },
    
    handleErrorCarrito(error) {
      console.error('Error en carrito:', error);
      this.showNotificationMessage(`Error al agregar producto: ${error.mensaje}`, true);
    },
    
    showNotificationMessage(message, isError = false) {
      this.notificationMessage = message;
      this.showNotification = true;
      
      // Estilo diferente para errores
      if (isError) {
        const notificationEl = document.querySelector('.notification');
        if (notificationEl) {
          notificationEl.style.backgroundColor = '#ff6b6b';
        }
      }
      
      // Oculta la notificación después de 3 segundos
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    }
  },

  async mounted() {
    await this.fetchProductos();
  },
  
  beforeUnmount() {
    clearTimeout(this.notificationTimeout);
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


/*Estilos para la ventana emergente al agregar al carro */


.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #5c36f2;
  color: white;
  padding: 15px 25px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
}

@keyframes fadeIn {
  from { opacity: 0; top: 0; }
  to { opacity: 1; top: 20px; }
}

@keyframes fadeOut {
  from { opacity: 1; top: 20px; }
  to { opacity: 0; top: 0; }
}
</style>
