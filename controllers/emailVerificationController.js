// emailVerificationController.js
const {
  sendVerificationEmail,
  verifyCode
} = require('../service/emailVerificationService');

const emailVerificationController = {
  // 发送验证码
  sendVerificationEmail: async (req, res) => {
    const { email } = req.body;
    try {
      // 直接发送验证码邮件
      await sendVerificationEmail(email);
      res.send('验证码已发送到您的邮箱');
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  // 验证验证码
  verifyCode: async (req, res) => {
    const { email, code } = req.body;
    try {
      const isValid = await verifyCode(email, code);
      if (!isValid) {
        res.status(400).send('验证码无效或已过期');
      } else {
        res.send('验证码验证成功');
      }
    } catch (error) {
      res.status(500).send('服务器错误');
    }
  }
};

module.exports = emailVerificationController;