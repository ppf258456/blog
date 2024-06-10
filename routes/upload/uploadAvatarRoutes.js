// uploadAvatarRoutes.js 
// 前端处理头像相关 只返回base64即可
const express = require('express');
const router = express.Router();
const avatarController = require('../../controllers/avatarController');

// 头像上传接口
router.post('/upload-avatar', avatarController.uploadAvatar);

module.exports = router;