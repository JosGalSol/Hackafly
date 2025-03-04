import { useState } from 'react';

const { VITE_API_URL } = import.meta.env;

const useUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUsers = async (searchValues) => {
        setLoading(true);
        console.log(searchValues);
        try {
            const { username, email, firstName, lastName } = searchValues;

            const query = [
                username ? `username=${username}` : '',
                email ? `email=${email}` : '',
                firstName ? `firstName=${firstName}` : '',
                lastName ? `lastName=${lastName}` : '',
            ]
                .filter(Boolean)
                .join('&');

            const response = await fetch(`${VITE_API_URL}/api/users?${query}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const body = await response.json();
            setUsers(body.data.users);
        } catch (error) {
            console.error('Error en la petición:', error);
        } finally {
            setLoading(false);
        }
    };

    return { users, loading, getUsers };
};

export default useUsersList;
