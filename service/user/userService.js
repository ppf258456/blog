// services/userService.js

const { User } = require('../../models');

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