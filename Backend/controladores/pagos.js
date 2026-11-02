/**
 * Módulo de Controladores para la gestión de Pagos y Reservaciones Simultáneas
 * Utiliza transacciones SQL para garantizar consistencia: si el pago falla, la reservación se revierte.
 */
import pool from '../conexion/conexion.js';

const procesarPagoYReserva = async (req, res) => {
    const { id_huesped_fk, id_habitacion_fk, fecha_inicio, fecha_fin, numero_tarjeta, mes_expiracion, cvv } = req.body;

    // Validación de campos obligatorios
    if (!id_huesped_fk || !id_habitacion_fk || !fecha_inicio || !fecha_fin || !numero_tarjeta) {
        return res.status(400).json({ mensaje: 'Todos los datos de la estancia y de pago son obligatorios.' });
    }

    // Validación estricta del formato de expiración (MM/AA) mediante Regex
    const formatoExpiracionRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (mes_expiracion && !formatoExpiracionRegex.test(mes_expiracion)) {
        return res.status(400).json({ mensaje: 'El formato de expiración debe ser válido (Ej. 12/28).' });
    }

    const inicioDate = new Date(fecha_inicio);
    const finDate = new Date(fecha_fin);
    const diasEstancia = (finDate - inicioDate) / (1000 * 60 * 60 * 24);

    // Obtenemos una conexión dedicada del pool para manejar la transacción
    pool.getConnection((errConn, connection) => {
        if (errConn) {
            console.error('Error al obtener conexión:', errConn);
            return res.status(500).json({ mensaje: 'Error interno en el servidor.' });
        }

        // Iniciamos la transacción SQL
        connection.beginTransaction(errTrans => {
            if (errTrans) {
                connection.release();
                console.error('Error al iniciar transacción:', errTrans);
                return res.status(500).json({ mensaje: 'Error al procesar la transacción.' });
            }

            // 1. Obtener precio de la habitación
            const sqlPrecio = 'SELECT precio FROM Habitaciones WHERE id_habitacion = ?';
            connection.query(sqlPrecio, [id_habitacion_fk], (errPrecio, resPrecio) => {
                if (errPrecio || resPrecio.length === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ mensaje: 'Error al calcular el costo de la habitación.' });
                    });
                }

                const precioTotal = resPrecio[0].precio * diasEstancia;

                // 2. Insertar la Reservación
                const sqlReservacion = `
                    INSERT INTO Reservaciones (id_huesped_fk, id_habitacion_fk, fecha_inicio, fecha_fin, precio) 
                    VALUES (?, ?, ?, ?, ?)
                `;

                connection.query(sqlReservacion, [id_huesped_fk, id_habitacion_fk, fecha_inicio, fecha_fin, precioTotal], (errRes, resRes) => {
                    if (errRes) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error('Error al insertar reservación:', errRes);
                            res.status(500).json({ mensaje: 'Error al registrar la reservación.' });
                        });
                    }

                    // Simulamos un escenario de fallo de pago aleatorio o validación de tarjeta
                    // (Aquí puedes agregar tus reglas si deseas simular rechazos de tarjeta)
                    
                    // 3. Insertar el Pago en la tabla Pagos
                    const sqlPago = `
                        INSERT INTO Pagos (pago, fecha, id_huesped_fk, id_habitacion_fk) 
                        VALUES (?, NOW(), ?, ?)
                    `;

                    connection.query(sqlPago, [precioTotal, id_huesped_fk, id_habitacion_fk], (errPago) => {
                        if (errPago) {
                            // SI EL PAGO FALLA, HACEMOS ROLLBACK PARA BORRAR LA RESERVACIÓN CREADA
                            return connection.rollback(() => {
                                connection.release();
                                console.error('Error al registrar el pago, aplicando rollback:', errPago);
                                res.status(500).json({ mensaje: 'El pago ha sido rechazado. No se registró la reservación.' });
                            });
                        }

                        // Si todo sale bien, confirmamos los cambios permanentemente en la base de datos
                        connection.commit(errCommit => {
                            connection.release();
                            if (errCommit) {
                                return connection.rollback(() => {
                                    res.status(500).json({ mensaje: 'Error al confirmar la transacción de pago.' });
                                });
                            }

                            res.status(201).json({
                                mensaje: '¡Pago procesado y reservación confirmada con éxito!',
                                precio_total: precioTotal,
                                dias_estancia: diasEstancia
                            });
                        });
                    });
                });
            });
        });
    });
};

export {
    procesarPagoYReserva
};