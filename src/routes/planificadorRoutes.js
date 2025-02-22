const express = require('express');
const planificadorController = require('../controllers/planificadorController');
const upload = require('../middlewares/storageImg');
const router = express.Router();

router.get('/', planificadorController.getPlanificadores);
router.get('/:id', planificadorController.getPlanificadorById);
router.post('/', upload.single('imagen_url'), planificadorController.createPlanificador); // Aquí se usa multer
router.put('/:id', upload.single('imagen_url'), planificadorController.updatePlanificador);
router.delete('/:id', planificadorController.deletePlanificador);
router.delete('/', planificadorController.deleteFechaExpiracion);

module.exports = router;