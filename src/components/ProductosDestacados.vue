<template>
  <section class="productos-destacados">
    <h2>Productos Destacados</h2>
    
    <!-- Notificación de producto agregado -->
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>
    
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
        
        <ButtonCarrito 
          :productoId="producto.id" 
          @producto-agregado="handleProductoAgregado"
          @error-carrito="handleErrorCarrito"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
import { ref as dbRef, get } from 'firebase/database';
import ButtonCarrito from './ButtonCarrito.vue';

// Variables reactivas
const productos = ref([]);
const loading = ref(true);
const error = ref(null);
const placeholderImage = '/imagenes/placeholder.jpg';
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationTimeout = ref(null);

// Función para obtener productos
const fetchProductos = async () => {
  try {
    loading.value = true;
    error.value = null;

    const snapshot = await get(dbRef(db, 'productos'));

    if (snapshot.exists()) {
      productos.value = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
        imagenUrl: getImageUrl(id)
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

// Función para generar URL de imagen
const getImageUrl = (productId) => {
  const num = parseInt(productId.replace(/\D/g, '')) || 1;
  return `/imagenes/producto(${Math.min(num, 20)}).jpg`;
};

// Función para formatear precio
const formatPrice = (price) => {
  return Number(price).toLocaleString("es-ES");
};

// Manejo de errores de imagen
const handleImageError = (event) => {
  event.target.src = placeholderImage;
  event.target.onerror = null;
  event.target.style.objectFit = 'contain';
};

// Manejo de producto agregado
const handleProductoAgregado = (producto) => {
  console.log('Producto agregado:', producto);
  showNotificationMessage(`${producto.nombre} añadido al carrito`);
};

// Manejo de errores del carrito
const handleErrorCarrito = (error) => {
  console.error('Error en carrito:', error);
  showNotificationMessage(`Error al agregar producto: ${error.mensaje}`, true);
};

// Mostrar notificación
const showNotificationMessage = (message, isError = false) => {
  notificationMessage.value = message;
  showNotification.value = true;
  
  // Estilo diferente para errores
  if (isError) {
    const notificationEl = document.querySelector('.productos-destacados .notification');
    if (notificationEl) {
      notificationEl.style.backgroundColor = '#ff6b6b';
    }
  }
  
  // Oculta la notificación después de 3 segundos
  clearTimeout(notificationTimeout.value);
  notificationTimeout.value = setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// Limpiar timeout al desmontar
onMounted(() => {
  fetchProductos();
});

// Limpieza
onUnmounted(() => {
  clearTimeout(notificationTimeout.value);
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

/*Estilos para la notificacion de agregar al carro*/

.productos-destacados {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: #333;
  margin: 1rem 0;
  padding: 2rem 0;
  position: relative;
}

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