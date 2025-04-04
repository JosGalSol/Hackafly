import { useEffect, useState } from 'react';
// Importamos el contexto de autorización.
import useAuthContext from '../hooks/useAuthContext.js';
import toast from 'react-hot-toast';

const { VITE_API_URL } = import.meta.env;

const useUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { authToken } = useAuthContext();

    const getUsers = async () => {
        setLoading(true);

        try {
            /*
            const {
                username = '',
                email = '',
                firstName = '',
                lastName = '',
            } = searchValues;
             */

            //  `${VITE_API_URL}/api/users?username=${username}&email=${email}&firstName=${firstName}&lastName=${lastName}`,
            const response = await fetch(
                `${VITE_API_URL}/api/admin/users/list`,
                { headers: { Authorization: `${authToken}` } },
            );

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const body = await response.json();
            setUsers(body.data);
        } catch (err) {
            toast.error(err.message, {
                id: 'favoriteId',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return { users, loading };
};

export default useUsersList;
