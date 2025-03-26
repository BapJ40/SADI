const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware'); // Middleware de autenticación
const { consultarEstadosVistas } = require('../middlewares/consultarEstadosVisitas');


router.get('/login', (req, res) => {
    res.render('login', { error: null });
})
router.post('/login', authController.login);
router.get('/register', (req, res) => {
    res.render('register', { error: null });
})
router.post('/register', authController.register);

router.get('/sadi-admin', authenticateJWT, (req, res) => {
    if (!req.user) {
        // Redirigir a login si el usuario no está autenticado
        return res.redirect('/login');
    }
    // Si el usuario está autenticado, renderizamos la vista del panel de administración
    res.render('sadi-admin');
});

router.get('/planificaciones_admin', authenticateJWT, (req, res) => {
    if(!req.user){
        return res.redirect('/login');    
    }
    res.render('planificadorAdmin');
});

// Logout
router.get('/logout', authController.logout); // Nueva ruta de logout


module.exports = router;