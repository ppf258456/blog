// verificationController.js
const { checkEmailExists, sendVerificationEmail, verifyCode } = require('../service/verificationService');

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

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword; // 更新加密后的密码
      await user.save();

      // 重置密码成功后，销毁验证码
      delete verificationCodes[email];
      res.send('密码重置成功');
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = verificationController;