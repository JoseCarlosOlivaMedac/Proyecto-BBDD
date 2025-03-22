
import { createRouter, createWebHistory } from 'vue-router';
import Productos from '../views/Productos.vue';
import Login from '../views/Login.vue'; 
import Carrito from '../views/Carrito.vue';

const routes = [
  
  {
    path: '/productos',
    name: 'productos',
    component: Productos
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: Carrito
  }
];

const router = createRouter({
  history: createWebHistory(''/''),
  routes
});

export default router;
