//Acceso a las variables de entorno del fichero .env y las añadimos a la lista de variables de entorno
import 'dotenv/config';

//importamos dependencias
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

//importamos rutas
import adminRoutes from './src/routes/adminRoutes.js';
import flightRoutes from './src/routes/flightRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import ratingRoutes from './src/routes/ratingRoutes.js';

import { fileURLToPath } from 'url';
import path from 'path';

//obtenemos variables de entorno necesarias
const { PORT, UPLOADS_DIR } = process.env;

//Creamos una aplicación express (server)
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, UPLOADS_DIR)));
//middleware que muestra por consola información de la petición entrante
app.use(morgan('dev'));

//midlleware que evita problemas de conexión entre cliente y servidor
app.use(cors());


//middleware que permite leer un body en formato JSON
app.use(express.json());

//middleware que permite leer un body en formato form-data
app.use(fileUpload());

//middleware que indica a Express dónde están las rutas.
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

// Define la ruta del archivo raiz
app.get('/', (req, res) => {
    res.send('API de la aplicación de búsqueda de vuelos');
});

// Manejo del request favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});

//middleware de manejo de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.httpStatus || 500).send({
        status: 'error',
        message: err.message,
    });
});

//middleware de ruta no encontrada
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Ruta no encontrada',
    });
});

//Indicamos al servidor que escuche peticiones en un puerto específico
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
