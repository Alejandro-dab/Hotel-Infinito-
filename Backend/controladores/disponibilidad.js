/**
 * Módulo de Controladores para la Disponibilidad y Reservaciones
 * Valida rangos de fechas (máximo 14 días) y previene traslapes en base de datos.
 */
import pool from '../conexion/conexion.js';

/**
 * POST: Verifica si una habitación se encuentra disponible en el rango de fechas solicitado.
 */
const verificarDisponibilidad = (req, res) => {
    const { id_habitacion_fk, fecha_inicio, fecha_fin } = req.body;

    // Validación de campos obligatorios
    if (!id_habitacion_fk || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Obtener la fecha actual local para evitar desfases
    const fechaActualLocal = new Date();
    const anio = fechaActualLocal.getFullYear();
    const mes = String(fechaActualLocal.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActualLocal.getDate()).padStart(2, '0');
    const hoyStr = `${anio}-${mes}-${dia}`;

    // Validaciones temporales
    if (fecha_inicio < hoyStr) {
        return res.status(400).json({ mensaje: 'La fecha de inicio no puede ser en el pasado.' });
    }

    if (fecha_fin <= fecha_inicio) {
        return res.status(400).json({ mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio.' });
    }

    const inicioDate = new Date(fecha_inicio);
    const finDate = new Date(fecha_fin);
    const diasEstancia = (finDate - inicioDate) / (1000 * 60 * 60 * 24);

    // Regla de negocio: Máximo 2 semanas (14 días)
    if (diasEstancia > 14) {
        return res.status(400).json({ mensaje: 'El límite máximo de reservación es de 2 semanas (14 días).' });
    }

    /**
     * Consulta SQL Antitraslape:
     * Verifica si existe un cruce con reservaciones previas para la misma habitación.
     */
    const sqlVerificarTraslape = `
        SELECT * FROM Reservaciones 
        WHERE id_habitacion_fk = ? 
          AND fecha_inicio <= ? 
          AND fecha_fin >= ?
    `;

    pool.query(sqlVerificarTraslape, [id_habitacion_fk, fecha_fin, fecha_inicio], (error, resultados) => {
        if (error) {
            console.error('Error al verificar disponibilidad:', error);
            return res.status(500).json({ mensaje: 'Error interno en el servidor.' });
        }

        // Si hay resultados, significa que la habitación está ocupada (Traslape)
        if (resultados.length > 0) {
            return res.status(409).json({ 
                mensaje: 'La habitación no se encuentra disponible en las fechas seleccionadas (existe un traslape).' 
            });
        }

        // Si pasa todas las validaciones, responde que está disponible
        res.status(200).json({
            disponible: true,
            dias_estancia: diasEstancia,
            mensaje: 'Fechas disponibles.'
        });
    });
};

export { verificarDisponibilidad };