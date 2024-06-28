// coinsRoutes.js
const express = require('express');
const router = express.Router();
const coinController = require('../../controllers/coins/coinsController');
const jwt = require('../../middlewares/jwtMiddleware')

// 保护所有路由
router.use(jwt)

// 获取用户硬币数
router.get('/balance/:user_id', coinController.getCoinsBalance);

// 为内容投币
router.post('/donate', coinController.donateCoins);

module.exports = router;
