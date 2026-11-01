import express from 'express';
const router = express.Router();

// Importar controlador de huéspedes
import * as huespedesController from '../controladores/controlador.js';

// Definición de ruta para el GET
router.get('/', huespedesController.listarHuespedes);
// Definición de ruta para el POST
router.post('/', huespedesController.crearHuesped);
// Definición de ruta para el PUT
router.put('/:id', huespedesController.editarHuesped);   
// Definición de ruta para el DELETE
router.delete('/:id', huespedesController.eliminarHuesped); 
// Definición de ruta para Get por ID
router.get('/:id', huespedesController.obtenerHuesped_Id);

export default router;