// checkExistenceRoute.js
const express = require('express');
const checkExistenceController = require('../controllers/checkExistenceController');

const router = express.Router();

// 检查用户名是否存在
router.get('/check-username', checkExistenceController.checkUsername);

// 检查邮箱是否存在
router.get('/check-email', checkExistenceController.checkEmail);

// 检查会员号是否存在
router.get('/check-member-number', checkExistenceController.checkMemberNumber);

module.exports = router;