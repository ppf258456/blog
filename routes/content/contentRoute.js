const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/contents/contentController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

// 创建内容
router.post('/', jwtMiddleware, contentController.createContent);

// 查询软删除的内容
router.get('/soft-deleted', jwtMiddleware, contentController.getSoftDeletedContents);

// 获取草稿列表
router.get('/drafts', jwtMiddleware, contentController.getDrafts);

// 获取内容
router.get('/:content_id', jwtMiddleware, contentController.getContentById);

// 更新内容
router.put('/:content_id', jwtMiddleware, contentController.updateContent);

// 删除内容
router.delete('/:content_id', jwtMiddleware, contentController.deleteContent);

// 恢复软删除的内容
router.post('/restore/:content_id', jwtMiddleware, contentController.restoreSoftDeletedContent);

// 获取某作者的所有作品
router.get('/author', jwtMiddleware, contentController.getAuthorContents);

// 获取所有内容列表
router.get('/', contentController.getAllContents);

module.exports = router;
