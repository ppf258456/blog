// middlewares/jwtMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // 确保引入正确的用户模型
const jwtMiddleware = async (req, res, next) => {
 
  // 从请求头或Cookie中获取JWT token
  const token = req.cookies.token ||(req.headers['token'] && req.headers['token']);

  // 如果没有token，返回401状态码和错误信息
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    console.log('Token:', token); // 添加日志，检查token
    // 使用jwt.verify方法解码token，并验证它的有效性
    const decoded = jwt.verify(token, process.env.JWT_SECRET,{ expiresIn: '1h' });
    console.log('Decoded Token:', decoded); // 添加日志，检查解码后的信息
   
    // 将解码后的用户信息存储到请求对象中，便于后续中间件或路由处理
    const user = await User.findByPk(decoded.userId);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    // console.log(user);
   
    next();
  } catch (ex) {
    // 如果token无效或过期，返回401状态码和错误信息
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = jwtMiddleware;