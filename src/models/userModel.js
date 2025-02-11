const db = require('../../config/db');

const User = {
  create: async (username, email, hashedPassword) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result;
  },
  findByUsername: async (username) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
};

module.exports = User;
