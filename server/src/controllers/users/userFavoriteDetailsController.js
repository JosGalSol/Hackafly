import selectUserFavoriteModel from '../../models/users/selectUserFavoriteModel.js';

const userFavoriteDetailsController = async (req, res, next) => {
    try {
        const { userId } = req.user.userId;
        const { favoriteId } = req.params;

        const favorite = await selectUserFavoriteModel(favoriteId, userId);
        res.send({
            status: 'Ok',
            data: {
                favorite,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default userFavoriteDetailsController;
