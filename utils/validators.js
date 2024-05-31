// utils/validators.js
// 各种属性的规则限制
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const memberNumberRegex = /^\d+$/;

exports.validateEmail = (email) => emailRegex.test(email);

exports.validatePassword = (password) => passwordRegex.test(password);

exports.validateMemberNumber = (memberNumber) => memberNumberRegex.test(memberNumber);
