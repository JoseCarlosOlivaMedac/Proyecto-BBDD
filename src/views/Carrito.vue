<template>
    <section class="carrito">
      <div class="carrito-header">
        <h2>Tu Carrito</h2>
        <p v-if="carrito.length === 0" class="vacío">Tu carrito está vacío.</p>
      </div>
  
      <div v-if="carrito.length > 0" class="productos-carrito">
        <div v-for="(producto, index) in carrito" :key="index" class="producto-item">
          <img :src="producto.imagen" :alt="producto.nombre" class="producto-imagen" />
          <div class="producto-info">
            <h3>{{ producto.nombre }}</h3>
            <p class="descripcion">{{ producto.descripcion }}</p>
            <div class="cantidad-precio">
              <input 
                type="number" 
                v-model="producto.cantidad" 
                min="1" 
                class="cantidad" 
                @input="calcularTotal" 
              />
              <span class="precio">${{ (producto.precio * producto.cantidad).toFixed(2) }}</span>
            </div>
            <button @click="eliminarProducto(index)" class="btn-eliminar">Eliminar</button>
          </div>
        </div>
        <div class="total">
          <p><strong>Total:</strong> ${{ total.toFixed(2) }}</p>
          <button class="btn-primary" @click="checkout">Realizar Compra</button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Lista de productos en el carrito
  const carrito = ref([
    {
      nombre: "Producto 1",
      descripcion: "Descripción del producto 1",
      precio: 20.0,
      cantidad: 1,
      imagen: "/imagenes/producto1.jpg",
    },
    {
      nombre: "Producto 2",
      descripcion: "Descripción del producto 2",
      precio: 25.0,
      cantidad: 2,
      imagen: "/imagenes/producto2.jpg",
    },
  ]);
  
  // Calcular el total del carrito
  const calcularTotal = () => {
    return carrito.value.reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };
  
  // Total calculado
  const total = computed(() => calcularTotal());
  
  // Eliminar producto del carrito
  const eliminarProducto = (index) => {
    carrito.value.splice(index, 1);
  };
  
  // Acción de checkout (ejemplo, redirigir o mostrar mensaje)
  const checkout = () => {
    alert('¡Gracias por tu compra! Te redirigimos a la página de pago.');
    // Aquí podrías redirigir a otra vista de pago, por ejemplo: router.push('/pago');
  };
  </script>
  
  <style scoped>
  .carrito {
    background-color: #f4f7f6;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 90%;
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
    background-color: #ff4c4c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
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
  </style>
  