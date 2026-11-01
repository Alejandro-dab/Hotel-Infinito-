/**
 * Módulo de Controladores para la gestión de Huéspedes
 * Maneja la lógica de negocio y las consultas SQL hacia la base de datos relacional.
 */
import pool from '../conexion/conexion.js';

// GET: Obtener todos los huéspedes
const listarHuespedes = (req, res) => {
    const sql = 'SELECT * FROM Huespedes';
    
    pool.query(sql, (error, resultados) => {
        if (error) {
            // Si falla, enviamos código 500 (Error del servidor)
            console.error('Error al consultar huéspedes:', error);
            return res.status(500).json({ mensaje: 'Error al obtener los huéspedes' });
        }
        // Si todo sale bien, enviamos el resultado
        res.json(resultados);
    });
};

// GET: Obtener un huésped por ID
const obtenerHuesped_Id = (req, res) => {
    // Capturamos el ID que viene en la URL
    const { id } = req.params;
    const sql = 'SELECT * FROM Huespedes WHERE id_huesped = ?';

    // Ejecutamos la consulta con un WHERE
    pool.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error('Error al buscar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al buscar el huésped' });
        }
        // Si no encuentra nada, devuelve un 404
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'Huésped no encontrado' });
        }
        // Si lo encuentra, devuelve solo el primer elemento del array
        res.json(resultados[0]);
    });
};

// POST: Crear un nuevo huésped
const crearHuesped = (req, res) => {
    // Recepción de los datos del 'body' de la petición alineados con el esquema SQL
    const { nombre, ap_paterno, ap_materno, num, email, pass } = req.body;

    // Consulta SQL con los campos exactos de la tabla Huespedes
    const sql = 'INSERT INTO Huespedes (nombre, ap_paterno, ap_materno, num, email, pass) VALUES (?, ?, ?, ?, ?, ?)';

    // Ejecución de la consulta con sus respectivos valores
    pool.query(sql, [nombre, ap_paterno || null, ap_materno || null, num || null, email, pass], (error, resultado) => {
        if (error) {
            console.error('Error al insertar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al registrar huésped' });
        }
        res.status(201).json({ 
            mensaje: 'Huésped registrado exitosamente', 
            // Devolver el ID del nuevo registro creado
            id_huesped: resultado.insertId 
        });
    });
};

// PUT: Actualizar un huésped
const editarHuesped = (req, res) => {
    const { id } = req.params;
    const { nombre, ap_paterno, ap_materno, num, email, pass } = req.body;
    
    const sql = 'UPDATE Huespedes SET nombre = ?, ap_paterno = ?, ap_materno = ?, num = ?, email = ?, pass = ? WHERE id_huesped = ?';

    pool.query(sql, [nombre, ap_paterno || null, ap_materno || null, num || null, email, pass, id], (error, resultado) => {
        if (error) {
            console.error('Error al actualizar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al actualizar huésped' });
        }
        res.json({ mensaje: 'Huésped actualizado correctamente' });
    });
};

// DELETE: Eliminar un huésped
const eliminarHuesped = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Huespedes WHERE id_huesped = ?';

    pool.query(sql, [id], (error, resultado) => {
        if (error) {
            console.error('Error al eliminar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al eliminar huésped' });
        }
        res.json({ mensaje: 'Huésped eliminado correctamente' });
    });
};

// Exportar los métodos para reutilizarlos en las rutas
export {
    listarHuespedes,
    crearHuesped, 
    editarHuesped, 
    eliminarHuesped,
    obtenerHuesped_Id
};