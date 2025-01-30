const express = require('express');
const carnetController = require('../controllers/carnetController'); // Controlador de carnets

const router = express.Router();

// Rutas de Carnets
router.get('/', carnetController.getAllCarnets);
router.get('/:id', carnetController.getCarnetById);
router.get('/img/:id', carnetController.getCarnetImgById);
router.put('/actualizar-estados', carnetController.updateEstadosMasivos);


module.exports = router;