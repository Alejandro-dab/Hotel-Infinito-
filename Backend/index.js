// index.js - Servidor principal de la API
import express from 'express'; 
import cors from 'cors'; // Seguridad de dominios, sobre quien consulta la API. 

// Importamos el pool de conexiones 
import pool from './conexion/conexion.js';

// Importar y usar tus rutas de huéspedes
import huespedesRoutes from './rutas/rutas.js';

const app = express();

// Middlewares esenciales
app.use(express.json()); // Permite recibir datos en formato JSON en las peticiones POST/PUT
app.use(cors());         // Permite peticiones desde el frontend de Vue (CORS)

// Ruta de prueba inicial para verificar que el servidor API responde
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Bienvenido a la API del Hotel Infinito!' });
});

// Importar y usar rutas de huéspedes
app.use('/api/huespedes', huespedesRoutes);

// Lee la variable de entorno de la nube o usa el 3000 por defecto en local
const PORT = process.env.PORT || 3000;

// Solo ejecutamos app.listen si estamos en local (Vercel maneja su propio puerto)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
    });
}

// Exportamos la app para que Vercel la pueda usar como Serverless Function
export default app;