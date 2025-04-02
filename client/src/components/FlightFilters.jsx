import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react'; // Importamos la función findAirline de aircodes

const FlightFilters = ({ onFilterChange, visibleAirlines }) => {
    const [filters, setFilters] = useState({
        stops: '',
        minPrice: '',
        maxPrice: '',
        sortByPrice: '',
        airline: '',
    });

    const [airlineSuggestions, setAirlineSuggestions] = useState([]); // Estado para las sugerencias de aerolíneas
    const suggestionsRef = useRef(null); // Referencia para el contenedor de sugerencias

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));

        // Si el campo que cambia es "airline", buscar sugerencias de aerolíneas
        if (name === 'airline' && value) {
            fetchAirlineSuggestions(value); // Llamar a la función de búsqueda de aerolíneas
        } else {
            setAirlineSuggestions([]); // Limpiar las sugerencias si el campo está vacío
        }
    };

    const fetchAirlineSuggestions = (query) => {
        // Filtrar las aerolíneas visibles que coinciden con el query
        const filteredSuggestions = visibleAirlines.filter((airline) =>
            airline.toLowerCase().includes(query.toLowerCase()),
        );
        setAirlineSuggestions(filteredSuggestions);
    };

    const applyFilters = () => {
        onFilterChange(filters);
    };

    const handleSuggestionClick = (airlineName) => {
        // Establecer el nombre de la aerolínea en el filtro y limpiar las sugerencias
        setFilters({
            ...filters,
            airline: airlineName,
        });
        setAirlineSuggestions([]); // Limpiar las sugerencias después de seleccionar una
    };

    // Detectar clics fuera del contenedor de sugerencias
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setAirlineSuggestions([]); // Cerrar las sugerencias si el clic es fuera del contenedor
            }
        };

        document.addEventListener('mousedown', handleClickOutside); // Escuchar clics fuera del contenedor

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Limpiar el evento cuando se desmonta el componente
        };
    }, []);

    useEffect(() => {
    }, [filters]);

    return (
        <section className='flex justify-center w-full py-6 bg-gradient-to-b from-dark-blue to-light-blue'>
            <div className='w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md space-y-4'>
                <h2 className='text-xl sm:text-2xl font-semibold text-center text-dark-blue mb-4'>
                    Filtros de Búsqueda
                </h2>
                <div className='space-y-3'>
                    <div>
                        <label className='block text-base font-medium text-gray-700'>
                            Paradas
                        </label>
                        <select
                            name='stops'
                            value={filters.stops}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medium-blue focus:border-medium-blue text-sm'
                        >
                            <option value=''>Cualquiera</option>
                            <option value='0'>Directo</option>
                            <option value='1'>1 Parada</option>
                            <option value='2'>2 Paradas</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-base font-medium text-gray-700'>
                            Aerolíneas
                        </label>
                        <input
                            type='text'
                            name='airline'
                            value={filters.airline}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medium-blue focus:border-medium-blue text-sm'
                        />
                        {airlineSuggestions.length > 0 && (
                            <ul
                                ref={suggestionsRef} // Asignamos la referencia al contenedor de las sugerencias
                                className='mt-2 border border-gray-300 rounded-md bg-white max-h-40 overflow-y-auto'
                            >
                                {airlineSuggestions.map((airline, index) => (
                                    <li
                                        key={index}
                                        className='p-2 cursor-pointer hover:bg-gray-100'
                                        onClick={() =>
                                            handleSuggestionClick(airline)
                                        } // Llamamos a handleSuggestionClick al seleccionar una sugerencia
                                    >
                                        {airline}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label className='block text-base font-medium text-gray-700'>
                            Precio Mínimo
                        </label>
                        <input
                            type='number'
                            name='minPrice'
                            value={filters.minPrice}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medium-blue focus:border-medium-blue text-sm'
                        />
                    </div>
                    <div>
                        <label className='block text-base font-medium text-gray-700'>
                            Precio Máximo
                        </label>
                        <input
                            type='number'
                            name='maxPrice'
                            value={filters.maxPrice}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medium-blue focus:border-medium-blue text-sm'
                        />
                    </div>
                    <div>
                        <label className='block text-base font-medium text-gray-700'>
                            Ordenar por
                        </label>
                        <select
                            name='sortByPrice'
                            value={filters.sortByPrice}
                            onChange={handleInputChange}
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medium-blue focus:border-medium-blue text-sm'
                        >
                            <option value=''>Seleccionar</option>
                            <option value='true'>Precio Ascendente</option>
                            <option value='false'>Precio Descendente</option>
                        </select>
                    </div>
                    <div className='text-center'>
                        <button
                            onClick={applyFilters}
                            className='top-3 relative py-2 px-4 text-white text-base font-bold overflow-hidden bg-medium-blue rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 '
                        >
                            Aplicar Filtros
                        </button>
                    </div>                    
                </div>
            </div>
        </section>
    );
};

FlightFilters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    visibleAirlines: PropTypes.array,
};

export default FlightFilters;
