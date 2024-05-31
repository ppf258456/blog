const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validateEmail,  validateMemberNumber } = require('../utils/validators');

exports.login = async (req, res) => {
    const { email, memberNumber, password } = req.body;

    if (!password) {
        return res.status(400).send({ error: 'Password is required' });
    }

    if (!email && !memberNumber) {
        return res.status(400).send({ error: 'Email or member number is required' });
    }

    try {
        let user;

        if (email) {
            // 检查邮箱格式
            if (!validateEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            user = await User.findOne({ where: { email } });
        } else if (memberNumber) {
            // 检查会员号格式（纯数字）
            if (!validateMemberNumber(memberNumber)) {
                return res.status(400).json({ error: 'Invalid member number format' });
            }
            user = await User.findOne({ where: { memberNumber } });
        }

        if (!user) {
            return res.status(400).send({ error: 'Invalid email/member number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid email/member number or password' });
        }
        
        // 生成JWT token，并在其中包含用户的角色信息
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 设置JWT为HTTP-Only的Cookie
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 24*60*60*1000 }); // 1天过期

        // 在Session中存储用户信息
        req.session.userId = user.id;
        req.session.userRole = user.role;

        res.send({ message: 'Login successful' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ error: 'Could not log out, please try again' });
        }
        res.clearCookie('token');
        res.send({ message: 'Logout successful' });
    });
};
