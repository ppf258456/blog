// registerService.js
const { User,Class_ } = require('../../models');
const {
  validateEmail,
  validatePassword,
  validateMemberNumber,
  validateRole,
  validateAccountStatus
} = require('../../utils/validators');
const { encodeBase64 } = require('../../utils/base64');
const { resizeAndEncodeImage } = require('../../utils/sharp');
const { checkEmailExists, verifyCode } = require('../emailVerificationService');

// 注册用户的服务函数
exports.registerUser = async (
  username,
  email,
  password,
  member_number,
  avatar,
  introduction,
  user_role,
  account_status,
  background_image,
  verificationCode
) => {
  // 验证邮箱格式
  if (!validateEmail(email)) {
    throw new Error('Invalid email format.');
  }
  // 验证密码强度
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long .');
  }
  // 验证会员号格式
  if (!validateMemberNumber(member_number)) {
    throw new Error('Invalid member number format.');
  }
  // 验证用户角色
  if (!validateRole(user_role)) {
    throw new Error('Invalid user role.');
  }
  // 验证账户状态
  if (!validateAccountStatus(account_status)) {
    throw new Error('Invalid account status.');
  }

  // 检查邮箱是否已存在
  if (await checkEmailExists(email)) {
    throw new Error('Email already exists.');
  }
  // 检查用户名是否已存在
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('Username already exists.');
  }
  // 检查会员号是否已存在
  const existingMemberNumber = await User.findOne({ where: { member_number } });
  if (existingMemberNumber) {
    throw new Error('Member number already exists.');
  }

  // 验证邮箱验证码是否正常，是否过期
  if (!verifyCode(email, verificationCode)) {
    throw new Error('Verification code is invalid or expired.');
  }

  // 使用 sharp 调整背景图大小并转换为 Base64
  if (!background_image) {
    background_image = process.env.DEFAULT_BACKGROUND_IMAGE;
    const backgroundImagePath = await resizeAndEncodeImage(background_image,300, 300)
    background_image = encodeBase64(backgroundImagePath);
  }



 
  // 创建新用户
  const newUser = await User.create({
    username,
    email,
    password, // 注意，这里应使用哈希后的密码
    member_number,
    avatar,
    introduction,
    user_role,
    account_status,
    background_image
  });

   // 创建默认分组
   const defaultFollowClass = await Class_.create({
    class_name: 'Default',
    class_type: 'follow',
    user_id: newUser.id,
    is_default: true
  });

  const defaultFansClass = await Class_.create({
    class_name: 'Default',
    class_type: 'fans',
    user_id: newUser.id,
    is_default: true
  });
  return {
    newUser,
    defaultFollowClass,
    defaultFansClass
  };
};