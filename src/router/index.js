import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Productos from '../views/Productos2.vue';
import Login from '../views/Login.vue';
import Carrito from '../views/Carrito.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/productos', name: 'productos', component: Productos },
  { path: '/login', name: 'login', component: Login },
  { path: '/carrito', name: 'carrito', component: Carrito }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
