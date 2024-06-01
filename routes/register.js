const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// 用户注册
router.post('/', registerController.register);

// 用户注销
router.delete('/',registerController.logout)
module.exports = router;
