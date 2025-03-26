const db = require('../../config/db');

const Trabajador = {
  getByIdWithCarnet: async (id) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          t.id,
          t.nombre,
          t.cargo,
          t.cedula,
          t.id_carnet,
          c.estado AS carnet_estado,
          c.img AS carnet_imagen  -- Asumiendo que el campo se llama imagen_url
        FROM 
          trabajadores t
        LEFT JOIN 
          carnet c ON t.id_carnet = c.id
        WHERE 
          t.id = ?
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error en modelo Trabajador:', error);
      throw error;
    }
  }
};

module.exports = Trabajador;