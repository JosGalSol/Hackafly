import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext.js';
import { Link } from 'react-router-dom';

import { Eye, EyeOff } from 'lucide-react';

const { VITE_API_URL } = import.meta.env;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { authUser, authLoginState } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [formInputs, setFormInputs] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const res = await fetch(`${VITE_API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formInputs),
            });

            const body = await res.json();

            if (body.status === 'error') {
                throw new Error(body.message);
            }

            authLoginState(body.data.token);
            toast.success('Bienvenid@!');
        } catch (err) {
            toast.error(err.message),
                {
                    id: 'login',
                };
        } finally {
            setLoading(false);
        }
    };

    if (authUser) {
        return <Navigate to='/' />;
    }

    return (
        <>
            
            <main className='bg-gradient-to-b from-dark-blue to-white flex items-center justify-center min-h-screen p-4'>
                <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-lg'>
                    <h2 className='text-3xl font-heading font-light text-dark-blue text-center mb-8'>
                        INICIAR SESIÓN
                    </h2>
                    <form
                        onSubmit={handleLogin}
                        className='flex flex-col space-y-4'
                    >
                        <label
                            htmlFor='email'
                            className='block text-dark-blue font-body'
                        >
                            Correo Electrónico
                        </label>
                        <input
                            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue'
                            type='email'
                            id='email'
                            value={formInputs.email}
                            onChange={(e) =>
                                setFormInputs({
                                    ...formInputs,
                                    email: e.target.value,
                                })
                            }
                            autoComplete='email'
                            autoFocus
                            required
                        />
                        <label
                            htmlFor='pass'
                            className='block text-dark-blue font-body'
                        >
                            Contraseña
                        </label>
                        <div className='relative'>
                            <input
                                className='w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue'
                                type={showPassword ? 'text' : 'password'}
                                id='pass'
                                value={formInputs.password}
                                onChange={(e) =>
                                    setFormInputs({
                                        ...formInputs,
                                        password: e.target.value,
                                    })
                                }
                                autoComplete='current-password'
                                required
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute inset-y-0 right-3 flex items-center text-[#3951AA] hover:text-[#179DD9]'
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                        <div className='text-center text-[#083059] '>
                            <Link
                                className='text-medium-blue font-bold hover:underline'
                                to='/users/password/recover/request'
                            >
                                Recuperar Contraseña
                            </Link>
                        </div>
                        <button
                            disabled={loading}
                            className={`w-full py-3 font-bold rounded-md transition 
                                ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-dark-blue text-white hover:bg-medium-blue'
                                }`}
                        >
                            {loading ? 'Iniciando...' : 'Iniciar sesión'}
                        </button>
                        <div className='text-center text-[#083059]'>
                            <p>
                                ¿No tienes cuenta?
                                <Link
                                    to='/register'
                                    className='text-medium-blue pl-2 hover:underline'
                                >
                                    ¡Registrate!
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default LoginPage;
