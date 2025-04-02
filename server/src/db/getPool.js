// Importamos las dependencias.
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargamos las variables de entorno.
dotenv.config();

// Obtenemos las variables de entorno necesarias.
const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    MYSQL_ADMIN_USER,
    MYSQL_ADMIN_PASSWORD,
    MYSQL_ADMIN_EMAIL,
} = process.env;

// Variable que almacenará un grupo de conexiones con la base de datos.
let pool;

// Configuración del administrador.
const adminConfig = {
    user: MYSQL_ADMIN_USER,
    password: MYSQL_ADMIN_PASSWORD,
    email: MYSQL_ADMIN_EMAIL || 'admin@default.com', // Valor por defecto si está vacío
};

// Función que retorna las conexiones.
const getPool = async () => {
    try {
        // Si no existen conexiones las creamos.
        if (!pool) {
            // Creamos una única conexión con el servidor MySQL.
            const dbConnection = await mysql.createConnection({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
            });

            // Con dicha conexión vamos a crear la base de datos si no existe.
            await dbConnection.query(
                `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`,
            );

            // Tras asegurarnos de que existe la base de datos creamos el pool.
            pool = mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
                database: MYSQL_DATABASE,
                timezone: 'Z',
            });
        }

        // Retornamos el pool.
        return await pool;
    } catch (err) {
        console.error(err);
    }
};

export { getPool, adminConfig };
