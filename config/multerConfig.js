// config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // 使用内存存储

const fileFilter = (req, file, cb) => {
  // 限制文件类型为图片
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制文件大小为10MB
});

module.exports = {
  upload: upload,
  single: upload.single('file'), // 适用于单个文件上传
  array: upload.array('file', 2), // 适用于多个文件上传，这里限制最多2个
};