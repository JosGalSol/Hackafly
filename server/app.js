//Acceso a las variables de entorno del fichero .env y las añadimos a la lista de variables de entorno
import 'dotenv/config';

//importamos dependencias
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

//importamos rutas
import userRoutes from './src/routes/userRoutes.js';
import flighRoutes from './src/routes/flighRoutes.js';

//obtenemos variables de entorno necesarias
const { PORT, UPLOADS_DIR } = process.env;

//Creamos una aplicación express (server)
const app = express();

//middleware que muestra por consola información de la petición entrante
app.use(morgan('dev'));

//midlleware que evita problemas de conexión entre cliente y servidor
app.use(cors());

//middleware que indica a Express dónde se encuentran los archivos estáticos.
app.use(express.static(UPLOADS_DIR));

//middleware que permite leer un body en formato JSON
app.use(express.json());

//middleware que permite leer un body en formato form-data
app.use(fileUpload());

//middleware que indica a Express dónde están las rutas.
app.use('/api/users', userRoutes);
app.use('/api/flights', flighRoutes);

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
