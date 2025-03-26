// estadosVistasApi.js
const express = require('express');
const db = require('../../config/db'); // Ajusta la ruta a tu configuración de la base de datos

const router = express.Router();

// Ruta para obtener los estados de las vistas
router.get('/estados-vistas', async (req, res) => {
    try {
        // Consultar la tabla vistas
        const [estados] = await db.query('SELECT * FROM vistas');

        // Enviar la respuesta como JSON
        res.status(200).json({
            success: true,
            data: estados
        });
    } catch (err) {
        console.error('Error al consultar estados de vistas:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error al consultar estados de vistas',
            error: err.message
        });
    }
});

module.exports = router;