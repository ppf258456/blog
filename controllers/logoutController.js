// logoutController.js 
const logoutService = require('../service/logoutService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// 在其他文件中
const { io } = require('../app');

// 处理退出登录请求
exports.logout = async (req, res) => {
  
    // console.log('Logout controller triggered');
    try {
      
     // 从token中获取用户ID
     const token = req.cookies.token || req.headers['token'];
        if (!token) {
          return res.status(401).json({ message: 'No token provided' });
        }
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          // console.log(decoded.userId);
          const user = await User.findByPk(decoded.userId);
        if (!user) {
    return res.status(404).json({ message: 'User not found' });
        }
      // 调用服务函数执行退出逻辑
     
      await logoutService.logoutUser(user.user_id);
      // 清除JWT Cookie
      res.clearCookie('token'); 
  
      // 清除Session数据
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: 'Could not log out, please try again' });
        }

        const status= user.account_status
        console.log(status);
        res.status(200).json({ message: 'Logout successful'});
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  };

// 处理管理员强制下线请求
// 修改为接受用户ID作为参数
exports.forceLogout = async (req, res, userId, io) => { 
  
  console.log('io is defined:', typeof io !== 'undefined');
  try {
    // 调用服务函数执行下线用户的逻辑
    const logoff = await logoutService.forceLogoutUser(userId);

    if (logoff) {
      // 使用socket.io向特定用户ID的客户端发送通知
      io.to(userId).emit('forcedLogout', { message: 'You have been forcefully logged out by an administrator' });
      
      // 发送响应，表示用户被强制下线成功
      res.status(200).json({ message: 'User forced logout successful' });
    } else {
      // 如果更新用户状态失败，则发送错误响应
      res.status(400).json({ message: 'Failed to force logout user' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};