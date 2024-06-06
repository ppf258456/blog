const User = require('../models/User');

// 中间件函数：检查用户是否在线
// 修改为异步函数并接收一个回调函数
const checkOnline = async (req, res, next) => {
  try {
    const  {user_id}  = req.body; // 从请求体获取user_id
    
    const user = await User.findByPk(user_id); // 根据用户ID查找用户
    
    if (user && user.account_status === 'online') { // 如果用户存在且在线
      next(); // 用户在线，继续执行下一个中间件或控制器
    } else {
      res.status(404).json({ error: 'User not found or not online' }); // 用户不存在或不在线，返回 404 Not Found 错误
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkOnline;