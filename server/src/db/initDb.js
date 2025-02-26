//importamos dependencias
import bcrypt from 'bcrypt';
// Accedemos a las variables del fichero ".env" y las añadimos a la lista de variables de entorno.
import 'dotenv/config';
const {
    MYSQL_ADMIN_USER,
    MYSQL_ADMIN_PASSWORD,
    MYSQL_ADMIN_FIRSTNAME,
    MYSQL_ADMIN_LASTNAME,
    MYSQL_ADMIN_EMAIL,
} = process.env;
// Importamos la función que nos permite conectarnos a la base de datos.
import { getPool } from './getPool.js';

// Función principal encargada de crear las tablas.
const main = async () => {
    try {
        // Obtenemos el pool.
        const pool = await getPool();

        console.log('Borrando tablas...');

        // Borramos las tablas.
        await pool.query('DROP TABLE IF EXISTS valorations, favorites , users');

        console.log('Creando tablas...');

        // Creamos la tabla de usuarios.

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                userId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                firstName VARCHAR(50) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                regCode CHAR(30),
                recoverPassCode CHAR(30),
                birthdate DATE,
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal' NOT NULL,
                active BOOLEAN DEFAULT FALSE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
                
               

            )
        `);
        // Creamos la tabla de criterios de busqueda favoritos de los Usuarios. (En esta tabla pondremos los criterios de busqueda en columnas)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                favoriteId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                userId INT UNSIGNED NOT NULL,
                title VARCHAR(100),
                origin VARCHAR(3) NOT NULL,
                destination VARCHAR(3) NOT NULL,
                departureDate DATE ,
                returnDate DATE,
                adults TINYINT(5),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(userId)
            )
        `);

        // Tabla de valoraciones.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS valorations (
                valorationId INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                userId INT UNSIGNED NOT NULL,
                title VARCHAR(100) NOT NULL,
                rate Enum('1', '2', '3', '4', '5') DEFAULT '5',
                comment VARCHAR(600),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(userId)
            )
        `);

        console.log('¡Tablas creadas!');

        //encriptamos la contraseña del usuario admin.
        const hashedPass = await bcrypt.hash(`${MYSQL_ADMIN_PASSWORD}`, 10);
        //insertamos el usuario admin.
        await pool.query(
            `INSERT INTO users (username, firstName, lastName, password, email, role, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                `${MYSQL_ADMIN_USER}`,
                `${MYSQL_ADMIN_FIRSTNAME}`,
                `${MYSQL_ADMIN_LASTNAME}`,
                hashedPass,
                `${MYSQL_ADMIN_EMAIL}`,
                'admin',
                true,
            ],
        );
        console.log('Usuario administrador creado!');

        // Cerramos el proceso con código 0.
        process.exit(0);
    } catch (err) {
        console.error(err);

        // Cerramos el proceso con código 1.
        process.exit(1);
    }
};

// Llamamos a la función principal.
main();
