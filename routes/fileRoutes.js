const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// 文件上传接口
router.post('/upload', fileController.uploadFile);

module.exports = router;