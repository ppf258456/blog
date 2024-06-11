// services/userService.js
const { Op } = require('sequelize');
const { User } = require('../../models');
const bcrypt = require('bcrypt'); // 引入bcrypt库用于密码加密
// 获取所有用户
exports.getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 返回用户详细信息
exports.getUserById = async (user_id) => {
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 更新用户信息
exports.updateUser = async (user_id, userData) => {
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(userData);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 删除用户
exports.deleteUser = async (user_id) => {
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};
// 模糊查找用户
exports.searchUsers = async (searchTerm) => {
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${searchTerm}%` } }, // 模糊搜索用户名
          { member_number: searchTerm } // 精确搜索会员号
        ]
      }
    });
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 修改密码
exports.changePassword = async (user_id, oldPassword, newPassword) => {
  try {
    const user = await this.getUserById(user_id);

    // 验证旧密码
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    // 哈希新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};  