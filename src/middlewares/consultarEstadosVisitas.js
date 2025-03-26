const db = require('../../config/db'); // Usamos el pool de conexión existente

const consultarEstadosVistas = async (req, res, next) => {
    try {
        // Consultar la tabla vistas
        const [estados] = await db.query('SELECT * FROM vistas');

        // Asignar los datos a req para que estén disponibles en el siguiente middleware o ruta
        req.estadosVistas = estados; // No necesitas convertirlo a JSON

        next(); // Pasar al siguiente middleware o ruta
    } catch (err) {
        console.error('Error al consultar estados de vistas:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error al consultar estados de vistas',
            error: err.message
        });
    }
};

const estadosVistas = {
    consultarEstadosVistas
};

module.exports = estadosVistas;