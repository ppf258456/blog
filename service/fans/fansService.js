const { paginate } = require('../../utils/paginate');
const { Fans, User } = require('../../models');




const fanService = {
    // 获取用户的粉丝列表
    getFollowers: async (user_id, page = 1, limit = 20) => {
      const { offset, limit: page_limit } = paginate(page, limit);
      return await Fans.findAll({
        where: { user_id, deleteAt: null },
        include: [{ model: User, as: 'follower' }],
        limit: page_limit,
        offset,
        order: [['createAt', 'DESC']]
      });
    }
  };
  
  module.exports = fanService;