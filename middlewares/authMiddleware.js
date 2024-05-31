// authMiddleware.js

/**
 * 中间件函数：检查用户是否已登录
 * 如果用户未登录，则返回401状态码和错误消息
 */
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send({ error: 'Please log in' });
    }
    next();
};

/**
 * 中间件工厂函数：检查用户角色
 * @param {string} role - 要求的用户角色
 * 如果用户角色与要求不符，则返回403状态码和错误消息
 */
const checkRole = (role) => (req, res, next) => {
    if (req.session.userRole !== role) {
        return res.status(403).send({ error: 'Access denied' });
    }
    next();
  };
module.exports = { checkAuth,checkRole };
