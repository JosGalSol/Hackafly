import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Importamos el hook personalizado
import useUsersList from "../hooks/useUsersList.js";
import { AuthContext } from "../context/AuthContext";


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

    const { users, loading } = useUsersList(searchValues);
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = authToken || localStorage.getItem("token");

// Manejar cambios en los inputs de búsqueda
    const handleChange = (e) => {
        setSearchValues({
            ...searchValues,
            [e.target.name]: e.target.value,
        });
    };



    // Habilitar/Deshabilitar usuario
    const handleToggleUserStatus = async (userId, isActive) => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/users/${userId}/activate`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isActive: !isActive }),
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.message); 
    
            toast.success(`Usuario ${!isActive ? "habilitado" : "deshabilitado"} correctamente.`);
            toast("Recarga la página para ver los cambios.");
        } catch (error) {
            toast.error(`Error: ${error.message || "No se pudo actualizar el usuario."}`);
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
        toast.error(`Error: ${error.message || "No se pudo eliminar el usuario."}`);
    }
};

    useEffect(() => {
        if (!token) {
            toast.error("No tienes permisos para ver esta página.");
            navigate("/login");
        }
    }, [token, navigate]);

    return (
        <main>
            <h1>Lista de Usuarios</h1>

            <div>
                <input type="text" name="username" placeholder="Buscar por usuario" value={searchValues.username} onChange={handleChange} />
                <input type="text" name="email" placeholder="Buscar por email" value={searchValues.email} onChange={handleChange} />
                <input type="text" name="firstName" placeholder="Buscar por nombre" value={searchValues.firstName} onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Buscar por apellido" value={searchValues.lastName} onChange={handleChange} />
            </div>

            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.isActive ? "Activo" : "Inactivo"}</td>
                                <td>
                                    <button onClick={() => handleToggleUserStatus(user.id, user.isActive)}>
                                        {user.isActive ? "Deshabilitar" : "Habilitar"}
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: "10px" }}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default AdminListUsers;