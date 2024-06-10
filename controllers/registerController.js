// registerController.js
const bcrypt = require('bcrypt'); // 引入bcrypt库用于密码加密
const registerService = require('../service/register/registerService'); // 引入注册服务层

// 注册用户的控制器函数
// 处理 '/register' 路由的POST请求，调用服务层进行注册逻辑处理
async function register(req, res) {
  // 从请求体中解构出用户信息和图片Base64字符串
  const {
    username,
    email,
    password,
    member_number,
    introduction,
    user_role,
    account_status,
    verificationCode,
    avatar, // 用户头像的Base64编码
    background_image, // 用户背景图的Base64编码，由后端处理并返回
  } = req.body;

  try {
    // 对密码进行哈希加密，保障存储安全性
    const hashedPassword = await bcrypt.hash(password, 10);

    // 调用服务层的registerUser函数完成用户的注册
    // 这里将用户信息和加密后的密码作为参数传递
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

    // 注册成功后，返回状态码200和成功消息，同时返回新创建的用户信息
    res.status(200).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    // 如果在注册过程中发生错误，打印错误堆栈信息，并返回状态码500和错误信息
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
}

// 导出register函数，以便在路由中使用
module.exports = {
  register,
};