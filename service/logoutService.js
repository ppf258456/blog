// services/userService.js



const User = require('../models/user');

exports.logoutUser = async (user_id) => {
  try {
    // 更新用户状态为离线
    await User.update({ account_status: 'logoff' }, { where: { user_id: user_id } });
  } catch (error) {
    throw error;
  }
};


exports.forceLogoutUser = async (user_id) => {
    try {
      
        // 在这里执行下线用户的逻辑
        // 例如，更新用户的登录状态为已下线
        const logout = await User.update({ account_status: 'logoff' }, {
            where: { user_id: user_id }
        });

        return logout;
    } catch (error) {
        throw error;
    }
};
