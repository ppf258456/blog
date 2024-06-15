//loginService.js
const {User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(member_number, password) {
  const startTime = Date.now(); // 记录开始时间
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
 const tokenTime = Date.now(); // 记录生成令牌前的时间
 console.log('Time before token generation:', new Date(tokenTime)); // 打印时间
  // 生成令牌
  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const endTime = Date.now(); // 记录结束时间
  console.log('Time after token generation:', new Date(endTime)); // 打印时间
  console.log('Generated token:', token); // 打印生成的令牌
  const decodedToken = jwt.decode(token, { complete: true });
  if (decodedToken) {
    console.log(decodedToken);
    console.log('iat (Issued At) timestamp:', decodedToken.payload.iat);
    console.log('Elapsed time from start to token generation:', (tokenTime - startTime) + ' ms');
  }
  return token;
}





module.exports = {
  loginUser,
 
};
