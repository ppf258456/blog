const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// User 模型定义
const User = sequelize.define('User', {
    // 用户ID
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    // 用户名
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // 用户年龄
    userAge: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
    },
    // 用户生日
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    // 用户电子邮件
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    // 创建时间
    createdAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    // 更新时间
    updatedAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    },
    // 删除时间
    deletedAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
        field: 'deleted_at'
    },
    // 用户角色
    role: {
        type: DataTypes.ENUM('admin', 'user', 'Audit'),
        allowNull: true,
        defaultValue: 'user'
    },
    // 会员编号
    memberNumber: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        field: 'memberNumber'
    },
    // 数量
    num: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
    },
    // 用户地址
    address: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    // 密码
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'user', // 对应数据库中的表名
    timestamps: true, // 启用 Sequelize 自动添加的时间戳字段
    createdAt: 'created_at', // 自定义 createdAt 字段名
    updatedAt: 'updated_at', // 自定义 updatedAt 字段名
    paranoid: true, // 启用软删除
    deletedAt: 'deleted_at', // 自定义 deletedAt 字段名
    indexes: [ // 定义索引
        {
            name: 'idx_User_deleted_at',
            fields: ['deleted_at']
        },
        {
            name: 'addr',
            fields: ['address']
        }
    ],
    hooks: {
        beforeCreate: (user) => {
            user.userAge = calculateAge(user.birthday);
        },
        beforeUpdate: (user) => {
            user.userAge = calculateAge(user.birthday);
        }
    }
});

// 计算年龄的辅助函数
function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

module.exports = User;
