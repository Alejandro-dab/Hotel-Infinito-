# Hotel Infinito - Sistema de Reservaciones con Login y pagos.

Aplicación web Full Stack para la exhibición de catálogo de habitaciones, consulta de disponibilidad en tiempo real y procesamiento de reservaciones con pago en línea.

## 📐 Arquitectura del Sistema

El proyecto está estructurado como una aplicación monolítica dividida en dos módulos principales:

- **Frontend:** Desarrollado en Vue 3 (Composition API) impulsado por Vite, empleando Vue Router para la navegación de cliente (SPA) y Axios para las peticiones HTTP asíncronas.
- **Backend:** API REST desarrollada en Node.js con Express, conectada a una base de datos MySQL relacional. Gestiona la lógica de negocios, autenticación de huéspedes y prevención de traslapes en fechas de reservación.

## 📌 Funcionalidades Principales

1. **Autenticación y Registro:** Creación de cuenta e inicio de sesión para huéspedes con persistencia en `localStorage`.
2. **Catálogo por Pisos:** Exhibición dinámica de habitaciones clasificadas por nivel y categoría (Standard, Deluxe, Suite).
3. **Validación de Disponibilidad:** Comprobación de rangos de fechas (máximo 14 días) mediante consultas antitraslape en base de datos.
4. **Módulo de Pago Simulado:** Procesamiento unificado de reservación y registro de transacción.

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
git clone https://github.com/Alejandro-dab/Hotel-Infinito-.git
cd hotel-infinito
```

### 2. Configuración del Backend

1. Navegar a la carpeta del servidor e instalar dependencias:

   ```bash
   cd Backend
   npm install
   ```

2. Crear un archivo `.env` en la raíz de `Backend/` con la siguiente estructura:

   ```env
   PORT=7000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=hotel_infinito
   FRONTEND_URL=http://localhost:5173
   ```

3. Importar la base de datos MySQL desde el archivo de esquema disponible en el proyecto (`Hotel_infinito.sql`).

4. Iniciar el servidor en modo desarrollo:
   ```bash
   node index.js
   ```

---

### 3. Configuración del Frontend

1. Navegar a la carpeta del cliente e instalar dependencias:

   ```bash
   cd ../Frontend
   npm install
   ```

2. Crear un archivo `.env` en la raíz de `Frontend/`:

   ```env
   VITE_API_URL=http://localhost:7000
   ```

3. Iniciar el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```

---

## ☁️ Despliegue en Producción (Vercel)

### Configuración del Frontend (`vercel.json`)

Para garantizar que las rutas de la Single Page Application (SPA) funcionen correctamente en producción sin generar errores 404 al recargar, se incluye el archivo `vercel.json` en el módulo Frontend:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Variables de Entorno en Producción

- **Frontend (`.env.production`):**

  ```env
  VITE_API_URL=[https://hotel-infinito-8wup.vercel.app](https://hotel-infinito-8wup.vercel.app)

  ```

- **Backend (`.env` en la nube):**
  Asegurar que la configuración de CORS en `Backend/index.js` permita solicitudes desde el dominio de despliegue:
  ```javascript
  app.use(
    cors({
      origin: [
        "[https://hotel-infinito-8wup.vercel.app](https://hotel-infinito-8wup.vercel.app)",
        "http://localhost:5173",
      ],
      credentials: true,
    }),
  );
  ```

---
