const { Follows, User } = require('../../models');
const { paginate } = require('../../utils/paginate');

const followService = {
  // 创建关注关系
  createFollow: async (follower_id, followee_id) => {
    await Follows.create({ follower_id, followee_id });

    // 更新关注者的关注数和被关注者的粉丝数
    await User.increment('follow_count', { where: { user_id: follower_id } });
    await User.increment('fans_count', { where: { user_id: followee_id } });

    // 检查对方是否已经关注了自己，以确定是否为互相关注
    const mutual_follow = await Follows.findOne({
      where: {
        follower_id: followee_id,
        followee_id: follower_id
      }
    });

    // 如果对方也关注了自己，则更新两条记录为互相关注
    if (mutual_follow) {
      await Follows.update(
        { is_mutual: true },
        { where: { follower_id, followee_id } }
      );
      await Follows.update(
        { is_mutual: true },
        { where: { follower_id: followee_id, followee_id: follower_id } }
      );
    }
  },

  // 取消关注关系
  deleteFollow: async (follower_id, followee_id) => {
    await Follows.destroy({
      where: { follower_id, followee_id }
    });

    // 更新关注者的关注数和被关注者的粉丝数
    await User.decrement('follow_count', { where: { user_id: follower_id } });
    await User.decrement('fans_count', { where: { user_id: followee_id } });

    // 检查对方是否仍然关注自己，如果是则更新为非互相关注
    const mutual_follow = await Follows.findOne({
      where: {
        follower_id: followee_id,
        followee_id: follower_id
      }
    });

    // 如果对方仍然关注自己，则更新对方的记录为非互相关注
    if (mutual_follow) {
      await Follows.update(
        { is_mutual: false },
        { where: { follower_id: followee_id, followee_id: follower_id } }
      );
    }
  },

  // 获取用户的关注列表
  getFollowing: async (user_id, page = 1, limit = 20) => {
    const { offset, limit: page_limit } = paginate(page, limit);
    return await Follows.findAll({
      where: { follower_id: user_id },
      include: [{ model: User, as: 'followee' }],
      limit: page_limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  },

  // 检查两个用户是否互相关注
  isMutual: async (follower_id, followee_id) => {
    const follow = await Follows.findOne({
      where: {
        follower_id,
        followee_id
      }
    });
    return follow ? follow.is_mutual : false;
  }
};

module.exports = followService;
