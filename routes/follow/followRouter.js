const express = require('express');
const FollowController = require('../../controllers/follow/followController');
const router = express.Router();
const jwt = require('../../middlewares/jwtMiddleware')
// POST /follow/create - 创建关注关系
router.post('/create', jwt,FollowController.createFollow);

// POST /follow/delete - 取消关注关系
router.post('/delete',jwt, FollowController.deleteFollow);

// GET /follow/following/:user_id - 获取用户的关注列表
router.get('/following/:user_id', jwt,FollowController.getFollowing);

// GET /follow/isMutual/:followerId/:followeeId - 检查两个用户是否互相关注
router.get('/isMutual/:follower_id/:followee_id',jwt, FollowController.isMutual);

module.exports = router;
