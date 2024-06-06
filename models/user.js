const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true // 用户ID，主键，自增，唯一
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // 用户名，非空，唯一
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // 邮箱，非空，唯一
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false // 密码，非空
  },
  member_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // 会员号，非空，唯一
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false // 头像，非空
  },
  introduction: {
    type: DataTypes.TEXT,
    allowNull: true // 个人简介，可为空
  },
  fans_count: {
    type: DataTypes.BIGINT,
    defaultValue: 0, // 默认值为0
    allowNull: false // 粉丝数，非空
  },
  follow_count: {
    type: DataTypes.BIGINT,
    defaultValue: 0, // 默认值为0
    allowNull: false // 关注数，非空
  },
  likes_count: {
    type: DataTypes.BIGINT,
    defaultValue: 0, // 默认值为0
    allowNull: false // 获赞数，非空
  },
  background_image: {
    type: DataTypes.STRING,
    allowNull: true // 背景图，可为空
  },
  register_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // 默认值为当前时间
    allowNull: false // 注册时间，非空
  },
  last_login_time: {
    type: DataTypes.DATE,
    allowNull: true // 最后登录时间，可为空
  },
  account_status: {
    type: DataTypes.STRING,
    allowNull: true, // 账号状态，可为空
    validate: {
      isIn: {
        args: [process.env.ACCOUNT_STATUS.split(',')], // 可选值为 online, freeze, prohibit, stealth,
        msg: 'Invalid account status.' // 无效的账号状态
      }
    }
  },
  user_role: {
    type: DataTypes.STRING,
    allowNull: true, // 用户身份，可为空
    validate: {
      isIn: {
        args: [process.env.VALID_ROLES.split(',')], // 可选值从环境变量中读取
        msg: 'Invalid user role.' // 无效的用户身份
      }
    }
  },
  user_level: {
    type: DataTypes.INTEGER,
    allowNull: true // 用户级别，可为空
  },
  coin_count: {
    type: DataTypes.BIGINT,
    allowNull: true // 硬币数，可为空
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // 默认值为当前时间
    allowNull: false // 更新时间，非空
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true // 删除时间，可为空
  }
}, {
  tableName: 'users',
  timestamps: true, // 启用时间戳
  paranoid: true, // 启用软删除
  underscored: true // 使用下划线命名
});

module.exports = User;
