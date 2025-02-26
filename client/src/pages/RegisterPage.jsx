//Importamos hooks
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

//importamos variables de entorno
const { VITE_API_URL } = import.meta.env;

//Iniciamos el componente
const RegisterPage = () => {
    //obtenemos navigate
    const navigate = useNavigate();
    //Creamos una variable en el State por cada elemento del forumlario
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [birthdate, setBirthdate] = useState('');

    //Creamos una variable en el State para indicar si estamos haciendo fecth
    const [loading, setLoading] = useState(false);

    //función que maneja el envío del formulario
    const handleRegister = async (e) => {
        try {
            //prevenimos el envío del formulario por defecto
            e.preventDefault();
            //Realizamos la comprobación de si coinciden las contraseñas
            if (password !== passConfirm) {
                throw new Error('Las contraseñas no coinciden');
            }
            //indicamos  que estamos haciendo fetch
            setLoading(true);
            //obtenemos una respuesta
            const res = await fetch(`${VITE_API_URL}/api/users/register`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                    birthdate,
                }),
            });

            //obtenemos el body
            const body = await res.json();

            //Si  hay un error, lanzamos un mensaje
            if (body.status === 'error') {
                throw new Error(body.message);
            }

            //si sale el registro bien, lanzamos un mensaje
            toast.success('Usuario/a registrado/a correctamente', {
                id: 'register',
                duration: 5000,
            });

            //redirigimos a la página de login
            navigate('/login');
        } catch (err) {
            toast.error(err.message, {
                id: 'register',
            });
        } finally {
            //Indicamos que el fetch ha terminado
            setLoading(false);
        }
    };
    return (
        <main className="bg-[#E5F7FF] flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-[#083059] text-center mb-6">
                    Crea tu cuenta
                </h2>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block text-[#083059] font-medium"
                        >
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                            required
                        />
                    </div>
                    <div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-[#083059] font-medium"
                            >
                                Apellidos
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                                required
                            />
                        </div>
                        <label
                            htmlFor="username"
                            className="block text-[#083059] font-medium"
                        >
                            Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-[#083059] font-medium"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-[#083059] font-medium"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="passConfirm"
                            className="block text-[#083059] font-medium"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="passConfirm"
                            value={passConfirm}
                            onChange={(e) => setPassConfirm(e.target.value)}
                            className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="birthdate"
                            className="block text-[#083059] font-medium"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 font-bold rounded-md transition 
                            ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#179DD9] text-white hover:bg-[#083059]'
                            }`}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className="text-center text-[#083059] mt-4">
                    ¿Ya tienes cuenta?{' '}
                    <a
                        href="/login"
                        className="text-[#3951AA] font-bold hover:underline"
                    >
                        Inicia sesión
                    </a>
                </p>
            </div>
        </main>
    );
};

export default RegisterPage;
