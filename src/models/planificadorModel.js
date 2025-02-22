const db = require('../../config/db'); // Usamos el pool de conexión existente

const Planificador = {
    // Obtener todos los planificadors
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM planificaciones ORDER BY fecha_creacion DESC');
        return rows;
    },

    // Obtener un planificador por su ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM planificaciones WHERE id = ?', [id]);
        return rows[0];
    },

    // Crear un nuevo planificador
    create: async (planificador) => {
        const [result] = await db.query('INSERT INTO planificaciones SET ?', planificador);
        return result.insertId;
    },

    // Actualizar un planificador
    update: async (id, planificador) => {
        await db.query('UPDATE planificaciones SET ? WHERE id = ?', [planificador, id]);
        return true;
    },

    // Eliminar un planificador
    delete: async (id) => {
        await db.query('DELETE FROM planificaciones WHERE id = ?', [id]);
        return true;
    },

    deleteFechaExpiracion: async () => {
        await db.query('DELETE FROM planificaciones WHERE fecha_expiracion < NOW()');
        return true;
    }
};

module.exports = Planificador;