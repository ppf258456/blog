// roleService.js

const models = require('../models');
const paginate = require('../utils/paginate');

/**
 * 获取用户权限
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} - 返回用户的权限记录
 */
exports.getUserPermissions = async (userId) => {
    try {
        const permissions = await models.RolePermission.findOne({
            where: { userId }
        });
        if (!permissions) {
            throw new Error('Permissions not found for the user');
        }
        return permissions;
    } catch (error) {
        throw error;
    }
};

/**
 * 更新用户权限和角色
 * @param {number} userId - 用户ID
 * @param {string} role - 角色
 * @param {boolean} canCreate - 是否具有创建权限
 * @param {boolean} canRead - 是否具有读取权限
 * @param {boolean} canUpdate - 是否具有更新权限
 * @param {boolean} canDelete - 是否具有删除权限
 * @returns {Object} - 更新后的用户信息
 */

exports.updateUserPermissionsAndRole = async ({ userId, role, canCreate, canRead, canUpdate, canDelete }) => {
    try {
        // 查找目标用户
        const targetUser = await models.User.findByPk(userId);
        if (!targetUser) {
            throw new Error('User not found');
        }

        // 验证角色合法性
        const validRoles =  process.env.VALID_ROLES.split(',');
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role');
        }
        // 如果当前用户是管理员且目标用户也是管理员，则无法修改
        if (currentUserRole === 'admin' && targetUser.role === 'admin') {
            throw new Error('Forbidden: You cannot modify other admin\'s permissions');
        }
        // 更新用户权限和角色
        let permission = await models.RolePermission.findOne({ where: { userId } });
        if (!permission) {
            permission = await models.RolePermission.create({
                userId,
                role,
                canCreate,
                canRead,
                canUpdate,
                canDelete
            });
        } else {
            permission.role = role;
            permission.canCreate = canCreate;
            permission.canRead = canRead;
            permission.canUpdate = canUpdate;
            permission.canDelete = canDelete;
            await permission.save();
        }
        return { message: 'Permissions and role updated successfully', user: targetUser };
    } catch (error) {
        throw error;
    }
};

