//importamos dependencias
import jwt from 'jsonwebtoken';

//importamos la función que lanza un error
import generateErrorUtil from '../utils/generateErrorUtil.js';

//Creamos middleware que desencripta un token y crea la propiedad user en el objeto request.
const authUserMiddleware = async (req, res, next) => {
    try {
        //obtenemos el token
        const { authorization } = req.headers;

        //si falta el token lanzamos un error
        if (!authorization) {
            return next(
                generateErrorUtil('Falta la cabecera de autenticación', 401),
            );
        }
        try {
            //Desencriptamos la información del token
            const tokenInfo = jwt.verify(authorization, process.env.SECRET);

            //Creamos una propiedad inventada en el objeto "request" para almacenar el ID y rol del usuario
            req.user = {
                userId: tokenInfo.id,
                role: tokenInfo.role,
            };

            //Pasamos el control al siguiente middlware o función controladora.
            next();
        } catch (err) {
            console.error(err);
            next(generateErrorUtil('Token inválido', 403));
        }
    } catch (err) {
        next(err);
    }
};

//exportamos la función
export default authUserMiddleware;
