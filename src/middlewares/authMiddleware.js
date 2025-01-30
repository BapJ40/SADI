const jwt = require('jsonwebtoken');
dotenv = require('dotenv');

dotenv.config();

exports.authenticateJWT = (req, res, next) => {
  const token = req.cookies.token; // Token guardado en la cookie

  if (!token) {
    req.user = null; // Si no hay token, el usuario es invitado
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar los datos del usuario en `req.user`
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('Token expirado:', err.message);
      res.clearCookie('token'); // Elimina la cookie si el token expiró
      return res.redirect('/login'); // Redirigir al login
    }
    console.error('Token inválido:', err.message);
    res.clearCookie('token'); // Limpia la cookie si el token es inválido
    res.redirect('/login');
  }
};