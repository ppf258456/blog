const bcrypt = require('bcrypt');
const registerService = require('../service/register/registerService');
async function register(req, res) {
  const { 
    username, 
    email,
    password,
    member_number, 
    avatar,
    introduction, 
    user_role, 
    account_status,
    background_image 
      } = req.body;

  try {
     // 对密码进行哈希加密
     const hashedPassword = await bcrypt.hash(password, 10);
     await registerService.registerUser(
      username,
      email,
      hashedPassword, 
      member_number, 
      avatar, 
      introduction, 
      user_role,
      account_status,
      background_image);
    res.status(200).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  register,
};
