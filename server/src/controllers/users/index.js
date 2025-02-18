//importamos las funciones controladoras
import registerUserController from './registerUserController.js';
import loginUserController from './loginUserController.js';
import privateUserProfileController from './privateUserProfileController.js';
import saveUserFavoriteController from './saveUserFavoriteController.js';
import userFavoriteController from './userFavoriteController.js';
import userFavoriteDetailsController from './userFavoriteDetailsController.js';
import deleteUserFavoriteController from './deleteUserFavoriteController.js';
import updateUserPassController from './updateUserPassController.js';
import activateUserController from './activateUserController.js';
import sendRecoveryPassEmailController from './sendRecoveryPassEmailController.js';
import useRecoveryPassCodeController from './useRecoveryPassCodeController.js';
import updateUserController from './updateUserController.js';

//exportamos las funciones controladoras
export {
    registerUserController,
    loginUserController,
    privateUserProfileController,
    userFavoriteController,
    deleteUserFavoriteController,
    userFavoriteDetailsController,
    saveUserFavoriteController,
    updateUserPassController,
    activateUserController,
    sendRecoveryPassEmailController,
    useRecoveryPassCodeController,
    updateUserController,
};
