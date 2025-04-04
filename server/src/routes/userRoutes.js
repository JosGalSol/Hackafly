//importamos dependencias
import express from 'express';

//importamos middleware--> el de autenticación.
import authUserMiddleware from '../middlewares/authUserMiddleware.js';

//importamos funciones controladoras
import {
    loginUserController,
    privateUserProfileController,
    userFavoriteController,
    deleteUserFavoriteController,
    updateUserFavoriteController,
    updateUserPassController,
    updateUserController,
    registerUserController,
    saveUserFavoriteController,
    activateUserController,
    sendRecoveryPassEmailController,
    useRecoveryPassCodeController,
    userAvatarController,
    userFavoriteDetailsController,
} from '../controllers/users/index.js';

//importamos controladores de valoraciones
import { createRatingController } from '../controllers/ratings/indexRatingControllers.js';

//creamos un router
const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', registerUserController);

// Validación usuario
router.put('/validate/:regCode', activateUserController);

// Iniciar sesión de usuario (requiere Validacion)
router.post('/login', loginUserController);

// Cambiar contraseña (requiere autenticación)
router.post('/password', authUserMiddleware, updateUserPassController);

// Envia email para recuperar contraseña (extra)
router.put('/password/reset', sendRecoveryPassEmailController);

// Recuperar contraseña(extra)
router.put('/password/reset/:recoverPassCode', useRecoveryPassCodeController);

// Actualizar datos de usuario (requiere autenticación)
router.put('/profile', authUserMiddleware, updateUserController);

//Actualizar avatar de usuario.
router.put('/avatar', authUserMiddleware, userAvatarController);

// Obtener el perfil del usuario (requiere estar autenticado)
router.get('/profile', authUserMiddleware, privateUserProfileController);

// Guardar un criterio de búsqueda como favorito (requiere autenticación)
router.post('/favorites', authUserMiddleware, saveUserFavoriteController);

// Actualizar un criterio de búsqueda favorito del usuario(requiere autenticación)
router.put(
    '/favorites/:favoriteId',
    authUserMiddleware,
    updateUserFavoriteController,
);

// Obtener la lista de criterios de búsqueda favoritos del usuario (requiere autenticación)
router.get('/favorites', authUserMiddleware, userFavoriteController);

// Obtener detalles de un criterio de búsqueda favorito (requiere autenticación)
router.get(
    '/favorites/:favoriteId',
    authUserMiddleware,
    userFavoriteDetailsController,
);

// Eliminar un criterio de búsqueda favorito (requiere autenticación)
router.delete(
    '/favorites/:favoriteId',
    authUserMiddleware,
    deleteUserFavoriteController,
);

// Valorar la plataforma (requiere autenticación)
router.post('/ratings', authUserMiddleware, createRatingController);

export default router;
