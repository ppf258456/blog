// models/index.js
const Sequelize = require('sequelize');
const config = require('../config/database'); // 确保路径正确
const initModels = require('./init-models');

const sequelize = config; // 直接使用配置导出的 sequelize 实例

const models = initModels(sequelize);

models.Sequelize = Sequelize;
models.sequelize = sequelize;

// // 添加一个函数来转换时间戳到东八区
// function convertToUTCPlus8(date) {
//     return new Date(date.getTime() + 8 * 60 * 60 * 1000);
//   }
  
//   // 为所有模型添加 beforeCreate 钩子
//   Object.values(models).forEach(model => {
//     if (model.sequelize) {
//       model.addHook('beforeCreate', (instance, options) => {
//         if (instance.createdAt) {
//           instance.createdAt = convertToUTCPlus8(new Date(instance.createdAt));
//         }
//         if (instance.updatedAt) {
//           instance.updatedAt = convertToUTCPlus8(new Date(instance.updatedAt));
//         }
//         if (instance.deletedAt) {
//           instance.deletedAt = convertToUTCPlus8(new Date(instance.deletedAt));
//         }
//       });
//     }
//   });


module.exports = models;
