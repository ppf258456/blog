const express = require('express');
const verificationController = require('../controllers/verificationController');

const router = express.Router();

// 检查邮箱是否存在
router.get('/check-email', verificationController.checkEmail);

// 发送验证码
router.post('/send-verification-code', verificationController.sendVerificationCode);

// 重置密码
router.post('/reset-password', verificationController.resetPassword);

module.exports = router;