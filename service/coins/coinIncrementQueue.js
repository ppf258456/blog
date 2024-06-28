//coinIncrementQueue.js
const Bull = require('bull');
const coinIncrementQueue = new Bull('coinIncrement', 'redis://127.0.0.1:6379');
const {coins,transactions} = require('../../models')
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
   const newTransactions=  await transactions.create({
      user_id: user_id,
      content_id:0,
      content_type:"每日发放",
      transaction_type: '每日奖励',
      transaction_time: nextDayMidnight,
      transaction_info: '每日奖励增加3个硬币。',
      amount: 3,
    });
    // 获取当前硬币记录
    const coinRecord = await coins.findOne({ where: { user_id: user_id } });
    let transactionInfo = coinRecord.transaction_info ? coinRecord.transaction_info.split(',') : [];

    console.log(newTransactions.transaction_id);
    // 添加新的交易记录
    transactionInfo.push(newTransactions.transaction_id);

  // 更新 transaction_info 字段
  await coins.update(
    { transaction_info: transactionInfo.join(',') },
    { where: { user_id: user_id } }
  );
  
    console.log(`为用户 ${user_id} 增加硬币成功，交易记录 ID: ${newTransactions.transaction_id}`);
  } catch (error) {
    console.error(`为用户 ${user_id} 增加硬币失败`, error);
    // 可以选择重试，或者记录日志等操作
    throw error;
  }
});

module.exports = coinIncrementQueue;