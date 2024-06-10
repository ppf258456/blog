// utils/sharp.js
const sharp = require('sharp');

/**
 * 使用 sharp 调整图片大小并转换为 Base64 编码。
 * @param {Buffer} imageBuffer - 图片的 Buffer 数据。
 * @param {number} width - 目标宽度。
 * @param {number} height - 目标高度。
 * @returns {Promise<string>} - Base64编码的字符串。
 */
exports.resizeAndEncodeImage = async (imageBuffer, width, height) => {
  // 检查 imageBuffer 是否为 Buffer 类型
  if (!Buffer.isBuffer(imageBuffer)) {
    throw new TypeError('Expected imageBuffer to be a Buffer');
  }

  // 检查宽度和高度是否为正数
  if (width <= 0 || height <= 0) {
    throw new RangeError('Width and height must be positive numbers');
  }

  try {
    // 使用 sharp 调整图像大小并转换为 JPEG 格式，然后转换为 Base64 编码的字符串
    const buffer = await sharp(imageBuffer)
      .resize(width, height) // 调整图像大小
      .toFormat(sharp.format.jpeg) // 转换为 JPEG 格式
      .toBuffer(); // 转换为 Buffer

    // 将 Buffer 数据转换为 Base64 编码的字符串
    return buffer.toString('base64');
  } catch (error) {
    // 打印错误堆栈信息以帮助调试
    console.error('Error processing image:', error);
    throw error; // 抛出错误以便调用者可以处理
  }
};