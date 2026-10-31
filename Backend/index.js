// index.js - Servidor principal de la API
import express from 'express';
import cors from 'cors'; //Seguridad de dominios, sobre quien consulta la API. 

// Importamos nuestro pool de conexiones que acabamos de crear
import pool from './conexion/conexion.js';

const app = express();

// Middlewares esenciales
app.use(express.json()); // Permite recibir datos en formato JSON en las peticiones POST/PUT
app.use(cors());         // Permite peticiones desde el frontend de Vue (CORS)

// Ruta de prueba inicial para verificar que el servidor API respond
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Bienvenido a la API de Hotel Infinito' });
});

// Lee la variable de entorno de la nube o usa el 3000 por defecto en local)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});