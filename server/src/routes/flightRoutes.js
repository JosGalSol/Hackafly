import express from 'express';
import searchFlightsController from '../controllers/flights/searchFlightsController.js';
import { storeFlightListController, filterFlightListController } from '../controllers/flights/flightListController.js';
import searchFlightsSchema from '../schemas/searchFlightsSchema.js';
import storeFlightsSchema from '../schemas/storeFlightsSchema.js';
import filterFlightsSchema from '../schemas/filterFlightsSchema.js';
import joiValidatorMiddleware from '../middlewares/joiValidatorMiddleware.js';

const router = express.Router();

// Endpoint para buscar vuelos y validarlos con la dependencia Joi
router.get(
    '/search',
    joiValidatorMiddleware(searchFlightsSchema),
    searchFlightsController,
);

// Endpoint para almacenar vuelos
router.post('/store', joiValidatorMiddleware(storeFlightsSchema), storeFlightListController);

// Endpoint para filtrar vuelos
router.get('/filter', joiValidatorMiddleware(filterFlightsSchema), filterFlightListController);

export default router;
