// passwordResetService.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {  verifyCode, checkEmailExists } = require('../service/emailVerificationService');

// 验证两次密码是否相同
function doPasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

// 重置密码的服务函数
async function resetPassword(email, code, newPassword, confirmPassword) {
  // 检查邮箱是否存在
  const emailExists = await checkEmailExists(email);
  if (!emailExists) {
    throw new Error('邮箱不存在');
  }

  // 验证验证码
  if (!verifyCode(email, code)) {
    throw new Error('验证码无效或已过期');
  }

  // 检查两次密码是否匹配
  if (!doPasswordsMatch(newPassword, confirmPassword)) {
    throw new Error('两次输入的密码不匹配');
  }

  // 更新用户密码
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('用户不存在');
  }
  user.password = hashedPassword;
  await user.save();

  return '密码重置成功';
}

module.exports = {
  resetPassword,
};