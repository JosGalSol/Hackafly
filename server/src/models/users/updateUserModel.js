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
        if (username && username.trim() !== '') {
            const [usersWithUsername] = await pool.query(
                `SELECT userId FROM users WHERE username = ? AND userId != ?`,
                [username.trim(), userId],
            );

            if (usersWithUsername.length > 0) {
                throw generateErrorUtil('Nombre de usuario no disponible', 409);
            }
        }

        // Verificar si el email ya está en uso por otro usuario
        if (email && email.trim() !== '') {
            const [usersWithEmail] = await pool.query(
                `SELECT userId FROM users WHERE email = ? AND userId != ?`,
                [email.trim(), userId],
            );

            if (usersWithEmail.length > 0) {
                throw generateErrorUtil('Email no disponible', 409);
            }
        }

        // Construir la consulta dinámica para actualizar los campos proporcionados
        const updates = [];
        const params = [];

        if (firstName && firstName.trim() !== '') {
            updates.push('firstName = ?');
            params.push(firstName.trim());
        }

        if (lastName && lastName.trim() !== '') {
            updates.push('lastName = ?');
            params.push(lastName.trim());
        }

        if (username && username.trim() !== '') {
            updates.push('username = ?');
            params.push(username.trim());
        }

        if (email && email.trim() !== '') {
            updates.push('email = ?');
            params.push(email.trim());
        }

        if (birthdate) {
            updates.push('birthdate = ?');
            params.push(birthdate);
        }

        // Si no hay campos para actualizar, lanzar un error
        if (updates.length === 0) {
            throw generateErrorUtil('No se proporcionaron campos para actualizar', 400);
        }

        // Agregar el campo modifiedAt y el userId a los parámetros
        updates.push('modifiedAt = ?');
        params.push(new Date());
        params.push(userId);

        // Construir y ejecutar la consulta
        const query = `UPDATE users SET ${updates.join(', ')} WHERE userId = ?`;
        console.log('Consulta SQL:', query); // Log de la consulta SQL
        console.log('Parámetros:', params); // Log de los parámetros

        const [result] = await pool.query(query, params);
        console.log('Resultado de la consulta:', result); // Log del resultado

    } catch (err) {
        console.error('Error en updateUserModel:', err); // Log del error para depuración
        throw generateErrorUtil('Error al actualizar el usuario', 500);
    }
};

export default updateUserModel;