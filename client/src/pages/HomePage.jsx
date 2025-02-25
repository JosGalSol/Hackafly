import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [ tipoViaje, setTipoViaje ] = useState( 'ida' );
    const [ fechaSalida, setFechaSalida ] = useState( '' );
    const [ fechaLlegada, setFechaLlegada ] = useState( '' );
    const [ origen, setOrigen ] = useState( '' );
    const [ destino, setDestino ] = useState( '' );
    const [ pasajeros, setPasajeros ] = useState( 1 );
    const [ claseBillete, setClaseBillete ] = useState( '' );
    const [ popularDestinations, setPopularDestinations ] = useState( [] );
    const [ topComments, setTopComments ] = useState( [] );

    const airportCodes = {
        Madrid: 'MAD',
        NuevaYork: 'JFK',
        Paris: 'CDG',
        Londres: 'LHR',
        Tokio: 'NRT'
    };

    useEffect( () => {
        // Simulación de datos de destinos más buscados, cambiar por una llamada a la api
        const fetchedPopularDestinations = [
            { origen: 'Madrid', destino: 'Nueva York' },
            { origen: 'Londres', destino: 'Tokio' },
            { origen: 'Paris', destino: 'Londres' }
        ];
        setPopularDestinations( fetchedPopularDestinations );

        // Simulación de datos de comentarios con ratings, cambiar por una llamada a la api
        const fetchedTopComments = [
            { user: 'Usuario1', comment: 'Excelente servicio!', rating: 5 },
            { user: 'Usuario2', comment: 'Muy buena experiencia.', rating: 4 },
            { user: 'Usuario3', comment: 'Recomendado!', rating: 4 }
        ];
        setTopComments( fetchedTopComments );
    }, [] );

    const toggleTipoViaje = () => {
        setTipoViaje( ( prevTipoViaje ) => ( prevTipoViaje === 'ida' ? 'ida-vuelta' : 'ida' ) );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();
        const origenCode = airportCodes[ origen ] || origen;
        const destinoCode = airportCodes[ destino ] || destino;

        const searchParams = {
            tipoViaje,
            fechaSalida,
            fechaLlegada,
            origen: origenCode,
            destino: destinoCode,
            pasajeros,
            claseBillete
        };
        { /* Aquí puedes hacer la llamada a la API con los datos de búsqueda, solo es un ejemplo*/ }
        fetch( 'https://api.example.com/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( searchParams )
        } )
            .then( response => response.json() )
            .then( data => console.log( data ) )
            .catch( error => console.error( 'Error:', error ) );
    };

    return (
        <div className="homepage">
            {/* Sección de búsqueda de vuelos */}
            <section className="search-section">
                <h2>¿Qué aventuras tienes en mente?</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Origen:</label>
                        <input
                            type="text"
                            name="origen"
                            value={origen}
                            onChange={( e ) => setOrigen( e.target.value )}
                            placeholder="Origen"
                        />
                    </div>

                    <div>
                        <label>Destino:</label>
                        <input
                            type="text"
                            name="destino"
                            value={destino}
                            onChange={( e ) => setDestino( e.target.value )}
                            placeholder="Destino"
                        />
                    </div>
                    {/* agregar más campos de búsqueda (escalas, aerolíneas, etc) Falta establecer la fecha actual como valor*/}
                    <div>
                        <label>Fecha de salida:</label>
                        <input
                            type="date"
                            name="fecha-salida"
                            value={fechaSalida}
                            onChange={( e ) => setFechaSalida( e.target.value )}
                        />
                    </div>

                    {tipoViaje === 'ida-vuelta' && (
                        <div>
                            <label>Fecha de llegada:</label>
                            <input
                                type="date"
                                name="fecha-llegada"
                                value={fechaLlegada}
                                onChange={( e ) => setFechaLlegada( e.target.value )}
                            />
                        </div>
                    )}

                    <div>
                        <label>Tipo de viaje:</label>
                        <button type="button" onClick={toggleTipoViaje} className="tipo-viaje-button">
                            {tipoViaje === 'ida' ? 'Solo Ida' : 'Ida y Vuelta'}
                        </button>
                    </div>

                    <div>
                        <label>Cantidad de pasajeros:</label>
                        <input
                            type="number"
                            name="pasajeros"
                            min="1"
                            max="10"
                            value={pasajeros}
                            onChange={( e ) => setPasajeros( e.target.value )}
                        />
                    </div>

                    <div>
                        <label>Clase del billete:</label>
                        <select
                            name="clase-billete"
                            value={claseBillete}
                            onChange={( e ) => setClaseBillete( e.target.value )}
                        >
                            <option value="">Selecciona una clase</option>
                            <option value="economica">Económica</option>
                            <option value="business">Business</option>
                            <option value="primera">Primera</option>
                        </select>
                    </div>

                    <button type="submit">Buscar</button>
                </form>

                <div className="carrousel-images">
                    {/* Agregar aqui las imágenes del carrusel */}
                    <img src="/src/img/avion1.jpg" alt="avion1" />
                    <img src="/src/img/avion2.jpg" alt="avion2" />
                    <img src="/src/img/avion3.jpg" alt="avion3" />
                    {/* ... más imágenes */}
                </div>
            </section>

            {/* Sección de últimas búsquedas */}
            <section className="recent-searches-section">
                <h2>Últimas Búsquedas realizadas...</h2>
                <div className="search-card">
                    <p>Origen: Madrid</p>
                    <p>Destino: Nueva York</p>
                    <button><img src='/src/img/buscar.png' alt='buscar' /></button>
                    <button><img src='/src/img/marcador.png' alt='guardar' /></button>
                </div>
            </section>

            {/* Sección de destinos más buscados y resumen de ratings */}
            <section className="popular-destinations-ratings-section">
                <div className="popular-destinations">
                    <h2>Destinos Más Buscados...</h2>
                    <button><img src='/src/img/flecha.png' alt='retroceder' /></button>

                    <ul>
                        {popularDestinations.map( ( destino, index ) => (
                            <div key={index} className='search-cards'>
                                <img src="" alt="" />
                                <li className='origen'>{destino.origen}</li>
                                <img src='/src/img/avion-cards.png' alt='avion' />
                                <li className='llegada'>{destino.destino}</li>
                            </div>
                        ) )}
                    </ul>
                    <button><img src='/src/img/flecha.png' alt='avanzar' /></button>
                </div>
                <div className="ratings-summary">
                    <h2>Lo que piensan nuestros usuarios...</h2>
                    {topComments.slice( 0, 3 ).map( ( comment, index ) => (
                        <div key={index} className="comment">
                            <p><strong>{comment.user}:</strong> {comment.comment}</p>
                            <p>Rating: {comment.rating}/5</p>
                        </div>
                    ) )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;