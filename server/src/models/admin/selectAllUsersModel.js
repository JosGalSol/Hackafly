import { getPool } from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Lista de columnas permitidas para filtrar
const allowedColumns = ['userId', 'username', 'firstName', 'lastName', 'email'];

const selectAllUsersModel = async (filters = {}) => {
    const pool = await getPool();

    // Definir las columnas que se seleccionarán
    const columns = ['userId', 'firstName', 'lastName', 'username', 'email', 'birthdate', 'createdAt'];

    // Iniciar la consulta base
    let query = `SELECT ${columns.join(', ')} FROM users`;

    // Filtrar y validar los filtros
    const validFilters = Object.entries(filters).filter(([key, value]) => {
        // Asegurarse de que la columna esté permitida y el valor no esté vacío
        return allowedColumns.includes(key) && value !== undefined && value !== '';
    });

    // Construir las condiciones y los parámetros dinámicamente
    const conditions = [];
    const params = [];

    validFilters.forEach(([key, value]) => {
        if (key === 'userId') {
            conditions.push('userId = ?');
            params.push(value);
        } else {
            conditions.push(`${key} LIKE ?`);
            params.push(`%${value}%`);
        }
    });

    // Agregar las condiciones a la consulta si existen
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        // Ejecutar la consulta
        const [users] = await pool.query(query, params);

        // Si no se encuentran usuarios, lanzar un error
        if (users.length < 1) {
            generateErrorUtil('No se encontraron usuarios con los filtros proporcionados.', 404);
        }

        return users;
    } catch (error) {
        // Capturar errores de la base de datos
        console.error('Error en selectAllUsersModel:', error);
        generateErrorUtil('Error al obtener los usuarios desde la base de datos.', 500);
    }
};

export default selectAllUsersModel;