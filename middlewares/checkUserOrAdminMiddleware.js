// middlewares/checkUserOrAdminMiddleware.js

const checkUserOrAdmin = (req, res, next) => {
    // 检查用户是否是要修改的用户本人或者是管理员
    // console.log(req.params);
    if (req.user.user_id !==  parseInt(req.params.user_id)   && req.user.user_role !== 'admin') {

       
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    // 是用户本人或者管理员，允许继续执行下一个中间件或控制器
    next();
 
};

module.exports = checkUserOrAdmin;
