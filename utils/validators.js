// validators.js
// 各种属性的规则限制

// 验证邮箱格式
// 检查邮箱是否符合规范
// @ 符号前最大支持64字节 
const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /^[a-zA-Z\d@$!%*?&]{8,}$/;
const memberNumberRegex = /^\d+$/;
const validRoles = ['admin', 'user', 'audit'];

exports.validateEmail = (email) => emailRegex.test(email);

exports.validatePassword = (password) => passwordRegex.test(password);

exports.validateMemberNumber = (memberNumber) => memberNumberRegex.test(memberNumber);

exports.validateRole = (role) => validRoles.includes(role);


