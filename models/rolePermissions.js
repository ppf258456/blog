// rolepermissions.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// RolePermission 模型定义
const RolePermission = sequelize.define('RolePermission', {
    // 权限ID
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    // 用户ID
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    // 角色
    role: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // 创建权限
    canCreate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    // 读取权限
    canRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    // 更新权限
    canUpdate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    // 删除权限
    canDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'rolepermissions', // 对应数据库中的表名
    timestamps: true // 启用 Sequelize 自动添加的时间戳字段
});

module.exports = RolePermission;
