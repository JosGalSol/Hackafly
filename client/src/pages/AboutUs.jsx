//Importamos componentes

import { FaPlane, FaHandshake, FaLightbulb, FaHeart } from 'react-icons/fa';

// Inicializamos el componente AboutUs que mostrará la información sobre nuestra empresa
const AboutUs = () => {
    return (
        <>
            
            {/* Contenedor principal */}
            <main className='bg-[#E5F7FF] flex flex-col items-center justify-center min-h-screen p-6'>
                <div className='w-full max-w-4xl mx-auto'>
                    <section className='bg-[#083059] text-white p-12 rounded-lg shadow-lg mb-8 transform hover:scale-[1.02] transition-transform'>
                        <h1 className='text-4xl font-bold text-center mb-6'>
                            <img
                                src='/logo.png'
                                alt='logo-hackaflight'
                            />
                        </h1>
                        <p className='text-xl text-center max-w-2xl mx-auto opacity-90'>
                            Tu compañero de confianza para encontrar los mejores
                            vuelos al mejor precio
                        </p>
                    </section>

                    {/* Sección de Misión */}
                    <div className='grid md:grid-cols-2 gap-8 mb-8'>
                        <section className='bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow'>
                            <div className='flex items-center mb-4'>
                                <FaPlane className='text-[#179DD9] text-3xl mr-4' />
                                <h2 className='text-2xl font-bold text-[#083059]'>
                                    Nuestra Misión
                                </h2>
                            </div>
                            <p className='text-gray-600 leading-relaxed'>
                                Conectar a viajeros con las mejores ofertas de
                                vuelos, haciendo que viajar sea accesible para
                                todos. Nos esforzamos por simplificar la
                                búsqueda y reserva de vuelos, proporcionando una
                                experiencia transparente y confiable.
                            </p>
                        </section>
                        <section className='bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow'>
                            <div className='flex items-center mb-4'>
                                <FaLightbulb className='text-[#179DD9] text-3xl mr-4' />
                                <h2 className='text-2xl font-bold text-[#083059]'>
                                    Nuestra Visión
                                </h2>
                            </div>
                            <p className='text-gray-600 leading-relaxed'>
                                Ser la plataforma líder en la búsqueda de
                                vuelos, reconocida por nuestra innovación,
                                transparencia y compromiso con la satisfacción
                                del cliente. Queremos hacer que viajar sea una
                                experiencia accesible y emocionante para todos.
                            </p>
                        </section>
                    </div>

                    {/* Sección de Valores con diseño en cuadrícula */}
                    <section className='bg-white p-8 rounded-lg shadow-md'>
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-[#083059] mb-4'>
                                Nuestros Valores
                            </h2>
                            <div className='w-24 h-1 bg-[#179DD9] mx-auto'></div>
                        </div>
                        <div className='grid md:grid-cols-2 gap-6'>
                            <div className='bg-[#E5F7FF] p-6 rounded-lg transform hover:scale-105 transition-transform'>
                                <div className='flex items-center mb-4'>
                                    <div className='bg-[#083059] p-3 rounded-full'>
                                        <FaHandshake className='text-white text-xl' />
                                    </div>
                                    <h3 className='font-bold text-[#083059] ml-4 text-xl'>
                                        Transparencia
                                    </h3>
                                </div>
                                <p className='text-gray-600'>
                                    Mostramos precios claros y condiciones sin
                                    letra pequeña.
                                </p>
                            </div>
                            <div className='bg-[#E5F7FF] p-6 rounded-lg transform hover:scale-105 transition-transform'>
                                <div className='flex items-center mb-4'>
                                    <div className='bg-[#083059] p-3 rounded-full'>
                                        <FaLightbulb className='text-white text-xl' />
                                    </div>
                                    <h3 className='font-bold text-[#083059] ml-4 text-xl'>
                                        Innovación
                                    </h3>
                                </div>
                                <p className='text-gray-600'>
                                    Mejoramos constantemente nuestra tecnología
                                    para ofrecer la mejor experiencia.
                                </p>
                            </div>
                            <div className='bg-[#E5F7FF] p-6 rounded-lg transform hover:scale-105 transition-transform'>
                                <div className='flex items-center mb-4'>
                                    <div className='bg-[#083059] p-3 rounded-full'>
                                        <FaHeart className='text-white text-xl' />
                                    </div>
                                    <h3 className='font-bold text-[#083059] ml-4 text-xl'>
                                        Compromiso
                                    </h3>
                                </div>
                                <p className='text-gray-600'>
                                    Nos dedicamos a encontrar las mejores
                                    ofertas para nuestros usuarios.
                                </p>
                            </div>
                            <div className='bg-[#E5F7FF] p-6 rounded-lg transform hover:scale-105 transition-transform'>
                                <div className='flex items-center mb-4'>
                                    <div className='bg-[#083059] p-3 rounded-full'>
                                        <FaPlane className='text-white text-xl' />
                                    </div>
                                    <h3 className='font-bold text-[#083059] ml-4 text-xl'>
                                        Accesibilidad
                                    </h3>
                                </div>
                                <p className='text-gray-600'>
                                    Hacemos que viajar sea posible para todos
                                    los presupuestos.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};
export default AboutUs;
