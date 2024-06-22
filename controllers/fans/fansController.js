const fanService = require('../../service/fans/fansService');

const fanController = {
  // 获取用户的粉丝列表
  getFollowers: async (req, res, next) => {
    const user_id = req.params.user_id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    try {
      const followers = await fanService.getFollowers(user_id, page, limit);
      res.status(200).json(followers);
    } catch (err) {
      console.error('获取粉丝列表出错:', err);
      next(err);
    }
  }
};

module.exports = fanController;
