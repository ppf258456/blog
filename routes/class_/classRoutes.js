const express = require('express');
const classController = require('../../controllers/class_/classController');
const router = express.Router();
const jwt =require('../../middlewares/jwtMiddleware')
// 保护所有路由
router.use(jwt)
// 创建分组
router.post('/create', classController.createClass);

// 获取所有分组
router.get('/:user_id', classController.getClasses);

// 更新分组信息
router.put('/:class_id', classController.updateClass);

// 删除分组
router.delete('/:class_id', classController.deleteClass);

module.exports = router;