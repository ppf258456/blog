// models/Follow.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 定义关注模型
const Follow = sequelize.define('Follow', {
  follow_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    // 关注记录ID，主键，自增
  },
  follower_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'Users', // 表名，注意这里是字符串
      key: 'user_id',
    },
    // 关注者ID，非空，关联到用户表中的user_id字段
  },
  following_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id',
    },
    // 被关注者ID，非空，关联到用户表中的user_id字段
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    // 关注时间，默认为当前时间，非空
  },
  follower_username: {
    type: DataTypes.STRING,
    allowNull: false,
    // 关注者用户名，非空
  },
  follower_avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    // 关注者头像
  },
  follower_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // 关注者等级
  },
  follower_bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    // 关注者个人简介
  },
  fans_count: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    // 粉丝数，默认值为0，非空
  },
}, {
  timestamps: false, // 不包含时间戳
  tableName: 'Follows' // 表名为Follows
});

module.exports = Follow;
