const { Follow, Fans, User } = require('../../models');
const Sequelize = require('sequelize') 
const sequelize = require('../../config/database')

const { paginate } = require('../../utils/paginate');


const follow_service = {
  createFollow: async (follower_id, followed_id, classify_id) => {
    // 检查是否存在关注关系
    const followExists = await Follow.findOne({
      where: {
        follower_id: follower_id,
        followed_id: followed_id,
        classify_id: classify_id,
        deletedAt: null
      }
    });
  
    if (followExists) {
      throw new Error('已关注，无法继续关注。');
    }
  
    try {
      // 使用事务来确保数据的一致性
      const transaction = await Follow.sequelize.transaction();
  
      // 在事务中执行多个数据库操作
      await Follow.create({ follower_id, followed_id, classify_id }, { transaction });
      await Fans.create({ fan_id: follower_id, followed_id, classify_id: 2 }, { transaction });
      // 更新关注者的关注数和被关注者的粉丝数
      await User.increment('follow_count', { by: 1, where: { user_id: follower_id }, transaction });
      await User.increment('fans_count', { by: 1, where: { user_id: followed_id }, transaction });
  
      // 检查对方是否已经关注了自己，如果是，则更新为互相关注
      const mutualFollow = await Follow.findOne({
        where: {
          follower_id: followed_id,
          followed_id: follower_id,
          classify_id: classify_id,
          is_mutual: false,
          deletedAt: null
        },
        transaction
      });
  
      if (mutualFollow) {
        await Follow.update(
          { is_mutual: true },
          {
            where: {
              follower_id: follower_id,
              followed_id: followed_id,
              classify_id: classify_id
            },
            transaction
          }
        );
      }
  
      // 提交事务
      await transaction.commit(); 
    } catch (error) {
      // 如果出现错误，回滚事务
      console.error('创建关注关系时发生错误:', error);
      await transaction.rollback();
      throw error;
    }
  },

  // 取消关注关系
  deleteFollow: async (follower_id, followed_id, classify_id) => {
    // 检查是否存在关注关系
    const followExists = await Follow.findOne({
      where: {
        follower_id: follower_id,
        followed_id: followed_id,
        classify_id: classify_id,
        deletedAt: null
      }
    });
  
    if (!followExists) {
      throw new Error('关注关系不存在，无法取消关注。');
    }
  
    try {
      // 使用 sequelize.transaction() 方法创建事务
      const transaction = await Follow.sequelize.transaction();
  
      // 在事务中执行操作
      await Follow.update(
        { deletedAt: Sequelize.literal('CURRENT_TIMESTAMP') },
        {
          where: {
            follower_id: follower_id,
            followed_id: followed_id,
            classify_id: classify_id,
            deletedAt: null
          },
          transaction
        }
      );
   // 查询 Fans 表，准备软删除对应记录
   const fansToDestroy  = await Fans.findOne({
    where: {
      fan_id: follower_id,
      followed_id: followed_id,
      deletedAt: null
    },
    transaction
  });
   // 如果找到了 Fans 表的记录，执行软删除
   if(fansToDestroy){
    await Fans.destroy({
      where: {
        fan_id: follower_id,
        followed_id: followed_id,
        deletedAt: null
      },
      transaction,
      force: true // 确保执行物理删除
    });
   }
      await User.decrement('follow_count', {
        by: 1,
        where: { user_id: follower_id, follow_count: { [Sequelize.Op.gte]: 1 } },
        transaction
      });
  
      await User.decrement('fans_count', {
        by: 1,
        where: { user_id: followed_id, fans_count: { [Sequelize.Op.gte]: 1 } },
        transaction
      });
  
      // 检查并处理互相关注的情况
      const mutualFollow = await Follow.findOne({
        where: {
          follower_id: followed_id,
          followed_id: follower_id,
          classify_id: classify_id,
          is_mutual: true,
          deletedAt: null
        },
        transaction
      });
  
      if (mutualFollow) {
        await Follow.update(
          { is_mutual: false },
          {
            where: { follower_id: followed_id, followed_id: follower_id, classify_id: classify_id },
            transaction
          }
        );
      }
  
      // 提交事务
      await transaction.commit();
    } catch (error) {
      // 如果出现错误，回滚事务
      console.error('取消关注时发生错误:', error);
      await transaction.rollback();
      throw error;
    }
  },
  // 获取用户的关注列表
  //由于设置了分组，我们这里只获取分组的id，当用户选择某个分组时，发起请求，获取该分组内的详细信息
  // Service 方法：获取特定用户在特定分组的关注列表 

  getFollowing: async (user_id,class_id, page = 1, limit = 20) => {
    const { offset, limit: page_limit } = paginate(page, limit);
    
    try{
      const followings =   await Follow.findAll({
        where: { follower_id: user_id,classify_id:class_id },
        include:[{
          model: User,
          as: 'followed',
          // attributes: ['user_id', 'username', 'email'], // 选取需要展示的用户字段
        },
      ] ,
        limit: page_limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      return followings
    }catch(error){
      console.error('获取分组内关注列表失败:', error);
      throw error;
    }
  },

// 检查两个用户是否互相关注
isMutual: async (follower_id, followed_id) => {
  // 查询用户A是否关注用户B
  const follow1 = await Follow.findOne({
    where: { follower_id, followed_id, deletedAt: null, is_mutual: true }
  });

  // 查询用户B是否关注用户A
  const follow2 = await Follow.findOne({
    where: { follower_id: followed_id, followed_id: follower_id, deletedAt: null, is_mutual: true }
  });

  // 如果两个方向的关注关系都存在，并且都标记为互相关注，则返回true
  return follow1 !== null && follow2 !== null;
},

  // 更新关注的分组设置
  updateFollowClassify: async (follower_id, followed_id, classify_id) => {
    // 执行更新操作，确保使用事务
    const transaction = await Follow.sequelize.transaction();
    try {
      await Follow.update(
        { classify_id },
        { where: { follower_id, followed_id }, transaction }
      );
      await transaction.commit();
      return { follower_id, followed_id, classify_id };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

};

module.exports = follow_service;
