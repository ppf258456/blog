// emailVerificationRoute.js
const express = require('express'); // 引入express模块来创建路由器
const emailVerificationController = require('../controllers/emailVerificationController'); // 引入邮箱验证控制器

const router = express.Router(); // 创建路由器实例

/**
 * POST 请求路由 '/send-verification-email'
 * 用于处理发送邮箱验证码的请求。
 * 请求体应包含用户邮箱字段：
 * {
 *   "email": "用户邮箱"
 * }
 * 发送成功后，用户将收到一封包含验证码的邮件。
 * 响应：
 *  - 成功: 返回状态码200和"验证码已发送到您的邮箱"消息。
 *  - 失败: 返回状态码400和错误信息，例如邮箱不存在或发送失败。
 */
router.post('/send-verification-email', emailVerificationController.sendVerificationEmail); // 注册发送验证码路由

/**
 * POST 请求路由 '/verify-code'
 * 用于处理邮箱验证码的验证请求。
 * 请求体应包含用户邮箱和验证码字段：
 * {
 *   "email": "用户邮箱",
 *   "code": "用户输入的验证码"
 * }
 * 如果验证码正确且未过期，验证成功。
 * 响应：
 *  - 成功: 返回状态码200和"验证码验证成功"消息。
 *  - 失败: 返回状态码400和错误信息，例如验证码无效或已过期。
 */
router.post('/verify-code', emailVerificationController.verifyCode); // 注册验证码验证路由

module.exports = router; // 导出路由器供其他文件使用