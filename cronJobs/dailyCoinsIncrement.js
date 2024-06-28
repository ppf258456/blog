// src/cronJobs/dailyCoinsIncrement.js

const coinService = require('../service/coins/coinService'); // 根据实际路径调整
const cron = require('node-cron');

class DailyCoinsIncrement {
  constructor() {
    this.cronJob = null;
  }

  // 启动定时任务
  start() {
    this.cronJob = cron.schedule('0 0 * * *', () => {
      coinService.dailyCoinsIncrement();
      console.log("定时任务完成！");
    });
    console.log('Daily coins increment cron job started.');
  }

  // 停止定时任务
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('Daily coins increment cron job stopped.');
    }
  }
}

module.exports = new DailyCoinsIncrement();