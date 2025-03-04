import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Importamos el hook personalizado
import useUsersList from "../hooks/useUsersList.js";
import { AuthContext } from "../contexts/AuthContext";

// Importamos el nuevo componente de la tabla
import UserListTable from "../components/UserListTable.jsx";

// Obtenemos las variables de entorno

const { VITE_API_URL } = import.meta.env;

// Iniciamos el componente
const AdminListUsers = () => {
    const [searchValues, setSearchValues] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
    });

    // Obtenemos los elementos necesarios del contexto pertinente.

    const { users, loading, getUsers } = useUsersList(searchValues);
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = authToken;

    // Manejar cambios en los inputs de búsqueda
    const handleChange = (e) => {
        setSearchValues({
            ...searchValues,
            [e.target.name]: e.target.value,
        });
    };

    // Ejecutar la búsqueda cuando se actualicen los valores de búsqueda
    useEffect(() => {
        getUsers(searchValues);  // Llamar a getUsers con los valores de búsqueda
    }, [searchValues, getUsers]);
    console.log()
    // Habilitar/Deshabilitar usuario
    const handleToggleUserStatus = async (userId, isActive) => {
        try {
            const res = await fetch(
                `${VITE_API_URL}/api/users/${userId}/activate`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isActive: !isActive }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(
                `Usuario ${
                    !isActive ? "habilitado" : "deshabilitado"
                } correctamente.`
            );
            toast("Recarga la página para ver los cambios.");
        } catch (error) {
            toast.error(
                `Error: ${error.message || "No se pudo actualizar el usuario."}`
            );
        }
    };

    // Borrar usuario
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

        try {
            const res = await fetch(`${VITE_API_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Usuario eliminado correctamente.");
            toast("Recarga la página para ver los cambios.");
        } catch (error) {
            toast.error(
                `Error: ${error.message || "No se pudo eliminar el usuario."}`
            );
        }
    };
// redirigir al login si falla la auth
    useEffect(() => {
        if (!token) {
            toast.error("No tienes permisos para ver esta página.");
            navigate("/login");
        }
    }, [token, navigate]);

    return (
        <main className="bg-[#E5F7FF] flex items-center justify-center min-h-screen p-4">
            <h1  className="text-2xl font-bold text-[#083059] text-center mb-6">Lista de Usuarios</h1>

            <div>
                <input
                    type="text"
                    name="username"
                    placeholder="Buscar por usuario"
                    value={searchValues.username}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Buscar por email"
                    value={searchValues.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="firstName"
                    placeholder="Buscar por nombre"
                    value={searchValues.firstName}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Buscar por apellido"
                    value={searchValues.lastName}
                    onChange={handleChange}
                />
            </div>

            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <UserListTable 
                    users={users} 
                    handleToggleUserStatus={handleToggleUserStatus} 
                    handleDeleteUser={handleDeleteUser}
                />
            )}
        </main>
    );
};

export default AdminListUsers;
