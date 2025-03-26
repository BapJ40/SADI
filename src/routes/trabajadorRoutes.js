const express = require('express');
const router = express.Router();
const trabajadorController = require('../controllers/trabajadorController');

// API JSON
router.get('/api/:id', trabajadorController.getTrabajadorApi);

// Vista que cargará el frontend dinámico
router.get('/:id', trabajadorController.mostrarDetalle);

module.exports = router;