// 分页相关
// utils/paginate.js
/**
 * 分页函数，用于计算 limit 和 offset
 * @param {number} page - 当前页数
 * @param {number} limit - 每页显示记录数
 * @returns {Object} - 包含 limit 和 offset 的对象
 */
exports.paginate = (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return { limit, offset };
};