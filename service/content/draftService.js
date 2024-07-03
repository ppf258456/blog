const { contents, content_categories } = require('../../models');


const draftService = {
  // 创建草稿
  createDraft: async (author_id, draftData, categoryIds) => {
    const transaction = await contents.sequelize.transaction();
    try {
      draftData.author_id = author_id;
      const newDraft = await contents.create(draftData, { transaction });

      const categoryAssociations = categoryIds.map(category_id => ({
        content_id: newDraft.content_id,
        category_id
      }));
      await content_categories.bulkCreate(categoryAssociations, { transaction });

      await transaction.commit();
      return newDraft;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`创建草稿时出错: ${error.message}`);
    }
  },

  // 获取草稿列表
  getDrafts: async (author_id) => {
    try {
      const drafts = await contents.findAll({
        where: {
          author_id,
          status: 0
        }
      });
      return drafts;
    } catch (error) {
      throw new Error(`获取草稿列表时出错: ${error.message}`);
    }
  },

  // 获取草稿详情
  getDraftById: async (content_id, author_id) => {
    try {
      const draft = await contents.findOne({
        where: {
          content_id,
          author_id,
          status: 0
        },
        include: [
          {
            model: content_categories,
            as: 'category_id_categories'
          }
        ]
      });
      if (!draft) {
        throw new Error(`草稿不存在`);
      }
      return draft;
    } catch (error) {
      throw new Error(`获取草稿详情时出错: ${error.message}`);
    }
  },

  // 更新草稿
  updateDraft: async (content_id, author_id, draftData, categoryIds) => {
    const transaction = await contents.sequelize.transaction();
    try {
      const updatedRowCount = await contents.update(draftData, {
        where: { content_id, author_id, status: 0 },
        transaction
      });

      if (updatedRowCount[0] === 0) {
        throw new Error(`找不到ID为 ${content_id} 或作者ID不匹配的草稿，更新失败`);
      }

      await content_categories.destroy({
        where: { content_id },
        transaction
      });

      const categoryAssociations = categoryIds.map(category_id => ({
        content_id,
        category_id
      }));
      await content_categories.bulkCreate(categoryAssociations, { transaction });

      await transaction.commit();
      return await contents.findByPk(content_id);
    } catch (error) {
      await transaction.rollback();
      throw new Error(`更新草稿时出错: ${error.message}`);
    }
  },

  // 删除草稿
  deleteDraft: async (content_id, author_id) => {
    try {
      const deletedCount = await contents.destroy({
        where: {
          content_id,
          author_id,
          status: 0
        },
        force: true, // 确保是物理删除
      });
      if (deletedCount === 0) {
        throw new Error(`找不到ID为 ${content_id} 的草稿，删除失败`);
      }
      return deletedCount;
    } catch (error) {
      throw new Error(`删除草稿时出错: ${error.message}`);
    }
  }
};

module.exports = draftService;