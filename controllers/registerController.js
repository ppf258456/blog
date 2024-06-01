const User = require('../models/user');
const {registerService} = require('../service/registerService');


exports.register = async (req, res) => {
    try {
        const { name, birthday, email, role, memberNumber, num, address, password } = req.body;

        const newUser = await registerService.registerUser({
            name,
            birthday,
            email,
            role,
            memberNumber,
            num,
            address,
            password
        });

        // 返回结果
        res.status(201).json({ message: "注册成功！", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * 注销用户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.logout = async (req, res, next) => {
    try {
        const userId = req.body.id;
        await registerService.logoutUser(userId);

        // 清除 Cookie 和 Session
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Could not log out, please try again' });
            }
            res.clearCookie('token');
            res.json({ message: 'User logged out and account deleted successfully' });
        });
    } catch (error) {
        next(error);
    }
};