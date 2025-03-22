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
        <li><i class="fas fa-home"></i> <router-link to="/">Inicio</router-link></li>
        <li><i class="fas fa-shopping-bag"></i> <router-link to="/productos">Productos</router-link></li>
        <li><i class="fas fa-shopping-cart"></i> <router-link to="/carrito">Carrito</router-link></li>
        <li><i class="fas fa-user"></i> <router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Estado del menú
const isMenuOpen = ref(false);

// Alternar menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Agregar animación al logo al cargar
onMounted(() => {
  const logo = document.querySelector(".logo h1");
  logo.classList.add("animate-logo");
  setTimeout(() => {
    logo.classList.remove("animate-logo");
  }, 1500);
});
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

/* Animación inicial */
@keyframes popIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-logo {
  animation: popIn 1.2s ease-in-out;
}

/* Efecto al pasar el mouse */
.logo h1:hover {
  transform: rotate(-3deg) scale(1.1);
}

/* ICONO DEL LOGO */
.logo i {
  color: #fff;
  font-size: 1.5rem;
}
.logo:hover {
  color: #5c36f2;
}

/* MENÚ DE NAVEGACIÓN */
nav ul {
  display: flex;
  list-style: none;
  margin: 0 50px;
  padding: 0;
  gap: 1.5rem;
}

nav ul li {
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ICONOS DEL MENÚ */
nav ul li i {
  color: #5c36f2;
  font-size: 1.2rem;
}

/* Línea animada debajo del enlace */
nav ul li a::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #5c36f2;
  transition: width 0.3s ease, left 0.3s ease;
}
/* Expansión desde el centro */
nav ul li:hover a::after {
  width: 100%;
  left: 0;
}
nav ul li a {
  text-decoration: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  position: relative;
  transition: color 0.3s ease-in-out;
}

nav ul li:hover a {
  color: #5c36f2;
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

@media (max-width: 900px) {
  .menu-burger {
    display: block;
  }

  .nav-menu {
    position: absolute;
    background: rgba(34, 34, 34, 0.95);
    width: 100%;
    height: 40vh; 
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
  }

  .nav-menu ul li {
    width: 80%;
    text-align: center;
  }

  .nav-menu ul li a {
    font-size: 1.3rem;
  }
}
</style>
