// index.js - Servidor principal de la API
import express from 'express'; 
import cors from 'cors'; // Seguridad de dominios, sobre quien consulta la API. 

// Importamos el pool de conexiones 
import pool from './conexion/conexion.js';

// Importar y usar ruta de huéspedes
import huespedesRoutes from './rutas/rutas.js';
// Importar ruta de habitaciones.js 
import rutasHabitaciones from './rutas/habitaciones_ruta.js';
// UImportar ruta de disponibilidad,js 
import rutasDisponibilidad from './rutas/disponibilidad_ruta.js';
//Importar ruta de pagos.js
import rutasPagos from './rutas/pagos_ruta.js';


const app = express();

// Middlewares esenciales
app.use(express.json()); // Permite recibir datos en formato JSON en las peticiones POST/PUT
// Permite peticiones desde el frontend de Vue (CORS)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());

app.options('*', cors({
    origin: dominiosPermitidos,
    credentials: true
}));

// Ruta de prueba inicial para verificar que el servidor API responde
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Bienvenido a la API del Hotel Infinito!' });
});

// Importar y usar rutas de huéspedes(LA URL)
app.use('/api/huespedes', huespedesRoutes);
app.use('/api/habitaciones', rutasHabitaciones); //endpoint de Habitaciones
app.use('/api/reservaciones', rutasDisponibilidad);
app.use('/api/pagos', rutasPagos);

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