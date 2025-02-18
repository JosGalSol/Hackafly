import amadeus from '../../utils/amadeusClientUtil.js';

const searchFlightsController = async (req, res) => {
    try {
        const {
            origin,
            destination,
            departureDate,
            returnDate,
            adults,
            sortBy,
            order,
            minPrice,
            maxPrice,
        } = req.query;

        if (
            !origin ||
            !destination ||
            !departureDate ||
            !returnDate ||
            !adults
        ) {
            return res
                .status(400)
                .send({ error: 'Faltan parámetros de búsqueda' });
        }
        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            adults: adults,
        });
        let flights = response.data;

        //filtrado de vuelos por precio

        if (minPrice || maxPrice) {
            flights = flights.filter((flight) => {
                const price = parseFloat(flight.price.total);
                if (minPrice && price < parseFloat(minPrice)) {
                    return false;
                }
                if (maxPrice && price > parseFloat(maxPrice)) {
                    return false;
                }
                return true;
            });
        }

        if (sortBy) {
            flights = flights.sort((a, b) => {
                let valueA, valueB;

                switch (sortBy) {
                    case 'price':
                        valueA = parseFloat(a.price.total);
                        valueB = parseFloat(b.price.total);
                        break;
                    case 'stops':
                        valueA = a.itineraries[0].segments.length;
                        valueB = b.itineraries[0].segments.length;
                        break;
                    case 'flightDuration':
                        valueA = a.itineraries[0].duration;
                        valueB = b.itineraries[0].duration;
                        break;
                    default:
                        return 0;
                }

                if (order === 'desendente') {
                    return valueB - valueA;
                } else {
                    return valueA - valueB;
                }
            });
        }
        //comprobar que se hayan encontrado vuelos
        // flights.forEach((flight) => {
        //     console.log(flight.price.total);
        // });

        res.json(flights);
    } catch (error) {
        console.error('error detallado', error.response?.result || error);
        res.status(500).send('error al buscar vuelos');
    }
};

export default searchFlightsController;

// Este controlador recibe los parámetros de búsqueda de vuelos,
// hace la llamada a la API Amadeus para obtener ofertas de vuelos,
// y devuelve la respuesta en formato JSON.
