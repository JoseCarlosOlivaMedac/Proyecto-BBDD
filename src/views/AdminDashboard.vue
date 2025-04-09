
<template>
    <div class="admin-container">
      <h1 class="title">🛒 Panel de Administración</h1>
  
      <!-- Formulario para agregar o editar -->
      <form @submit.prevent="guardarProducto" class="form-card">
        <h2 class="form-title">
          {{ editando ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}
        </h2>
  
        <div class="form-grid">
          <input v-model="form.nombre" type="text" placeholder="Nombre del producto" class="form-input" required />
          <input v-model.number="form.precio" type="number" placeholder="Precio (€)" class="form-input" required />
          <input v-model="form.imagen" type="text" placeholder="URL de imagen (opcional)" class="form-input full-width" />
          <textarea v-model="form.descripcion" placeholder="Descripción" class="form-input full-width"></textarea>
        </div>
  
        <div class="form-buttons">
          <button type="submit" class="btn btn-primary">
            {{ editando ? '💾 Actualizar' : '📦 Agregar' }}
          </button>
          <button v-if="editando" @click="cancelarEdicion" type="button" class="btn btn-secondary">
            ❌ Cancelar
          </button>
        </div>
      </form>
  
      <!-- Lista de productos -->
      <div v-if="productos.length" class="product-list">
        <div
          v-for="producto in productos"
          :key="producto.id"
          class="product-card"
        >
          <div class="product-content">
            <img
              v-if="producto.imagen"
              :src="producto.imagen"
              alt="Imagen del producto"
              class="product-image"
              @error="handleImageError($event,producto)"
              @load="handleImageLoad($event, producto)"
            />
            <div class="product-details">
              <h3 class="product-name">{{ producto.nombre }}</h3>
              <p class="product-description">{{ producto.descripcion }}</p>
              <p class="product-price">💶 €{{ producto.precio }}</p>
            </div>
          </div>
          <div class="product-actions">
            <button @click="cargarProducto(producto)" class="btn-action btn-edit">✏️ Editar</button>
            <button @click="eliminarProducto(producto.id)" class="btn-action btn-delete">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
  
      <p v-else class="empty-message">No hay productos aún. ¡Agrega el primero! 🚀</p>
    </div>
  </template>
  
  <script setup>
  // Importamos funciones de Vue
  import { ref, onMounted } from 'vue'
  
  // Importamos la función reutilizable
  import { getImageUrl } from '@/utils'
  
  // Importamos la referencia a la base de datos desde firebase.js
  import { db } from '@/firebase'
  
  // Funciones necesarias de Realtime Database
  import {
    ref as dbRef,
    onValue,
    push,
    update,
    remove
  } from 'firebase/database'
  
  // Estado reactivo para la lista de productos
  const productos = ref([])
  
  // Formulario reactivo para agregar o editar productos
  const form = ref({
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: ''
  })
  
  // Variables de control para edición
  const editando = ref(false)
  const idEditando = ref(null)
  
  // Función mejorada para manejar carga de imágenes
  const handleImageLoad = (event, producto) => {
    console.log('Imagen cargada correctamente:', producto.imagen)
    event.target.classList.add('loaded')
    event.target.classList.remove('error')
  }
  
  // Manejador de errores de imagen mejorado
  const handleImageError = (event, producto) => {
    console.error('Error cargando imagen:', producto.imagen)
    
    const fallbackImage = getImageUrl(producto.id)
    
    // Si ya estamos intentando cargar el fallback, usamos placeholder
    if (event.target.src.includes(fallbackImage) || event.target.src.includes('placeholder')) {
      event.target.src = '/imagenes/placeholder.jpg'
      event.target.onerror = null // Prevenir bucles infinitos
      return
    }
    
    // Primero intentamos con la imagen por defecto del producto
    event.target.src = fallbackImage
  }
  
  // Función optimizada para procesar productos
  const procesarProducto = (id, producto) => {
    // Validamos y limpiamos la URL de imagen
    let imagen = producto.imagen?.trim() || ''
    
    // Si la imagen parece una URL válida (http/https) o es base64, la usamos
    const isExternalImage = imagen.startsWith('http') || 
                           imagen.startsWith('data:image') ||
                           imagen.startsWith('blob:')
    
    return {
      id,
      ...producto,
      imagen: getImageUrl(id), // Aseguramos que se use getImageUrl
      precio: Number(producto.precio) || 0
    }
  }
  
  // Función para obtener productos con depuración
  const obtenerProductos = () => {
    const productosRef = dbRef(db, 'productos')
  
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        productos.value = []
        return
      }
  
      // Procesamos con validación adicional
      productos.value = Object.entries(data).map(([id, producto]) => {
        const processed = procesarProducto(id, producto)
        console.log('Procesando producto:', { id, original: producto, processed })
        return processed
      })
    }, (error) => {
      console.error('Error leyendo productos:', error)
    })
  }
  
  // Guardar producto con validación mejorada
  const guardarProducto = async () => {
    if (!form.value.nombre?.trim()) {
      alert('El nombre del producto es requerido')
      return
    }
  
    if (Number(form.value.precio) <= 0) {
      alert('El precio debe ser mayor que 0')
      return
    }
  
    try {
      const productoData = {
        nombre: form.value.nombre.trim(),
        precio: Number(form.value.precio),
        descripcion: form.value.descripcion.trim(),
        imagen: form.value.imagen.trim() || null // Guardamos null si está vacío
      }
  
      if (editando.value) {
        await update(dbRef(db, `productos/${idEditando.value}`), productoData)
      } else {
        await push(dbRef(db, 'productos'), productoData)
      }
  
      limpiarFormulario()
    } catch (error) {
      console.error('Error guardando producto:', error)
      alert(`Error: ${error.message || 'No se pudo guardar el producto'}`)
    }
  }
  
  // Eliminar producto con confirmación
  const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    
    try {
      await remove(dbRef(db, `productos/${id}`))
    } catch (error) {
      console.error('Error eliminando producto:', error)
      alert('No se pudo eliminar el producto')
    }
  }
  
  // Cargar producto para edición
  const cargarProducto = (producto) => {
    form.value = {
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen || ''
    }
    idEditando.value = producto.id
    editando.value = true
  }
  
  // Limpiar formulario
  const limpiarFormulario = () => {
    form.value = {
      nombre: '',
      precio: 0,
      descripcion: '',
      imagen: ''
    }
    editando.value = false
    idEditando.value = null
  }
  
  // Iniciamos al montar el componente
  onMounted(() => {
    console.log('Iniciando panel de administración...')
    obtenerProductos()
  })
  </script>
  <style scoped>
  .admin-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 32px;
    text-align: center;
  }
  
  /* Formulario */
  .form-card {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    margin-bottom: 40px;
  }
  
  .form-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #5c36f2;
    margin-bottom: 16px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  .form-input {
    width: 100%;
    padding: 12px;
    margin: 5px 5px 0 0;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #5c36f2;
    box-shadow: 0 0 0 2px rgba(92, 54, 242, 0.2);
  }
  
  .full-width {
    grid-column: span 1;
  }
  
  @media (min-width: 768px) {
    .full-width {
      grid-column: span 2;
    }
  }
  
  .form-buttons {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
  
  /* Botones */
  .btn {
    padding: 8px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    border: none;
    font-size: 1rem;
  }
  
  .btn:hover {
    transform: translateY(-1px);
  }
  
  .btn:active {
    transform: translateY(0);
  }
  
  .btn-primary {
    background-color: #5c36f2;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #4a2bd6;
  }
  
  .btn-secondary {
    background-color: #E67D00;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #cc7000;
  }
  
  .btn-action {
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
    font-size: 0.9rem;
    padding: 4px 8px;
  }
  
  .btn-edit {
    color: #5c36f2;
  }
  
  .btn-edit:hover {
    text-decoration: underline;
  }
  
  .btn-delete {
    color: #e63946;
  }
  
  .btn-delete:hover {
    text-decoration: underline;
  }
  
  /* Lista de productos */
  .product-list {
    display: grid;
    gap: 24px;
    margin-top: 40px;
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 640px) {
    .product-list {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  .product-card {
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .product-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .product-content {
    display: flex;
    gap: 16px;
  }
  
  .product-image {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #eee;
  }
  
  .product-details {
    flex: 1;
  }
  
  .product-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
  }
  
  .product-description {
    color: #666;
    margin: 0 0 8px 0;
    font-size: 0.9rem;
  }
  
  .product-price {
    color: #666;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0;
  }
  
  .product-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    justify-content: flex-end;
  }
  
  .empty-message {
    text-align: center;
    color: #999;
    margin: 40px 0;
    font-size: 1.1rem;
  }
  </style>