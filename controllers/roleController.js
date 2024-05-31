// controllers/roleController.js

const User = require('../models/user');

/**
 * 更新用户权限
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const updateRole = async (req, res, next) => {
    try {
        const { id, role } = req.body;

        // 检查是否提供了用户ID和新角色
        if (!id || !role) {
            return res.status(400).json({ message: 'User ID and new role are required' });
        }

        // 查找目标用户
        const targetUser = await User.findByPk(id);

        // 如果目标用户不存在，则返回404错误
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 获取当前用户的角色和ID
        const currentUserRole = req.currentUser.role;
        const currentUserId = req.currentUser.id;

        // 检查当前用户是否有权限修改此用户
        if (currentUserRole !== 'admin' && currentUserId !== targetUser.id) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
        }

        // 检查是否允许更新到的新角色
        const validRoles = ['admin', 'user', 'Audit'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // 根据需求，admin只能更新'user'和'Audit'角色
        if (currentUserRole === 'admin' && targetUser.role === 'admin') {
            return res.status(403).json({ message: 'Admin can only update "user" and "Audit" roles' });
        }

        // 更新用户角色
        targetUser.role = role;
        await targetUser.save();

        // 返回成功信息和更新后的用户信息
        res.json({ message: 'Role updated successfully', user: targetUser });
    } catch (error) {
        // 捕获错误并传递给下一个中间件
        next(error);
    }
};

module.exports = {
    updateRole,
};
