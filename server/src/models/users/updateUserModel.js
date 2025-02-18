import { getPool } from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Inicializamos el modelo.
const updateUserModel = async ({
    firstName,
    lastName,
    username,
    email,
    birthdate,
    userId,
}) => {
    const pool = await getPool();

    try {
        // Verificar si el username ya está en uso por otro usuario
        if (username) {
            const [usersWithUsername] = await pool.query(
                `SELECT userId FROM users WHERE username = ? AND userId != ?`,
                [username, userId],
            );

            if (usersWithUsername.length > 0) {
                generateErrorUtil('Nombre de usuario no disponible', 409);
            }
        }

        // Verificar si el email ya está en uso por otro usuario
        if (email) {
            const [usersWithEmail] = await pool.query(
                `SELECT userId FROM users WHERE email = ? AND userId != ?`,
                [email, userId],
            );

            if (usersWithEmail.length > 0) {
                generateErrorUtil('Email no disponible', 409);
            }
        }

        // Construir la consulta dinámica para actualizar los campos proporcionados
        const updates = [];
        const params = [];

        if (firstName) {
            updates.push('firstName = ?');
            params.push(firstName);
        }

        if (lastName) {
            updates.push('lastName = ?');
            params.push(lastName);
        }

        if (username) {
            updates.push('username = ?');
            params.push(username);
        }

        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        if (birthdate) {
            updates.push('birthdate = ?');
            params.push(birthdate);
        }

        // Si no hay campos para actualizar, lanzar un error
        if (updates.length === 0) {
            generateErrorUtil('No se proporcionaron campos para actualizar', 400);
        }

        // Agregar el campo modifiedAt y el userId a los parámetros
        updates.push('modifiedAt = ?');
        params.push(new Date());
        params.push(userId);

        // Construir y ejecutar la consulta
        const query = `UPDATE users SET ${updates.join(', ')} WHERE userId = ?`;
        await pool.query(query, params);

    } catch (err) {
        console.error('Error en updateUserModel:', err); // Log del error para depuración
        throw generateErrorUtil('Error al actualizar el usuario', 500);
    }
};

export default updateUserModel;