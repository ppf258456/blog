// registerService.js

const { User } = require('../models'); 
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword, validateMemberNumber, validateRole } = require('../utils/validators');
const { validateAndConvertPassword } = require('../utils/passwordUtils');

exports.registerUser = async ({ name, birthday, email, role, memberNumber, num, address, password }) => {
    try {
        // 检查是否提供了必要的信息
        if (!name || !birthday || !email || !role || !memberNumber || !password) {
            throw new Error('All fields are required');
        }

        // 检查邮箱格式是否正确
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        // 检查会员号是否为纯数字
        if (!validateMemberNumber(memberNumber)) {
            throw new Error('Member number should contain only digits');
        }

        // 检查密码格式
        if (!validatePassword(password)) {
            throw new Error('Invalid password format');
        }
        
        // 检查角色是否合法
        if (!validateRole(role)) {
            throw new Error('Invalid role');
        }

        // 调用函数验证密码并转换
        const validatedPassword = validateAndConvertPassword(password);

        // 创建新用户
        const hashedPassword = await bcrypt.hash(validatedPassword, 10);
        const newUser = await User.create({
            name,
            birthday,
            email,
            role,
            memberNumber,
            num,
            address,
            password: hashedPassword,
        });

        return newUser;
    } catch (error) {
        throw error;
    }
};

/**
 * 注销用户
 * @param {number} userId - 要注销的用户ID
 * @returns {Promise<void>} - 无返回值
 */
exports.logout = async (userId) => {
    try {
        // 删除用户
        await User.destroy({
            where: {
                id: userId
            }
        });
    } catch (error) {
        throw error;
    }
};