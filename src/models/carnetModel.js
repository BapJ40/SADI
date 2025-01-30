const db = require('../../config/db'); // Usamos el pool de conexión existente

const Carnet = {
  // Obtener todos los carnets
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM carnet');
    return rows;
},

// Obtener un carnet por su ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM carnet WHERE id = ?', [id]);
    return rows[0];
},

// Obtener img del carnet por su ID
  getImg: async (id) => {
    const [rows] = await db.query('SELECT img FROM carnet WHERE id = ?', [id]);
    return rows[0].img;
},

// Actualizar el estado de un carnet masivo
updateStates: async (cambios) => {
  const queries = cambios.map(cambio => 
      db.query('UPDATE carnet SET estado = ? WHERE id = ?', [cambio.estado, cambio.id])
  );

  // Ejecutar todas las consultas
  await Promise.all(queries);
  return true;
}

};

module.exports = Carnet;
