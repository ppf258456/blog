// middlewares/checkAdminMiddleware.js

// 中间件函数：检查是否是管理员
const checkAdmin = (req, res, next) => {
    // 检查用户是否具有管理员权限，可以根据实际情况修改
    // console.log(user);
    const isAdmin = req.user.user_role; // 假设管理员的身份信息在请求对象的 user 属性中
    if (isAdmin=="admin") {
        next(); // 是管理员，继续执行下一个中间件或控制器
    } else {
        res.status(403).json({ error: 'Forbidden' }); // 不是管理员，返回 403 Forbidden 错误
    }
};

module.exports = checkAdmin;
