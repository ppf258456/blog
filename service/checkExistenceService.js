// checkExistenceService.js
const { User } = require('../models/user');

// 检查用户名是否存在
async function checkUsernameExists(username) {
  return User.findOne({ where: { username } });
}

// 检查邮箱是否存在
async function checkEmailExists(email) {
  return User.findOne({ where: { email } });
}

// 检查会员号是否存在
async function checkMemberNumberExists(memberNumber) {
  return User.findOne({ where: { member_number: memberNumber } });
}

module.exports = {
  checkUsernameExists,
  checkEmailExists,
  checkMemberNumberExists,
};