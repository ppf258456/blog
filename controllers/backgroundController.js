const sharp = require('../utils/sharp');

// 背景图上传控制器
/* 服务器还没上，上了再添 */
exports.uploadBackground = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // 使用sharp处理图片
    const buffer = req.file.buffer;
    const base64Image = await sharp(buffer)
      .resize(300, 300) // 根据需要调整大小
      .toFormat(sharp.format.jpeg)
      .toBuffer()
      .then(buf => buf.toString('base64'));

    // 返回Base64编码的图片数据
    res.status(200).json({ message: 'Background image uploaded successfully', backgroundImage: base64Image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};