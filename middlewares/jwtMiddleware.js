// middlewares/jwtMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * 中间件函数：验证JWT并解码用户信息
 * 如果JWT无效或过期，则返回401状态码和错误消息
 */
const auth = (req, res, next) => {
  // 从请求头或Cookie中获取授权的token
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', ''));

  // 如果没有token，返回401状态码和错误信息
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // 使用jwt.verify方法解码token，并验证它的有效性
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 将解码后的用户信息存储到请求对象中，便于后续中间件或路由处理
    req.currentUser = decoded;
    next();
  } catch (ex) {
    // 如果token无效或过期，返回401状态码和错误信息
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
