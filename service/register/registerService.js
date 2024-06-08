
const {User} = require('../../models');
const {
  validateEmail,
  validatePassword,
  validateMemberNumber,
  validateRole,
  validateAccountStatus
} = require('../../utils/validators');
const { encodeBase64 } = require('../../utils/base64');
exports.registerUser=async(username, email, password, member_number, avatar, introduction, user_role, account_status,background_image)=> {
  // 验证输入信息
  if (!validateEmail(email)) {
    throw new Error('Invalid email format.');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long and include letters, numbers, and special characters.');
  }

  if (!validateMemberNumber(member_number)) {
    throw new Error('Invalid member number format.');
  }

  if (!validateRole(user_role)) {
    throw new Error('Invalid user role.');
  }

  if (!validateAccountStatus(account_status)) {
    throw new Error('Invalid account status.');
  }

  // 检查用户名、邮箱和会员号是否已存在
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('Username already exists.');
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('Email already exists.');
  }

  const existingMemberNumber = await User.findOne({ where: { member_number } });
  if (existingMemberNumber) {
    throw new Error('Member number already exists.');
  }
    // 如果没有设置背景图，使用默认值
  if(!background_image){
    background_image = process.env.DEFAULT_BACKGROUND_IMAGE;
  }else {
    background_image = encodeBase64(background_image);
  }
    // 头像转换为base64
    if (avatar) {
      avatar = encodeBase64(avatar);
    }
  // 创建新用户
  const newUser = await User.create({
    username,
    email,
    password,// 注意，这里传递的是哈希后的密码
    member_number,
    avatar,
    introduction,
    user_role,
    account_status,
    background_image
  });

  return newUser;
}



