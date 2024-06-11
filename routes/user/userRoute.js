// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController  = require('../../controllers/user/userController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware')
const checkUserOrAdminMiddleware = require('../../middlewares/checkUserOrAdminMiddleware')
const checkAdmin = require('../../middlewares/checkAdminMiddleware')
// const test = require('../../middlewares/test')
// 获取所有用户
/**
 * GET 请求路由 '/'
 * 用于获取所有用户的资料信息。
 * 需要通过 jwtMiddleware 和 checkAdmin 中间件进行验证。
 * 路径参数无
 * 请求包含token
 * GET /
 * 成功获取用户资料后，将返回用户信息。
 * 响应：
 *  - 成功: 返回状态码200和用户信息对象。
 *  - 用户未找到: 返回状态码404和"用户未找到"错误信息。
 *  - 服务器内部错误: 返回状态码500和"服务器内部错误"信息。
 */
router.get('/',  jwtMiddleware,  checkAdmin,UserController.getAllUsers);

// 获取个人资料路由
/**
 * GET 请求路由 '/userInfo/'
 * 用于获取指定用户ID的个人资料信息。
 * 需要通过 jwtMiddleware 和 checkUserOrAdminMiddleware 中间件进行验证。
 * 请求路径参数应包含用户ID：
 * GET /userInfo/?user_id=6
 * 
 * 成功获取用户资料后，将返回用户信息。
 * 响应：
 *  - 成功: 返回状态码200和用户信息对象。
 *  - 用户未找到: 返回状态码404和"用户未找到"错误信息。
 *  - 服务器内部错误: 返回状态码500和"服务器内部错误"信息。
 */
router.get('/userInfo/',jwtMiddleware,checkUserOrAdminMiddleware,UserController.getUserByUserid)

// 模糊查找用户
router.get('/find/',  UserController.getSerchUsers);

// 更新用户信息
router.put('/:user_id',jwtMiddleware, checkUserOrAdminMiddleware, UserController.updateUser);

// 删除用户
router.delete('/:user_id',jwtMiddleware,checkUserOrAdminMiddleware, UserController.deleteUser);

// 修改密码
router.put('/changePassword', jwtMiddleware,checkUserOrAdminMiddleware, UserController.changePassword);

// 修改邮箱
// 这个后面再搞
module.exports = router;
