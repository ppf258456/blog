// 检查在线
// 这个有无作用看你自己的需求
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const checkOnlineController = require('../controllers/checkOnlineController');

router.get('/', jwtMiddleware, checkOnlineController.checkOnline);

module.exports = router;