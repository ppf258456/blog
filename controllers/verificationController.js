const { checkEmailExists, sendVerificationEmail, verifyCode, resetPassword } = require('../service/verificationService');

const verificationController = {
  // 检查邮箱是否存在
  checkEmail: async (req, res) => {
    const { email } = req.query;
    try {
      const exists = await checkEmailExists(email);
      res.json({ exists });
    } catch (error) {
      res.status(500).send('服务器错误');
    }
  },

  // 发送验证码
  sendVerificationCode: async (req, res) => {
    const { email } = req.body;
    try {
      await sendVerificationEmail(email);
      res.send('验证码已发送到您的邮箱');
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  // 重置密码
  resetPassword: async (req, res) => {
    const { email, newPassword, confirmPassword, code } = req.body;
    try {
      await resetPassword(email, newPassword, confirmPassword, code);
      res.send('密码重置成功');
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = verificationController;