const Carnet = require('../models/carnetModel');

// Obtener todos los carnets
exports.getAllCarnets = async (req, res) => {
  try {
    const carnets = await Carnet.getAll();
    res.json(carnets);
  } catch (err) {
    console.error('Error al obtener carnets:', err.message);
    res.status(500).send('Error al obtener carnets');
  }
};

exports.getCarnetById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const carnet = await Carnet.getById(id);
      if (!carnet) {
        return res.status(404).send('Carnet no encontrado');
      }
      res.json(carnet);
    } catch (err) {
      console.error('Error al obtener carnet:', err.message);
      res.status(500).send('Error al obtener carnet' + err.message);
    }
};

exports.getCarnetImgById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const carnet = await Carnet.getImg(id);
      if (!carnet) {
        return res.status(404).send('Carnet no encontrado');
      }
      res.json(carnet);
    } catch (err) {
      console.error('Error al obtener carnet:', err.message);
      res.status(500).send('Error al obtener carnet' + err.message);
    }
};

exports.updateEstadosMasivos = async (req, res) => {
  const { cambios } = req.body;

  try {
      if (!Array.isArray(cambios)) {
          return res.status(400).send('Formato de datos inválido');
      }

      await Carnet.updateStates(cambios);
      res.send({ message: 'Estados actualizados correctamente' });
  } catch (err) {
      console.error('Error al actualizar estados masivos:', err.message);
      res.status(500).send('Error al actualizar estados');
  }
};