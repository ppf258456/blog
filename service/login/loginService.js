//login.js
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(member_number, password) {
  // 查询用户
  const user = await User.findOne({ where: { member_number } });
  if (!user) {
    throw new Error('User not found.');
  }

  // 验证密码
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid member number or password.');
  }
 // 更新用户的account_status为online
 await User.update({ account_status: 'online' }, { where: { member_number } });

  // 生成令牌
  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
 
  return token;
}





module.exports = {
  loginUser,
 
};
