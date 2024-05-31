// models/User.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const { age } = require('../virtualAttributes/userVirtualAttributes');
/**
 * User 模型定义
 * 定义与数据库中的 user 表对应的模型。
 */
const User = sequelize.define('User', {
    /**
     * 用户ID
     * 主键，自动递增
     */
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * 创建时间
     * 默认为当前时间
     */
    createdAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    /**
     * 更新时间
     * 默认为当前时间
     */
    updatedAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    },
    /**
     * 删除时间
     * 软删除字段，可为空
     */
    deletedAt: {
        type: DataTypes.DATE(3),
        allowNull: true,
        field: 'deleted_at'
    },
    /**
     * 用户名
     * 不可为空
     */
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
 
    /**
     * 用户生日
     * 不可为空
     */
    birthday: {
        type: DataTypes.DATE(3),
        allowNull: false
    },
       /**
     * 用户年龄
     * 可为空
     */
       userAge: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'userAge',
        defaultValue: 0
        // get() {
        //     const today = new Date();
        //     const birthday = new Date(this.getDataValue('birthday'));
        //     const age = today.getFullYear() - birthday.getFullYear();
        //     const monthDiff = today.getMonth() - birthday.getMonth();
        //     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        //         return age - 1;
        //     }
        //     return age;
        // }
    },
    /**
     * 用户电子邮件
     * 不可为空 找回使用
     */
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    /**
     * 用户角色
     * 不可为空
     */
    role: {
        type:DataTypes.ENUM('admin', 'user', 'Audit'),
        allowNull: true,
        defaultValue: 'user'
    },
    /**
     * 会员编号
     * 必填且唯一
     */
    memberNumber: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        field: 'member_number'
    },
    /**
     * 数量
     * 可为空
     */
    num: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    /**
     * 用户地址
     * 可为空
     */
    address: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    /**
     * 密码
     * 不可为空
     */
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
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
        /**
         * 在创建用户之前自动设置 createdAt 和 updatedAt 为当前时间
         */
        beforeCreate: (user) => {
            const now = new Date();
            user.createdAt = now;
            user.updatedAt = now;
            user.userAge = calculateAge(user.birthday);
        },
        /**
         * 在更新用户之前自动设置 updatedAt 为当前时间
         */
        beforeUpdate: (user) => {
            user.updatedAt = new Date();
            user.userAge = calculateAge(user.birthday);
        }
    }
});
// 实例方法来计算年龄
// User.prototype.calculateAge = function () {
//     const today = new Date();
//     const birthday = new Date(this.birthday);
//     let age = today.getFullYear() - birthday.getFullYear();
//     const monthDiff = today.getMonth() - birthday.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
//         age--;
//     }
//     return age;
// };
// // 定义虚拟属性 age，用于计算用户年龄
// Object.defineProperty(User.prototype, 'age', {
//     get: age
// });
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
