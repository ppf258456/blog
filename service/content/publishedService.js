const { contents, content_categories, categories } = require('../../models');
const { Op } = require('sequelize');

const PublishedService = {
  // 发布内容
  publishContent: async (content_id) => {
    try {
      const updatedContent = await contents.update(
        { status: 4 }, // 发布状态码
        { where: { content_id } }
      );

      return updatedContent;
    } catch (error) {
      throw new Error(`发布内容时出错: ${error.message}`);
    }
  },

  // 取消发布
  unpublishContent: async (content_id) => {
    try {
      const updatedContent = await contents.update(
        { status: 5 }, // 取消发布状态码
        { where: { content_id } }
      );

      return updatedContent;
    } catch (error) {
      throw new Error(`取消发布时出错: ${error.message}`);
    }
  }
};

module.exports = PublishedService;
