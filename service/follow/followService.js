const { Follows, Fans, User } = require('../../models');
const Sequelize = require('sequelize');
const { paginate } = require('../../utils/paginate');

// 检查关注关系是否存在
async function checkFollowRelationship(follower_id, followed_id,) {
  const existing_follow = await Follows.findOne({
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
      return; // 如果已存在关注关系，则直接返回
    }
  
  // 创建关注关系记录到 follow 表
  await Follows.create({ follower_id, followed_id, classify_id });

    //fans表 的 default值 classify_id 为 2
    await Fans.create({ fan_id: followed_id, followed_id: follower_id, classify_id: 2 });

    // 创建关注关系记录
    await Follows.create({ follower_id, followed_id,classify_id  });
  
    // 更新关注者的关注数，至少为0，只有在创建新的关注关系时才更新
    await updateFollowCount(follower_id);
  
    // 更新被关注者的粉丝数，至少为0，只有在创建新的关注关系时才更新
    await updateFansCount(followed_id);
  
    // 检查对方是否已经关注了自己，以确定是否为互相关注
    const mutual_follow = await Follows.findOne({
      where: { follower_id: followed_id, followed_id: follower_id }
    });
  
    // 如果对方也关注了自己，则更新两条记录为互相关注
    if (mutual_follow) {
      await Follows.update(
        { is_mutual: true },
        { where: { follower_id, followed_id } }
      );
      await Follows.update(
        { is_mutual: true },
        { where: { follower_id: followed_id, followed_id: follower_id } }
      );
    }
  },

  // 取消关注关系
  deleteFollow: async (follower_id, followed_id) => {
    // 检查是否存在关注关系
    const exists = await checkFollowRelationship(follower_id, followed_id);
    if (!exists) {
      throw new Error('关注关系不存在，无法取消关注。');
    }
  
    // 删除关注关系记录
    await Follows.update(
      { delete_at: Sequelize.literal('CURRENT_TIMESTAMP') },
      { where: { follower_id, followed_id, delete_at: null } }
    );
  
    // 删除粉丝表中的记录
    await Fans.update(
      { delete_at: Sequelize.literal('CURRENT_TIMESTAMP') },
      { where: { follower_id: followed_id, followed_id: follower_id, delete_at: null } }
    );
  
    // 更新关注者的关注数和被关注者的粉丝数，仅在确实取消关注时才更新
    await updateFollowCount(follower_id, -1);
    await updateFansCount(fans_id, -1);
  
    // 检查对方是否仍然关注自己，如果是则更新为非互相关注
    const mutual_follow = await Follows.findOne({
      where: { follower_id: followed_id, followed_id: follower_id }
    });
  
    // 如果对方仍然关注自己，则更新对方的记录为非互相关注
    if (mutual_follow) {
      await Follows.update(
        { is_mutual: false },
        { where: { follower_id: followed_id, followed_id: follower_id } }
      );
    }
  },

  // 获取用户的关注列表
  //由于设置了分组，我们这里只获取分组的id，当用户选择某个分组时，发起请求，获取该分组内的详细信息
  // Service 方法：获取特定用户在特定分组的关注列表 


  getFollowing: async (user_id,class_id, page = 1, limit = 20) => {
    const { offset, limit: page_limit } = paginate(page, limit);
    
    try{
      const followings =   await Follows.findAll({
        where: { follower_id: user_id,classify_id:class_id },
        include:[{
          model: User,
          as: 'following',
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
  const follow1 = await Follows.findOne({
    where: { follower_id, followed_id, delete_at: null, is_mutual: true }
  });

  // 查询用户B是否关注用户A
  const follow2 = await Follows.findOne({
    where: { follower_id: followed_id, followed_id: follower_id, delete_at: null, is_mutual: true }
  });

  // 如果两个方向的关注关系都存在，并且都标记为互相关注，则返回true
  return follow1 !== null && follow2 !== null;
},
};

module.exports = follow_service;
