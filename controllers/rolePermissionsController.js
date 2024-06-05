// roleController.js

const rolePermissionService = require('../service/roleService');



/**
 * 获取角色权限
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getRolePermission = async (req, res) => {
    try {
        const userid = req.params.userid;
        const rolePermission = await rolePermissionService.getUserPermissions(userid);
        res.status(200).json(rolePermission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * 更新用户身份
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





/**
 * 获取用户权限
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getUserPermissions = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const permissions = await roleService.getUserPermissions(userId);
        res.status(200).json({ permissions });
    } catch (error) {
        next(error);
    }
};




module.exports = {
    updateRole,
    getRolePermission,
};

