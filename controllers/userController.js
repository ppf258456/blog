// userController.js
const userService = require('../service/userService');
const { paginate } = require('../utils/paginate');


/**
 * 获取所有用户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // 默认每页显示10条记录
        const { offset } = paginate(page, limit);
        const users = await userService.getAllUsers({ page, limit, offset });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.findUser = async (req, res, next) => {
    try {
        const { identifier } = req.query;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        /* 在 URL 输入框中输入 http://your-api-endpoint/api/users/find?identifier=yourValue */
        // console.log(identifier);
        const users = await userService.findUser(identifier);
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const updatedUser = await userService.updateUser(userId, userData);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.deleteUsers = async (req, res, next) => {
    try {
        const userIds = req.body.userIds;
        await userService.deleteUsers(userIds);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

