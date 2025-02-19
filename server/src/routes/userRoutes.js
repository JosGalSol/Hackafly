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
    updateUserPassController,
    registerUserController,
    saveUserFavoriteController,
    activateUserController,
    sendRecoveryPassEmailController,
    useRecoveryPassCodeController,
    updateUserController,
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

// Obtener el perfil del usuario (requiere estar autenticado)
router.get('/profile', authUserMiddleware, privateUserProfileController);

// Actualizar el perfil del usuario (requiere estar autenticado)(extra)
router.put('/profile', authUserMiddleware, updateUserController);

// Guardar un criterio de búsqueda como favorito (requiere autenticación)
router.post('/favorites', authUserMiddleware, saveUserFavoriteController);

// Obtener la lista de criterios de búsqueda favoritos del usuario (requiere autenticación)
router.get('/favorites', authUserMiddleware, userFavoriteController);

// Obtener detalles de un criterio de búsqueda favorito (requiere autenticación)
router.get(
    '/favorites/:favoriteId',
    authUserMiddleware,
    userFavoriteController,
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
