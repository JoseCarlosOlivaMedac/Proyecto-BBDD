<template>
    <section class="ajustes">
      <h1>Ajustes</h1>
  
      <!-- Modo Oscuro -->
      <div class="ajuste-item">
        <h2>Modo Oscuro</h2>
        <label class="switch">
          <input type="checkbox" v-model="modoOscuro" @change="toggleModoOscuro" />
          <span class="slider"></span>
        </label>
      </div>
  
      <!-- Cambiar Idioma -->
      <div class="ajuste-item">
        <h2>Idioma</h2>
        <select v-model="idioma" @change="cambiarIdioma">
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          <option value="fr">Francés</option>
        </select>
      </div>
  
      <!-- Actualizar Nombre de Usuario -->
      <div class="ajuste-item">
        <h2>Actualizar Nombre de Usuario</h2>
        <input
          type="text"
          v-model="nuevoNombre"
          placeholder="Ingresa tu nuevo nombre"
        />
        <button @click="actualizarNombre">Actualizar</button>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from "vue";
  import { auth } from "../firebase"; // Importa el servicio de autenticación
  import { updateProfile } from "firebase/auth"; // Para actualizar el perfil del usuario
  
  // Estado reactivo
  const modoOscuro = ref(false); // Controla el modo oscuro
  const idioma = ref("es"); // Idioma seleccionado
  const nuevoNombre = ref(""); // Nuevo nombre del usuario
  
  // Función para alternar el modo oscuro
  const toggleModoOscuro = () => {
  if (modoOscuro.value) {
    document.documentElement.classList.add("modo-oscuro");
    localStorage.setItem("modoOscuro", "true");
  } else {
    document.documentElement.classList.remove("modo-oscuro");
    localStorage.setItem("modoOscuro", "false");
  }
};
  
  // Función para cambiar el idioma
  const cambiarIdioma = () => {
    alert(`Idioma cambiado a: ${idioma.value}`);
    localStorage.setItem("idioma", idioma.value);
  };
  
  // Función para actualizar el nombre del usuario
  const actualizarNombre = async () => {
    if (!nuevoNombre.value.trim()) {
      alert("Por favor, ingresa un nombre válido.");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: nuevoNombre.value });
        alert("Nombre actualizado con éxito.");
        nuevoNombre.value = "";
      } else {
        alert("Debes iniciar sesión para actualizar tu nombre.");
      }
    } catch (error) {
      console.error("Error al actualizar el nombre:", error);
      alert("Hubo un error al actualizar tu nombre.");
    }
  };
  
  // Cargar configuraciones guardadas
  onMounted(() => {
    // Cargar modo oscuro desde localStorage
    const modoOscuroGuardado = localStorage.getItem("modoOscuro") === "true";
    modoOscuro.value = modoOscuroGuardado;
    if (modoOscuroGuardado) {
      document.documentElement.classList.add("modo-oscuro");
    }
    onMounted(() => {
  const modoOscuroGuardado = localStorage.getItem("modoOscuro") === "true";
  modoOscuro.value = modoOscuroGuardado;
  if (modoOscuroGuardado) {
    document.documentElement.classList.add("modo-oscuro");
  }
});
  
    // Cargar idioma desde localStorage
    const idiomaGuardado = localStorage.getItem("idioma") || "es";
    idioma.value = idiomaGuardado;
  });
  </script>
  
  <style scoped>
  .ajustes {
    padding: 2rem;
    max-width: 600px;
    height: 68vh;
    margin: 0 auto;
    background-color: var(--color-background);
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: var(--color-primary);
    margin-bottom: 2rem;
  }
  
  .ajuste-item {
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .ajuste-item h2 {
    margin: 0;
    color: var(--color-text);
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #5c36f2;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  input[type="text"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    width: 70%;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #5c36f2;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 6px;
    margin-left: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
  
  button:hover {
    background-color: var(--color-secondary);
  }
  
  /* Modo oscuro no funciona xD */
  .modo-oscuro {
    --color-background: #222;
    --color-text: #f4f7f6;
    --color-primary: #5c36f2;
    --color-secondary: #e67d00;
    background-color: var(--color-background);
    color: var(--color-text);
  }
  </style>