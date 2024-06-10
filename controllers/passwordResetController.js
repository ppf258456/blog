// controllers/passwordResetController.js
// 重置密码
const passwordResetService = require('../service/passwordResetService'); // 引入密码重置服务

const resetPassword = async (req, res) => {
  const { email, code, newPassword, confirmPassword } = req.body;

  try {
    // 调用服务层的 resetPassword 函数来重置密码
    const result = await passwordResetService.resetPassword(email, code, newPassword, confirmPassword);
    res.status(200).json({ message: result });
  } catch (error) {
    // 错误处理
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  resetPassword,
};