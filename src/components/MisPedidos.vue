<template>
    <section class="mis-pedidos">
      <h1>Mis Pedidos</h1>
      <div v-if="loading" class="loading">Cargando pedidos...</div>
      <div v-else-if="pedidos.length === 0" class="no-pedidos">
        <p>No tienes pedidos registrados.</p>
      </div>
      <div v-else class="pedidos-list">
        <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-item">
          <div class="pedido-header">
            <h2>Pedido #{{ pedido.id }}</h2>
            <p><strong>Fecha:</strong> {{ formatDate(pedido.fecha) }}</p>
            <p><strong>Total:</strong> ${{ pedido.total.toFixed(2) }}</p>
          </div>
          <ul class="productos-list">
            <li v-for="producto in pedido.productos" :key="producto.id" class="producto-item">
              <span>{{ producto.nombre }}</span>
              <span>{{ producto.cantidad }} x ${{ producto.precio }}</span>
            </li>
          </ul>
          <div class="pedido-actions">
            <button class="btn seguimiento" @click="seguirPaquete(pedido.id)">Seguimiento de Paquete</button>
            <button class="btn devolucion" @click="devolverPedido(pedido.id)">Devoluciones</button>
            <button class="btn eliminar" @click="eliminarPedido(pedido.id)">Eliminar Pedido</button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { db } from "../firebase"; // Importa la referencia a Firebase
  import { ref as dbRef, onValue, remove } from "firebase/database";
  import { auth } from "../firebase"; // Importa el servicio de autenticación
  
  const pedidos = ref([]); // Lista de pedidos
  const loading = ref(true); // Estado de carga
  
  // Formatear fecha
  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Función para eliminar un pedido
  const eliminarPedido = async (pedidoId) => {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      const pedidoRef = dbRef(db, `pedidos/${pedidoId}`);
      await remove(pedidoRef);
      pedidos.value = pedidos.value.filter((pedido) => pedido.id !== pedidoId);
      alert("Pedido eliminado con éxito.");
    }
  };
  
  // Función para seguimiento de paquete
  const seguirPaquete = (pedidoId) => {
    alert(`Redirigiendo al seguimiento del paquete para el pedido #${pedidoId}.`);
    // Aquí podrías redirigir a una página de seguimiento o mostrar un modal con información
  };
  
  // Función para devoluciones
  const devolverPedido = (pedidoId) => {
    alert(`Iniciando proceso de devolución para el pedido #${pedidoId}.`);
    // Aquí podrías redirigir a una página de devoluciones o mostrar un formulario
  };
  
  onMounted(() => {
    const user = auth.currentUser; // Obtener el usuario autenticado
    if (!user) {
      alert("Debes iniciar sesión para ver tus pedidos.");
      return;
    }
  
    const pedidosRef = dbRef(db, `pedidos`);
    onValue(pedidosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userPedidos = Object.entries(data)
          .filter(([id, pedido]) => pedido.email === user.email) // Filtrar pedidos del usuario actual
          .map(([id, pedido]) => ({
            id,
            ...pedido,
          }));
        pedidos.value = userPedidos;
      } else {
        pedidos.value = [];
      }
      loading.value = false;
    });
  });
  </script>
  
  <style scoped>
  .mis-pedidos {
    padding: 2rem;
    max-width: 900px;
    height: 68vh;
    margin: 0 auto;
    background-color: #f4f7f6;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #5c36f2;
    margin-bottom: 1.5rem;
  }
  
  .loading {
    text-align: center;
    font-size: 1.2rem;
    color: #333;
  }
  
  .no-pedidos {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
  }
  
  .pedidos-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .pedido-item {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .pedido-header {
    margin-bottom: 1rem;
  }
  
  .pedido-header h2 {
    margin: 0;
    color: #333;
  }
  
  .pedido-header p {
    margin: 0.3rem 0;
    color: #555;
  }
  
  .productos-list {
    margin: 1rem 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid #ddd;
    padding-top: 1rem;
  }
  
  .producto-item {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    color: #444;
  }
  
  .pedido-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
  
  .btn.seguimiento {
    background-color: #5c36f2;
    color: white;
  }
  
  .btn.seguimiento:hover {
    background-color: #4a2ecb;
  }
  
  .btn.devolucion {
    background-color: #e67d00;
    color: white;
  }
  
  .btn.devolucion:hover {
    background-color: #d65c00;
  }
  
  .btn.eliminar {
    background-color: #d9534f;
    color: white;
  }
  
  .btn.eliminar:hover {
    background-color: #c9302c;
  }
  </style>