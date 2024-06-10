// 头像上传控制器
// 假设前端发送Base64编码的头像数据

/* 服务器还没上，上了再添 */
exports.uploadAvatar = async (req, res) => {
    // 直接将
    const { avatarBase64 } = req.body;
  
    res.status(200).json({ message: 'Avatar uploaded successfully', avatar: avatarBase64 });
  };