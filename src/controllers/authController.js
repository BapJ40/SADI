const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
dotenv = require('dotenv');

dotenv.config();

// Generar JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION } // Configuración de expiración
  );
};


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generar el token JWT
      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true }); // Guardar el token en una cookie
      res.redirect('/sadi-admin'); // Redirigir al área de invitados
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
};

// Registro (opcional si lo necesitas)
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create(username, email, hashedPassword);
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error al registrar usuario');
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token'); // Eliminar la cookie del token
  res.redirect('/'); // Redirigir al inicio
};