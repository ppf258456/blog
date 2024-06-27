// logoutController.js 
const socketService = require('../service/socket/socketService'); 
const checkOnlineMiddleware= require('../middlewares/checkOnlineMiddleware')
const logoutService = require('../service/logoutService');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// 在其他文件中


// 处理退出登录请求
const logout = async (req, res) => {
  
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
  const forceLogout = async (req, res) => {
    const { user_id } = req.body;
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const result = await logoutService.forceLogoutUser(user_id);
      if (result) {
        socketService.emitToUser(user_id, 'forcedLogout', 'You are being forcefully logged out.');
        res.status(200).json({ message: 'Forced logout initiated' });
      } else {
        res.status(400).json({ message: 'Failed to force logout' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  };
module.exports = { logout, forceLogout };