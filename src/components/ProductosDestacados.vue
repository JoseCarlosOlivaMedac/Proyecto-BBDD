<template>
  <section class="productos-destacados">
    <h2>Productos Destacados</h2>
    
    <!-- Mensaje de carga mientras se obtienen los productos -->
    <div v-if="loading" class="loading-message">Cargando productos destacados...</div>
    
    <!-- Mensaje de error en caso de fallo al cargar los productos -->
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <!-- Grid de productos que se muestra cuando los productos están disponibles -->
    <div v-else class="productos-grid">
      <div 
        v-for="producto in productos.slice(0, 4)" 
        :key="producto.id" 
        class="producto"
      >
        <!-- Contenedor de la imagen del producto -->
        <div class="producto-imagen-container">
          <img 
            :src="producto.imagenUrl || placeholderImage" 
            :alt="producto.nombre"
            @error="handleImageError" 
          />
        </div>
        
        <!-- Nombre y descripción del producto -->
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        
        <!-- Precio del producto formateado -->
        <span class="precio">${{ formatPrice(producto.precio) }}</span>
        
        <!-- Componente para agregar el producto al carrito -->
        <ButtonCarrito :productoId="producto.id" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';  // Importa 'ref' para declarar reactivas y 'onMounted' para ejecutar código cuando el componente se monta
import { db } from '../firebase';  // Importa la configuración de Firebase para usar la base de datos en tiempo real
import { ref as dbRef, get } from 'firebase/database';  // Importa las funciones necesarias para acceder a la base de datos de Firebase
import ButtonCarrito from './ButtonCarrito.vue';  // Importa el componente ButtonCarrito para ser usado dentro del template

// Variables reactivas
const productos = ref([]);  // Arreglo para almacenar los productos obtenidos de Firebase
const loading = ref(true);  // Estado que indica si los productos están siendo cargados
const error = ref(null);  // En caso de error, se almacena el mensaje de error aquí
const placeholderImage = '/imagenes/placeholder.jpg';  // Imagen por defecto si falla la carga de una imagen

// Función asincrónica para obtener los productos de la base de datos de Firebase
const fetchProductos = async () => {
  try {
    loading.value = true;  // Marca el inicio de la carga
    error.value = null;  // Resetea el error

    // Realiza una consulta para obtener los productos de la base de datos de Firebase
    const snapshot = await get(dbRef(db, 'productos'));

    // Si existen productos, se procesan y se asignan al arreglo 'productos'
    if (snapshot.exists()) {
      productos.value = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,  // Se extienden los datos del producto con el ID
        imagenUrl: getImageUrl(id)  // Genera la URL de la imagen para cada producto
      }));
    } else {
      console.log("No hay productos disponibles.");
      productos.value = [];  // Si no hay productos, se asigna un arreglo vacío
    }
  } catch (err) {
    console.error("Error al obtener productos:", err);
    error.value = "Error al cargar productos destacados";  // Asigna un mensaje de error si ocurre un problema
  } finally {
    loading.value = false;  // Marca la carga como completada
  }
};

// Función para generar la URL de la imagen de un producto, basándose en su ID
const getImageUrl = (productId) => {
  // Extrae el número del ID del producto (ej: "producto1" -> 1)
  const num = parseInt(productId.replace(/\D/g, '')) || 1;  // Asegura que siempre se extrae un número válido
  return `/imagenes/producto(${Math.min(num, 20)}).jpg`;  // Devuelve la URL de la imagen asegurando que no sea mayor a 20
};

// Función para formatear el precio de un producto a formato de moneda (España)
const formatPrice = (price) => {
  return Number(price).toLocaleString("es-ES");  // Formatea el precio en formato numérico de España
};

// Función que maneja el error de carga de imágenes, mostrando una imagen por defecto en caso de error
const handleImageError = (event) => {
  event.target.src = placeholderImage;  // Asigna la imagen por defecto
  event.target.onerror = null;  // Elimina el manejador de errores para evitar bucles infinitos
  event.target.style.objectFit = 'contain';  // Ajusta la imagen para que se vea correctamente
};

// Se ejecuta cuando el componente se monta
onMounted(() => {
  fetchProductos();  // Llama a la función para obtener los productos de Firebase
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