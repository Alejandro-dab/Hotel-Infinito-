/**
 * Módulo de Controladores para la gestión de Habitaciones
 * Consulta el inventario real almacenado en la base de datos para alimentar el frontend.
 */
import pool from '../conexion/conexion.js';

/**
 * GET: Obtener todas las habitaciones ordenadas por piso y número de ID.
 */
const listarHabitaciones = (req, res) => {
    const sql = 'SELECT * FROM Habitaciones ORDER BY piso ASC, id_habitacion ASC';
    
    pool.query(sql, (error, resultados) => {
        if (error) {
            console.error('Error al consultar habitaciones:', error);
            return res.status(500).json({ mensaje: 'Error al obtener el catálogo de habitaciones' });
        }
        res.json(resultados);
    });
};

export {
    listarHabitaciones
};