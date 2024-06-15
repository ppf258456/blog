const Sequelize = require('sequelize');
const config = require('../config/database'); // 确保路径正确
const initModels = require('./init-models');

const sequelize = config; // 直接使用配置导出的 sequelize 实例

const models = initModels(sequelize);

models.Sequelize = Sequelize;
models.sequelize = sequelize;

module.exports = models;
