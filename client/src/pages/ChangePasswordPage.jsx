// Importamos los hooks.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos la función que muestra un mensaje al usuario.
import toast from 'react-hot-toast';
// Importamos el contexto de autorización.
import useAuthContext from '../hooks/useAuthContext.js';
import Header from '../components/Header.jsx';
import { Eye, EyeOff } from 'lucide-react';
// Importamos la URL de nuestra API.
const { VITE_API_URL } = import.meta.env;
// Inicializamos el componente
const ChangePasswordPage = () => {
    // obtenemos el toquen de autenticación del contexto
    const { authToken } = useAuthContext();
    const navigate = useNavigate();
    // para el cambio de contraseña
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // cargando
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        // Doble validación de la nueva contraseña
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        try {
            setLoading(true);
            // realizamos la petición a la API para la actualización de contraseña
            const response = await fetch(`${VITE_API_URL}/api/users/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${authToken}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Error al actualizar la contraseña',
                );
            }
            // si todo está bien, muestra un mensaje de éxito y se limpian los campos del formulario
            toast.success('Contraseña actualizada correctamente');
            // al hacer el cambio de contraseña, redirigimos al perfil
            navigate('/users/profile');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className='bg-gradient-to-b from-dark-blue to-white min-h-screen flex flex-col justify-center p-4'>
                <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm lg:max-w-4xl mx-auto transition transform hover:scale-[1.008]'>
                    <h2 className='text-3xl sm:text-4xl font-heading font-light text-dark-blue text-center mb-6'>
                        CAMBIAR CONTRASEÑA
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className=' text-[#3951AA] hover:text-[#179DD9] pl-5 '
                        >
                            {showPassword ? (
                                <EyeOff size={40} />
                            ) : (
                                <Eye size={40} />
                            )}
                        </button>
                    </h2>

                    <form onSubmit={handlePasswordChange} className='space-y-4'>
                        <div>
                            <label className='block text-dark-blue font-medium text-sm mb-1 font-body'>
                                Contraseña Actual:
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                required
                                autoComplete='current-password'
                                disabled={loading}
                                className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                            />
                        </div>
                        <div>
                            <label className='block text-dark-blue font-medium text-sm mb-1 font-body'>
                                Nueva Contraseña:
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                autoComplete='new-password'
                                disabled={loading}
                                className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                            />
                        </div>
                        <div>
                            <label className='block text-dark-blue font-medium text-sm mb-1 font-body'>
                                Confirmar Contraseña:
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                autoComplete='new-password'
                                disabled={loading}
                                className='w-full p-3 border border-accent-blue rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue font-body'
                            />
                        </div>
                        <div className='flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 mt-6'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full py-2 font-button rounded-md transition-colors duration-300 bg-dark-blue text-white hover:bg-medium-blue'
                            >
                                {loading
                                    ? 'Actualizando...'
                                    : 'Cambiar contraseña'}
                            </button>
                            <button
                                type='button'
                                onClick={() => navigate('/users/profile')}
                                disabled={loading}
                                className='w-full py-2 font-button rounded-md transition-colors duration-300 bg-gray-200 text-dark-blue hover:bg-gray-300'
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default ChangePasswordPage;
