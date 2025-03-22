<template>
    <section class="login">
      <div class="login-container">
        <div class="login-header">
          <h2>Iniciar Sesión</h2>
          <button class="close-btn" @click="cerrarVista">X</button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="input-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" v-model="email" required placeholder="Ingresa tu correo">
          </div>
          <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" required placeholder="Ingresa tu contraseña">
          </div>
          <button type="submit" class="btn-secundary">Iniciar Sesión</button>
          <p>¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
        </form>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const cerrarVista = () => {
    router.push('/');
  };
  
  const submitForm = () => {
    // Aquí iría la lógica para manejar el inicio de sesión
    console.log('Iniciando sesión con:', email.value, password.value);
  };
  </script>
  
  <style scoped>
  .login {
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 350px;
  }
  
  .login-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  h2 {
    font-size: 1.8rem;
    color: #333;
  }
  
  .close-btn {
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
  }
  
  .input-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
  }
  
  input:focus {
    border-color: #5c36f2;
  }
  
  button[type="submit"] {
    background-color: #5c36f2;
    color: white;
    padding: 0.7rem 1.5rem;
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
  }
  
  button[type="submit"]:hover {
    background-color: #e67d00;
  }
  
  p {
    text-align: center;
    margin-top: 1rem;
  }
  
  router-link {
    color: #5c36f2;
    text-decoration: none;
  }
  
  router-link:hover {
    text-decoration: underline;
  }
  </style>
  