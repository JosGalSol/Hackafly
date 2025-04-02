//importamos hooks
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

//importamos dependencias de entorno
const { VITE_API_URL } = import.meta.env;

//Iniciamos el hook
const useRatingList = () => {
    //Declaramos una variable en el State que permita almacenar el array de entradas
    const [ratings, setRatings] = useState([]);
    //obtenemos las entradas cuando se monta el componente
    useEffect(() => {
        //solicitamos las valoraciones al servidor
        const fetchRatings = async () => {
            try {
                //obtenemos una respuesta del servidor
                const res = await fetch(`${VITE_API_URL}/api/ratings`);

                //obtenemos el body
                const body = await res.json();

                //si hay un error lo lanzamos
                if (body.status === 'error') {
                    throw new Error(body.message);
                }
                //actualizamos el State con las valoraciones
                setRatings(body.data.ratings);
            } catch (err) {
                toast.error(err.message, {
                    id: 'listRatings',
                    duration: 5000,
                });
            }
        };
        //llamamos a la función
        fetchRatings();
    }, []);
    //Devolvemos los elementos que nos interesan
    return { ratings, setRatings };
};
export default useRatingList;
