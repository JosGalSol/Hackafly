import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext.js';
import { Link } from 'react-router-dom';

const { VITE_API_URL } = import.meta.env;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { authUser, authLoginState } = useAuthContext();
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
        <main className='login'>
            <h2>Log in</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor='email'>Email:</label>
                <input
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

                <label htmlFor='pass'>Password:</label>
                <input
                    type='password'
                    id='pass'
                    value={formInputs.password}
                    onChange={(e) =>
                        setFormInputs({
                            ...formInputs,
                            password: e.target.value,
                        })
                    }
                    autoComplete='password'
                    required
                />
                <Link to='/users/password/recover/request'>
                    Recuperar Contraseña
                </Link>
                <button disabled={loading}>Log in</button>
            </form>
        </main>
    );
};

export default LoginPage;
