
/* 
就这个dotenv的路径我真是操了，在根目录也读不到，非要引用一下才能找到，这点毛病修了2小时！！！
*/

require('dotenv').config({ path: '../.env' });
const sequelize = require('../config/database');

const User = require('../models/User'); // 导入模型
const Follow = require('../models/follow')
// 同步所有模型
sequelize.sync({ force: false }) // 设置 force: true 会先删除现有表然后重新创建表
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
