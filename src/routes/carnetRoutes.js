const express = require('express');
const carnetController = require('../controllers/carnetController'); // Controlador de carnets
const { consultarEstadosVistas } = require('../middlewares/consultarEstadosVisitas'); // Middleware para consultar estados de vistas

const router = express.Router();

// Ruta principal
router.get('/', consultarEstadosVistas, (req, res) => {
    const estadosVistas = req.estadosVistas; // Obtener los estados de las vistas desde req

    // Buscar si la vista "sadi_invitado" está activa
    const sadiInvitado = estadosVistas.find(vista => vista.nombre_vista === 'sadi_invitado');

    if (sadiInvitado && sadiInvitado.estado === 'activa') {
        // Renderizar la vista si está activa
        return res.render('sadi-invitado');
    } else {
        // Si no está activa, enviar un mensaje de error
        
        return res.redirect('/'); // Redirigir a la página
    }
});

// Otras rutas de Carnets
router.get('/carnets-info', carnetController.getAllCarnets);
router.get('/carnets-info/:id', carnetController.getCarnetById);
router.get('/carnets-info/img/:id', carnetController.getCarnetImgById);
router.put('/actualizar-estados', carnetController.updateEstadosMasivos);

module.exports = router;