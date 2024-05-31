// registerController.js

const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword, validateMemberNumber } = require('../utils/validators');

exports.register = async (req, res) => {
    try {
        const { name, birthday, email, role, memberNumber, num, address, password } = req.body;

        // 检查是否提供了必要的信息
        if (!name || !birthday || !email || !role || !memberNumber || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // 检查邮箱格式是否正确
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // 检查会员号是否为纯数字
        if (!validateMemberNumber(memberNumber)) {
            return res.status(400).json({ error: 'Member number should contain only digits' });
        }

        // 检查密码格式
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Invalid password format' });
        }

        // 创建新用户
        const hashedPassword = await bcrypt.hash(password, 10);
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

        // 返回结果
        res.status(201).json({ message: "注册成功！" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
