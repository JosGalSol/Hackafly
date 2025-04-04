import Joi from 'joi';

const timePattern = /^([01]\d|2[0-3])$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const filterFlightsSchema = Joi.object({
    airline: Joi.string().optional(),
    minPrice: Joi.number().optional(),
    maxPrice: Joi.number().optional(),
    departureTime: Joi.string().pattern(timePattern).optional(),
    arrivalTime: Joi.string().pattern(timePattern).optional(),
    class: Joi.string()
        .valid('a', 'f', 'p', 'r', 'c', 'd', 'i', 'j', 'z')
        .optional(),
    sortByPrice: Joi.string().valid('true', 'false').optional(),
    stops: Joi.number().integer().min(0).max(3).optional(),
    destination: Joi.string().length(3).optional(), // Validación para el código IATA del destino
    departureDate: Joi.string().pattern(datePattern).optional(), // Validación para la fecha de salida
    arrivalDate: Joi.string().pattern(datePattern).optional(), // Validación para la fecha de llegada
    sortBy: Joi.string().valid('price', 'stops', 'duration').optional(), // Validación para el criterio de ordenación
    order: Joi.string().valid('asc', 'desc').optional(), // Validación para el orden de ordenación
});

export default filterFlightsSchema;
