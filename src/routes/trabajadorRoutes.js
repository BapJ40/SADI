const express = require('express');
const trabajadorController = require('../controllers/trabajadorController'); // Controlador de carnets
const { authenticateJWT } = require('../middlewares/authMiddleware'); // Middleware para autenticar

const router = express.Router();

router.get('/', authenticateJWT, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    trabajadorController.getAllTrabajadores(req, res);
});

router.get('/:id', authenticateJWT, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    trabajadorController.getTrabajadorById(req, res);
});

module.exports = router;