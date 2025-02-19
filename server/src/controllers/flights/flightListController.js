import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Variable global para almacenar la lista de vuelos
let globalFlights = [];

// Controlador para almacenar la lista de vuelos en la variable global
const storeFlightListController = (req, res, next) => {
    try {
        const flights = req.body; // Asume que los vuelos se envían en el cuerpo de la solicitud

        // Validar que haya vuelos para almacenar
        if (!flights || !Array.isArray(flights) || flights.length === 0) {
            throw generateErrorUtil('No hay vuelos disponibles para almacenar.', 400);
        }

        // Almacenar la lista de vuelos en la variable global
        globalFlights = flights;

        // Enviar respuesta de éxito
        res.status(200).send({
            status: 'ok',
            message: 'Lista de vuelos almacenada con éxito',
        });
    } catch (err) {
        next(err);
    }
};

// Controlador para filtrar la lista de vuelos almacenada
const filterFlightListController = (req, res, next) => {
    try {
        // Validar que haya vuelos almacenados
        if (!globalFlights || globalFlights.length === 0) {
            throw generateErrorUtil('No hay vuelos disponibles para filtrar.', 404);
        }

        // Obtener los parámetros de filtrado del query
        const {
            airline,
            minPrice,
            maxPrice,
            departureTime,
            arrivalTime,
            travelClass,
            page = 1, // Página por defecto: 1
            limit = 10, // Límite de resultados por página: 10
        } = req.query;

        // Validar que los parámetros de paginación sean números válidos
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        if (isNaN(parsedPage)) {
            throw generateErrorUtil('El parámetro "page" debe ser un número válido.', 400);
        }
        if (isNaN(parsedLimit)) {
            throw generateErrorUtil('El parámetro "limit" debe ser un número válido.', 400);
        }

        // Aplicar los filtros
        let filteredFlights = globalFlights;

        // Filtro por aerolínea
        if (airline) {
            filteredFlights = filteredFlights.filter(flight =>
                flight.validatingAirlineCodes?.includes(airline.toUpperCase()),
            );
        }

        // Filtro por precio mínimo
        if (minPrice) {
            const parsedMinPrice = parseFloat(minPrice);
            if (isNaN(parsedMinPrice)) {
                throw generateErrorUtil('El parámetro "minPrice" debe ser un número válido.', 400);
            }
            filteredFlights = filteredFlights.filter(
                flight => parseFloat(flight.price?.total) >= parsedMinPrice,
            );
        }

        // Filtro por precio máximo
        if (maxPrice) {
            const parsedMaxPrice = parseFloat(maxPrice);
            if (isNaN(parsedMaxPrice)) {
                throw generateErrorUtil('El parámetro "maxPrice" debe ser un número válido.', 400);
            }
            filteredFlights = filteredFlights.filter(
                flight => parseFloat(flight.price?.total) <= parsedMaxPrice,
            );
        }

        // Filtro por horario de salida
        if (departureTime) {
            const parsedDepartureTime = new Date(departureTime);
            if (isNaN(parsedDepartureTime.getTime())) {
                throw generateErrorUtil('El parámetro "departureTime" debe ser una fecha válida.', 400);
            }
            filteredFlights = filteredFlights.filter(flight => {
                const departure = new Date(flight.itineraries[0]?.segments[0]?.departure?.at);
                return departure >= parsedDepartureTime;
            });
        }

        // Filtro por horario de llegada
        if (arrivalTime) {
            const parsedArrivalTime = new Date(arrivalTime);
            if (isNaN(parsedArrivalTime.getTime())) {
                throw generateErrorUtil('El parámetro "arrivalTime" debe ser una fecha válida.', 400);
            }
            filteredFlights = filteredFlights.filter(flight => {
                const lastSegment = flight.itineraries[0]?.segments[flight.itineraries[0]?.segments.length - 1];
                const arrival = new Date(lastSegment?.arrival?.at);
                return arrival <= parsedArrivalTime;
            });
        }

        // Filtro por clase de billete
        if (travelClass) {
            filteredFlights = filteredFlights.filter(flight =>
                flight.travelerPricings?.some(pricing => pricing.travelerType === travelClass),
            );
        }

        // Paginación
        const startIndex = (parsedPage - 1) * parsedLimit;
        const endIndex = parsedPage * parsedLimit;
        const paginatedFlights = filteredFlights.slice(startIndex, endIndex);

        // Enviar la respuesta con los vuelos filtrados y paginados
        res.status(200).send({
            status: 'ok',
            data: paginatedFlights,
            pagination: {
                totalFlights: filteredFlights.length,
                totalPages: Math.ceil(filteredFlights.length / parsedLimit),
                currentPage: parsedPage,
                flightsPerPage: parsedLimit,
            },
            message: 'Lista de vuelos filtrada y paginada con éxito',
        });
    } catch (err) {
        next(err);
    }
};

export { storeFlightListController, filterFlightListController };