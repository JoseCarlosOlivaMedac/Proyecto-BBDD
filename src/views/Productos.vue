<template>
  <div class="wrapper">
    <h1>PRODUCTOS</h1>
    <SearchBar @search="handleSearch" />

    <!-- Selector de modo con iconos animados -->
    <div class="modo-selector">
      <div 
        class="modo-opcion" 
        :class="{ activo: modoVisualizacion === 'paginacion' }"
        @click="modoVisualizacion = 'paginacion'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="icono" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
        <span>Paginación</span>
      </div>
      <div 
        class="modo-opcion" 
        :class="{ activo: modoVisualizacion === 'scroll' }"
        @click="modoVisualizacion = 'scroll'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="icono" viewBox="0 0 24 24">
          <path d="M12 4v16m-6-6l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
        <span>Scroll Infinito</span>
      </div>
    </div>

    <!-- Notificación de producto agregado -->
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>

    <div class="productos-container">
      <div v-if="loading" class="loading-message">Cargando productos...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="productosMostrados.length === 0" class="empty-message">
        {{ isSearching ? 'No se encontraron productos' : 'No hay productos disponibles' }}
      </div>
      <div v-else>
        <div class="productos-grid">
          <div
            v-for="producto in productosMostrados"
            :key="producto.id"
            class="producto"
          >
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

        <!-- Controles de paginación -->
        <div class="pagination" v-if="modoVisualizacion === 'paginacion' && productosMostrados.length > 0">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { ref as dbRef, get } from "firebase/database";
import ButtonCarrito from "../components/ButtonCarrito.vue";
import SearchBar from '../components/SearchBar.vue';

export default {
  components: {
    ButtonCarrito,
    SearchBar
  },

  name: "Productos",

  data() {
    return {
      productos: [],
      filteredProducts: [],
      isSearching: false,
      currentPage: 1,
      itemsPerPage: 4,
      scrollLimit: 4,
      loading: true,
      error: null,
      placeholderImage: '/imagenes/placeholder.jpg',
      showNotification: false,
      notificationMessage: '',
      notificationTimeout: null,
      modoVisualizacion: "paginacion"
    };
  },

  computed: {
    totalPages() {
      const sourceProducts = this.isSearching ? this.filteredProducts : this.productos;
      return Math.ceil(sourceProducts.length / this.itemsPerPage);
    },
    productosMostrados() {
      const sourceProducts = this.isSearching ? this.filteredProducts : this.productos;
      
      if (this.modoVisualizacion === "scroll") {
        return sourceProducts.slice(0, this.scrollLimit);
      } else {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return sourceProducts.slice(start, start + this.itemsPerPage);
      }
    }
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
      event.target.src = this.placeholderImage;
      event.target.onerror = null;
      event.target.style.objectFit = 'contain';
    },

    getImageUrl(productId) {
      const num = parseInt(productId.replace(/\D/g, '')) || 1;
      return `/imagenes/producto(${Math.min(num, 20)}).jpg`;
    },

    handleProductoAgregado(producto) {
      this.showNotificationMessage(`${producto.nombre} añadido al carrito`);
    },

    handleErrorCarrito(error) {
      this.showNotificationMessage(`Error al agregar producto: ${error.mensaje}`, true);
    },

    showNotificationMessage(message, isError = false) {
      this.notificationMessage = message;
      this.showNotification = true;

      if (isError) {
        const notificationEl = document.querySelector('.notification');
        if (notificationEl) {
          notificationEl.style.backgroundColor = '#ff6b6b';
        }
      }

      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },

    changePage(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    handleScroll() {
      const bottomOfWindow = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 50;

      if (bottomOfWindow && this.scrollLimit < (this.isSearching ? this.filteredProducts.length : this.productos.length)) {
        this.scrollLimit += 4;
      }
    },

    handleSearch(query) {
      if (!query.trim()) {
        this.isSearching = false;
        this.currentPage = 1;
        this.scrollLimit = 4;
        return;
      }
      
      this.isSearching = true;
      const searchTerm = query.toLowerCase();
      
      this.filteredProducts = this.productos.filter(producto => {
        return (
          producto.nombre.toLowerCase().includes(searchTerm) ||
          producto.descripcion.toLowerCase().includes(searchTerm)
        );
      });
      
      this.currentPage = 1;
      this.scrollLimit = 4;
    }
  },

  async mounted() {
    await this.fetchProductos();

    if (this.modoVisualizacion === "scroll") {
      window.addEventListener("scroll", this.handleScroll);
    }
  },

  watch: {
    modoVisualizacion(nuevoModo) {
      if (nuevoModo === "scroll") {
        this.scrollLimit = 4;
        window.addEventListener("scroll", this.handleScroll);
      } else {
        window.removeEventListener("scroll", this.handleScroll);
      }
    }
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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
.empty-message,
.error-message {
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.buttonCarrito {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

/* Estilos para la ventana emergente al agregar al carro */
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

/* Estilos de paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #5c36f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #4a2ecb;
}

.pagination span {
  font-size: 1rem;
  color: #333;
}

.modo-selector {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.modo-opcion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background-color: #f1f1f1;
  border-radius: 12px;
  padding: 1rem;
  width: 120px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.modo-opcion:hover {
  transform: scale(1.05);
  background-color: #e4e4e4;
}

.modo-opcion.activo {
  background-color: #5c36f2;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(92, 54, 242, 0.3);
}

.modo-opcion .icono {
  width: 32px;
  height: 32px;
  transition: transform 0.3s ease;
}

.modo-opcion.activo .icono {
  transform: rotate(360deg);
}

.modo-opcion span {
  font-size: 0.9rem;
  font-weight: bold;
}
</style>