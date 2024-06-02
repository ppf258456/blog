// loginService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // 使用 index.js 导入模型
const { validateEmail, validateMemberNumber } = require('../utils/validators');
const { validateAndConvertPassword } = require('../utils/passwordUtils');

exports.loginUser = async ({ email, memberNumber, password, req, res }) => {
    if (!password) {
        throw new Error('Password is required');
    }

    if (!email && !memberNumber) {
        throw new Error('Email or member number is required');
    }

    try {
        let user;

        if (email) {
            // 检查邮箱格式
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }
            user = await User.findOne({ where: { email } });
        } else if (memberNumber) {
            // 检查会员号格式（纯数字）
            if (!validateMemberNumber(memberNumber)) {
                throw new Error('Invalid member number format');
            }
            user = await User.findOne({ where: { memberNumber } });
        }

        if (!user) {
            throw new Error('Invalid email/member number or password');
        }
        
        // 调用函数验证密码并转换
        const validatedPassword = validateAndConvertPassword(password);
        const isMatch = await bcrypt.compare(validatedPassword, user.password);
        if (!isMatch) {
            throw new Error('Invalid email/member number or password');
        }
        
        // 生成JWT token，并在其中包含用户的角色信息
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 设置JWT为HTTP-Only的Cookie
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 24*60*60*1000 }); // 1天过期

        // 在Session中存储用户信息
        req.session.userId = user.id;
        req.session.userRole = user.role;

        return token;
    } catch (error) {
        throw error;
    }
};

exports.logoutUser = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw new Error('Could not log out, please try again');
        }
        res.clearCookie('token');
        return { message: 'Logout successful' };
    });
};
