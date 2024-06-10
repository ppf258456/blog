/**
 * 配置SMTP服务的文件
 * 包含SMTP服务的主机名、端口号、安全性设置以及认证信息
 */
module.exports = {
    host: 'smtp.qq.com',  // SMTP服务器地址
    port: 465,            // SMTP端口号，SSL通常为465
    secure: true,         // 使用SSL加密
    auth: {               // 邮箱认证信息
        user: 'epic0320@qq.com',  // 邮箱地址
        pass: 'dgwamcqqatzkbdag'  // 邮箱授权码
    }
};