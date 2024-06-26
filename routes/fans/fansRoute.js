const express = require('express');
const fansController = require('../../controllers/fans/fansController');
const router = express.Router();
const jwt = require('../../middlewares/jwtMiddleware');

// GET /fans/:user_id - 获取用户某个分组的粉丝列表
router.get('/:user_id', jwt, fansController.getFans);

// PUT /fans/classify - 更改粉丝分组
router.put('/classify',jwt, fansController.updateFanClassify);

module.exports = router;
