<template>
  <header>
    <div class="logo">
      <h1><i class="fas fa-tshirt"></i> LIVE SHOP</h1>
    </div>
    <button
      class="menu-burger"
      aria-label="Abrir menú"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
    >
      <i class="fas fa-bars"></i>
    </button>
    <nav :class="{ 'nav-menu': true, 'show': isMenuOpen }">
      <ul>
        <div class="search-container">
          <SearchBar />
        </div>
        <li><i class="fas fa-home"></i> <router-link to="/">Inicio</router-link></li>
        <li><i class="fas fa-shopping-bag"></i> <router-link to="/productos">Productos</router-link></li>
        <li><i class="fas fa-shopping-cart"></i> <router-link to="/carrito">Carrito ({{ totalItems }})</router-link></li>

        <!-- Muestra la información del usuario si está logueado -->
        <div class="user-info" v-if="userName">
          <p>Bienvenid@, <strong>{{ userName }}</strong></p>
          <button @click="logout">Cerrar Sesión</button>
        </div>

        <!-- Muestra el enlace de Login si no está logueado -->
        <li v-if="!userName"><i class="fas fa-user"></i> <router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { inject, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SearchBar from "./BarraBusqueda.vue";

// Mostrar número de productos en el icono del carrito
const carrito = inject("carrito");

const totalItems = computed(() => {
  return carrito.value.reduce((total, producto) => total + producto.cantidad, 0);
});

// Estado del menú de navegación
const isMenuOpen = ref(false);

// Función para alternar el menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const userName = ref(""); // Almacena el nombre del usuario
const auth = getAuth();
const router = useRouter();

// Verificar el estado de autenticación
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.value = user.displayName || "Usuario"; // Asigna el nombre del usuario
    } else {
      userName.value = ""; // Usuario no autenticado
    }
  });
});

// Función para cerrar sesión con confirmación
const logout = async () => {
  const confirmLogout = window.confirm("¿Estás seguro que deseas cerrar sesión?");
  if (confirmLogout) {
    try {
      await signOut(auth); // Cierra sesión en Firebase
      userName.value = ""; // Limpia el nombre del usuario
      router.push("/"); // Redirige al inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
};
</script>

<style scoped>
/* HEADER */
header {
  background-color: #222;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
}

/* LOGO */
.logo h1 {
  font-size: 1.8rem;
  margin: 0 50px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

/* Barra de búsqueda */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 2;
  height: 40px; 
  margin-top: 1px; 
}

/* MENÚ DE NAVEGACIÓN */
nav ul {
  display: flex;
  list-style: none;
  margin: 0 50px;
  padding: 0;
  gap: 1.5rem;
  align-items: center; /* Asegura que los elementos estén centrados verticalmente */
}

nav ul li {
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  transition: color 0.3s ease-in-out;
}

nav ul li a {
  text-decoration: none; /* Elimina el subrayado */
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  position: relative;
  transition: color 0.3s ease-in-out;
}

nav ul li:hover a,
nav ul li:hover i,
nav ul li a:hover,
nav ul li a:hover i {
  color: #5c36f2;
}

nav ul li::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #5c36f2;
  transition: width 0.3s ease, left 0.3s ease;
}

nav ul li:hover::after {
  width: 100%;
  left: 0;
}

/* MENÚ MOBILE */
.menu-burger {
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

/* Respuesta para pantallas pequeñas */
@media (max-width: 900px) {
  .menu-burger {
    display: block;
  }

  .nav-menu {
    position: absolute;
    background: rgba(34, 34, 34, 0.95);
    width: 100%;
    height: 45vh;
    z-index: 99;
    top: 0;
    left: 0;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-100%);
    transition: transform 0.4s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  }

  .nav-menu.show {
    transform: translateY(0);
  }

  .nav-menu ul {
    flex-direction: column;
    gap: 40px;
    padding: 0;
    margin-top: 0;
  }

  .nav-menu ul li {
    width: 80%;
    text-align: center;
  }

  .nav-menu ul li a {
    font-size: 1.3rem;
  }
}

/* Estilo para la sección de usuario (alinear horizontalmente) */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info p {
  margin: 0;
}
</style>
