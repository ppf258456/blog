// routers/logoutRouter.js
const express = require('express');
const router = express.Router();
const { logout, forceLogout } = require('../controllers/logoutController');
const checkAdminMiddleware = require('../middlewares/checkAdminMiddleware');
const checkOnlineMiddleware = require('../middlewares/checkOnlineMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// 退出登录路由
router.post('/', jwtMiddleware, logout);

// 管理员强制下线路由
// 修改为接受JSON请求体，其中包含user_id
router.post('/force-logout', jwtMiddleware, checkAdminMiddleware, async (req, res) => {
  const { user_id } = req.body; // 从请求体获取user_id

  // 检查用户是否在线的中间件
  await checkOnlineMiddleware(req, res, () => {
    // 如果用户在线，执行强制下线逻辑
    forceLogout(req, res, user_id);
  });
});

module.exports = router;