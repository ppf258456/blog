const { Follow, Fans, User } = require('../../models');
const Sequelize = require('sequelize') 
const sequelize = require('../../config/database')

const { paginate } = require('../../utils/paginate');

// 检查关注关系是否存在
async function checkFollowRelationship(follower_id, followed_id,) {
  const existing_follow = await Follow.findOne({
    where: { follower_id, followed_id }
  });
  return existing_follow !== null;
}

// 更新关注者的关注数，至少为0
async function updateFollowCount(user_id, increment = 1) {
  await User.increment('follow_count', {
    by: increment,
    where: {
      user_id,
      follow_count: { [Sequelize.Op.gte]: 0 }
    }
  });
}

// 更新被关注者的粉丝数，至少为0
async function updateFansCount(user_id, increment = 1) {
  await User.increment('fans_count', {
    by: increment,
    where: {
      user_id,
      fans_count: { [Sequelize.Op.gte]: 0 }
    }
  });
}

const follow_service = {
  // 创建关注关系，如果已存在则不触发
  createFollow: async (follower_id, followed_id,classify_id,) => {
    // 检查是否已存在关注关系
    const exists = await checkFollowRelationship(follower_id, followed_id,);
    if (exists) {
      return  res.status(400).json({ message: '已存在关注关系' }); // 如果已存在关注关系，返回错误信息;
    }
  
  // 创建关注关系记录到 follow 表
  await Follow.create({ follower_id, followed_id, classify_id });

    //fans表 的 default值 classify_id 为 2
    await Fans.create({ fan_id: followed_id, followed_id: follower_id, classify_id: 2 });
  
    // 更新关注者的关注数，至少为0，只有在创建新的关注关系时才更新
    await updateFollowCount(follower_id);
  
    // 更新被关注者的粉丝数，至少为0，只有在创建新的关注关系时才更新
    await updateFansCount(followed_id);
  
    // 检查对方是否已经关注了自己，以确定是否为互相关注
    const mutual_follow = await Follow.findOne({
      where: { follower_id: followed_id, followed_id: follower_id }
    });
  
    // 如果对方也关注了自己，则更新两条记录为互相关注
    if (mutual_follow) {
      await Follow.update(
        { is_mutual: true },
        { where: { follower_id, followed_id } }
      );
      await Follow.update(
        { is_mutual: true },
        { where: { follower_id: followed_id, followed_id: follower_id } }
      );
    }
  },

  // 取消关注关系
  deleteFollow: async (follower_id, followed_id,classify_id) => {
    // 检查是否存在关注关系
    const followExists = await Follow.findOne({
      where: {
        follower_id: follower_id,
        followed_id: followed_id,
        classify_id: classify_id,
        deletedAt: null // 确保查询的是未被软删除的记录
      }
    });
  
    if (!followExists) {
      throw new Error('关注关系不存在，无法取消关注。');
    }
  
    try {
       // 使用 sequelize.transaction() 方法创建事务
    // 注意这里的 async/await 语法和回调函数的使用
      const transaction = await Follow.sequelize.transaction()        // 't' 是事务参数
        transaction(async t=>{
          try{
            // 在事务中执行操作
            await Follow.update(
             { deletedAt: sequelize.literal('CURRENT_TIMESTAMP') },
             {
               where: {
                 follower_id: follower_id,
                 followed_id: followed_id,
                 classify_id: classify_id,
                 deletedAt: null
               },
               transaction:t
             }
           );
           await Fans.update(
             { deletedAt: sequelize.literal('CURRENT_TIMESTAMP') },
             {
               where: {
                 fan_id: follower_id,
                 followed_id: followed_id,
                 classify_id: classify_id,
                 deletedAt: null
               },
               transaction:t
             }
           );
           await User.decrement('follow_count', {
             by: 1,
             where: { user_id: follower_id, follow_count: { [Sequelize.Op.gte]: 1 } },
             transaction: t // 将事务参数传递给操作
           });
           await User.decrement('fans_count', {
             by: 1,
             where: { user_id: followed_id, fans_count: { [Sequelize.Op.gte]: 1 } },
             transaction: t // 将事务参数传递给操作
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
             transaction:t
           });
           
           if (mutualFollow) {
             await Follow.update(
               { is_mutual: false },
               {
                 where: { follower_id: followed_id, followed_id: follower_id, classify_id: classify_id },
                 transaction:t
               }
             );
           }
             // 提交事务
             return t.commit(); // 使用返回值来自动提交事务
                   }
                   catch (error) {
                     // 如果出现错误，回滚事务
                     console.error('取消关注时发生错误:', error);
                     await t.rollback();
                     throw error; 
                   }
                 
        })
  
  
      // 事务提交后，transaction 变量将包含提交结果
    } catch (error) {
      // 如果在创建事务时出现错误，处理异常
      console.error('取消关注关系出错:', error);
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
};

module.exports = follow_service;
