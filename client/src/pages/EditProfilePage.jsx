// Importamos los hooks.
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos la función que muestra un mensaje al usuario.
import toast from 'react-hot-toast';
// Importamos el contexto de autorización.
import useAuthContext from '../hooks/useAuthContext.js';
//importamos momento para configurar la fehca entregada por el servidor
import moment from 'moment';


// Importamos la URL de nuestra API.
const { VITE_API_URL } = import.meta.env;
// Inicializamos el componente
const EditProfilePage = () => {
    // obtenemos el toquen de autenticación del contexto
    const { authToken } = useAuthContext();
    const navigate = useNavigate();

    // Para almacenar los datos del usuario
    const [userData, setUserData] = useState(null);

    const [firstName, SetFirstName] = useState('');
    const [lastName, SetLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // cargando
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const inputFileRef = useRef(null);
    // obtenemos los datos del usuario al cargar la página
    useEffect(() => {
        // si no hay toquen, regresamos a la página de login
        if (!authToken) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            setProfileLoading(true);
            try {
                // Realizamos una petición a la API para la información del usuario
                const response = await fetch(
                    `${VITE_API_URL}/api/users/profile`,
                    { headers: { Authorization: `${authToken}` } },
                );

                // Si no hay respuesta, se lanza un error
                if (!response.ok)
                    throw new Error(
                        `Error ${response.status}: ${response.statusText}`,
                    );

                const data = await response.json();
                const user = data.data.user;
                setUserData(user);

                SetFirstName(user.firstName);
                SetLastName(user.lastName);
                setUsername(user.username);
                setEmail(user.email);
            } catch (error) {
                toast.error(
                    error.message || 'Error al cargar los datos del usuario',
                );
            } finally {
                setProfileLoading(false);
            }
        };

        fetchUserData();
    }, [authToken, navigate]);

    const handleAvatarChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('avatar', e.target.files[0]);
            setAvatarLoading(true);
            try {
                const response = await fetch(
                    `${VITE_API_URL}/api/users/avatar`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `${authToken}`,
                        },
                        body: formData,
                    },
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || 'Error al actualizar el avatar',
                    );
                }
                toast.success('Avatar actualizado');
                // Actualizamos el avatar en el estado
                setUserData({ ...userData, avatar: result.data.user.avatar });
            } catch (error) {
                toast.error(`Error: ${error.message}`);
            } finally {
                setAvatarLoading(false);
            }
        }
    };

    // Cambio de contraseña
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        // Doble validación de la nueva contraseña
        try {
            setLoading(true);
            // realizamos la petición a la API para la actualización de contraseña
            const response = await fetch(`${VITE_API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${authToken}`,
                },
                body: JSON.stringify({ firstName, lastName, username, email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Error al actualizar el perfil',
                );
            }
            // si todo está bien, muestra un mensaje de éxito y se limpian los campos del formulario
            toast.success('Perfil Actualizado');
            // Actualizamos el perfil y redirigimos a la pagina de perfil
            navigate('/users/profile');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Mostramos mensajes de perfil cargando...
    if (profileLoading) {
        return (
            <div className='bg-gradient-to-b from-dark-blue to-white min-h-screen flex items-center justify-center'>
                <p className='text-center text-dark-blue font-body text-xl sm:text-2xl'>
                    Cargando perfil...
                </p>
            </div>
        );
    }
    // Si el perfil no carga, mostramos un error.
    if (!userData) {
        return (
            <div className='bg-gradient-to-b from-dark-blue to-white min-h-screen flex items-center justify-center'>
                <p className='text-center text-dark-blue font-body text-xl sm:text-2xl'>
                    No se pudo cargar la información del usuario.
                </p>
            </div>
        );
    }
    // formulario para editar el perfil
    return (
        <>
            
            <main className='bg-gradient-to-b from-dark-blue to-thite min-h-screen flex flex-col justify-center p-4'>
                <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm lg:max-w-4xl mx-auto transition transform hover:scale-[1.008]'>
                    <h2 className='text-3xl sm:text-4xl font-heading font-light text-dark-blue text-center mb-6'>
                        EDITAR PERFIL
                    </h2>

                    <div className='flex flex-col items-center apace-y-4 mb-6'>
                        <img
                            src={
                                userData.avatar !== null
                                    ? `${VITE_API_URL}/uploads/${userData.avatar}`
                                    : '/default-avatar.png'
                            }
                            alt='Avatar'
                            className='w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover shadow-lg transition transform hover:scale-105'
                        />
                        <br />
                        <button
                            type='button'
                            onClick={() => inputFileRef.current.click()}
                            disabled={avatarLoading}
                            className='w-full py-2 font-button rounded-md transition-colors duration-300 bg-dark-blue text-white hover:bg-medium-blue'
                        >
                            {avatarLoading
                                ? 'Cambiando avatar...'
                                : 'Cambiar Avatar'}
                        </button>
                        <input
                            type='file'
                            ref={inputFileRef}
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            accept='image/*'
                        />
                    </div>

                    {/* Formulario para actualizar información del usuario */}
                    <form onSubmit={handleProfileUpdate} className='space-y-4'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-dark-blue font-medium text-sm mb-1'>
                                    Nombre:
                                </label>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={(e) =>
                                        SetFirstName(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                    className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                                />
                            </div>
                            <div>
                                <label className='block text-dark-blue font-medium text-sm mb-1'>
                                    Apellido:
                                </label>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={(e) =>
                                        SetLastName(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                    className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                                />
                            </div>
                            <div>
                                <label className='block text-dark-blue font-medium text-sm mb-1'>
                                    Usuario:
                                </label>
                                <input
                                    type='text'
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                    className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                                />
                            </div>
                            <div>
                                <label className='block text-dark-blue font-medium text-sm mb-1'>
                                    Email:
                                </label>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                                />
                            </div>
                        </div>
                        {/* la edad no sera modificable (campo deshabilitado)*/}
                        <div>
                            <label className='block text-dark-blue font-medium text-sm mb-1'>
                                Edad:
                            </label>
                            <input
                                type='text'
                                value={`${moment().diff(moment(userData.birthdate), 'years')} años`}
                                disabled
                                className='w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-body'
                            />
                        </div>
                        <div className='flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 mt-6'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full py-2 font-button  rounded-md transition-color duration-300 bg-dark-blue text-white hover:bg-medium-blue'
                            >
                                {loading ? 'Actualizando...' : 'Actualizar'}
                            </button>
                            <button
                                type='button'
                                onClick={() => navigate('/users/profile')}
                                disabled={loading}
                                className='w-full py-2 font-button rounded-md transition-color duration-300 bg-gray-200 text-dark-blue hover:bg-gray-300'
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                    <hr className='my-4' />
                    <button
                        onClick={() => navigate('/users/profile/password')}
                        className='w-full py-2 font-button rounded-md transition-colors duration-300 bg-dark-blue text-white hover:bg-medium-blue'
                    >
                        Cambiar Contraseña
                    </button>
                </div>
            </main>
        </>
    );
};

export default EditProfilePage;
