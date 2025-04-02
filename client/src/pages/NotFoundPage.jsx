

// Inicializamos el componente.
const NotFoundPage = () => {
    return (
        <>
            
            <main className='bg-black min-h-screen flex flex-col items-center justify-center p-4'>
                <div className='max-w-sm w-full mx-auto text-center'>
                    <h3 className='text-light-blue font-button  text-6xl font-semibold mb-2'>
                        Error 404
                    </h3>
                    <img
                        src='/error404.png'
                        alt='Error 404'
                        className='mx-auto mb-2 w-2/3 h-auto'
                    />
                    <h2 className='text-medium-blue font-button text-3xl font-bold mb-2'>
                        Página no encontrada
                    </h2>

                    <p className='text-light-blue mb-11 font-body'>
                        La página a la que intentas acceder no existe.
                    </p>

                    <a
                        href='/'
                        className='inline-block bg-white hover:bg-medium-blue text-dark-blue font-bold py-2 px-4 rounded transition-colors'
                    >
                        Volver al inicio
                    </a>
                </div>
            </main>
        </>
    );
};

export default NotFoundPage;
