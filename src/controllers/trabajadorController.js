const Trabajador = require('../models/trabajadorModel');

const trabajadorController = {
 // En el mismo controlador
getTrabajadorApi: async (req, res) => {
    try {
      const { id } = req.params;
      const trabajador = await Trabajador.getByIdWithCarnet(id);
  
      if (!trabajador) {
        return res.status(404).json({ 
          error: 'Trabajador no encontrado' 
        });
      }
  
      res.json({
        nombre: trabajador.nombre,
        cargo: trabajador.cargo,
        cedula: trabajador.cedula,
        estado: trabajador.carnet_estado,
        imagenCarnet: trabajador.carnet_imagen
      });
  
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al cargar los datos del trabajador' 
      });
    }
  },

  // Vista que usará el frontend dinámico
  mostrarDetalle: async (req, res) => {
    try {
      const { id } = req.params;
      const trabajador = await Trabajador.getByIdWithCarnet(id);

      if (!trabajador) {
        return res.status(404).render('error', {
          titulo: 'Error',
          mensaje: 'Trabajador no encontrado'
        });
      }

      res.render('InfoEmpleado', {
        titulo: 'Información del trabajador',
        trabajador: {
          nombre: trabajador.nombre,
          cargo: trabajador.cargo,
          cedula: trabajador.cedula,
          estado: trabajador.carnet_estado,
          imagenCarnet: trabajador.carnet_imagen || '/images/default-profile.jpg' // Imagen por defecto si no hay
        }
      });

    } catch (error) {
      console.error('Error en controlador:', error);
      res.status(500).render('error', {
        titulo: 'Error',
        mensaje: 'Error al cargar los datos del trabajador'
      });
    }
  }
};

module.exports = trabajadorController;