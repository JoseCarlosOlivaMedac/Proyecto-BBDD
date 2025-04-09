import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Productos from '../views/Productos.vue';
import Login from '../views/Login.vue';
import Carrito from '../views/Carrito.vue';
import MisPedidos from "../components/MisPedidos.vue";
import Ajustes from '../components/Ajustes.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/productos', name: 'productos', component: Productos },
  { path: '/login', name: 'login', component: Login },
  { path: '/carrito', name: 'carrito', component: Carrito },
  { path: "/mis-pedidos", name: "MisPedidos", component: MisPedidos },
  { path: "/ajustes", name: "Ajustes", component: Ajustes },
  { path: "/admin-dashboard", name: "AdminDashboard", component: AdminDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
