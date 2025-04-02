import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const { VITE_API_URL } = import.meta.env;

const SendRecoverPassPage = () => {
    const { authUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendRecoveryPassCode = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const res = await fetch(
                `${VITE_API_URL}/api/users/password/reset`,
                {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                    }),
                },
            );

            const body = await res.json();
            if (body.status === 'error') {
                throw new Error(body.message);
            }

            toast.success(body.message, {
                id: 'sendRecoverPass',
                duration: 10000,
            });

            navigate('/');
        } catch (err) {
            toast.error(err.message, {
                id: 'sendRecoverPass',
            });
        } finally {
            setLoading(false);
        }
    };

    if (authUser) {
        return <Navigate to='/' />;
    }

    return (
        <>
            
            <main className='bg-[#E5F7FF] flex items-center justify-center min-h-screen p-4'>
                <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                    <h2 className='font-bold text-[25px] text-[#083059]'>
                        Recuperacion de contraseña
                    </h2>
                    <p className='font-heavy text-[20px] text-[#083059]'>
                        Por favor introduce el correo electronico registrado.
                    </p>
                    <form
                        onSubmit={handleSendRecoveryPassCode}
                        className='flex flex-col gap-[30px] p-[30px] font-bold'
                    >
                        <input
                            className='w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]'
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='new-password'
                            autoFocus
                            required
                        />

                        <button
                            disabled={loading}
                            className={`w-full py-3 font-bold rounded-md transition 
                                ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#179DD9] text-white hover:bg-[#083059]'
                                }`}
                        >
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default SendRecoverPassPage;
