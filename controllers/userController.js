
// userController
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword, validateMemberNumber } = require('../utils/validators');


// 获取所有用户
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// 获取特定用户
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};
// 查找用户并返回其ID
exports.findUser = async (req, res, next) => {
    try {
        const identifier = req.query.identifier;
        const user = await User.findOne({
            where: {
                $or: [{ name: identifier }, { memberNumber: identifier }]
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id: user.id });
    } catch (error) {
        next(error);
    }
};


// 更新用户信息
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, birthday, email, role, memberNumber, password } = req.body;

        // 检查必要字段是否为空
        if (!name || !birthday || !email || !role || !memberNumber || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 验证字段
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Invalid password format' });
        }
        if (!validateMemberNumber(memberNumber)) {
            return res.status(400).json({ message: 'Invalid member number format' });
        }

        // 查询要更新的用户
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 检查当前用户角色是否为管理员
        if (req.currentUser.role === 'admin') {
            // 如果是管理员，允许更新'user', 'Audit' 他们两类所有用户的信息
            if (role !== 'admin') {
                // 如果不是管理员，只允许更新'user', 'Audit' 他们两类所有用户的信息
                await user.update({
                    name,
                    birthday,
                    email,
                    role,
                    memberNumber,
                    /*
                    在 bcrypt.hash(password, 10) 中，
                    数字 10 表示加密时使用的 salt 轮数。
                    salt 轮数是指哈希函数的迭代次数，
                    它影响了密码的计算复杂度和安全性。
                    bcrypt 会根据给定的 salt 轮数执行多次哈希计算，
                    以增加破解密码的难度。
                    建议使用的 salt 轮数在 10 到 12 之间，可以提供良好的安全性和性能。
                    */
                    password: await bcrypt.hash(password, 10)
                });

                // 过滤掉密码字段后返回更新后的用户数据
                const updatedUser = await User.findByPk(id, {
                    attributes: { exclude: ['password'] }
                });

                res.json(updatedUser);
            } else {
                // 如果是管理员，只能更新自己的信息
                if (req.currentUser.id !== parseInt(id)) {
                    return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
                }

                // 更新用户信息
                await user.update({
                    name,
                    birthday,
                    email,
                    role,
                    memberNumber,
                    password: await bcrypt.hash(password, 10)
                });

                // 过滤掉密码字段后返回更新后的用户数据
                const updatedUser = await User.findByPk(id, {
                    attributes: { exclude: ['password'] }
                });

                res.json(updatedUser);
            }
        } else {
            // 如果不是管理员，只能更新自己的信息
            if (req.currentUser.id !== parseInt(id)) {
                return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
            }

            // 更新用户信息
            await user.update({
                name,
                birthday,
                email,
                role,
                memberNumber,
                password: await bcrypt.hash(password, 10)
            });

            // 过滤掉密码字段后返回更新后的用户数据
            const updatedUser = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });

            res.json(updatedUser);
        }
    } catch (error) {
        next(error);
    }
};

// 删除用户
exports.deleteUsers = async (req, res, next) => {
    try {
        const { userIds } = req.body;
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'Please provide user IDs to delete' });
        }

        await User.destroy({
            where: {
                id: userIds
            }
        });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};