const followService = require('../../service/follow/followService');

const followController = {
  // 创建关注关系
  createFollow: async (req, res, next) => {
    try {
      const { follower_id, followed_id,classify_id  } = req.body;
      await followService.createFollow(follower_id, followed_id,classify_id );
      res.status(201).json({ message: '关注成功' });
    } catch (err) {
      console.error('创建关注关系出错:', err);
      next(err);
    }
  },

  // 取消关注关系
  deleteFollow: async (req, res, next) => {
    try {
      const { follower_id, followed_id,classify_id  } = req.body;
      await followService.deleteFollow(follower_id, followed_id,classify_id );
      res.json({ message: '取消关注成功' });
    } catch (err) {
      console.error('取消关注关系出错:', err);
      next(err);
    }
  },

  // 获取用户某个分组的关注列表
  getFollowing: async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const class_id = req.query.class_id;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const following = await followService.getFollowing(user_id, class_id,page, limit);
      res.status(200).json(following);
    } catch (err) {
      console.error('获取关注列表出错:', err);
      next(err);
    }
  },

  // 检查两个用户是否互相关注
  isMutual: async (req, res, next) => {
    const { follower_id, followed_id  } = req.params;
    try {
      const mutual = await followService.isMutual(follower_id, followed_id );
      res.status(200).json({ isMutual: mutual });
    } catch (err) {
      console.error('检查互相关注关系出错:', err);
      next(err);
    }
  }
};

module.exports = followController;
