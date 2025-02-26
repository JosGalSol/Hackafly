// Importamos los hooks.
import { useContext, useEffect } from 'react';

// Importamos los componentes y los hooks useParams y useNavigate.
import { Navigate, useNavigate, useParams } from 'react-router-dom';

// Importamos el contexto de autorización.
import { AuthContext } from '../contexts/AuthContext';

// Importamos la función que muestra un mensaje al usuario.
import toast from 'react-hot-toast';

// Importamos la URL de nuestra API.
const { VITE_API_URL } = import.meta.env;

// Inicializamos el componente.
const ValidateUserPage = () => {
    // Obtenemos los elementos necesarios del contexto de autorización.
    const { authUser } = useContext(AuthContext);

    // Obtenemos la función navigate.
    const navigate = useNavigate();

    // Obtenemos el código de registro.
    const { regCode } = useParams();

    // Validamos al usuario en la fase de montaje del componente actual.
    useEffect(() => {
        // Función que envía una petición de validación.
        const fetchValidateUser = async () => {
            try {
                // Obtenemos una respuesta.
                const res = await fetch(
                    `${VITE_API_URL}/api/users/validate/${regCode}`,
                    {
                        method: 'put',
                    }
                );

                // Obtenemos el body.
                const body = await res.json();

                // Si hay algún error lo lanzamos.
                if (body.status === 'error') {
                    throw new Error(body.message);
                }

                // Si todo ha ido bien mostramos un mensaje al usuario.
                toast.success(body.message, {
                    id: 'activateUser',
                });

                // Redirigimos a login.
                navigate('/login');
            } catch (err) {
                toast.error(err.message, {
                    id: 'activateUser',
                });

                // Redirigimos a la página principal.
                navigate('/');
            }
        };

        // Llamamos a la función anterior.
        fetchValidateUser();
    }, [regCode, navigate]);

    // Si estamos logueados restringimos el acceso redirigiendo a la página principal.
    if (authUser) {
        return <Navigate to='/' />;
    }

    return (
        <main>
            <h2>Página de activación de usuario</h2>
        </main>
    );
};

export default ValidateUserPage;
