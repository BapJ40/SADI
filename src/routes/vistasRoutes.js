const express = require('express');
const vistasController = require('../controllers/vistasController'); // Controlador de vistas
const router = express.Router();

// Ruta principal
router.get('/estado-vista/:nombre_vista', vistasController.getEstadoVistaController);
router.put('/actualizar-estado', vistasController.updateEstadoController);

module.exports = router;