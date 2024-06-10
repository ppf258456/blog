// controllers/userController.js

const userService  = require('../../service/user/userService');
const { paginate } = require('../../utils/paginate');
const configMulter = require('../../config/multerConfig'); // 引入multer配置
const sharp = require('../../utils/sharp'); // 引入sharp处理图片

// 获取所有用户（需管理员）
exports.getAllUsers = async (req, res) => {
  try { // 获取页数和每页显示记录数
    const { page, limit } = req.query;
    // 计算 limit 和 offset
    const { offset, finalLimit } = paginate(page, limit);
    const users = await userService.getAllUsers(finalLimit, offset);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取详细用户信息
exports.getUserByUserid = async(req,res) =>{
  // console.log(req.params, '      ', req.originalUrl);
  const {user_id} = req.query;
  // console.log(user_id);
  try{
    let userData = await userService.getUserById(user_id);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(userData)
  }catch(error){
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
// 获取用户
exports.getSerchUsers = async (req, res) => {
  console.log(req.query);
  const { searchTerm, page, limit } = req.query;
  console.log(searchTerm);
  try {
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Please provide a username or member number.' });
    }
     // 计算 limit 和 offset
     const { offset, finalLimit } = paginate(page, limit);
    // 根据提供的搜索条件进行模糊搜索
   const users = await userService.searchUsers(searchTerm,finalLimit, offset);
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 更新用户
exports.updateUser = async (req, res) => {
  try {
      const  user_id  =  parseInt(req.params.user_id,10);  
      const user  = await userService.getUserById(user_id);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
       // 如果上传了文件，处理图片
    if (req.file) {
      
      const imageBuffer = req.file.buffer; // 获取文件的 Buffer 数据
      // 假设我们想要调整图片到的宽度和高度
      const width = 800;
      const height = 600;

      // 使用 sharp 调整图片大小并转换为 Base64 编码
      const base64Image = await resizeAndEncodeImage(imageBuffer, width, height);
      // 假设 'avatar' 是数据库中存储图片 Base64 编码的字段
      req.body.avatar = `data:image/jpeg;base64,${base64Image}`;
    }
      // 验证是否是管理员修改其他管理员的信息
      if (req.user.user_id !== user_id && req.user.user_role === 'admin' && user.user_role === 'admin') {
          return res.status(403).json({ error: 'Forbidden: Admin cannot update other admin\'s information' });
        }
      // 提取可更改字段
      let allowedFields = ['username', 'avatar', 'introduction', 'background_image'];

    // 如果是管理员，允许修改更多字段
    if (req.user.user_role === 'admin') {
      allowedFields = ['username', 'avatar','background_image', 'introduction', 'user_role'];
    }
      // 过滤用户提交的数据，只保留允许修改的字段
      const filteredUserData = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          if (field === 'avatar' || field === 'background_image') {
            // 如果是头像或背景图字段，对图片进行 base64 编码
            const base64String = encodeBase64(req.body[field]);
            filteredUserData[field] = base64String;
          } else {
            filteredUserData[field] = req.body[field];
          }
        }
      }
      // 继续处理更新用户信息的逻辑
       await userService.updateUser(user_id, filteredUserData);
      res.status(200).json("update successful",filteredUserData);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  const user_id  = req.params.user_id;
  console.log("user_id",user_id);
  try {
     // 查找用户
     const user = await userService.getUserById(user_id);
      // 如果用户不存在，返回404错误
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const result = await userService.deleteUser(user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user_id = req.user.user_id;

    const result = await userService.changePassword(user_id, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};