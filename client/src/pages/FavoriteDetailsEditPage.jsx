import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext.js';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import aircodes from 'aircodes';

const { VITE_API_URL } = import.meta.env;

const FavoriteDetailsEditPage = () => {
    const [favorites, setfavorites] = useState({});
    const [loading, setLoading] = useState(true);
    const [initialFavorites, setInitialFavorites] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const { favoriteId } = useParams();
    const { authToken, authUser } = useAuthContext();

    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);

    // Función para buscar aeropuertos con `aircodes`
    const handleSearch = (query, setSuggestions) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const results = aircodes.findAirport(query) || []; // 🔍 Busca aeropuertos por ciudad, país o código IATA
        setSuggestions(results);
    };

    // Obtenemos la lista de favoritos del usuario.
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch(
                    `${VITE_API_URL}/api/users/favorites/${favoriteId}`,
                    {
                        headers: authUser
                            ? {
                                  Authorization: authToken,
                              }
                            : {},
                    },
                );
                const body = await res.json();

                if (body.status === 'error') {
                    throw new Error(body.message);
                }
                setfavorites(body.data.favorites);
                setInitialFavorites(body.data.favorites);
            } catch (err) {
                toast.error(err.message, {
                    id: 'favoriteId',
                });
            } finally {
                setLoading(false);
            }
        };

        if (authToken && authUser) {
            fetchFavorites();
        }
    }, [favoriteId, authToken, authUser]);

    // Guardamos los cambios realizados en el favorito.
    const handleSave = async () => {
        try {
            if (!favorites.origin || !favorites.destination || !favorites.departureDate || favorites.adults <= 0 || !Date.parse(favorites.departureDate) || (favorites.returnDate && isNaN(Date.parse(favorites.returnDate)))) {
                throw new Error("Campos vacíos");
            }

            const formattedFavorites = {
                title: favorites.title,
                origin: favorites.origin,
                destination: favorites.destination,
                departureDate: formatDate(favorites.departureDate),
                returnDate: favorites.returnDate ? formatDate(favorites.returnDate) : null,
                adults: favorites.adults,
            };

            const res = await fetch(
                `${VITE_API_URL}/api/users/favorites/${favoriteId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: authToken,
                    },
                    body: JSON.stringify(formattedFavorites),
                },
            );
            const body = await res.json();
            setIsEditing(false);
            toast.success(body.message);
        } catch (err) {
            toast.error(err.message, {
                id: 'favoriteId',
            });
        }
    };

    // Toggle para permitir editar un favorito.
    const handleEditToggle = () => setIsEditing(!isEditing);

    // Cambiamos el valor de un input al editar un favorito.
    const handleChange = (e) => {
        setfavorites({
            ...favorites,
            [e.target.name]: e.target.value,
        });
    };

    // Formato de la fecha para que pueda ser enviada al endpoint de actualización de favoritos.
    const formatDate = (date) => {
        if (!date) return null;
        const newDate = new Date(date);
        return newDate.toISOString().split('T')[0]; // Devuelve solo la parte de la fecha (sin hora)
    };

    // Buscamos el vuelo favorito del usuario
    const navigate = useNavigate();

    const handleFavoriteSearch = async (favorites) => {
        try {
            setLoading(true);
            const searchParams = new URLSearchParams({
                origin: favorites.origin,
                destination: favorites.destination,
                departureDate: formatDate(favorites.departureDate),
                adults: favorites.adults,
            });

            if (favorites.returnDate) {
                searchParams.append('returnDate', formatDate(favorites.returnDate));
            }

            const res = await fetch(`${VITE_API_URL}/api/flights/search?${searchParams.toString()}`);
            const body = await res.json();

            if (!res.ok || body.status === 'error') {
                throw new Error(body.message || 'Error al obtener los vuelos');
            }

            const flights = body || [];

            let returnFlights = [];
            if (favorites.returnDate) {
                const searchParamsVuelta = new URLSearchParams({
                    origin: favorites.destination,
                    destination: favorites.origin,
                    departureDate: formatDate(favorites.departureDate),
                    adults: favorites.adults,
                });

                const resVuelta = await fetch(`${VITE_API_URL}/api/flights/search?${searchParamsVuelta.toString()}`);
                const bodyVuelta = await resVuelta.json();

                if (resVuelta.ok && bodyVuelta.length > 0) {
                    returnFlights = bodyVuelta.map((flight) => ({ ...flight, isReturn: true }));
                }
            }
            navigate('/search-results', {
                state: {
                    flights: [...flights, ...returnFlights],
                    searchParams: {
                        origin: favorites.origin,
                        destination: favorites.destination,
                        departureDate: favorites.departureDate,
                        returnDate: favorites.returnDate || null,
                        adults: favorites.adults,
                        tipoViaje: favorites.returnDate ? 'ida-vuelta' : 'ida',
                    },
                },
            });
            setLoading(false);
        } catch (err) {
            console.error('Error al buscar vuelos:', err);
            toast.error(err.message || 'Error al buscar vuelos, inténtelo de nuevo más tarde.');
        }
    };

    const handleCancel = () => {
        setfavorites(initialFavorites); // Restauramos el estado inicial
        setIsEditing(false); // Dejamos de editar
    };
    
    return (
        <>
         {loading && (
                    <div className='fixed inset-0 bg-dark-blue bg-opacity-90 flex items-center justify-center z-50'>
                        <div className='bg-white p-8 rounded-md shadow-lg max-w-xs mx-auto'>
                            <div className='w-16 h-16 border-8 border-dark-blue border-dashed rounded-full animate-spin mx-auto mb-4'></div>
                            <h2 className='text-dark-blue text-2xl font-bold text-center'>
                                Cargando...
                            </h2>
                            <p className='text-dark-blue text-center mt-2'>
                                hackeando tu vuelo...
                            </p>
                        </div>
                    </div>
                )}
            
                    {/* Animación de carga sobrepuesta */}
        {loading && (
            <div className='fixed inset-0 bg-dark-blue bg-opacity-90 flex items-center justify-center z-50'>
                <div className='bg-white p-8 rounded-md shadow-lg max-w-xs mx-auto'>
                    <div className='w-16 h-16 border-8 border-dark-blue border-dashed rounded-full animate-spin mx-auto mb-4'></div>
                    <h2 className='text-dark-blue text-2xl font-bold text-center'>
                        Cargando...
                    </h2>
                    <p className='text-dark-blue text-center mt-2'>
                        Hackeando tu vuelo...
                    </p>
                </div>
            </div>
        )}
            <main className="bg-light-blue p-8 rounded-lg shadow-md w-full max-w-lg mx-auto mt-10 mb-20">
                <h2 className="text-center text-dark-blue text-3xl mb-6">Detalles del Favorito</h2>
                <form>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-base font-medium text-dark-blue mb-2">
                            Titulo
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={favorites.title || ''}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-medium-blue focus:outline-none"
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="origin" className="block text-base font-medium text-dark-blue mb-2">
                            Origen
                        </label>
                        <input
                            type="text"
                            name="origin"
                            value={favorites.origin || ''}
                            onChange={(e) => {
                                handleChange(e);
                                handleSearch(e.target.value, setOriginSuggestions);
                            }}
                            readOnly={!isEditing}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-medium-blue focus:outline-none"
                        />
                        {originSuggestions.length > 0 && (
                            <ul className="absolute top-full bg-white text-black border border-gray-300 max-h-48 overflow-y-auto rounded-md shadow-md z-10">
                                {originSuggestions.map((airport) => (
                                    <li
                                        key={airport.iata}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            setfavorites({ ...favorites, origin: airport.iata });
                                            setOriginSuggestions([]); // Ocultar las sugerencias
                                        }}
                                    >
                                        {airport.city} - {airport.name} ({airport.iata})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Destino */}
                    <div className="mb-6 relative">
                        <label htmlFor="destination" className="block text-base font-medium text-dark-blue mb-2">
                            Destino
                        </label>
                        <input
                            type="text"
                            name="destination"
                            value={favorites.destination || ''}
                            onChange={(e) => {
                                handleChange(e);
                                handleSearch(e.target.value, setDestinationSuggestions);
                            }}
                            readOnly={!isEditing}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-medium-blue focus:outline-none"
                        />
                        {destinationSuggestions.length > 0 && (
                            <ul className="absolute top-full bg-white text-black border border-gray-300 max-h-48 overflow-y-auto rounded-md shadow-md">
                                {destinationSuggestions.map((airport) => (
                                    <li
                                        key={airport.iata}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            setfavorites({ ...favorites, destination: airport.iata });
                                            setDestinationSuggestions([]); // Ocultar las sugerencias
                                        }}
                                    >
                                        {airport.city} - {airport.name} ({airport.iata})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="departureDate" className="block text-base font-medium text-dark-blue mb-2">
                            Fecha de Salida
                        </label>
                        <input
                            type="date"
                            name="departureDate"
                            value={favorites?.departureDate ? new Date(favorites.departureDate).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            readOnly={!isEditing}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-medium-blue focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="returnDate" className="block text-base font-medium text-dark-blue mb-2">
                            Fecha de Regreso
                        </label>
                        <input
                            type="date"
                            name="returnDate"
                            value={favorites?.returnDate ? new Date(favorites.returnDate).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            min={favorites.departureDate ? new Date(favorites.departureDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-medium-blue focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="adults" className="block text-base font-medium text-dark-blue mb-2">
                            Adultos
                        </label>
                        <input
                            type="number"
                            name="adults"
                            value={favorites.adults || 1}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-medium-blue focus:outline-none"
                        />
                    </div>
                    {loading && (
                    <div className='fixed inset-0 bg-dark-blue bg-opacity-90 flex items-center justify-center z-50'>
                        <div className='bg-white p-8 rounded-md shadow-lg max-w-xs mx-auto'>
                            <div className='w-16 h-16 border-8 border-dark-blue border-dashed rounded-full animate-spin mx-auto mb-4'></div>
                            <h2 className='text-dark-blue text-2xl font-bold text-center'>
                                Cargando...
                            </h2>
                            <p className='text-dark-blue text-center mt-2'>
                                hackeando tu vuelo...
                            </p>
                        </div>
                    </div>
                )}
                    <div className="flex justify-between items-center">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-medium-blue focus:outline-none"
                            >
                                Cancelar
                            </button>
                        )}
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className="bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-medium-blue focus:outline-none"
                            >
                                Editar
                            </button>
                        )}
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-medium-blue text-white py-2 px-4 rounded-md hover:bg-accent-blue focus:outline-none"
                            >
                                Guardar
                            </button>
                        )}
                        <button
                            disabled={isEditing}
                            onClick={(e) => {
                                e.preventDefault();
                                handleFavoriteSearch(favorites)}}
                            className="bg-light-blue text-dark-blue py-2 px-4 rounded-md hover:bg-accent-blue focus:outline-none"
                        >
                            Ver Vuelos
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
};

export default FavoriteDetailsEditPage;
