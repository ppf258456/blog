const express = require('express');
const router = express.Router();
const backgroundController = require('../../controllers/backgroundController');
const { upload } = require('../../config/multerConfig');

// 背景图上传接口
router.post('/upload-background', upload.single('background_image'), backgroundController.uploadBackground);
