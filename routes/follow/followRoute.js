const express = require('express');
const router = express.Router();
const followController = require('../../controllers/follow/followController');

// POST /follow/create - 创建关注关系
router.post('/create', followController.createFollow);

// POST /follow/delete - 取消关注关系
router.post('/delete', followController.deleteFollow);

// GET /follow/following/:user_id - 获取用户某个分组的关注列表
router.get('/following/:user_id', followController.getFollowing);

// GET /follow/isMutual/:follower_id/:fans_id - 检查两个用户是否互相关注
router.get('/isMutual/:follower_id/:fans_id', followController.isMutual);

module.exports = router;
