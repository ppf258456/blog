// userController.js
const userService = require('../service/userService');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
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
