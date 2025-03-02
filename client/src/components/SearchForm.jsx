import PropTypes from 'prop-types';

const SearchForm = ( {
    tipoViaje,
    fechaSalida,
    fechaRetorno,
    origen,
    destino,
    pasajeros,
    setTipoViaje,
    setFechaSalida,
    setFechaRetorno,
    setOrigen,
    setDestino,
    setPasajeros,
    handleSubmit
} ) => {
    return (
        <div className='relative z-10 flex justify-center items-center'>
            <form onSubmit={handleSubmit} className='flex flex-col items-center w-11/12 md:w-4/5 space-y-4 p-8 bg-dark-blue text-light-blue shadow-lg rounded-lg'>
                <div className='grid grid-cols-2 gap-4 w-full'>
                    <div className='flex flex-col'>
                        <label>Pasajeros:</label>
                        <input
                            type="number"
                            value={pasajeros}
                            onChange={( e ) => setPasajeros( e.target.value )}
                            min="1"
                            className='text-slate-900 w-full border border-dark-blue p-2'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label>Tipo de Viaje:</label>
                        <select value={tipoViaje} onChange={( e ) => setTipoViaje( e.target.value )} className='text-slate-900 w-full border border-dark-blue p-2'>
                            <option value="ida">Ida</option>
                            <option value="ida-vuelta">Ida y Vuelta</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label>Origen:</label>
                        <input
                            type="text"
                            value={origen}
                            onChange={( e ) => setOrigen( e.target.value )}
                            className='text-slate-900 w-full border border-dark-blue p-2'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label>Destino:</label>
                        <input
                            type="text"
                            value={destino}
                            onChange={( e ) => setDestino( e.target.value )}
                            className='text-slate-900 w-full border border-dark-blue p-2'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label>Fecha de Salida:</label>
                        <input
                            type="date"
                            value={fechaSalida}
                            onChange={( e ) => setFechaSalida( e.target.value )}
                            className='text-slate-900 w-full border border-dark-blue p-2'
                        />
                    </div>
                    {tipoViaje === 'ida-vuelta' && (
                        <div className='flex flex-col'>
                            <label>Fecha de Retorno:</label>
                            <input
                                type="date"
                                value={fechaRetorno}
                                onChange={( e ) => setFechaRetorno( e.target.value )}
                                className='text-slate-900 w-full border border-dark-blue p-2'
                            />
                        </div>
                    )}
                </div>
                <button type="submit" className="top-3 relative py-4 px-8 text-slate-900 text-base font-bold overflow-hidden bg-medium-blue rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-accent-blue before:to-medium-blue before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0">Buscar</button>
            </form>
        </div>
    );
};

SearchForm.propTypes = {
    tipoViaje: PropTypes.string.isRequired,
    fechaSalida: PropTypes.string.isRequired,
    fechaRetorno: PropTypes.string,
    origen: PropTypes.string.isRequired,
    destino: PropTypes.string.isRequired,
    pasajeros: PropTypes.number.isRequired,
    setTipoViaje: PropTypes.func.isRequired,
    setFechaSalida: PropTypes.func.isRequired,
    setFechaRetorno: PropTypes.func.isRequired,
    setOrigen: PropTypes.func.isRequired,
    setDestino: PropTypes.func.isRequired,
    setPasajeros: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
};

export default SearchForm;