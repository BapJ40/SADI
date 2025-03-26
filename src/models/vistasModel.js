const db = require('../../config/db.js'); // Ajusta la ruta a tu configuración de la base de datos

class Vistas {
    static async getEstadoVista(nombre_vista) {
        const [result] = await db.query(
            'SELECT estado FROM vistas WHERE nombre_vista = ?',
            [nombre_vista]
        );
        return result[0]?.estado; // Devuelve el estado de la vista
    }

    static async updateEstado(vista) {
        const { nombre_vista, estado } = vista;
        const [result] = await db.query(
            'UPDATE vistas SET estado = ? WHERE nombre_vista = ?',
            [estado, nombre_vista]
        );
        return result;
    }
}

module.exports = Vistas;