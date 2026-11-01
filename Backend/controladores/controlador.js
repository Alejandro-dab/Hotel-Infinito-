//Importación de la conexión a la DB
import pool from '../conexion/conexion.js';

// GET: Obtener todos los huéspedes
const listarHuespedes = (req, res) => {
    const sql = 'SELECT * FROM huespedes';
    
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
    const sql = 'SELECT * FROM huespedes WHERE id_huesped = ?';

    //Ejecutamos la consulta con un WHERE
    pool.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error('Error al buscar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al buscar el huésped' });
        }
        //Si no encuentra nada, devuelve un 404
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'Huésped no encontrado' });
        }
        //Si lo encuentra, devuelve solo el primer elemento del array
        res.json(resultados[0]);
    });
};

// POST: Crear un nuevo huésped
const crearHuesped = (req, res) => {
    //Recepción de los datos del 'body' de la petición
    const { nombre, apellido, email, telefono } = req.body;

    //Consulta SQL
    const sql = 'INSERT INTO huespedes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)';

    //Ejecución de la consulta
    pool.query(sql, [nombre, apellido, email, telefono], (error, resultado) => {
        if (error) {
            console.error('Error al insertar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al registrar huésped' });
        }
        res.status(201).json({ 
            mensaje: 'Huésped registrado exitosamente', 
            // Devolver el ID del nuevo producto creado
            id_huesped: resultado.insertId 
        });
    });
};

// PUT: Actualizar un huésped
const editarHuesped = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono } = req.body;
    const sql = 'UPDATE huespedes SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id_huesped = ?';

    pool.query(sql, [nombre, apellido, email, telefono, id], (error, resultado) => {
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
    const sql = 'DELETE FROM huespedes WHERE id_huesped = ?';

    pool.query(sql, [id], (error, resultado) => {
        if (error) {
            console.error('Error al eliminar huésped:', error);
            return res.status(500).json({ mensaje: 'Error al eliminar huésped' });
        }
        res.json({ mensaje: 'Huésped eliminado correctamente' });
    });
};

//Exportar el metodo para reutilizarlo
export {
    listarHuespedes,
    crearHuesped, 
    editarHuesped, 
    eliminarHuesped,
    obtenerHuesped_Id
};