const User = require('../models/user');

exports.isUserOnline = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user && user.account_status === 'online'; // 假设 'online' 表示用户在线
  } catch (error) {
    throw error;
  }
};
