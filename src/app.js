const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const multer = require('multer');
const carnetRoutes = require('./routes/carnetRoutes'); // Importa las rutas de carnets
const trabajadoresRoutes = require('./routes/trabajadorRoutes');
const planificadorRoutes = require('./routes/planificadorRoutes');
const estadosVistasApi = require('./middlewares/estadosVistasApi');
const vistasRoutes = require('./routes/vistasRoutes');

dotenv.config();

const app = express();
// Configuraciones

// Configura el directorio de las vistas
app.set('views', path.join(__dirname, '../views'));

// Configura el motor de vistas
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar carpeta pública
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para manejar JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.render('bienvenida');
});

// Rutas
// Usar la API de estados de vistas
app.use('/api', estadosVistasApi);
app.use(authRoutes);
app.use('/carnets', carnetRoutes);
app.use('/trabajador', trabajadoresRoutes);
app.use('/planes', planificadorRoutes);
app.use('/vistas', vistasRoutes);

// Servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));