// virtualAttributes.js

/**
 * 获取用户年龄的虚拟属性
 * @returns {number} 用户年龄
 */
function age() {
    // 获取当前时间
    const currentDate = new Date();
    // 计算年龄
    const age = currentDate.getFullYear() - this.birthday.getFullYear();
    return age;
}

module.exports = { age };
