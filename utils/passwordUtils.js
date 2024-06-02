// passwordUtils.js

/**
 * 函数用于验证密码是否为纯数字并转换为字符串
 * 如果密码为纯数字，则转换为字符串；否则返回原密码
 * @param {string} password - 待验证的密码
 * @returns {string} - 转换后的密码
 */
const validateAndConvertPassword = (password) => {
    // 如果密码为纯数字，则转换为字符串
    if (/^\d+$/.test(password)) {
        return password.toString();
    }
    // 如果密码不是纯数字，则返回原密码
    return password;
};

module.exports = { validateAndConvertPassword };
