// emailVerificationService.js
const nodemailer = require('nodemailer');
const smtpConfig = require('../config/smtp.config');
const crypto = require('crypto');
const User = require('../models/user');

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
  verificationCodes[email] = { code, timestamp: Date.now() + 5 * 60 * 1000 }; // 5分钟后过期

  const mailOptions = {
    from: smtpConfig.auth.user,
    to: email,
    subject: '您的邮箱验证码',
    text: `您的验证码是：${code}，请在5分钟内使用它完成验证。`,
  };

  try {
    await transporter.sendMail(mailOptions);
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

module.exports = {
  generateVerificationCode,
  checkEmailExists,
  sendVerificationEmail,
  verifyCode,
};