// registerRouter.js
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

/**
 * POST 请求路由 '/register'
 * 用于处理用户注册的请求。
 * 请求体应包含以下字段：
 * {
 *   "username": "用户自定义的用户名",
 *   "email": "用户邮箱",
 *   "password": "用户设置的密码",
 *   "member_number": "会员号",
 *   "avatar": "用户头像链接",
 *   "introduction": "用户简介",
 *   "user_role": "用户角色",
 *   "account_status": "账户状态",
 *   "background_image": "背景图片链接"
 * }
 * 注册成功后，将创建新用户并返回成功消息。
 * 响应:
 *  - 成功: 返回状态码200和"用户注册成功"消息。
 *  - 失败: 返回状态码400和错误信息。
 */
router.post('/', registerController.register);

module.exports = router;
