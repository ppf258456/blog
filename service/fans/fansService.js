const { paginate } = require('../../utils/paginate');
const { Fans, User } = require('../../models');




const fanService = {
    // 获取用户某分组下的粉丝列表
    getFollowers: async (user_id,class_id, page = 1, limit = 20) => {
      const { offset, limit: page_limit } = paginate(page, limit);
      return await Fans.findAll({
        where: {fan_id:user_id,classify_id:class_id, deletedAt: null },
        include: [{ model: User, as: 'fan' }],
        limit: page_limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
    },

      // 更新粉丝分组
      updateFanClassify: async (fan_id, followed_id, classify_id) => {
        const transaction = await Fans.sequelize.transaction();
        try {
          await Fans.update(
            { classify_id },
            { where: { fan_id, followed_id }, transaction }
          );
          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      }
  };
  
  module.exports = fanService;