/**
 * Enrutador para la verificación de disponibilidad.
 */
import express from 'express';
// 1. Importamos la función con su nuevo nombre
import { verificarDisponibilidad } from '../controladores/disponibilidad.js';

const router = express.Router();

// 2. Usamos la función importada en el método POST
router.post('/', verificarDisponibilidad);

export default router;