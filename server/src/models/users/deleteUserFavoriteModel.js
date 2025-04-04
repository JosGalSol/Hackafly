import { getPool } from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const deleteUserFavoriteModel = async (favoriteId, userId) => {
    // Validamos que los parámetros no sean falsy (null, undefined, '', 0, etc.)
    if (!favoriteId) {
        throw generateErrorUtil('El ID del favorito no es válido', 400);
    }

    if (!userId) {
        throw generateErrorUtil('El ID del usuario no es válido', 400);
    }

    // Obtenemos el pool de conexión
    const pool = await getPool();

    // Intentamos borrar el criterio de búsqueda favorito
    const [result] = await pool.query(
        `DELETE FROM favorites WHERE favoriteId = ? AND userId = ?`,
        [favoriteId, userId],
    );

    // Verificamos si se eliminó algo
    if (result.affectedRows === 0) {
        throw generateErrorUtil(
            'Criterio de búsqueda favorito no encontrado o no pertenece al usuario',
            404,
        );
    }

    // Devolvemos el ID borrado
    return favoriteId;
};

export default deleteUserFavoriteModel;
