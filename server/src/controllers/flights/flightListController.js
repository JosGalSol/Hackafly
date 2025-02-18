// Importamos las dependencias.
import amadeus from '../../utils/amadeusClientUtil.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
import validateSearch from '../../validators/apiValidation.js';

// Controlador para obtener la lista de vuelos.
const flightListController = async (req, res, next) => {
    try {
        // Validar los datos de la solicitud usando Joi
        const { err, value } = validateSearch.validate(req.query);

        // Si hay un error de validación, lanzar un error
        if (err) {
            throw generateErrorUtil('Datos de búsqueda inválidos. Por favor, revise los campos.', 400);
        }

        // Extraer los valores validados
        const { origin, destination, departureDate, returnDate, adults } = value;

        // Verificar que los campos obligatorios estén presentes
        if (!origin || !destination || !departureDate) {
            throw generateErrorUtil('Faltan campos obligatorios: origin, destination o departureDate.', 400);
        }

        // Realizar la solicitud a la API de Amadeus
        const response = await amadeus.shopping.flight_offers_search.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            returnDate: returnDate || undefined, // Si no hay returnDate, no se incluye
            adults: adults || 1, // Valor por defecto: 1 adulto
        });

        // Extraer los datos de los vuelos de la respuesta
        const flights = response.data;

        // Enviar la respuesta al cliente
        res.status(200).send({
            status: 'ok',
            data: flights,
            message: 'Lista de vuelos obtenida con éxito',
        });
    } catch (err) {
        // Manejar errores específicos de la API de Amadeus
        if (err.response && err.response.status === 400) {
            next(generateErrorUtil('Error en la solicitud a la API de Amadeus. Verifique los parámetros.', 400));
        } else if (err.response && err.response.status === 500) {
            next(generateErrorUtil('Error interno en la API de Amadeus. Inténtelo de nuevo más tarde.', 500));
        } else {
            // Pasar el error al middleware de manejo de errores
            next(err);
        }
    }
};

export default flightListController;