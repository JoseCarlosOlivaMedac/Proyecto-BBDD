<template>
    <div class="user-status">
      <div v-if="user" class="user-info">
        <img v-if="user.photoURL" :src="user.photoURL" alt="Foto de perfil" class="user-photo" />
        <div class="user-details">
          <p class="welcome-message">Hola, <strong>{{ user.displayName || user.email }}</strong></p>
          <button @click="logout" class="btn-logout">Cerrar Sesión</button>
        </div>
      </div>
      <div v-else class="user-info">
        <p class="welcome-message">No has iniciado sesión.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { auth } from "../firebase"; // Importa el servicio de autenticación
  import { onAuthStateChanged, signOut } from "firebase/auth"; // Importa las funciones necesarias
  
  const user = ref(null); // Estado reactivo para almacenar el usuario autenticado
  
  // Escucha los cambios en el estado de autenticación
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser; // Actualiza el estado del usuario
    });
  });
  
  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      alert("Has cerrado sesión.");
      user.value = null; // Limpia el estado del usuario
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un error al cerrar sesión.");
    }
  };
  </script>
  
  <style scoped>
  .user-status {
    background: var(--color-background);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
    color: var(--color-text);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .user-photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .welcome-message {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text);
  }
  
  .btn-logout {
    background: transparent;
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  
  .btn-logout:hover {
    background: var(--color-secondary);
    color: white;
  }
  </style>