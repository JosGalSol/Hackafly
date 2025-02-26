import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuthContext from '../hooks/useAuthContext.js';
const { VITE_API_URL } = import.meta.env;
const UserProfilePage = () => {
    const { authToken } = useAuthContext();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        avatar: '',
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${VITE_API_URL}/api/users/profile`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [authToken]);

    const hanlePassawordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${VITE_API_URL}/api/users/password`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const result = await response.json();
            if (result.status === 'error') {
                throw new Error(result.message);
            }

            toast.success('Contraseña actualizada correctamente');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-profile-page">
            <h2>Perfil de Usuario</h2>
            <div className="user-info">
                <img src={userData.avatar} alt="Avatar" />
                <p>
                    <strong>Nombre:</strong> {userData.firstName}{' '}
                    {userData.lastName}
                </p>
                <p>
                    <strong>Usuario:</strong> {userData.username}
                </p>
                <p>
                    <strong>Email:</strong> {userData.email}
                </p>
            </div>

            <form onSubmit={hanlePassawordChange}>
                <h3>Cambiar Contraseña</h3>
                <div>
                    <label>Contraseña Actual:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nueva Contraseña:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
            </form>
        </div>
    );
};

export default UserProfilePage;
