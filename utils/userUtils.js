// utils/userUtils.js

const User = require('../models/user');

// 根据用户名或会员编号查找用户
async function findUserByUniqueIdentifier(identifier) {
    return await User.findOne({
        where: {
            $or: [{ name: identifier }, { memberNumber: identifier }]
        }
    });
}

module.exports = findUserByUniqueIdentifier;
