<template>
  <section class="carrito">
    <div class="carrito-header">
      <h2>Tu Carrito</h2>
      <p v-if="carrito.length === 0" class="vacío">Tu carrito está vacío.</p>
    </div>

    <div v-if="carrito.length > 0" class="productos-carrito">
      <div v-for="producto in carrito" :key="producto.id" class="producto-item">
        <img :src="getImageUrl(producto.id)" :alt="producto.nombre" class="producto-imagen" />
        <div class="producto-info">
          <h3>{{ producto.nombre }}</h3>
          <p class="descripcion">{{ producto.descripcion }}</p>
          <div class="cantidad-precio">
            <input 
              type="number" 
              v-model.number="producto.cantidad" 
              min="1" 
              class="cantidad" 
              @change="actualizarCantidad(producto.id, producto.cantidad)" 
            />
            <span class="precio">${{ (producto.precio * producto.cantidad).toFixed(2) }}</span>
          </div>
          <button @click="eliminarProducto(producto.id)" class="btn-eliminar">Eliminar</button>
        </div>
      </div>
      <div class="total">
        <p><strong>Total:</strong> ${{ total.toFixed(2) }}</p>
        <button class="btn-primary" @click="abrirFormulario">Realizar Compra</button>
      </div>
    </div>

    <!-- Formulario de compra -->
    <div v-if="mostrarFormulario" class="form-overlay">
      <form class="form-compra" @submit.prevent="procesarCompra">
        <h2>Datos de Compra</h2>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model.trim="form.nombre" required />
        </div>
        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input type="text" id="apellidos" v-model.trim="form.apellidos" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="form.email" required />
        </div>
        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input type="text" id="direccion" v-model.trim="form.direccion" required />
        </div>
        <div class="form-group">
          <label for="metodoPago">Método de Pago</label>
          <select id="metodoPago" v-model="form.metodoPago" required>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="paypal">PayPal</option>
            <option value="transferencia">Transferencia Bancaria</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Confirmar Compra</button>
          <button type="button" class="btn-secundary" @click="cerrarFormulario">Cancelar</button>
        </div>
      </form>
    </div>
  </section>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
import { ref as dbRef, onValue, remove, update, set } from 'firebase/database';

const carrito = ref([]);
const mostrarFormulario = ref(false);
const form = ref({
  nombre: '',
  apellidos: '',
  email: '',
  direccion: '',
  metodoPago: 'tarjeta'
});

// Obtener imagen del producto
const getImageUrl = (productId) => {
  const num = parseInt(productId.replace(/\D/g, '')) || 1;
  return `/imagenes/producto(${Math.min(num, 20)}).jpg`;
};

// Cargar carrito desde Firebase con gestión de memoria
let carritoListener;
onMounted(() => {
  const carritoRef = dbRef(db, 'carrito');
  carritoListener = onValue(carritoRef, (snapshot) => {
    if (snapshot.exists()) {
      carrito.value = Object.entries(snapshot.val()).map(([id, item]) => ({
        id,
        ...item,
        // Asegurar que cantidad es número y no menor a 1
        cantidad: Math.max(1, Number(item.cantidad) || 1)
      }));
    } else {
      carrito.value = [];
    }
  });
});

// Limpiar listener al desmontar
onUnmounted(() => {
  if (carritoListener) {
    carritoListener(); // Esto elimina el listener
  }
});

// Calcular el total del carrito
const total = computed(() => {
  return carrito.value.reduce((sum, producto) => {
    return sum + (producto.precio * producto.cantidad);
  }, 0);
});

// Actualizar cantidad en Firebase con validación
const actualizarCantidad = async (productId, nuevaCantidad) => {
  const cantidad = Math.max(1, Number(nuevaCantidad) || 1);
  try {
    const productoRef = dbRef(db, `carrito/${productId}`);
    await update(productoRef, { cantidad });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    // Podrías mostrar una notificación al usuario aquí
  }
};

// Eliminar producto del carrito con confirmación
const eliminarProducto = (productId) => {
  if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
    const productoRef = dbRef(db, `carrito/${productId}`);
    remove(productoRef);
  }
};

// Procesar compra con validación
const procesarCompra = async () => {
  try {
    // Validación adicional del formulario
    if (!form.value.nombre || !form.value.apellidos || !form.value.email || !form.value.direccion || !form.value.metodoPago) {
  alert('Por favor completa todos los campos requeridos');
  return;
}

    // Aquí iría la lógica para procesar el pago
    // Por ahora simulamos una respuesta exitosa
    
    // Guardar el pedido en Firebase
    const pedidoRef = dbRef(db, `pedidos/${Date.now()}`);
    await set(pedidoRef, {
      ...form.value,
      productos: carrito.value,
      total: total.value,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    });
    console.log('Datos del formulario:', form.value);
console.log('Productos en el carrito:', carrito.value);
console.log('Total:', total.value);
    // Vaciar el carrito después de la compra
    await remove(dbRef(db, 'carrito'));
    
    // Resetear formulario
    form.value = {
      nombre: '',
      apellidos: '',
      email: '',
      direccion: '',
      metodoPago: 'tarjeta'
    };
    
    mostrarFormulario.value = false;
    alert(`¡Compra realizada con éxito! Recibirás un correo en breve con tu pedido${form.value.email}`);
    
  } catch (error) {
    console.error('Error al procesar compra:', error);
    alert('Hubo un error al procesar tu compra. Por favor intenta nuevamente.');
  }
  

};

const abrirFormulario = () => {
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
};
</script>
<style scoped>

.carrito {
  background-color: #f4f7f6;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  min-height: 68vh;
  margin: 2rem auto;
  max-width: 1200px;
}

.carrito-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.carrito-header h2 {
  font-size: 2rem;
  color: #333;
}

.vacío {
  font-size: 1.2rem;
  color: #777;
}

.productos-carrito {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.producto-item {
  background: #fff;
  padding: 1.2rem;
  display: flex;
  gap: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  align-items: center;
}

.producto-imagen {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.producto-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.producto-info h3 {
  font-size: 1.3rem;
  margin: 0.5rem 0;
  color: #222;
}

.descripcion {
  font-size: 1rem;
  color: #777;
  margin-bottom: 1rem;
}

.cantidad-precio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
}

.cantidad {
  width: 50px;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.precio {
  font-size: 1.3rem;
  font-weight: bold;
  color: #222;
}

.btn-eliminar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  background-color: #ff4c4c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: auto;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-eliminar:hover {
  background-color: #e43f3f;
}

.total {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-primary {
  background-color: #5c36f2;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #e67d00;
}


.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-compra {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.form-compra h2 {
  color: #5c36f2;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.btn-primary {
  background-color: #5c36f2;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #e67d00;
}

.btn-secundary {
  background-color: #ccc;
  color: #333;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secundary:hover {
  background-color: #bbb;
}
</style>