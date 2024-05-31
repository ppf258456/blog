// utils/validators.js

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const memberNumberRegex = /^\d+$/;

exports.validateEmail = (email) => emailRegex.test(email);

exports.validatePassword = (password) => passwordRegex.test(password);

exports.validateMemberNumber = (memberNumber) => memberNumberRegex.test(memberNumber);
