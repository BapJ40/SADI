const db = require('../../config/db'); // Usamos el pool de conexión existente

const Trabajador = {
    // Obtener todos los trabajadores con información del carnet
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT t.*, c.img AS carnet_img, c.estado AS carnet_estado
            FROM trabajadores t
            LEFT JOIN carnet c ON t.numero_carnet = c.id
        `);
        return rows;
    },

    // Obtener un trabajador por ID con información del carnet
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT t.*, c.img AS carnet_img, c.estado AS carnet_estado
            FROM trabajadores t
            LEFT JOIN carnet c ON t.numero_carnet = c.id
            WHERE t.id = ?
        `, [id]);
        return rows[0];
    }
};

module.exports = Trabajador;
