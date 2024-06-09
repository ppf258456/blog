// registerController.js
const bcrypt = require('bcrypt');
const registerService = require('../service/register/registerService');

 /**
   * 注册用户的控制器函数
   * 处理 '/register' 路由的POST请求，调用服务层进行注册逻辑处理。
   * 
   * @param {express.Request} req - 请求对象，包含用户注册信息
   * @param {express.Response} res - 响应对象，用于发送响应数据
   * @param {express.NextFunction} next - 传递控制权给下一个中间件
   */



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
    background_image,
    verificationCode
  } = req.body;

  try {
    // 对密码进行哈希加密
    const hashedPassword = await bcrypt.hash(password, 10);
    // 调用服务层函数完成注册
    const newUser = await registerService.registerUser(
      username,
      email,
      hashedPassword,
      member_number,
      avatar,
      introduction,
      user_role,
      account_status,
      background_image,
      verificationCode
    );
    // 返回注册成功信息
    res.status(200).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    // 错误处理
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
};