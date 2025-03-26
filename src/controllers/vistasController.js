const Vistas = require('../models/vistasModel');

// Controlador para obtener el estado de una vista específica
exports.getEstadoVistaController = async (req, res) => {
    try {
        const { nombre_vista } = req.params; // Obtener el nombre de la vista desde los parámetros de la URL
        const estado = await Vistas.getEstadoVista(nombre_vista); // Método en el modelo
        res.status(200).json({
            success: true,
            estado,
        });
    } catch (error) {
        console.error('Error al obtener el estado de la vista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el estado de la vista',
            error: error.message,
        });
    }
};

// Controlador para actualizar el estado de una vista
exports.updateEstadoController = async (req, res) => {
    try {
        const { nombre_vista, estado } = req.body; // Obtener los datos del cuerpo de la solicitud
        console.log('Datos recibidos:', { nombre_vista, estado }); // Depuración

        const result = await Vistas.updateEstado({ nombre_vista, estado }); // Actualizar el estado en la base de datos
        console.log('Resultado de la consulta:', result); // Depuración

        res.status(200).json({
            success: true,
            message: `Estado de la vista "${nombre_vista}" actualizado a "${estado}"`,
            data: result,
        });
    } catch (error) {
        console.error('Error al actualizar el estado de la vista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado de la vista',
            error: error.message,
        });
    }
};