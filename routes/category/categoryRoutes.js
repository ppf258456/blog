const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const jwt = require('../../middlewares/jwtMiddleware')
const checkAdmin = require('../../middlewares/checkAdminMiddleware')
router.use(jwt,checkAdmin)
// 创建新的分类
router.post('/', categoryController.createCategory);

// 获取所有分类
router.get('/', categoryController.getAllCategories);

// 获取单个分类信息
router.get('/:id', categoryController.getCategoryById);

// 更新分类信息
router.put('/:id', categoryController.updateCategory);

// 删除分类信息（软删除）
router.delete('/:id', categoryController.deleteCategory);

// 恢复被软删除的分类
router.post('/:id/restore', categoryController.restoreCategory);

// 获取被软删除的分类
router.get('/deleted', categoryController.getDeletedCategories);

module.exports = router;
