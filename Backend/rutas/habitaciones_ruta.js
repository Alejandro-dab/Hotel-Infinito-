import express from 'express';
import { listarHabitaciones } from '../controladores/habitaciones.js';

const router = express.Router();

router.get('/', listarHabitaciones);

export default router;