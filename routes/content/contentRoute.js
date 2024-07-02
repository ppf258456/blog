const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/contents/contentController');
const jwt = require('../../middlewares/jwtMiddleware')

// 创建内容
router.post('/', jwt, contentController.createContent);

// 查询软删除的内容
router.get('/soft-deleted', jwt, contentController.getSoftDeletedContents);

// 获取内容
router.get('/:content_id', jwt, contentController.getContentById);

// 更新内容
router.put('/:content_id', jwt, contentController.updateContent);

// 删除内容
router.delete('/:content_id', jwt, contentController.deleteContent);

// 恢复软删除的内容
router.post('/restore/:content_id', jwt, contentController.restoreSoftDeletedContent);

// 获取某作者的所有作品
router.get('/author', jwt, contentController.getAuthorContents);

// 获取所有内容列表
router.get('/', contentController.getAllContents);


module.exports = router;
