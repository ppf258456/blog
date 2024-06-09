// emailVerificationRoute.js
const express = require('express'); // 引入express模块
const emailVerificationController = require('../controllers/emailVerificationController'); // 引入邮箱验证控制器

const router = express.Router(); // 创建路由器

/**
 * POST 请求路由 '/send-verification-email'
 * 用于处理发送邮箱验证码的请求。
 * 请求体应包含用户邮箱字段：
 * {
 *   "email": "用户邮箱"
 * }
 * 如果邮箱存在，则发送验证码到该邮箱。
 * 响应:
 *  - 成功: 返回状态码200和"验证码已发送到您的邮箱"消息。
 *  - 失败: 返回状态码400和错误信息。
 */
router.post('/send-verification-email', emailVerificationController.sendVerificationEmail); // 注册路由和处理发送验证码的函数

/**
 * POST 请求路由 '/verify-code'
 * 用于处理邮箱验证码验证的请求。
 * 请求体应包含邮箱和验证码字段：
 * {
 *   "email": "用户邮箱",
 *   "code": "用户输入的验证码"
 * }
 * 验证用户输入的验证码是否正确且未过期。
 * 响应:
 *  - 成功: 返回状态码200和"验证码验证成功"消息。
 *  - 失败: 返回状态码400和错误信息。
 */
router.post('/verify-code', emailVerificationController.verifyCode); // 注册路由和处理验证码验证的函数

module.exports = router; // 导出路由器