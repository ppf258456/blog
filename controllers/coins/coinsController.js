const coinService = require('../../models'); // 确保这里的路径与您的项目结构相匹配

const coinController = {
  // 获取用户硬币数
  getCoinsBalance: async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const coinsBalance = await coinService.getCoinsBalance(user_id);
      res.status(200).json({ success: true, data: coinsBalance });
    } catch (error) {
      console.error('获取用户硬币数出错:', error);
      next(error);
    }
  },

  // 为内容投币
  donateCoins: async (req, res, next) => {
    try {
      const { donor_id, receiver_id, content_id, content_type, donationAmount } = req.body;
      const result = await coinService.donateCoins(donor_id, receiver_id, content_id, content_type, donationAmount);
      res.json({ success: result.success });
    } catch (error) {
      console.error('为内容投币时出错:', error);
      next(error);
    }
  },

  // 每天定时任务增加硬币
  dailyCoinsIncrement: async (req, res, next) => {
    // 由于这是一个定时任务，通常不会通过HTTP请求触发
    // 因此，这里不提供HTTP接口，而是通过cron或其他定时任务机制调用
    // 此方法不需要在控制器中处理HTTP请求和响应
  }
};

module.exports = coinController;