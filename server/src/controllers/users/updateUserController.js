// importar el modelo de usuario

import updateUserModel from '../../models/users/updateUserModel.js';

// Controlador para actualizar un usuario

const updateUserController = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, birthdate } = req.body;
        const userId = req.user.userId;
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