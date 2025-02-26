// Importamos dependencias.
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Importamos la función que me permite conectarme a la base de datos.
import { getPool } from '../../db/getPool.js';

// Importamos la función que envía un email.
import sendMailUtil from '../../utils/sendEmailUtil.js';

// Importamos la función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función que se conecta a la base de datos para crear un nuevo usuario.
const insertUserModel = async (
    firstName,
    lastName,
    username,
    email,
    password,
    birthdate,
) => {
    // Obtenemos el pool.
    const pool = await getPool();

    // Obtenemos el listado de usuarios que tengan el nombre de usuario que recibimos
    // por body. Utilizamos destructuring con arrays para quedarme concretamente con
    // el array de resultados de SELECT que será el array que esá en la posición cero.
    let [users] = await pool.query(
        `SELECT userId FROM users WHERE username = ?`,
        [username],
    );

    // Lanzamos un error si ya existe un usuario con ese nombre.
    if (users.length > 0) {
        throw generateErrorUtil('Nombre de usuario no disponible', 409);
    }

    // Obtenemos el listado de usuarios que tengan el email que recibimos por body.
    [users] = await pool.query(`SELECT userId FROM users WHERE email = ?`, [
        email,
    ]);

    // Lanzamos un error si ya existe un usuario con ese email.
    if (users.length > 0) {
        throw generateErrorUtil('Email no disponible', 409);
    }

    // Generamos un código de registro de 30 caracteres.
    const regCode = crypto.randomBytes(15).toString('hex');

    // Encriptamos la contraseña.
    const hashedPass = await bcrypt.hash(password, 10);

    // Generamos la fecha actual.
    const now = new Date();

    // Insertamos el usuario en la tabla correspondiente.
    await pool.query(
        `
            INSERT INTO users (firstName, lastName, username, email, password, regCode, birthdate, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            firstName,
            lastName,
            username,
            email,
            hashedPass,
            regCode,
            birthdate,
            now,
        ],
    );

    // Asunto del email de verificación.
    const emailSubject = 'Activa tu usuario en Hack a flight ;)';

    // Cuerpo del email de verificación.
    const emailBody = `
        ¡Bienvenid@ ${username}!

        Gracias por registrarte en Hack a flight. Para activar tu cuenta y empezar a ahorrar en tus vuelos, haz click en el siguiente enlace:

        ${process.env.CLIENT_URL}/validate/${regCode}
    `;

    // Enviamos el email.
    await sendMailUtil(email, emailSubject, emailBody);
};

export default insertUserModel;
