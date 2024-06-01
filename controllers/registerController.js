const registerService = require('../service/registerService');

exports.register = async (req, res) => {
    try {
        const { name, birthday, email, role, memberNumber, num, address, password } = req.body;

        const newUser = await registerService.registerUser({
            name,
            birthday,
            email,
            role,
            memberNumber,
            num,
            address,
            password
        });

        // 返回结果
        res.status(201).json({ message: "注册成功！", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};