<template>
    <button @click="agregarAlCarrito" class="btn-secundary">
      Agregar al Carrito
    </button>
  </template>
  
  <script setup>
  import { ref as dbRef, set, get, update } from 'firebase/database';
  import { db } from '../firebase';
  
  const props = defineProps({
    productoId: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['producto-agregado', 'error-carrito']);
  
  const agregarAlCarrito = async () => {
    try {
      // Validación básica
      if (!props.productoId) {
        throw new Error('ID de producto no proporcionado');
      }
  
      // 1. Verificar si el producto existe en la colección principal
      const productoRef = dbRef(db, `productos/${props.productoId}`);
      const productoSnapshot = await get(productoRef);
      
      if (!productoSnapshot.exists()) {
        throw new Error(`Producto ${props.productoId} no encontrado en la base de datos`);
      }
  
      // 2. Obtener datos del producto
      const productoData = productoSnapshot.val();
      
      // 3. Referencia al carrito
      const carritoRef = dbRef(db, `carrito/${props.productoId}`);
      const carritoSnapshot = await get(carritoRef);

      let cantidad = 1; //Cantidad predeterminada al agregar al carrito
  
      // 4. Lógica para añadir/actualizar
      if (carritoSnapshot.exists()) {
        // Si ya existe, incrementar cantidad
        await update(carritoRef, {
          cantidad: carritoSnapshot.val().cantidad + 1,
          ultimaActualizacion: new Date().toISOString()
        });
      } else {
        // Si no existe, crear nuevo registro
        await set(carritoRef, {
          id: props.productoId,
          nombre: productoData.nombre,
          precio: productoData.precio,
          imagen: productoData.imagen,
          cantidad: 1,
          fechaAgregado: new Date().toISOString(),
          ultimaActualizacion: new Date().toISOString()
        });
      }
  
      // Notificación y logging
      console.log('✅ Producto actualizado en carrito:', {
        id: props.productoId,
        nombre: productoData.nombre,
        cantidad
      });
      
      emit('producto-agregado', {
        id: props.productoId,
        nombre: productoData.nombre,
        cantidad
      });
  
    } catch (error) {
      console.error('❌ Error en agregarAlCarrito:', {
        productoId: props.productoId,
        error: error.message,
        stack: error.stack
      });
      
      emit('error-carrito', {
        productoId: props.productoId,
        mensaje: error.message
      });
    }
  };

  
  </script>
  <style scoped>
  .btn-secundary {
      background-color: #5c36f2;
      color: white;
      text-decoration: none;
      padding: 0.7rem 1.5rem;
      border-radius: 6px;
      font-weight: bold;
      transition: background 0.3s ease;
      border: none;
      cursor: pointer;
  }
  
  .btn-secundary:hover {
      background-color: rgb(230, 125, 0);
  }
  </style>