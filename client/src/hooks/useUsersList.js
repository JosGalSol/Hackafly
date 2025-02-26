import { useState } from "react";

const { VITE_API_URL } = import.meta.env;

const useUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUsers = async (searchValues) => {
        setLoading(true);

        try {
            const {
                username = "",
                email = "",
                firstName = "",
                lastName = "",
            } = searchValues;

            const response = await fetch(
                `${VITE_API_URL}/api/players?username=${username}&email=${email}&firstName=${firstName}&lastName=${lastName}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener usuarios");
            }

            const body = await response.json();
            setUsers(body.data.users);
        } catch (error) {
            console.error("Error en la petición:", error);
        } finally {
            setLoading(false);
        }
    };

    return { users, loading, getUsers };
};

export default useUsersList;
