/**
 * Configuración del enrutador principal (Vue Router)
 * Define las rutas de navegación para la aplicación cliente.
 */
import { createRouter, createWebHistory } from 'vue-router';

// El alias '@' equivale a la carpeta 'src/'. Evita rutas relativas
// frágiles como '../views/', que se rompen si se mueve el archivo.
import LoginView from '@/views/LoginView.vue';
import MainView from '@/views/MainView.vue';
import DisponibilidadView from '../views/DisponibilidadView.vue';
import PagosView from '@/views/PagosView.vue';

// Definición de las rutas del sistema
// Cada objeto asocia una URL (path) con el componente que se renderiza
// dentro de <RouterView /> en App.vue.
const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Main', component: MainView },
  { path: '/pagos', name: 'Pagos', component: PagosView }, 
  {path: '/disponibilidad', name: 'disponibilidad', component: DisponibilidadView}
];

// Instancia del enrutador utilizando el modo de historial HTML5
// (URLs limpias, sin '#'). En producción requiere que el servidor
// redirija todas las rutas a index.html (en Vercel, vía vercel.json).
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;