import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Importamos el hook personalizado
import useUsersList from '../hooks/useUsersList.js';
import { AuthContext } from '../contexts/AuthContext';

// Obtenemos las variables de entorno
const { VITE_API_URL } = import.meta.env;

// Iniciamos el componente
const AdminListUsers = () => {
    const [searchValues] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
    });

    // Obtenemos los elementos necesarios del contexto pertinente.
    const { users, loading } = useUsersList(searchValues);
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = authToken;

    // Estado para manejar la lista de usuarios en la UI
    const [usersList, setUsersList] = useState([]);

    // Actualizar la lista local de usuarios cuando `users` cambie
    useEffect(() => {
        setUsersList(users);
    }, [users]);

    // Habilitar/Deshabilitar usuario
    const handleToggleUserStatus = async (userId, isActive) => {
        const toastId = `toggle-status-${userId}`; // Generamos un id único para este toast
        try {
            const res = await fetch(`${VITE_API_URL}/api/admin/users/${userId}/true`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${authToken}`,
                },
                body: JSON.stringify({ isActive: !isActive }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Actualizar el estado del local users
            setUsersList((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === userId ? { ...user, isActive: !isActive } : user
                )
            );

            // Mostrar un mensaje de éxito y evitar duplicados usando `id`
            toast.success(`Usuario ${!isActive ? 'habilitado' : 'deshabilitado'} correctamente.`, {
                id: toastId,
            });
        } catch (error) {
            toast.error(`Error: ${error.message || 'No se pudo actualizar el usuario.'}`, {
                id: toastId, // Usamos el mismo id para no acumular múltiples toasts
            });
        }
    };

    // Borrar usuario
    const handleDeleteUser = async (userId) => {
        const toastId = `delete-user-${userId}`; // Generamos un id único para este toast

        // Confirmación para borrar
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            // Realizar la solicitud DELETE al backend
            const res = await fetch(`${VITE_API_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `${authToken}` },
            });

            const data = await res.json();

            // Si la respuesta no es exitosa, lanzamos un error
            if (!res.ok) throw new Error(data.message);

            // Actualizar la lista de usuarios en el estado local, eliminando el usuario
            setUsersList((prevUsers) =>
                prevUsers.filter((user) => user.userId !== userId) // Eliminamos al usuario de la lista
            );

            // Mostrar un mensaje de éxito
            toast.success('Usuario eliminado correctamente.', { id: toastId });
            toast('Recarga la página para ver los cambios.', { id: `reload-${userId}` }); // ID único para este toast también
        } catch (error) {
            // Manejar errores si algo sale mal
            toast.error(`Error: ${error.message || 'No se pudo eliminar el usuario.'}`, {
                id: toastId,
            });
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('No tienes permisos para ver esta página.');
            navigate('/login');
        }
    }, [token, navigate]);

    return (
        <>
            <main className="bg-gradient-to-b from-dark-blue to-white min-h-screen flex flex-col justify-between">
                <div className="flex flex-col items-center justify-center flex-1 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg lg:max-w-4xl transition transform hover:scale-[1.008]">
                        <h2 className="text-3xl sm:text-4xl font-heading font-light text-dark-blue text-center mb-6">
                            Lista de Usuarios
                        </h2>

                        {loading ? (
                            <p className="text-center text-dark-blue">Cargando usuarios...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-blue-300 table-fixed">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            <th className="px-4 py-2 border-b text-center">Usuario</th>
                                            <th className="px-4 py-2 border-b text-center">Email</th>
                                            <th className="px-4 py-2 border-b text-center">Nombre</th>
                                            <th className="px-4 py-2 border-b text-center">Apellido</th>
                                            <th className="px-4 py-2 border-b text-center">Estado</th>
                                            <th className="px-4 py-2 border-b text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersList.map((user) => (
                                            <tr key={user.userId} className="odd:bg-white even:bg-blue-50">
                                                <td className="px-4 py-2 border-b text-center">{user.username}</td>
                                                <td className="px-4 py-2 border-b text-center">{user.email}</td>
                                                <td className="px-4 py-2 border-b text-center">{user.firstName}</td>
                                                <td className="px-4 py-2 border-b text-center">{user.lastName}</td>
                                                <td className="px-4 py-2 border-b text-center">
                                                    {user.isActive ? 'Activo' : 'Inactivo'}
                                                </td>
                                                <td className="px-4 py-2 border-b text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleToggleUserStatus(user.userId, user.isActive)
                                                        }
                                                        className="bg-medium-blue text-white px-4 py-2 rounded hover:bg-medium-blue w-full mb-2"
                                                    >
                                                        {user.isActive ? 'Deshabilitar' : 'Habilitar'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.userId)}
                                                        className="bg-dark-blue text-white px-4 py-2 rounded hover:bg-dark-blue w-full"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default AdminListUsers;