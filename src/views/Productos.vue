<template>
  <div>
    <h1>Productos</h1>
    <div v-if="loading">Cargando...</div>
    <div v-else>
      <div v-for="(producto, index) in productos" :key="index" class="producto">
        <h2>{{ producto.nombre }}</h2>
        <p>{{ producto.descripcion }}</p>
        <p>Precio: ${{ producto.precio }}</p>
        <img :src="producto.imagen" alt="Producto" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue"; // Importa la función nextTick
import { realTimeDb, get, ref as dbRef } from "../firebase"; // Importa Firebase

export default {
  name: "Productos",
  data() {
    return {
      productos: [], // Aquí almacenaremos los productos
      loading: true, // Estado de carga
    };
  },
  methods: {
    async fetchProductos() {
      try {
        // Verifica que el servicio de Firebase se esté conectando correctamente
        console.log("Iniciando la solicitud de productos desde Firebase...");

        const productosRef = dbRef(realTimeDb, "productos"); // Referencia de productos en Firebase
        const snapshot = await get(productosRef); // Solicita los datos

        if (snapshot.exists()) {
          console.log("Datos crudos de Firebase:", snapshot.val()); // Verifica los datos crudos antes de convertirlos
          this.productos = Object.values(snapshot.val()); // Convierte los datos en un array
          console.log("Productos después de convertir a array:", this.productos); // Verifica los productos después de la conversión
          
          // Asegura que Vue reaccione a la actualización de los productos
          nextTick(() => {
            console.log("Productos después de la actualización reactiva:", this.productos); // Verifica después de la actualización reactiva
          });
        } else {
          console.log("No hay datos disponibles en Firebase");
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error); // Captura el error
      } finally {
        this.loading = false; // Deja de mostrar el mensaje de carga
        console.log("Estado de carga después de la solicitud:", this.loading); // Verifica que el estado de carga haya cambiado
      }
    },
  },
  mounted() {
    console.log("Component mounted. Ejecutando fetchProductos...");
    this.fetchProductos(); // Llama a la función para obtener los productos
    console.log("Productos después de fetch:", this.productos); // Verifica si los productos están vacíos inicialmente
  },
};
</script>

<style scoped>
.producto {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.producto img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
</style>
