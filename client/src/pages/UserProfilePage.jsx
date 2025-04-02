import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext.js';
import moment from 'moment';

const { VITE_API_URL } = import.meta.env;

const UserProfilePage = () => {
    const { authToken, authUser, authLoading } = useAuthContext(); // Usar `authUser` en lugar de `user`
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
        }
    }, [authToken, navigate]);

    if (authLoading) {
        return (
            <p className='text-center mt-4 text-dark-blue font-body'>
                Cargando perfil...
            </p>
        );
    }

    if (!authUser) {
        return (
            <p className='text-center mt-4 text-dark-blue font-body'>
                No se pudo cargar la información del usuario.
            </p>
        );
    }

    return (
        <main className='bg-gradient-to-b from-dark-blue to-white min-h-screen flex flex-col justify-between'>
            <div className='flex flex-col items-center justify-center flex-1 p-4'>
                <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg lg:max-w-4xl transition transform hover:scale-[1.008]'>
                    <h2 className='text-3xl sm:text-4xl font-heading font-light  text-dark-blue text-center mb-6'>
                        PERFIL DE USUARIO
                    </h2>
                    
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16'>
                        <div className='flex flex-col items-center'>
                            <img
                                src={
                                    authUser.avatar
                                        ? `${VITE_API_URL}/uploads/${authUser.avatar}`
                                        : '/default-avatar.png'
                                }
                                alt='Avatar'
                                className='w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover shadow-lg transition transform hover:scale-105'
                            />
                        </div>
                        <div className='mt-6 lg:mt-7 lg:w-3/3'>
                            <div className='space-y-3'>
                                <p className='text-dark-blue text-base sm:text-lg font-body'>
                                    <strong>Nombre:</strong> {authUser.firstName} {authUser.lastName}
                                </p>
                                <p className='text-dark-blue text-base sm:text-lg font-body'>
                                    <strong>Usuario:</strong> {authUser.username}
                                </p>
                                <p className='text-dark-blue text-base sm:text-lg font-body'>
                                    <strong>Email:</strong> {authUser.email}
                                </p>
                                <p className='text-dark-blue text-base sm:text-lg font-body'>
                                    <strong>Edad:</strong> {moment().diff(moment(authUser.birthdate), 'years')} años
                                </p>
                                <p className='text-dark-blue text-base sm:text-lg font-body'>
                                    <strong>Miembro desde:</strong> {moment(authUser.createdAt).format('DD/MM/YYYY')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 space-y-4 lg:flex lg:space-y-0 lg:space-x-4 lg:mt-10'>
                        <button
                            onClick={() => navigate('/users/profile/edit')}
                            className='w-full py-2 font-button rounded-md transition-colors duration-300 bg-dark-blue text-white hover:bg-medium-blue'
                        >
                            Editar perfil
                        </button>
                        <button
                            onClick={() => navigate('/users/profile/password')}
                            className='w-full py-2 font-button  rounded-md transition-colors duration-300 bg-dark-blue text-white hover:bg-medium-blue'
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserProfilePage;