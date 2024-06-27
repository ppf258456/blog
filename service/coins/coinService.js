const { coins, User, transactions } = require('../../models');
// dailyCoinsIncrement 使用 Bull 队列
const coinIncrementQueue = require('./coinIncrementQueue');
const coinService = {
  // 获取用户硬币数
  getCoinsBalance: async (user_id) => {
    return coins.findOne({
      where: { user_id },
      attributes: ['coins_number']
    });
  },

  // 为内容投币
  donateCoins: async (donor_id, receiver_id, content_id, content_type, donationAmount) => {
    const transaction = await coins.sequelize.transaction();
    try {
      // 检查投币者硬币数量是否足够
      const donorCoin = await coins.findOne({ where: { user_id: donor_id }, transaction });
      if (!donorCoin || donorCoin.coins_number < donationAmount) {
        throw new Error('投币者硬币不足');
      }

      // 检查是否已经对该作品投过币
      const hasDonatedToContent = await transactions.findOne({
        where: {
          user_id: donor_id,
          content_id: content_id,
          content_type: content_type,
          transaction_type: 'donate',
        },
        transaction
      });
      if (hasDonatedToContent) {
        throw new Error('已对该作品投过币');
      }

      // 更新投币者硬币数并记录投币交易
      donorCoin.coins_number -= donationAmount;
      await donorCoin.save({ transaction });
      await transactions.create({
        user_id: donor_id,
        content_id: content_id,
        content_type: content_type,
        transaction_type: 'donate',
        amount: -donationAmount,
        description: `向${content_type} ${content_id} 投币 ${donationAmount} 个`,
        transaction_time: new Date(),
      }, { transaction });

      // 作者接收分成
      const receiverCoin = await coins.findOne({ where: { user_id: receiver_id }, transaction });
      const actualAmount = donationAmount * 0.3;
      receiverCoin.coins_number += actualAmount;
      receiverCoin.transaction_info = (receiverCoin.transaction_info || '') + `${new Date().toISOString()},捐硬币，${donationAmount},+${actualAmount},`;
      await receiverCoin.save({ transaction });
      await transactions.create({
        user_id: receiver_id,
        content_id: content_id,
        content_type: content_type,
        transaction_type: 'receive',
        amount: actualAmount,
        description: `因作品 ${content_type} ${content_id} 被投币，获得分成 ${actualAmount} 个`,
        transaction_time: new Date(),
      }, { transaction });

      await transaction.commit();
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      console.error('为内容投币时出错:', error.message);
      throw error;
    }
  },

 // 每天定时任务增加硬币
 dailyCoinsIncrement: async () => {
  console.log("定时任务启动成功！");
  // 查询所有用户
  const users = await User.findAll();
  // 计算次日0点的时间
  const nextDayMidnight = new Date();
  nextDayMidnight.setDate(nextDayMidnight.getDate() + 1);
  nextDayMidnight.setHours(0, 0, 0, 0);
  // 将每个用户作为一个任务添加到队列
  for (const user of users) {
    coinIncrementQueue.add({
      userId: user.user_id,
      nextDayMidnight,
    });
  }
}
};


module.exports = coinService;