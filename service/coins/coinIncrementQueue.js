const Bull = require('bull');
const coinIncrementQueue = new Bull('coinIncrement', 'redis://127.0.0.1:6379');

// 处理队列中的每个任务
coinIncrementQueue.process(async (job) => {
  const { user_id, nextDayMidnight } = job.data;
  try {
    // 增加硬币
    await coins.increment('coins_number', {
      by: 3,
      where: { user_id: user_id },
    });

    // 记录每日增加硬币的交易信息
    await transactions.create({
      user_id: user_id,
      transaction_type: 'daily_bonus',
      transaction_time: nextDayMidnight,
      transaction_info: '每日奖励增加3个硬币。',
      coins_number: 3,
    });
  } catch (error) {
    console.error(`为用户 ${user_id} 增加硬币失败`, error);
    // 可以选择重试，或者记录日志等操作
    throw error;
  }
});

module.exports = coinIncrementQueue;