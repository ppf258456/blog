// roleService.js




/**
 * 创建角色权限记录
 * @param {Object} rolePermissionData - 角色权限数据
 * @returns {Promise<Object>} - 新创建的角色权限记录
 */
exports.createRolePermission = async (rolePermissionData) => {
    try {
        const rolePermission = await models.RolePermission.create(rolePermissionData);
        return rolePermission;
    } catch (error) {
        throw error;
    }
};
/**
 * 更新用户权限
 * @param {Object} userData - 用户数据
 * @returns {Object} 更新后的用户信息
 */
exports.updateUserRole = async (userData) => {
    try {
        const { id, role, currentUserRole, currentUserId } = userData;

        // 检查是否提供了用户ID和新角色
        if (!id || !role) {
            throw new Error('User ID and new role are required');
        }

        // 查找目标用户
        const targetUser = await User.findByPk(id);

        // 如果目标用户不存在，则返回404错误
        if (!targetUser) {
            throw new Error('User not found');
        }

        // 检查当前用户是否有权限修改此用户
        if (currentUserRole !== 'admin' && currentUserId !== targetUser.id) {
            throw new Error('Forbidden: You can only update your own profile');
        }

        // 检查是否允许更新到的新角色
        const validRoles = ['admin', 'user', 'Audit'];
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role');
        }

        // 根据需求，admin只能更新'user'和'Audit'角色
        if (currentUserRole === 'admin' && targetUser.role === 'admin') {
            throw new Error('Admin can only update "user" and "Audit" roles');
        }

        // 更新用户角色
        targetUser.role = role;
        await targetUser.save();

        // 返回更新后的用户信息
        return { message: 'Role updated successfully', user: targetUser };
    } catch (error) {
        throw error;
    }
};
