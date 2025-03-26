const express = require('express');
const planificadorController = require('../controllers/planificadorController');
const upload = require('../middlewares/storageImg');
const router = express.Router();
const { consultarEstadosVistas } = require('../middlewares/consultarEstadosVisitas');

router.get('/', consultarEstadosVistas, (req, res) => {
    const estadosVistas = req.estadosVistas; // Obtener los estados de las vistas desde req

    // Buscar si la vista "sadi_invitado" está activa
    const plan = estadosVistas.find(vista => vista.nombre_vista === 'planes');

    if (plan && plan.estado === 'activa') {
        // Renderizar la vista si está activa
        return res.render('planes');
    } else {
        // Si no está activa, enviar un mensaje de error
        return res.status(403).send('Acceso denegado: La vista no está disponible');
    }
});

router.get('/planificaciones-info', planificadorController.getPlanificadores);
router.get('/planificaciones-info/:id', planificadorController.getPlanificadorById);
router.post('/planificaciones-info', upload.single('imagen_url'), planificadorController.createPlanificador); // Aquí se usa multer
router.put('/planificaciones-info/:id', upload.single('imagen_url'), planificadorController.updatePlanificador);
router.delete('/planificaciones-info/:id', planificadorController.deletePlanificador);
router.delete('/planificaciones-info', planificadorController.deleteFechaExpiracion);

module.exports = router;