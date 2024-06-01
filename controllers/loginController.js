// loginController.js

const loginService = require('../service/loginService');

exports.login = async (req, res) => {
    const { email, memberNumber, password } = req.body;

    try {
        const token = await loginService.loginUser({
            email,
            memberNumber,
            password,
            req,
            res
        });

        // 返回结果
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const result = await loginService.logoutUser(req, res);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
