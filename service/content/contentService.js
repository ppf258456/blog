const { contents, content_categories, categories, User } = require('../../models');
const { Op } = require('sequelize');

const contentService = {
  // 创建内容并关联分类
  createContent: async (contentData, categoryIds) => {
    const transaction = await contents.sequelize.transaction();
    try {
      const newContent = await contents.create(contentData, { transaction });

      // 创建内容与分类的关联
      const categoryAssociations = categoryIds.map(category_id => ({
        content_id: newContent.content_id,
        category_id
      }));

      await content_categories.bulkCreate(categoryAssociations, { transaction });

      await transaction.commit();
      return newContent;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`创建内容时出错: ${error.message}`);
    }
  },

  // 更新草稿
  updateDraft: async (content_id, contentData, categoryIds) => {
    const transaction = await contents.sequelize.transaction();
    try {
      await contents.update(contentData, {
        where: { content_id, status: 0 }, // 只更新草稿状态的内容
        transaction
      });

      // 先删除所有关联的分类
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
      throw new Error(`更新草稿时出错: ${error.message}`);
    }
  },

  // 提交草稿进行审核
  submitForReview: async (content_id, contentData) => {
    try {
      const updatedContent = await contents.update(contentData, {
        where: { content_id, status: 0 }, // 只能提交草稿状态的内容
        returning: true // 返回更新后的内容
      });

      if (updatedContent[0] === 0) {
        throw new Error(`找不到ID为 ${content_id} 的草稿或更新失败`);
      }

      return updatedContent[1][0]; // 返回更新后的内容对象
    } catch (error) {
      throw new Error(`提交草稿时出错: ${error.message}`);
    }
  },

  // 审核内容
  reviewContent: async (content_id, contentData) => {
    try {
      const updatedContent = await contents.update(contentData, {
        where: { content_id, status: 1 }, // 只能审核状态为1的内容
        returning: true // 返回更新后的内容
      });

      if (updatedContent[0] === 0) {
        throw new Error(`找不到ID为 ${content_id} 的待审核内容或更新失败`);
      }

      return updatedContent[1][0]; // 返回更新后的内容对象
    } catch (error) {
      throw new Error(`审核内容时出错: ${error.message}`);
    }
  },

  // 发布内容
  publishContent: async (content_id, contentData) => {
    try {
      const updatedContent = await contents.update(contentData, {
        where: { content_id, status: 2 }, // 只能发布状态为2的内容
        returning: true // 返回更新后的内容
      });

      if (updatedContent[0] === 0) {
        throw new Error(`找不到ID为 ${content_id} 的已审核内容或更新失败`);
      }

      return updatedContent[1][0]; // 返回更新后的内容对象
    } catch (error) {
      throw new Error(`发布内容时出错: ${error.message}`);
    }
  },

  // 获取所有已发布内容列表
  getAllPublishedContents: async () => {
    try {
      const publishedContents = await contents.findAll({
        where: {
          status: 2 // 只获取已发布状态的内容
        },
        include: [
          {
            model: categories,
            as: 'category_id_categories',
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'author'
          }
        ]
      });

      return publishedContents;
    } catch (error) {
      throw new Error(`获取已发布内容列表时出错: ${error.message}`);
    }
  },

  // 获取通用内容列表（草稿、审核中、已发布）
  getGeneralContents: async () => {
    try {
      const generalContents = await contents.findAll({
        where: {
          status: {
            [Op.in]: [0, 1, 2] // 获取草稿、审核中和已发布状态的内容
          }
        },
        include: [
          {
            model: categories,
            as: 'category_id_categories',
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'author'
          }
        ]
      });

      return generalContents;
    } catch (error) {
      throw new Error(`获取通用内容列表时出错: ${error.message}`);
    }
  },

  // 根据ID获取内容
  getContentById: async (content_id) => {
    try {
      const content = await contents.findOne({
        where: { content_id },
        include: [
          {
            model: categories,
            as: 'category_id_categories',
            through: { attributes: [] }
          }
        ]
      });

      if (!content) {
        throw new Error(`找不到ID为 ${content_id} 的内容`);
      }

      return content;
    } catch (error) {
      throw new Error(`获取内容时出错: ${error.message}`);
    }
  },

  // 删除内容
  deleteContent: async (content_id) => {
    try {
      const result = await contents.destroy({
        where: { content_id }
      });

      if (result === 0) {
        throw new Error(`找不到ID为 ${content_id} 的内容或删除失败`);
      }

      return result;
    } catch (error) {
      throw new Error(`删除内容时出错: ${error.message}`);
    }
  },
};

module.exports = contentService;
