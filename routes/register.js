// routes/register.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


// 检查邮箱是否符合规范
// 现在邮箱格式检查函数会确保@符号前面的字符长度不超过64个字符。
const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};


router.post('/', async (req, res) => {
    try {
        
     
        const { name, birthday, email, role, memberNumber, num, address, password, } = req.body;

        // 检查是否提供了必要的信息
        if (!name || !birthday || !email || !role || !memberNumber || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // 检查邮箱格式是否正确
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // 检查邮箱是否已经被注册
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // 检查会员号是否已经被注册
        const existingMember = await User.findOne({ where: { memberNumber } });
        if (existingMember) {
            return res.status(400).json({ error: 'Member number is already registered' });
        }

        // 检查会员号是否为纯数字
        if (!/^\d+$/.test(memberNumber)) {
                return res.status(400).json({ error: 'Member number should contain only digits' });
        }

         // 检查密码格式
         if (/\s/.test(password)) {
            return res.status(400).json({ error: 'Password should not contain spaces' });
        }

        // 检查密码格式
          if (!/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/=-]+$/.test(password)) {
            return res.status(400).json({ error: 'Password should contain only letters, digits, and symbols' });
        }

        // 8-20位
        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({ error: 'Password length should be between 8 and 20 characters' });
        }

         // 检查角色是否合法
         const validRoles = process.env.VALID_ROLES;
         if (!validRoles.includes(role)) {
             return res.status(400).json({ error: 'Invalid role' });
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
        res.status(201).json({message:"注册成功！"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
