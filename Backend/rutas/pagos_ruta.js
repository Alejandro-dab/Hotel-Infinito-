import express from 'express';
import { procesarPagoYReserva } from '../controladores/pagos.js';

const router = express.Router();

router.post('/', procesarPagoYReserva);

export default router;