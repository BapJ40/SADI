const Trabajador = require('../models/trabajadorModel');

exports.getAllTrabajadores = async (req, res) => {
    try {
        const trabajadores = await Trabajador.getAll();
        res.json(trabajadores);
    } catch (error) {
        console.error('Error al obtener trabajadores:', error);
        res.status(500).json({ error: 'Error al obtener trabajadores' });
    }
};

exports.getTrabajadorById = async (req, res) => {
    try {
        const trabajador = await Trabajador.getById(req.params.id);
        if (trabajador) {
            res.json(trabajador);
        } else {
            res.status(404).json({ error: 'Trabajador no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el trabajador:', error);
        res.status(500).json({ error: 'Error al obtener el trabajador' });
    }
};