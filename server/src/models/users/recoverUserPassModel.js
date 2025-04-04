import generateErrorUtil from '../../utils/generateErrorUtil.js';
import { getPool } from '../../db/getPool.js';
import bcrypt from 'bcrypt';

const recoverUserPassModel = async (recoverPassCode, newPassword) => {
    const pool = await getPool();

    // Find the user by the recovery code
    const [users] = await pool.query(
        `SELECT userId FROM users WHERE recoverPasscode = ?`,
        [recoverPassCode],
    );

    if (users.length < 1) {
        throw generateErrorUtil(
            'Código de recuperación inválido o expirado',
            404,
        );
    }

    const userId = users[0].userId;

    const hashedPass = await bcrypt.hash(newPassword, 10);
    const now = new Date();

    await pool.query(
        `UPDATE users SET password = ?, modifiedAt = ?, recoverPassCode = NULL WHERE userId = ?`,
        [hashedPass, now, userId],
    );
};

export default recoverUserPassModel;
