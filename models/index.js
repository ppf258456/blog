// index.js
const Sequelize = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];
const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);

const models = {};

// 导入模型
models.User = require('./User');
// models.RolePermission = require('./rolePermissions');
// models.Articles=require('./articles')(sequelize, Sequelize.DataTypes);
// // 定义关联关系
// models.User.hasMany(models.RolePermission, { foreignKey: 'userId' });
// models.RolePermission.belongsTo(models.User, { foreignKey: 'userId' });

// models.User.hasMany(models.Articles, { foreignKey: 'user_id' });
// models.Articles.belongsTo(models.User, { foreignKey: 'user_id' });

models.Sequelize = Sequelize;
models.sequelize = sequelize;

module.exports = models;
