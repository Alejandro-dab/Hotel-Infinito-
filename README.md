# Hotel Infinito - Sistema de Reservaciones y Gestión Hotelera

Aplicación web Full Stack para la exhibición de catálogo de habitaciones, consulta de disponibilidad en tiempo real y procesamiento de reservaciones con pago en línea.

## 📐 Arquitectura del Sistema

El proyecto está estructurado como una aplicación monolítica dividida en dos módulos principales:

- **Frontend:** Desarrollado en Vue 3 (Composition API) impulsado por Vite, empleando Vue Router para la navegación de cliente (SPA) y Axios para las peticiones HTTP asíncronas.
- **Backend:** API REST desarrollada en Node.js con Express, conectada a una base de datos MySQL relacional. Gestiona la lógica de negocios, autenticación de huéspedes y prevención de traslapes en fechas de reservación.

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- Vue.js 3 (Composition API)
- Vue Router
- Axios
- Vite
- CSS3 / HTML5

### Backend

- Node.js
- Express.js
- MySQL / `mysql2`
- CORS (`cors`)
- Dotenv (`dotenv`)

---

## 🚀 Configuración e Instalación Local

### Prerrequisitos

- Node.js (versión 18.x o superior)
- npm o yarn
- Instancia de base de datos MySQL activa

---

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/tu-usuario/hotel-infinito.git](https://github.com/tu-usuario/hotel-infinito.git)
cd hotel-infinito
```
