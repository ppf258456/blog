// passwordResetRoute.js
const express = require('express'); // 引入express模块
const passwordResetController = require('../controllers/passwordResetController'); // 引入密码重置控制器

const router = express.Router(); // 创建路由器

/**
 * POST 请求路由 '/reset-password'
 * 用于处理用户密码重置的请求。
 * 请求体应包含邮箱、验证码、新密码和确认密码字段：
 * {
 *   "email": "用户邮箱",
 *   "code": "用户收到的验证码",
 *   "newPassword": "新密码",
 *   "confirmPassword": "确认新密码"
 * }
 * 如果验证码有效且两次输入的密码相同，则重置密码。
 * 响应:
 *  - 成功: 返回状态码200和"密码重置成功"消息。
 *  - 失败: 返回状态码400和错误信息。
 */
router.post('/reset-password', passwordResetController.resetPassword); // 注册路由和处理函数

module.exports = router; // 导出路由器