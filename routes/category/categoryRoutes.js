const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category/categoryController');
const jwt = require('../../middlewares/jwtMiddleware')
const checkAdmin = require('../../middlewares/checkAdminMiddleware')
router.use(jwt)
// 创建新的分类
router.post('/',checkAdmin, categoryController.createCategory);

// 获取所有分类
router.get('/', categoryController.getAllCategories);

// 获取被软删除的分类
router.get('/deleted',checkAdmin, categoryController.getDeletedCategories);

// 获取分区下的所有分类
router.get('/section/:section_id', categoryController.getCategoriesBySection);

// 获取单个分类信息
router.get('/:id', categoryController.getCategoryById);

// 更新分类信息
router.put('/:id',checkAdmin, categoryController.updateCategory);

// 删除分类信息（软删除）
router.delete('/:id',checkAdmin, categoryController.deleteCategory);

// 恢复被软删除的分类
router.post('/restore/:id',checkAdmin, categoryController.restoreCategory);



module.exports = router;
