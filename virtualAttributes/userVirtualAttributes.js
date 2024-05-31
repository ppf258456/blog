// virtualAttributes.js
// 可以使用该方法在展示时获取用户年龄，但不会存储到数据库中！！，所以我没有再使用该函数了
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
