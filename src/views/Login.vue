<template>
  <section class="auth">
    <div class="auth-container">
      <div class="auth-header">
        <h2>{{ isLogin ? "Iniciar Sesión" : "Registro" }}</h2>
        <button class="close-btn" @click="cerrarVista">✖</button>
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
        
        <div v-if=" !isLogin" class="input-group">
          <label for="name">Nombre Completo</label>
          <input type="text" id="name" v-model="name" required placeholder="Ingresa tu nombre">
        </div>

        <button type="submit" class="btn-auth">
          {{ isLogin ? "Iniciar Sesión" : "Registrarse" }}
        </button>
      </form>

      <p>
        {{ isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?" }}
        <span @click="toggleAuthMode">{{ isLogin ? "Regístrate aquí" : "Inicia sesión aquí" }}</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const name = ref("");
const isLogin = ref(true); // Alternar entre Login y Registro
const router = useRouter();

const cerrarVista = () => {
  router.push("/");
};

const submitForm = () => {
  if (isLogin.value) {
    console.log("Iniciando sesión con:", email.value, password.value);
  } else {
    console.log("Registrando usuario:", name.value, email.value, password.value);
  }
};

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
};
</script>

<style scoped>

.auth {
  width: 100%;
  height: 100vh;
  background-image: url("/public/imagenes/login-background.jpg");
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 380px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.9rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #5c36f2;
}

/* Inputs */
.input-group {
  margin-bottom: 1.2rem;
  text-align: left;
}

label {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #5c36f2;
  box-shadow: 0 0 5px rgba(92, 54, 242, 0.3);
}

/* Botón */
.btn-auth {
  background: #5c36f2;
  color: white;
  padding: 0.8rem;
  border-radius: 8px;
  width: 100%;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.btn-auth:hover {
  background: #e67d00;
}

/* Alternar entre Login y Registro */
p {
  margin-top: 1rem;
  font-size: 1rem;
}

p span {
  color: #5c36f2;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

p span:hover {
  color: #e67d00;
}

/* Animación */
@keyframes fadeIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
