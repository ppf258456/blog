// roleController.js

const roleService = require('../service/roleService');

/**
 * 更新用户权限
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const updateRole = async (req, res, next) => {
    try {
        const { id, role } = req.body;

        const userData = {
            id,
            role,
            currentUserRole: req.currentUser.role,
            currentUserId: req.currentUser.id
        };

        const result = await roleService.updateUserRole(userData);

        // 返回结果
        res.json(result);
    } catch (error) {
        // 捕获错误并传递给下一个中间件
        next(error);
    }
};

module.exports = {
    updateRole,
};
