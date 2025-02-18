import express from 'express';
import joiValidatorError from '../middlewares/joiValidatorMiddleware.js';
import searchFlightsController from '../controllers/flights/searchFlightsController.js';

// Importar los controladores de almacenamiento y filtrado de vuelos
import { storeFlightListController, filterFlightListController } from '../controllers/flights/flightListController.js';

const router = express.Router();

// Endpoint para buscar vuelos y validarlos con la dependencia joi

router.get('/api/flights/search', joiValidatorError, searchFlightsController);

// Endpoint para almacenar la lista de vuelos y validarlos con la dependencia joi
router.post('/api/flights/store', storeFlightListController, joiValidatorError);

// Endpoint para filtrar la lista de vuelos almacenada y validarlos con la dependencia joi
router.get('/api/flights/filter', filterFlightListController, joiValidatorError);

export default router;
