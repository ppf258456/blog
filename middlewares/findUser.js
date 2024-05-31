const User = require('../models/user');

async function findUser(req, res, next) {
    try {
        const { name, memberNumber } = req.query || req.body;

        let users;
        if (memberNumber) {
            // 根据会员编号查找用户
            const user = await User.findOne({ where: { memberNumber } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.userIds = [user.id]; // 将用户ID放入数组中
        } else if (name) {
            // 根据用户名查找用户
             users = await User.findAll({ where: { name } });
            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.userIds = users.map(user => user.id); // 将所有用户的ID放入数组中
        } else {
            return res.status(400).json({ message: 'Please provide a name or member_number' });
        }

        
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = findUser;
