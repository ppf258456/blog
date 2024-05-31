const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

// 登录路由
router.post('/login', authController.login);

// 退出登录
router.post('/logout', authController.logout);

module.exports = router;
