import { useEffect, useState } from 'react';
import useAuthContext from '../hooks/useAuthContext.js';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;
import { useNavigate } from 'react-router-dom';


const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authToken } = useAuthContext();

    //Formato de la fecha para que pueda ser enviada al endpoint de actualización de favoritos.
    const formatDate = (date) => {
        if (!date) return null; // Si la fecha es null, no la formateamos
        const newDate = new Date(date);
        return newDate.toISOString().split('T')[0]; // Devuelve solo la parte de la fecha (sin hora)
    };

    useEffect(() => {
        if (!authToken) return;

        const fetchFavorites = async () => {
            try {
                const res = await fetch(`${VITE_API_URL}/api/users/favorites`, {
                    headers: {
                        Authorization: authToken,
                    },
                });

                const body = await res.json();
                if (!res.ok) {
                    throw new Error(body.message || 'Error desconocido');
                }

                setFavorites(body.data.favorites);
            } catch (err) {
                toast.error(err.message, {
                    id: 'favoriteId',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [authToken]);
    const navigate = useNavigate();
    const handleFavoriteSearch = async (favorite) => {
        try {
            setLoading(true);
            const searchParams = new URLSearchParams({
                origin: favorite.origin,
                destination: favorite.destination,
                departureDate: formatDate(favorite.departureDate),
                adults: favorite.adults,
            });

            if (favorite.returnDate) {
                searchParams.append(
                    'returnDate',
                    formatDate(favorite.returnDate),
                );
            }

            // Hacer la petición directamente a la API de vuelos
            const res = await fetch(
                `${VITE_API_URL}/api/flights/search?${searchParams.toString()}`,
            );
            const body = await res.json();

            if (!res.ok || body.status === 'error') {
                throw new Error(body.message || 'Error al obtener los vuelos');
            }

            const flights = body || [];

            // 🛫 Si es ida y vuelta, obtener también los vuelos de regreso
            let returnFlights = [];
            if (favorite.returnDate) {
                const searchParamsVuelta = new URLSearchParams({
                    origin: favorite.destination,
                    destination: favorite.origin,
                    departureDate: formatDate(favorite.departureDate),
                    adults: favorite.adults,
                });

                const resVuelta = await fetch(
                    `${VITE_API_URL}/api/flights/search?${searchParamsVuelta.toString()}`,
                );
                const bodyVuelta = await resVuelta.json();

                    if (resVuelta.ok && bodyVuelta.length > 0) {
                        returnFlights = bodyVuelta.map((flight) => ({ ...flight, isReturn: true }));
                    }
                }
          
            //Envia los datos del favorito para mostrar los vuelos directamente
            navigate('/search-results', {
                state: {
                    flights: [...flights, ...returnFlights],
                    searchParams: {
                        origin: favorite.origin,
                        destination: favorite.destination,
                        departureDate: favorite.departureDate,
                        returnDate: favorite.returnDate || null,
                        adults: favorite.adults,
                        tipoViaje: favorite.returnDate ? 'ida-vuelta' : 'ida',
                    },
                },
            });
        } catch (err) {
            console.error('Error al buscar vuelos:', err);
            toast.error(
                err.message ||
                    'Error al buscar vuelos, inténtelo de nuevo más tarde.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFavorite = async (favoriteId) => {
        try {
            const res = await fetch(
                `${VITE_API_URL}/api/users/favorites/${favoriteId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: authToken,
                    },
                },
            );

            const body = await res.json();
            if (!res.ok) {
                throw new Error(body.message || 'Error al eliminar favorito');
            }

            setFavorites((prevFavorites) =>
                prevFavorites.filter((fav) => fav.favoriteId !== favoriteId),
            );
            toast.success('Búsqueda borrada con éxito');
        } catch (err) {
            toast.error(err.message, {
                id: 'favoriteId',
            });
        }
    };

    return (
        <div className='flex flex-col min-h-screen'>
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
                )}

            {/* Contenido Principal (ocupa el espacio restante) */}
            <main className='flex-grow w-full max-w-4xl mx-auto mt-6 p-4 sm:p-6 bg-white rounded-lg shadow-md mb-10'>
                <h2 className='text-2xl sm:text-3xl font-semibold text-center text-dark-blue mb-4 sm:mb-6'>
                    Lista de Búsquedas Favoritas
                </h2>

                {favorites.length === 0 ? (
                    <p className='text-center text-gray-500'>
                        No tienes búsquedas favoritas aún.
                    </p>
                ) : (
                    <ul className='space-y-4'>
                        {favorites.map((favorite) => (
                            <li
                                key={favorite.favoriteId}
                                className='bg-gray-100 p-4 rounded-lg shadow-sm'
                            >
                                <p className='text-base sm:text-lg font-medium text-gray-800'>
                                    {favorite.title} - Desde{' '}
                                    <span className='text-medium-blue'>
                                        {favorite.origin}
                                    </span>{' '}
                                    a{' '}
                                    <span className='text-medium-blue'>
                                        {favorite.destination}
                                    </span>
                                </p>
                                <p className='text-sm text-gray-600'>
                                    Fecha de salida:{' '}
                                    {new Date(
                                        favorite.departureDate,
                                    ).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}{' '}
                                    {favorite.returnDate
                                        ? `- Fecha de retorno: ${new Date(
                                              favorite.returnDate,
                                          ).toLocaleDateString('es-ES', {
                                              day: '2-digit',
                                              month: 'long',
                                              year: 'numeric',
                                          })}  `
                                        : ''}
                                    | Adultos: {favorite.adults}
                                </p>

                                <div className='mt-3 flex flex-wrap gap-2'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFavoriteSearch(favorite);
                                        }}
                                        className='bg-medium-blue text-white px-4 py-2 rounded-md hover:bg-dark-blue transition text-sm sm:text-base'
                                    >
                                        Ver Vuelos
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteFavorite(
                                                favorite.favoriteId,
                                            )
                                        }
                                        className='bg-transparent text-gray-700 px-4 py-2 rounded-md hover:bg-dark-blue hover:text-white transition text-sm sm:text-base'
                                    >
                                        Borrar
                                    </button>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/favorites/${favorite.favoriteId}`,
                                            )
                                        }
                                        className='bg-light-yellow text-dark-blue px-4 py-2 rounded-md border-2 hover:border-dark-blue text-sm sm:text-base'
                                    >
                                        Editar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;
