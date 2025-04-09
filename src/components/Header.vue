<template>
  <header class="header">
    <div class="logo-container">
      <h1 class="logo" @click="animateLogo">
        <i class="fas fa-tshirt"></i> LIVE SHOP
      </h1>
    </div>

    <button
      class="menu-toggle"
      aria-label="Abrir menú"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
    >
      <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <nav class="nav" :class="{ 'nav--open': isMenuOpen }">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="fas fa-home"></i> Inicio
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/productos" class="nav-link">
            <i class="fas fa-shopping-bag"></i> Productos
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/carrito" class="nav-link">
            <i class="fas fa-shopping-cart"></i> Carrito
          </router-link>
        </li>
        <li v-if="!user" class="nav-item">
          <router-link to="/login" class="nav-link">
            <i class="fas fa-user"></i> Login
          </router-link>
        </li>
        <li v-if="user" class="user-info">
          <!-- Mostrar ícono de Font Awesome si no hay foto de perfil -->
          <div class="user-avatar" @click="toggleModal">
            <i v-if="!user.photoURL" class="fas fa-user-circle"></i>
            <img
              v-else
              :src="user.photoURL"
              :alt="user.displayName || 'Usuario'"
              referrerpolicy="no-referrer"
            />
          </div>
          <span class="user-name">{{ user.displayName || user.email }}</span>
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </li>
      </ul>
    </nav>

   
    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="toggleModal">
    <div class="modal">
      <ul class="modal-options">
        <!-- Opción para ir a Mis pedidos -->
        <li @click="goToOrders">Mis pedidos</li>
        
        <!-- Opción para ir a Ajustes -->
        <li @click="goToSettings">Ajustes</li>

        <!-- Opción para ir a Admin Dashboard -->
        <li @click="goToAdminDashboard">Admin Dashboard</li>
      </ul>
    </div>
  </div>
  </header>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const isMenuOpen = ref(false);
const isModalOpen = ref(false); // Estado para controlar el modal
const user = ref(null);
const router = useRouter();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;

  // Bloquear scroll cuando el menú está abierto
  if (isMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const animateLogo = () => {
  const logo = document.querySelector(".logo");
  logo.classList.add("logo--animate");
  setTimeout(() => {
    logo.classList.remove("logo--animate");
  }, 1000);
};

const logout = async () => {
  try {
    await signOut(auth);
    if (isMenuOpen.value) toggleMenu(); // Cerrar menú si está abierto
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const goToOrders = () => {
  toggleModal();
  router.push("/mis-pedidos");
};

const goToSettings = () => {
  toggleModal();
  router.push("/ajustes");
};

const goToAdminDashboard = () => {
  router.push('/admin-dashboard'); // Redirige a Admin Dashboard
  toggleModal(); // Cierra el modal
};
  
onMounted(() => {
  // Escuchar cambios de autenticación
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });

  // Limpiar listener al desmontar
  return () => unsubscribe();
});
</script>

<style scoped>
/* Base Styles */
.header {
  background-color: #222;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Logo Styles */
.logo {
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.63 ease-in-out;
  color: #fff;
}

.logo:hover {
  transform: rotate(-3deg) scale(1.05);
  color: #5c36f2;
}

.logo i {
  color: var(--text-color);
  font-size: 1.5rem;
  transition: color var(--transition-speed);
}

.logo:hover i {
  color: var(--primary-color);
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.logo--animate {
  animation: popIn 0.8s ease-in-out;
}

/* Navigation Styles */
nav {
  display: flex;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.5rem 0;
  transition: color 0.3s ease-in-out;
}

.nav-link i {
  transition: color 0.3s ease-in-out;
}

/* Hover effect for nav-link */
.nav-link:hover,
.nav-link:hover i,
.nav-item:hover .nav-link,
.nav-item:hover .nav-link i {
  color: #5c36f2;
}

/* Line effect */
.nav-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #5c36f2;
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 100%;
  left: 0;
  transform: translateX(0);
}

/* User Info Styles */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-left: 1rem;
}

.user-avatar {
  width: 48px; /* Aumenta el tamaño del contenedor */
  height: 48px; /* Aumenta el tamaño del contenedor */
  font-size: 2rem; /* Aumenta el tamaño del ícono */
  border-radius: 50%;
  margin: 0 15px;
  background-color: #444; /* Fondo para el ícono */
  color: #fff; /* Color del ícono */
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar:hover {
  background-color: #5c36f2; /* Cambia el color de fondo al pasar el mouse */
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
}
.user-name {
 display: none;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 1rem;
  transition: color var(--transition-speed);
  padding: 0.5rem;
}

.logout-btn:hover {
  color: #5c36f2;
}

/* Mobile Styles */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

@media (max-width: 900px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(34, 34, 34, 0.98);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateY(-100%);
    transition: transform 0.4s ease-in-out;
    z-index: 100;
  }

  .nav--open {
    transform: translateY(0);
  }

  .nav-list {
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    padding: 0 1rem;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }

  .nav-link {
    justify-content: center;
    font-size: 1.5rem;
    padding: 1rem;
  }

  .user-info {
    flex-direction: column;
    margin-top: 2rem;
    gap: 1rem;
  }

  .user-name {
    max-width: 100%;
    font-size: 1.2rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.modal {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 1rem 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  height: 200px;
  text-align: center;
}

.modal-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-options li {
  padding: 0.8rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.modal-options li:hover {
  background-color: #f4f7f6;
  color: #5c36f2;
}
</style>