import { getPool } from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const activateUserModel = async (regCode) => {
    const pool = await getPool();

    const [users] = await pool.query(
        `SELECT userId FROM users WHERE regCode = ?`,
        [regCode],
    );

    if (users.length < 1) {
        generateErrorUtil('Codigo de registro invalido', 404);
    }

    await pool.query(
        `UPDATE users SET active = TRUE, regCode = null WHERE regCode = ?`,
        [regCode],
    );
};

export default activateUserModel;
