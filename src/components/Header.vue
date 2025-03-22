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
        <!--Aqui hay que sustituir los # por la direccion que desarrollaremos posteriormente , es decir las vistas
          Eso lo haremos con el enrutador de vue es decir la etiqueta router-link to ='' -->
          <li><a href="#"><i class="fas fa-home"></i> Inicio</a></li>
          <li><router-link to="/productos"><i class="fas fa-store"></i> Productos</router-link></li>
          <li><router-link to="/carrito"><i class="fas fa-shopping-cart"></i> Carrito</router-link></li>
          <li><router-link to="/login"><i class="fas fa-user"></i> Iniciar Sesión</router-link></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Estado del menú
  const isMenuOpen = ref(false);
  
  // Alternar menú
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  </script>
  
<style scoped>


header {
  background-color: #222;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo h1 {
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo i {
  color: var(--color-primario);
  font-size: 1.5rem;
}

/* Menú de navegación */
nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
}

nav ul li {
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s ease-in-out;
}


/* Enlaces */
nav ul li a {
  text-decoration: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  transition: color 0.3s ease-in-out;
}

nav ul li:hover a {
  color: #5c36f2;
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

nav ul li:hover a::after {
  width: 100%;
  left: 0;
}

/* Botón menú mobile */
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

/* RESPONSIVE */
/*Aqui seguramente hay que ajustar algun que otro margen , probarlo en vuestros mobiles y me decis ! */
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