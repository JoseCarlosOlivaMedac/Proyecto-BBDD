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
import { db } from '../firebase';  // Importa la instancia de Firebase Realtime Database configurada en el archivo firebase.js
import { ref as dbRef, get } from "firebase/database";  // Importa las funciones necesarias para acceder a la base de datos de Firebase
import ButtonCarrito from "../components/ButtonCarrito.vue";  // Importa el componente ButtonCarrito para ser utilizado en la vista

export default {
  // Define los componentes que se van a usar en este componente Vue.
  components: {
    ButtonCarrito  // Componente para el botón de agregar al carrito
  },
  
  // Define el nombre del componente.
  name: "Productos",
  
  // Define el estado inicial del componente (data).
  data() {
    return {
      productos: [],  // Arreglo donde se guardarán los productos obtenidos desde Firebase
      loading: true,  // Estado que indica si los productos están siendo cargados
      error: null,  // En caso de error, se almacenará el mensaje de error aquí
      placeholderImage: '/imagenes/placeholder.jpg'  // Imagen de respaldo cuando no se puede cargar una imagen de producto
    };
  },
  
  // Define los métodos que se utilizarán dentro del componente.
  methods: {
    
    /**
     * Función para obtener los productos desde Firebase Realtime Database.
     * Realiza una consulta a la base de datos y asigna los resultados a la variable 'productos'.
     * Muestra un mensaje de error en caso de que falle la consulta.
     */
    async fetchProductos() {
      try {
        this.loading = true;  // Marca el inicio de la carga
        this.error = null;  // Resetea el error, por si hubo un intento previo que falló.

        // Realiza la consulta a la base de datos para obtener los productos.
        const snapshot = await get(dbRef(db, "productos"));

        // Si la consulta devuelve resultados, los procesa.
        if (snapshot.exists()) {
          // Convierte los productos obtenidos en un arreglo de objetos con sus respectivas propiedades.
          this.productos = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,  // Extiende los datos del producto con el ID
            imagenUrl: this.getImageUrl(id)  // Asigna la URL de la imagen generada para el producto
          }));
        } else {
          this.productos = [];  // Si no hay productos, se asigna un arreglo vacío
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
        this.error = "Error al cargar los productos. Por favor, intente nuevamente.";  // Mensaje de error si algo falla
      } finally {
        this.loading = false;  // Marca la carga como completada
      }
    },
    
    /**
     * Función para formatear el precio de los productos con el formato adecuado.
     * @param {number} price - El precio del producto.
     * @returns {string} - El precio formateado en formato moneda (España).
     */
    formatPrice(price) {
      return Number(price).toLocaleString("es-ES");
    },
    
    /**
     * Maneja los errores de carga de imagen, mostrando una imagen por defecto en caso de error.
     * @param {Event} event - El evento que se dispara cuando una imagen no puede cargarse.
     */
    handleImageError(event) {
      console.log('Error cargando imagen', event.target.src);
      event.target.src = this.placeholderImage;  // Asigna una imagen por defecto
      event.target.onerror = null;  // Elimina el manejador de errores para evitar bucles infinitos
      event.target.style.objectFit = 'contain';  // Cambia el ajuste de la imagen para que se vea bien
    },

    /**
     * Función para generar la URL de la imagen de cada producto, basándose en su ID.
     * La URL de la imagen se construye usando el ID del producto.
     * @param {string} productId - El ID del producto (ej. "producto1").
     * @returns {string} - La URL de la imagen correspondiente al producto.
     */
    getImageUrl(productId) {
      // Extrae el número del ID (ej: "producto1" -> 1)
      const num = parseInt(productId.replace(/\D/g, '')) || 1;  // Extrae el número y lo convierte a entero.
      
      // Devuelve la URL de la imagen, asegurándose de que el número del producto no sea mayor a 20.
      return `/imagenes/producto(${Math.min(num, 20)}).jpg`;  
    }
  },

  /**
   * Hook de ciclo de vida de Vue que se ejecuta cuando el componente ha sido montado.
   * Aquí se llama a la función para obtener los productos desde la base de datos de Firebase.
   */
  async mounted() {
    await this.fetchProductos();  // Llama a la función para obtener los productos al montar el componente.
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
