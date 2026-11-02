/**
 * Configuración del enrutador principal (Vue Router)
 * Define las rutas de navegación para la aplicación cliente y utiliza el historial HTML5.
 */
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import MainView from '@/views/MainView.vue';
import DisponibilidadView from '@/views/DisponibilidadView.vue';
import PagosView from '@/views/PagosView.vue';

// Definición de la tabla de rutas del sistema
const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'dashboard', component: MainView },
  { path: '/pagos', name: 'pagos', component: PagosView }, 
  // Uso de parámetro dinámico (:id?) para la selección específica de recursos
  { path: '/disponibilidad/:id?', name: 'disponibilidad', component: DisponibilidadView }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;