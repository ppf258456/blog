const express = require('express');
const fansController = require('../../controllers/fans/fansController');
const router = express.Router();
const jwt = require('../../middlewares/jwtMiddleware');

// GET /fans/:user_id - 获取用户的粉丝列表
router.get('/:user_id', jwt, fansController.getFollowers);

module.exports = router;
