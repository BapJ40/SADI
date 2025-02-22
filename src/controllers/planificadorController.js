const Planificador = require('../models/planificadorModel');

exports.getPlanificadores = async (req, res) => {
    try {
        const planificadores = await Planificador.getAll();
        res.json(planificadores);
    } catch (err) {
        console.error('Error al obtener planificadores:', err.message);
        res.status(500).send('Error al obtener planificadores' + err.message);
    }
};

exports.getPlanificadorById = async (req, res) => {
    const { id } = req.params;

    try {
        const planificador = await Planificador.getById(id);
        if (!planificador) {
            return res.status(404).send('Planificador no encontrado');
        }
        res.json(planificador);
    } catch (err) {
        console.error('Error al obtener planificador:', err.message);
        res.status(500).send('Error al obtener planificador' + err.message);
    }
};

exports.createPlanificador = async (req, res) => {
    const planificador = req.body;
    if (req.file) {
        planificador.imagen_url = `/uploads/${req.file.filename}`; // Guarda la URL relativa del archivo en el objeto planificador
    }
    try {
        const id = await Planificador.create(planificador);
        res.json({ id, mensaje: 'Planificador creado' });
    } catch (err) {
        console.error('Error al crear planificador:', err.message);
        res.status(500).send('Error al crear planificador' + err.message);
    }
};

exports.updatePlanificador = async (req, res) => {
    const { id } = req.params;
    const planificador = req.body;
    if (req.file) {
        planificador.imagen_url = `/uploads/${req.file.filename}`; // Guarda la URL relativa del archivo en el objeto planificador
    }

    try {
        const result = await Planificador.update(id, planificador);
        if (!result) {
            return res.status(404).send('Planificador no encontrado');
        }
        res.json({ mensaje: 'Planificador actualizado' });
    } catch (err) {
        console.error('Error al actualizar planificador:', err.message);
        res.status(500).send('Error al actualizar planificador' + err.message);
    }
};
    
exports.deletePlanificador = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Planificador.delete(id);
        if (!result) {
            return res.status(404).send('Planificador no encontrado');
        }
        res.json({ mensaje: 'Planificador eliminado' });
    } catch (err) {
        console.error('Error al eliminar planificador:', err.message);
        res.status(500).send('Error al eliminar planificador' + err.message);
    }
};

exports.deleteFechaExpiracion = async (req, res) => {
    try {
        await Planificador.deleteFechaExpiracion();
        res.json({ mensaje: 'Planificadores expirados eliminados' });
    } catch (err) {
        console.error('Error al eliminar planificadores expirados:', err.message);
        res.status(500).send('Error al eliminar planificadores expirados' + err.message);
    }
};