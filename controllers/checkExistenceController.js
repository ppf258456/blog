// checkExistenceController.js
const { checkUsernameExists, checkEmailExists, checkMemberNumberExists } = require('../service/checkExistenceService');

const checkExistenceController = {
  // 检查用户名是否存在
  checkUsername: async (req, res) => {
    const { username } = req.query;
    const exists = await checkUsernameExists(username);
    res.json({ exists: exists !== null });
  },

  // 检查邮箱是否存在
  checkEmail: async (req, res) => {
    const { email } = req.query;
    const exists = await checkEmailExists(email);
    res.json({ exists: exists !== null });
  },

  // 检查会员号是否存在
  checkMemberNumber: async (req, res) => {
    const { memberNumber } = req.query;
    const exists = await checkMemberNumberExists(memberNumber);
    res.json({ exists: exists !== null });
  },
};

module.exports = checkExistenceController;