<template>
  <div class="carrito">
    <h2>Carrito de Compras</h2>
    <div v-if="carrito.length === 0" class="carrito-vacio">
      <p>Tu carrito está vacío.</p>
    </div>
    <transition-group name="fade" tag="div">
      <div v-for="producto in carrito" :key="producto.id" class="producto">
        <div class="info">
          <img :src="producto.imagen" :alt="producto.nombre" class="imagen-producto" />
          <div class="detalles">
            <h3>{{ producto.nombre }}</h3>
            <p>Precio unitario: ${{ producto.precio.toFixed(2) }}</p>
          </div>
        </div>
        <div class="cantidad-precio">
          <div class="cantidad-control">
            <button @click="decrementarCantidad(producto)">-</button>
            <input type="number" v-model.number="producto.cantidad" min="1" class="cantidad" />
            <button @click="incrementarCantidad(producto)">+</button>
          </div>
          <span class="precio">${{ (producto.precio * producto.cantidad).toFixed(2) }}</span>
        </div>
        <button @click="confirmarEliminacion(producto)" class="eliminar">Eliminar</button>
      </div>
    </transition-group>

    <div v-if="carrito.length > 0" class="total">
      <h3>Total: ${{ total.toFixed(2) }}</h3>
      <button @click="vaciarCarrito" class="vaciar-carrito">Vaciar Carrito 🗑️</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, inject } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de que db está correctamente configurado

const carrito = ref([]);

// Inyectamos la función addToCart desde el componente principal
const addToCart = inject('addToCart');

// Al montar el componente, se verifica si hay productos en el localStorage y se cargan
onMounted(() => {
  const storedCart = JSON.parse(localStorage.getItem('carrito'));
  if (storedCart) {
    carrito.value = storedCart;
  }
});

// Cuando el carrito cambie, se guarda en el localStorage
watch(carrito, (nuevoCarrito) => {
  localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
}, { deep: true });

// Cálculo total del carrito
const total = computed(() => carrito.value.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0));

// Incrementar cantidad de un producto
const incrementarCantidad = (producto) => {
  if (producto.cantidad < producto.stock) {
    producto.cantidad++;
    actualizarCarrito(producto);
  } else {
    alert("No hay suficiente stock para este producto.");
  }
};

// Decrementar cantidad de un producto
const decrementarCantidad = (producto) => {
  if (producto.cantidad > 1) {
    producto.cantidad--;
    actualizarCarrito(producto);
  }
};

// Confirmación para eliminar un producto del carrito
const confirmarEliminacion = (producto) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}" del carrito?`)) {
    eliminarDelCarrito(producto);
  }
};

// Eliminar un producto del carrito
const eliminarDelCarrito = (producto) => {
  carrito.value = carrito.value.filter(p => p.id !== producto.id);
  actualizarCarrito();
};

// Vaciar el carrito
const vaciarCarrito = () => {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    carrito.value = [];
    actualizarCarrito();
  }
};

// Actualiza el carrito y sincroniza con Firebase
const actualizarCarrito = (productoModificado) => {
  // Actualizamos el carrito en el localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito.value));

  // Si hemos modificado el producto, actualizamos el stock en Firebase
  if (productoModificado) {
    // Actualizar el stock en Firebase
    const productoRef = doc(db, "camisetas", productoModificado.id);
    updateDoc(productoRef, {
      stock: productoModificado.stock - productoModificado.cantidad
    }).then(() => {
      console.log("Stock actualizado en Firebase");
    }).catch((error) => {
      console.error("Error al actualizar stock en Firebase", error);
    });
  }
};
</script>

<style scoped>
.carrito {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 16px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carrito h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.producto {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.imagen-producto {
  width: 80px;
  height: auto;
  border-radius: 8px;
  margin-right: 1rem;
}

.info {
  display: flex;
  align-items: center;
}

.detalles h3 {
  margin: 0;
  font-size: 1.1rem;
}

.detalles p {
  margin: 0;
  color: #555;
}

.cantidad-precio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cantidad-control {
  display: flex;
  align-items: center;
}

.cantidad-control button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.cantidad-control input {
  width: 50px;
  text-align: center;
  margin: 0 0.3rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 0.2rem;
}

.precio {
  font-weight: bold;
}

.eliminar {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.total {
  text-align: center;
  margin-top: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.vaciar-carrito {
  background-color: #e67e22;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

/* Animaciones */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsivo */
@media (max-width: 600px) {
  .producto {
    flex-direction: column;
    align-items: flex-start;
  }

  .cantidad-precio {
    width: 100%;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .total h3 {
    font-size: 1.2rem;
  }
}
</style>
