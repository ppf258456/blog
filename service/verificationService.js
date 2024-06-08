const nodemailer = require('nodemailer');
const smtpConfig = require('../config/smtp.config');
const crypto = require('crypto');
const User = require('../models/user.js');
const bcrypt = require('bcrypt'); // 引入bcrypt库

let transporter = nodemailer.createTransport(smtpConfig);
let verificationCodes = {}; // 存储验证码和时间戳

// 生成随机验证码
function generateVerificationCode() {
  return crypto.randomBytes(4).toString('hex');
}

// 检查邮箱是否存在
async function checkEmailExists(email) {
  const user = await User.findOne({ where: { email } });
  return user !== null;
}

// 发送验证码邮件
async function sendVerificationEmail(email) {
  if (!await checkEmailExists(email)) {
    throw new Error('邮箱不存在');
  }

  const code = generateVerificationCode();
  verificationCodes[email] = { code, timestamp: Date.now() + 5 * 60 * 1000 }; // 设置验证码5分钟后过期

  const mailOptions = {
    from: smtpConfig.auth.user,
    to: email,
    subject: '您的验证码',
    text: `您的验证码是：${code}，请在5分钟内使用它。`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('验证码邮件发送成功');
  } catch (error) {
    console.error('发送邮件失败:', error);
    throw error;
  }
}

// 验证验证码
function verifyCode(email, code) {
  const codeInfo = verificationCodes[email];
  return codeInfo && codeInfo.code === code && Date.now() < codeInfo.timestamp;
}

// 重置密码服务函数
async function resetPassword(email, newPassword, confirmPassword, code) {
  if (newPassword !== confirmPassword) {
    throw new Error('两次输入的密码不一致');
  }

  if (!verifyCode(email, code)) {
    throw new Error('验证码无效或已过期');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('用户不存在');
  }

  // 使用bcrypt加密密码
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  user.password = hashedPassword; // 更新加密后的密码
  await user.save();

  // 重置密码成功后，销毁验证码
  delete verificationCodes[email];
}

module.exports = {
  checkEmailExists,
  sendVerificationEmail,
  verifyCode,
  resetPassword,
};