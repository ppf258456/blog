const { contents, content_categories } = require('../../models');
const { Op } = require('sequelize');

const ReviewService = {
  /**
   * 提交草稿进行审核
   * @param {number} content_id - 内容ID
   * @param {object} contentData - 更新的内容数据
   * @param {array} categoryIds - 分类ID数组
   * @returns {object} - 更新后的内容
   */
  submitForReview: async (content_id, contentData, categoryIds) => {
    const transaction = await contents.sequelize.transaction();
    try {
      contentData.status = 1; // 将内容状态设置为待审核
      await contents.update(contentData, {
        where: { content_id },
        transaction
      });

      // 删除所有关联的分类
      await content_categories.destroy({
        where: { content_id },
        transaction
      });

      // 创建新的分类关联
      const categoryAssociations = categoryIds.map(category_id => ({
        content_id,
        category_id
      }));

      await content_categories.bulkCreate(categoryAssociations, { transaction });

      await transaction.commit();

      const updatedContent = await contents.findByPk(content_id);
      return updatedContent;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`提交审核时出错: ${error.message}`);
    }
  },

  /**
   * 审核通过
   * @param {number} content_id - 内容ID
   * @returns {object} - 更新后的内容
   */
  approveContent: async (content_id) => {
    try {
      const updatedContent = await contents.update(
        { status: 2 }, // 审核通过状态码
        { where: { content_id } }
      );

      return updatedContent;
    } catch (error) {
      throw new Error(`审核通过时出错: ${error.message}`);
    }
  },

  /**
   * 审核驳回
   * @param {number} content_id - 内容ID
   * @returns {object} - 更新后的内容
   */
  rejectContent: async (content_id) => {
    try {
      const updatedContent = await contents.update(
        { status: 3 }, // 审核驳回状态码
        { where: { content_id } }
      );

      return updatedContent;
    } catch (error) {
      throw new Error(`审核驳回时出错: ${error.message}`);
    }
  }
};

module.exports = ReviewService;
