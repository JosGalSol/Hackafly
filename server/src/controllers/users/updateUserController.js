// Importar el modelo de usuario
import updateUserModel from '../../models/users/updateUserModel.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Controlador para actualizar un usuario
const updateUserController = async (req, res, next) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { firstName, lastName, username, email, birthdate } = req.body;

        // Verificar que al menos un campo esté presente para actualizar
        if (!firstName && !lastName && !username && !email && !birthdate) {
            throw generateErrorUtil('No se proporcionaron campos para actualizar.', 404);
        }

        // Obtener el ID del usuario autenticado
        const userId = req.user?.userId;

        // Validar que el ID del usuario esté presente
        if (!userId) {
            throw generateErrorUtil('Usuario no autenticado o ID de usuario no proporcionado.', 401);
        }

        // Llamar al modelo para actualizar el usuario
        await updateUserModel({
            firstName,
            lastName,
            username,
            email,
            birthdate,
            userId,
        });

        // Enviar respuesta de éxito
        res.status(200).send({
            status: 'ok',
            message: 'Usuario actualizado correctamente.',
        });
    } catch (err) {
        next(err);
    }
};

export default updateUserController;