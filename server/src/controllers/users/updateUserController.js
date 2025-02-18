// importar el modelo de usuario

import updateUserModel from '../../models/users/updateUserModel.js';
// Controlador para actualizar un usuario

const updateUserController = async (req, res, next) => {
    try {
        // Obtener el ID del usuario autenticado
        const userId = req.user?.userId;
        // Obtener los datos del usuario a actualizar
        const { firstName, lastName, username, email, birthdate } = req.body;
        // Llamar al modelo para actualizar el usuario
        await updateUserModel({
            firstName,
            lastName,
            username,
            email,
            birthdate,
            userId,
        });
        res.send({
            status: 'ok',
            message: 'Usuario actualizado.',
        });
    } catch (err) {
        next(err);
    }
};

export default updateUserController;