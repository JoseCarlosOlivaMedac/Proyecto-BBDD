//Este es el Router que nos permitira movernos entre las vistas de la aplicacion , ademas se ha añadido una funcion de proteccion de rutas para que no se pueda acceder a la vista de carrito sin antes haber iniciado sesion
//Se importa el router de vue y se crean las rutas de la aplicacion
//Se importan las vistas de Productos, Login y Carrito
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
