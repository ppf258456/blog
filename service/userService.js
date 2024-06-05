// services/userService.js
const { User } = require('../models'); // 使用 index.js 导入模型
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const paginate = require('../utils/paginate');

/**
 * 获取所有用户
 * @param {number} page - 当前页数
 * @param {number} limit - 每页显示记录数
 * @returns {Promise<Array>} - 包含用户对象的数组
 */
exports.getAllUsers = async ({ page, limit }) => {
    try {
        const { offset } = paginate(page, limit);
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            limit,
            offset
        });
        return users;
    } catch (error) {
        throw error;
    }
};

exports.getUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        return user;
    } catch (error) {
        throw error;
    }
};

exports.findUser = async (identifier) => {
    try {
        // 首先按照名称和邮箱进行模糊查询
        let users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${identifier}%` } },
                    { email: { [Op.like]: `%${identifier}%` } }
                ]
            }
        });

        // 如果找到了用户，则直接返回结果
        if (users.length > 0) {
            return users.map(user => ({ 
                id: user.id,
                name:user.name,
                email:user.email, 
                memberNumber:user.memberNumber,
            }));
        } else {
            // 如果没找到用户，则按照会员号进行精确查询
            const user = await User.findOne({
                where: {
                    memberNumber: identifier
                }
            });

            // 如果找到了用户，则返回结果
            if (user) {
                return [{  
                    id: user.id,
                    name:user.name,
                    email:user.email, 
                    memberNumber:user.memberNumber, 
                }];
            } else {
                // 如果用户既不在名称中，也不在会员号中，则返回用户未找到
                return null;
            }
        }
    } catch (error) {
        throw error;
    }
};

exports.updateUser = async (userId, userData) => {
    try {
        const { name, birthday, address } = userData;
        if (!name || !birthday) {
            throw new Error('Name and birthday fields are required');
        }
    
        // 查询要更新的用户
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // 更新用户信息
        user.name = name;
        user.birthday = birthday;
        user.address = address;
    
        await user.save();
        // 过滤掉密码字段后返回更新后的用户数据
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

exports.deleteUsers = async (userIds) => {
    try {
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            throw new Error('Please provide user IDs to delete');
        }

        await User.destroy({
            where: {
                id: userIds
            }
        });
          // 用户删除成功后返回一个成功消息
          return { message: 'Users deleted successfully' };
    } catch (error) {
        throw error;
    }
};

