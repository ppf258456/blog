const followService = require('../../service/follow/followService');

const followController = {
  // 创建关注关系
  createFollow: async (req, res, next) => {
    const { follower_id, followee_id } = req.body;
    try {
      await followService.createFollow(follower_id, followee_id);
      res.status(201).json({ message: '关注关系创建成功' });
    } catch (err) {
      console.error('创建关注关系出错:', err);
      next(err);
    }
  },

  // 取消关注关系
  deleteFollow: async (req, res, next) => {
    const { follower_id, followee_id } = req.body;
    try {
      await followService.deleteFollow(follower_id, followee_id);
      res.status(200).json({ message: '关注关系取消成功' });
    } catch (err) {
      console.error('取消关注关系出错:', err);
      next(err);
    }
  },

  // 获取用户的关注列表
  getFollowing: async (req, res, next) => {
    const user_id = req.params.user_id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    try {
      const following = await followService.getFollowing(user_id, page, limit);
      res.status(200).json(following);
    } catch (err) {
      console.error('获取关注列表出错:', err);
      next(err);
    }
  },

  // 检查两个用户是否互相关注
  isMutual: async (req, res, next) => {
    const { follower_id, followee_id } = req.params;
    try {
      const mutual = await followService.isMutual(follower_id, followee_id);
      res.status(200).json({ isMutual: mutual });
    } catch (err) {
      console.error('检查互相关注关系出错:', err);
      next(err);
    }
  }
};

module.exports = followController;
